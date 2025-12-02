# Task Management Application with AI Assistant (MCP-Based)

A modern, feature-rich task management application built with Next.js and powered by Google Gemini AI.Where AI can create, update, delete, and summarize tasks by calling real backend functions

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![Go](https://img.shields.io/badge/Go-1.25-38bdf8?style=for-the-badge&logo=go)

## 📋 What This App Does

The AI is not just a chatbot — it works using a Model Context Protocol (MCP)-style architecture, meaning the model can invoke backend tools to perform real actions safely and deterministically.
**Key Capabilities:**

-  Create, update, and delete tasks with a simple interface
-  Interact with an AI assistant to manage tasks through conversation
-  Track productivity with detailed analytics and visualizations
-  Secure authentication with JWT token management
-  Monitor task completion trends and efficiency metrics
-  Filter and view tasks by date ranges
-  Manage user profile and security settings

## 📸 Screenshots

### Dashboard - Task Management


_Main dashboard showing the task list with create task form and AI assistant panel_
<img width="1552" height="907" alt="Screenshot 2025-12-02 at 7 58 27 PM" src="https://github.com/user-attachments/assets/eee736c6-ecd4-48df-b4d0-70047532eb4e" />


### Analytics Dashboard


_Comprehensive analytics view with charts showing task completion trends, status distribution, and productivity metrics_
<img width="1552" height="907" alt="Screenshot 2025-12-02 at 8 00 02 PM" src="https://github.com/user-attachments/assets/28f49c55-6e08-4853-a6cf-c68f8e7630fa" />
<img width="1552" height="907" alt="Screenshot 2025-12-02 at 8 00 19 PM" src="https://github.com/user-attachments/assets/46c7e549-11b1-4885-97c0-57fc61ce379d" />

## MCP (Model Context Protocol) – How AI Works Here

This project implements an Action-based MCP pattern.
### What kind of MCP is this?
- **HTTP-based, Tool-Calling MCP**
- **Server-controlled execution**
- **Deterministic & safe**

### What the AI can do:
- *Call create_task*
- *Call update_task*
- *Call delete_task*
- *Call list_tasks*
- *Ask for task summaries*

### What the AI cannot do:
- *Directly modify the database*
- *Execute arbitrary code*
- *Bypass authentication*
- *Guess or hallucinate task state*

#### All actions go through typed, validated backend functions.

- The model decides what tool to call,
- the server decides how the action is executed.
## ✨ Features

### 🎯 Task Management

- **Create Tasks**: Add new tasks with title and description
- **Update Status**: Change task status (Todo → In Progress → Done)
- **Delete Tasks**: Remove tasks with confirmation
- **Real-time Updates**: Tasks refresh automatically after operations
- **Toast Notifications**: Instant feedback for all operations

### 🤖 AI Assistant (Merlin)

- **Natural Language Processing**: Chat with AI to manage tasks
- **Intelligent Task Creation**: Create tasks by simply describing them
- **Smart Updates**: Update task details through conversation
- **Task Deletion**: Remove tasks via AI commands
- **Productivity Insights**: Ask about your productivity and get task summaries
- **Context-Aware**: AI understands your task context and provides relevant responses

### 📊 Analytics & Insights

- **Task Metrics Dashboard**:
  - Total tasks count
  - Completed tasks
  - In-progress tasks
  - Remaining tasks
  - Tasks completed this month
- **Visual Charts**:
  - **Pie Chart**: Task status distribution
  - **Line Chart**: Daily completion trends (last 7 days)
  - **Bar Chart**: Weekly trends (last 4 weeks)
- **Date Filtering**:
  - Today
  - Last 7 days
  - This month
  - Custom date range
- **Progress Tracking**:
  - Overall progress percentage
  - Completion rate
  - Efficiency metrics

### 🔐 Authentication & Security

- **User Registration**: Create new accounts
- **Secure Login**: JWT-based authentication
- **Auto Token Refresh**: Automatic token refresh on expiration
- **Profile Management**: Update personal information
- **Password Change**: Secure password update functionality
- **Protected Routes**: Authentication guard for sensitive pages

### 🎨 User Interface

- **Modern Design**: Clean, intuitive interface built with Tailwind CSS
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Polished transitions and interactions
- **Icon System**: Consistent iconography using React Icons

### 📱 Navigation

- **Sidebar Navigation**: Easy access to different views
- **View Switching**: Toggle between To-do and Analytics views
- **Quick Actions**: Fast access to profile and settings

## 🛠️ Technology Stack

### Frontend

- **Next.js 16.0** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript 5.0** - Type safety
- **Tailwind CSS 3.4** - Utility-first CSS framework

### AI & Data Visualization

- **Google Gemini AI** - Natural language processing and task management
- **Recharts 3.5** - Data visualization library for charts

### Utilities

- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notification system
- **React Icons** - Icon library
- **React Markdown** - Markdown rendering for AI responses
- **ClassNames** - Conditional class name utility

### Authentication

- **JWT Tokens** - Secure authentication
- **Cookie-based Sessions** - Persistent login sessions

### Backend
# follow the link for backend Repo:[Go Backend](https://github.com/Anilrajput6441/MCP-GO-Backend.git)
- *The backend is written in Go so follow the repo Readme to initialize the backend*

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Backend API server running (for task operations)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Go-Frontend-Nextjs
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
Go-Frontend-Nextjs/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── profile/           # Profile pages
│   │   └── security/      # Security settings
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AIChat.tsx         # AI chat interface
│   ├── AIPanel.tsx        # AI panel wrapper
│   ├── Analytic.tsx       # Analytics dashboard
│   ├── CreateTask.tsx     # Task creation form
│   ├── TaskList.tsx       # Task list display
│   ├── Sidebar.tsx        # Navigation sidebar
│   └── Toaster.tsx        # Toast notifications
├── services/              # API service functions
│   ├── aiTools.ts         # AI task operations
│   ├── taskService.ts     # Task CRUD operations
│   ├── authService.ts     # Authentication
│   └── userService.ts     # User management
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility libraries
│   ├── axios.ts           # Axios configuration
│   └── gemini.ts          # Gemini AI setup
├── utils/                 # Utility functions
│   └── taskSummary.ts     # Task summary generator
├── types/                 # TypeScript types
│   └── task.ts            # Task type definitions
└── Ai/                    # AI configuration
    └── tools.ts           # AI function declarations
```

## 🔧 Configuration

### API Configuration

The app communicates with a backend API. Ensure your backend is running and the `NEXT_PUBLIC_API_URL` environment variable points to the correct endpoint.

### AI Configuration

To use the AI assistant features, you need a Google Gemini API key. Add it to your `.env.local` file as `NEXT_PUBLIC_GEMINI_API_KEY`.

## 📝 Usage Examples

### Creating a Task via UI

1. Navigate to the dashboard
2. Enter task title in the input field
3. Optionally add a description
4. Click "Add Task"

### Creating a Task via AI

1. Open the AI panel on the right
2. Type: "Create a task to review the quarterly report"
3. The AI will create the task automatically

### Asking About Productivity

1. Open the AI panel
2. Type: "What's my productivity today?"
3. Get a summary of completed and pending tasks

### Viewing Analytics

1. Click "Analytics" in the sidebar
2. Select a date filter (Today, Last 7 Days, This Month, or Custom)
3. View charts and metrics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Recharts](https://recharts.org/) - Chart library
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications

---

**Anil Behera**
