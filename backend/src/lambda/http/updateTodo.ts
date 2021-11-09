import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

const logger = createLogger("Update Todos")

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    logger.debug('Updating todo ${todoId}')
    const result = await updateTodo(todoId, updatedTodo, userId)
    return {
      statusCode: 200,
      body: JSON.stringify({ result })
    }

  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    }))
