import { TodosAccess } from './todosAccess'
import { getPresignedUrl } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const acessobj = new TodosAccess()
const logger = createLogger("Todos")

export async function createTodo(userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {
  const todo = {
    todoId: uuid.v4(),
    userId: userId,
    ...newTodo
  }

  const newItem: TodoItem = await acessobj.createTodo(todo as TodoItem)

  return newItem
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
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
  logger.debug('deleting a todo: ${todoId}')
  acessobj.deleteTodo(todoId, userId)
}

export async function getPresignedUrlForTodo(todoId: String, userId: String): Promise<string> {
  const attachmentUrl = getPresignedUrl(todoId)
  const todo = {
    todoId: todoId,
    userId: userId,
    attachmentUrl: attachmentUrl
  }

  return await acessobj.updateTodoUrl(todo as TodoItem)
}
