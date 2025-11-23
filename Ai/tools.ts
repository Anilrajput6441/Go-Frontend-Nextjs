import { SchemaType } from "@google/generative-ai";

export const taskTools = [
  {
    functionDeclarations: [
      {
        name: "create_task",
        description: "Create a user task",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
          },
          required: ["title"],
        },
      },
      {
        name: "list_tasks",
        description: "List all tasks for a user",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {},
        },
      },
      {
        name: "update_task",
        description: "Update an existing task",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
            title: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            status: { type: SchemaType.STRING },
          },
          required: ["id"],
        },
      },
      {
        name: "delete_task",
        description: "Delete a task",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
          },
          required: ["id"],
        },
      },
    ],
  },
];
