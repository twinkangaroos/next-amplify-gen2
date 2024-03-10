"use client"

import { useState, useEffect } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "@/amplify/data/resource"

const client = generateClient<Schema>()

export default function TodoList() {
    const [todos, setTodos] = useState<Schema["Todo"][]>([])

    async function listTodos() {
        const { data } = await client.models.Todo.list({
            authMode: 'iam'
        })
        setTodos(data)
        console.log("CSR_todos=", data)
    }

    useEffect(() => {
        listTodos()
        if (todos.length > 0) { // todos の長さが 0 より大きい場合にサブスクリプションを設定
            const sub = client.models.Todo.observeQuery().subscribe(({ items }) =>
                setTodos([...items])
            )
            return () => sub.unsubscribe()
        }
    }, [])

    return (
        <div>
            <h1>Todos</h1>
            <button onClick={async () => {
                const { errors, data: newTodo } = await client.models.Todo.create({
                    content: window.prompt("title"),
                    done: false,
                    priority: 'medium'
                })
                console.log("newTodo=", newTodo)
                listTodos()
            }}>Create </button>

            <ul>
                {todos.length > 0 ?
                    todos.map((todo) => (
                        <li key={todo.id} style={{ listStyle: 'none' }}>{todo.content}</li>
                    ))
                    : ''
                }
            </ul>
        </div>
    )
}