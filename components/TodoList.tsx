"use client"

import { useState, useEffect } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "@/amplify/data/resource"

const client = generateClient<Schema>()

export default function TodoList() {
    const [todos, setTodos] = useState<Schema["Todo"][]>([])

    async function listTodos() {
        const { data } = await client.models.Todo.list()
        setTodos(data)
    }

    useEffect(() => {
        // listTodos()
        const sub = client.models.Todo.observeQuery().subscribe(({ items }) =>
            setTodos([...items])
        )

        return () => sub.unsubscribe()
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
                console.log(errors, newTodo)
            }}>Create </button>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>{todo.content}</li>
                ))}
            </ul>
        </div>
    )
}