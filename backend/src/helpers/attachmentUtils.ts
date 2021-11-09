import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3_bucket = process.env.ATTACHMENT_S3_BUCKET
const s3 = new XAWS.S3({ signatureVersion: "v4" })

export function getPresignedUrl(todoId: String): string {
  try {
    const attachmentUrl =  s3.getSignedUrl("putObject", {
      Bucket: s3_bucket,
      Key: todoId,
      Expires: 500
    });

    return attachmentUrl
  }
  catch (error) {
    return `${error}  error attachment url`
  }
}
