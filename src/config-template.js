export default {
    "aws": {
        "s3": {
            "uploadsBucketName": "",// notes attachments bucket
            "userUploadsPath": "", // attachments path in the bucket
            "uploadSizeMax": 5000000
        },
        "apig": {
            "URL": "", // apigtaeway url
            "region": "" // apig region
        },
        "cognito": {
            "userpoolId": "", 
            "appClientId": "",
            "region": "", // identitypool region
            "identitypoolId": ""
        }
    }
}