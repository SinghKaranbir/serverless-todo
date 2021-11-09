import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils';
import { getTodos } from '../../helpers/todos'

const logger = createLogger("Get Todos")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const todos = await getTodos(userId)
    logger.debug('Getting all todos for user: ${userId}')

    if (todos.length !== 0)
      return {
        statusCode: 200,
        body: JSON.stringify({ items: todos }),
      }

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Item not found",
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
