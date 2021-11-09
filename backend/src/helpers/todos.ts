import { TodosAccess } from './todosAccess'
import { getPresignedUrl } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const acessobj = new TodosAccess()
const logger = createLogger("Todos")
const s3_bucket = process.env.ATTACHMENT_S3_BUCKET

export async function createTodo(userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()
  const todo = {
    todoId: todoId,
    userId: userId,
    attachmentUrl: `https://${s3_bucket}.s3.amazonaws.com/${todoId}`,
    ...newTodo
  }

  const newItem: TodoItem = await acessobj.createTodo(todo as TodoItem)

  return newItem
}

export async function getTodos(userId: string): Promise<any> {
  logger.info("Getting Todos", userId)
  return acessobj.getTodo(userId);
}

export async function updateTodo(todoId: String, updatedTodo: UpdateTodoRequest, userId: String): Promise<any> {
  const todo = {
    todoId: todoId,
    userId: userId,
    ...updatedTodo
  }

  return await acessobj.updateTodo(todo as TodoItem)
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  logger.info('deleting a todo', todoId)
  acessobj.deleteTodo(todoId, userId)
}

export function getPresignedUrlForTodo(todoId: String): string {
  return getPresignedUrl(todoId)
}
