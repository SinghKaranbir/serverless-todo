import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'

const logger = createLogger("Create Todo")


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const todo = await createTodo(getUserId(event), newTodo)
    logger.debug(todo.name)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: todo,
      }),
    }
});

handler.use(
  cors({
    credentials: true
  })
)
