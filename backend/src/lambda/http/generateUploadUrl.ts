import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { getPresignedUrlForTodo } from '../../helpers/todos'


const logger = createLogger("GeneratePresignedUrl")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    logger.debug('Generating attachment url for todo ${todoId}')

    const attachmentUrl = await getPresignedUrlForTodo(todoId, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({ Url: attachmentUrl })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
