import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private logger = createLogger('TodosAccess')
    ) { }


    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    async getTodo(userId: string): Promise<any> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }).promise()

        return result.Items
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
                ':n': updatedTodo.name,
                ':d': updatedTodo.dueDate,
                ':done': updatedTodo.done
            },
            ExpressionAttributeNames: {
                "#namefield": "name"
            }
        }).promise()
    }

    async deleteTodo(todoId: string, userId: string): Promise<void> {
        try {
            await this.docClient.delete({
                TableName: this.todosTable,
                Key: { todoId, userId }
            }).promise()

            this.logger.debug('Todo item deleted')
        } catch (error) {
            this.logger.error(error)
        }
    }
}
