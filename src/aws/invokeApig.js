import AWSG from "aws-sdk/global";
import sigV4Client from "./sigV4Client";
import {authUser} from "./auth";
import config from "../config";

export async function invokeApig({
    path,
    method = "GET",
    headers = {},
    queryParams = {},
    body
  }) {
    if (!await authUser()) {
      throw new Error("User is not logged in");
    }
  
    const signedRequest = sigV4Client
      .newClient({
        accessKey: AWSG.config.credentials.accessKeyId,
        secretKey: AWSG.config.credentials.secretAccessKey,
        sessionToken: AWSG.config.credentials.sessionToken,
        region: config.aws.apig.region,
        endpoint: config.aws.apig.URL
      })
      .signRequest({
        method,
        path,
        headers,
        queryParams,
        body
      });
    body = body ? JSON.stringify(body) : body;
    headers = signedRequest.headers;
  
    const results = await fetch(signedRequest.url, {
      method,
      headers,
      body
    });
  
    if (results.status !== 200) {
      throw new Error(await results.text());
    }
  
    return results.json();
  }