import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'

export class TodosAccess {
    constructor(
        private readonly XAWS = AWSXRay.captureAWS(AWS),
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly createdAtIndex = process.env.TODOS_CREATED_AT_INDEX
        private logger = createLogger('TodosAccess')
    ) { }


    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async getTodo(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.createdAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return result.Items as TodoItem[]
    }

    async updateTodo(updatedTodo: TodoItem): Promise<void> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                'todoId': updatedTodo.todoId,
                'userId': updatedTodo.userId
            },
            UpdateExpression: 'set #namefield = :n, dueDate = :d, done = :done',
            ExpressionAttributeValues: {
                ':n': updateTodo.name,
                ':d': updatedTodo.dueDate,
                ':done': updatedTodo.done
            },
            ExpressionAttributeNames: {
                "#namefield": "name"
            }
        }).promise()
    }

    async updateTodoUrl(updatedTodo: TodoItem): Promise<string> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId: updatedTodo.todoId,
                userId: updatedTodo.userId
            },
            ExpressionAttributeNames: { "#A": "attachmentUrl" },
            UpdateExpression: "set #A = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": updatedTodo.attachmentUrl,
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()

        return updatedTodo.attachmentUrl
    }

    async deleteTodo(todoId: string, userId: string): Promise<void> {
        try {
            await this.docClient.delete({
                TableName: this.todosTable,
                Key: { todoId, userId }
            }).promise()

            logger.debug('Todo item deleted')
        } catch (error) {
            logger.error(error)
        }
    }
}
