"use client";

import { useEffect, useRef, useState } from "react";
import { getModel } from "@/lib/gemini";
import { taskTools } from "@/Ai/tools";
import type { Tool } from "@google/generative-ai";
import {
  aiCreateTask,
  aiListTasks,
  aiUpdateTask,
  aiDeleteTask,
} from "@/services/aiTools";

import ReactMarkdown from "react-markdown";
import { Task } from "@/types/task";
import { generateTaskSummary } from "@/utils/taskSummary";
import toast from "react-hot-toast";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function AIChat({
  onAIAction,
  tasks = [],
}: {
  onAIAction?: () => void;
  tasks?: Task[];
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const userInput = input.trim();
    if (!userInput || loading) return;

    const userMsg: Message = { role: "user", text: userInput };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // Generate summary if productivity question
    const shouldIncludeSummary = isProductivityQuestion(userInput);
    const summary =
      shouldIncludeSummary && tasks.length > 0
        ? generateTaskSummary(tasks)
        : null;

    // Build the prompt with optional summary
    let prompt = userInput;
    if (summary) {
      prompt = `${summary}\n\nUser question: ${userInput}`;
    }

    const model = getModel();

    try {
      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: taskTools as Tool[],
      });

      const functionCalls = response.response.functionCalls();

      if (!functionCalls || functionCalls.length === 0) {
        const text = response.response.text();
        setMessages((m) => [...m, { role: "ai", text }]);
        setLoading(false);
        return;
      }

      // Process tool call
      const toolCall = functionCalls[0];
      const { name, args } = toolCall;

      // Type assertion for args based on function name
      let result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const argsObj = args as Record<string, any>;

      try {
        if (name === "create_task") {
          result = await aiCreateTask(
            argsObj.title as string,
            (argsObj.description as string) || ""
          );
          toast.success("Task created successfully!");
          // Refresh tasks after AI creates a task
          onAIAction?.();
        } else if (name === "list_tasks") {
          result = await aiListTasks();
        } else if (name === "update_task") {
          result = await aiUpdateTask({ ...argsObj });
          toast.success("Task updated successfully!");
          // Refresh tasks after AI updates a task
          onAIAction?.();
        } else if (name === "delete_task") {
          result = await aiDeleteTask(argsObj.id as string);
          toast.success("Task deleted successfully!");
          // Refresh tasks after AI deletes a task
          onAIAction?.();
        } else {
          result = { error: "Unknown tool" };
          toast.error("Unknown action requested");
        }
      } catch (toolError) {
        console.error("Tool call error:", toolError);
        const actionName = name.replace(/_/g, " ");
        toast.error(`Failed to ${actionName}. Please try again.`);
        result = { error: "Tool call failed" };
      }

      // Send tool response back to model
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
          {
            role: "model",
            parts: [{ functionCall: toolCall }],
          },
          {
            role: "function",
            parts: [
              {
                functionResponse: {
                  name: name,
                  response: result,
                },
              },
            ],
          },
        ],
      });

      const finalResponse = await chat.sendMessage("Continue");
      const finalText = finalResponse.response.text();

      setMessages((m) => [...m, { role: "ai", text: finalText }]);
    } catch (error) {
      console.error("Error in AI chat:", error);
      toast.error("An error occurred. Please try again.");
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    }
    setLoading(false);
  }

  // Helper to detect productivity questions
  function isProductivityQuestion(userInput: string): boolean {
    const productivityKeywords = [
      "productivity",
      "today",
      "progress",
      "completed",
      "summary",
      "stats",
      "statistics",
      "how many",
      "what did i",
      "what have i",
      "how much",
      "efficiency",
      "performance",
    ];

    const lowerInput = userInput.toLowerCase();
    return productivityKeywords.some((keyword) => lowerInput.includes(keyword));
  }

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-scroll space-y-4 p-4 min-h-0 max-h-[calc(100vh-12rem)] overscroll-contain scrollbar-thin">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-xl text-sm leading-relaxed shadow
          ${
            m.role === "user"
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-100 text-gray-900 rounded-bl-none"
          }`}
            >
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 bg-gray-200 rounded-xl text-sm shadow rounded-bl-none animate-pulse">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 pt-0 flex gap-2 flex-shrink-0 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
        <input
          className="flex-1 p-2 rounded-bl-xl outline-none"
          placeholder="Ask Merlin anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-br-xl shadow hover:bg-blue-700 disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
