import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { invokeApig, s3Upload, s3DeleteObject } from "../../aws";
import LoaderButton from "../misc/LoaderButton";
import config from "../../config";
import "./Note.css";

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.textAreaMaxChar = 500;
    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      note: null,
      content: "",
      editNote: false
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getNote();
      this.setState({
        note: results,
        content: results.content
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return invokeApig({ path: `/notes/${this.props.match.params.id}` });
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.length < 50
      ? str
      : str.substr(0, 20) + "..." + str.substr(str.length - 20, str.length);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleFileChange = event => {
    if (this.state.note.attachment) {
      if (window.confirm("Replace old attachment?")) {
        const s3File = this.state.note.attachment.match(/(?:.*?\/){3}(.*)/);
        s3DeleteObject(unescape(s3File[1]));
      }
    }
    this.file = event.target.files[0];
  };

  saveNote(note) {
    return invokeApig({
      path: `/notes/${this.props.match.params.id}`,
      method: "PUT",
      body: note
    });
  }

  handleSubmit = async event => {
    let uploadedFilename;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        uploadedFilename = (await s3Upload(this.file)).Location;
      }

      await this.saveNote({
        ...this.state.note,
        content: this.state.content,
        attachment: uploadedFilename || this.state.note.attachment
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  deleteNote() {
    return invokeApig({
      path: `/notes/${this.props.match.params.id}`,
      method: "DELETE"
    });
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note and any attachments it may have?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      if (this.state.note.attachment) {
        const s3File = this.state.note.attachment.match(/(?:.*?\/){3}(.*)/);

        s3DeleteObject(decodeURIComponent(s3File[1]));
      }
      await this.deleteNote();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  };

  renderEditNote() {
    return (
      <div className="Note">
        {this.state.note && (
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <ControlLabel>
                Max characters: {this.textAreaMaxChar}
              </ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                maxLength={this.textAreaMaxChar}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.note.attachment && (
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.note.attachment}
                  >
                    {this.formatFilename(this.state.note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>
            )}
            <FormGroup controlId="file">
              {!this.state.note.attachment && (
                <ControlLabel>Attachment</ControlLabel>
              )}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>
        )}
      </div>
    );
  }

  renderNote() {
    return (
      <div className="Note">
        {this.state.note && (
          <form>
            <FormGroup>
              <ControlLabel>Note (private)</ControlLabel>
              <p align="justify">{this.state.content}</p>
              <ControlLabel>Attachment (public)</ControlLabel>
              {this.state.note.attachment && (
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.note.attachment}
                  >
                    {this.formatFilename(this.state.note.attachment)}
                  </a>
                </FormControl.Static>
              )}
            </FormGroup>

            <Button
              type="button"
              onClick={() => this.setState({ editNote: true })}
            >
              Edit
            </Button>
          </form>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="Note">
        {this.state.editNote ? this.renderEditNote() : this.renderNote()}
      </div>
    );
  }
}
