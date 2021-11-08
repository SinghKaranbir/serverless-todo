import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils';
//import { getTodosForUser as getTodosForUser } from '../../helpers/todos'

const logger = createLogger("Get Todos")

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    logger.debug(userId)

    return undefined
})

handler.use(
  cors({
    credentials: true
  })
)
