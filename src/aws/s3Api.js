import { authUser } from "./auth";
import S3 from "aws-sdk/clients/s3";
import config from "../config";
import AWSG from "aws-sdk/global";

export async function s3Upload(file) {
  if (!await authUser()) {
    throw new Error("User is not logged in");
  }

  const s3 = new S3({
    params: {
      Bucket: config.aws.s3.uploadsBucketName
    }
  });
  const filename = `${ config.aws.s3.userUploadsPath}${AWSG.config.credentials.identityId}/${Date.now()}-${
    file.name
  }`;

  return s3
    .upload({
      Key: filename,
      Body: file,
      ContentType: file.type,
      ACL: "public-read"
    })
    .promise();
}

export async function s3DeleteObject(key) {
  if (!await authUser()) {
    throw new Error("User is not logged in");
  }

  const s3 = new S3();

  return s3
    .deleteObject({
      Bucket: config.aws.s3.uploadsBucketName,
      Key: key
    })
    .promise();
}
