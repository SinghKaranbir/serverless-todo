import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger("Todos")

const s3_bucket = process.env.ATTACHMENT_S3_BUCKET
const s3 = new XAWS.S3({ signatureVersion: "v4" })

export function getPresignedUrl(todoId: String): string {
  try {
    const attachmentUrl =  s3.getSignedUrl("putObject", {
      Bucket: s3_bucket,
      Key: todoId,
      Expires: 500
    });
    logger.info("Attachment URL ", attachmentUrl)
    return attachmentUrl
  }
  catch (error) {
    logger.info(error)
    return `${error}  error attachment url`
  }
}
