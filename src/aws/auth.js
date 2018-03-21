import AWSG from "aws-sdk/global";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import config from "../config";

export async function authUser() {
  if (
    AWSG.config.credentials &&
    Date.now() < AWSG.config.credentials.expireTime - 60000
  ) {
    return true;
  }

  const currentUser = getCurrentUser();

  if (currentUser === null) {
    return false;
  }

  const userToken = await getUserToken(currentUser);

  await getAwsCredentials(userToken);
  return true;
}

export function signOutUser() {
  const currentUser = getCurrentUser();

  if (currentUser !== null) {
    currentUser.signOut();
  }

  if (AWSG.config.credentials) {
    AWSG.config.credentials.clearCachedId();
    AWSG.config.credentials = new AWSG.CognitoIdentityCredentials({});
  }
}

function getAwsCredentials(userToken) {
  const authenticator = `cognito-idp.${config.aws.cognito.region}.amazonaws.com/${
    config.aws.cognito.userpoolId
  }`;

  AWSG.config.update({ region: config.aws.cognito.region });

  AWSG.config.credentials = new AWSG.CognitoIdentityCredentials({
    IdentityPoolId: config.aws.cognito.identitypoolId,
    Logins: {
      [authenticator]: userToken
    }
  });

  return AWSG.config.credentials.getPromise();
}

function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function(err, session) {
      if (err) {
        reject(err);
        return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

export function getCurrentUser() {
  const userPool = new CognitoUserPool({
    UserPoolId: config.aws.cognito.userpoolId,
    ClientId: config.aws.cognito.appClientId
  });
  return userPool.getCurrentUser();
}