# 🏅 Comment Management System (Frontend)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.x-61DAFB.svg?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6.svg?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/vite-5.x-646CFF.svg?style=flat&logo=vite)
![Redux](https://img.shields.io/badge/redux-toolkit-764ABC.svg?style=flat&logo=redux)

A robust and modern frontend application for managing comments, replies, and reactions. Built with performance, scalability, and user experience in mind.

## 📋 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)

## 🚀 Introduction

This project serves as the frontend client for a comprehensive comment management system. It provides a seamless interface for users to authenticate, post comments, reply to threads, and react to content. It supports multiple authentication modes and real-time updates via Socket.io.

## ✨ Features

- **Authentication & Security**:
  - Secure Login and Signup pages with real-time validation.
  - Support for **Cookie-based (HttpOnly)** or **Header-based (Bearer token)** authentication methods.
  - Protected routes with smart redirection.
- **Comment Management**:
  - CRUD operations: Create, Read, Edit, Delete comments.
  - Nested replies (threading support).
  - Optimistic UI updates for a snappy user experience.
- **Interactivity**:
  - **Reactions**: Like and Dislike functionality with immediate visual feedback.
  - **Real-time Updates**: Live integration using Socket.io (optional).
- **Data Handling**:
  - Server-side sorting (Newest, Most Liked, Most Disliked).
  - Server-side pagination.
- **UI/UX**:
  - Responsive design using CSS Modules and SCSS.
  - Toast notifications for success and error states.
  - informative Alert components for form validation.

## 🛠 Technology Stack

- **Core**: [React 18](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Styling**: SCSS Modules (Sass)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Real-time**: [Socket.io Client](https://socket.io/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/comment-management-frontend.git
    cd comment-management-frontend
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory (or copy `.env.example` if available) and configure your variables.

    ```bash
    cp .env.example .env
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## ⚙️ Configuration

The application is configured via environment variables.

| Variable              | Description                  | Options / Default                      |
| :-------------------- | :--------------------------- | :------------------------------------- |
| `VITE_API_BASE_URL`   | Base URL for the backend API | **Required**                           |
| `VITE_AUTH_MODE`      | Authentication mechanism     | `cookie` (HttpOnly), `header` (Bearer) |
| `VITE_ENABLE_SOCKET`  | Enable real-time features    | `true`, `false`                        |
| `VITE_SOCKET_URL`     | Socket.io server URL         | Required if socket is enabled          |
| `VITE_ENABLE_REPLIES` | Enable threaded replies      | `true`, `false`                        |

## 📂 Project Structure

```
src/
├── app/              # Redux store and global hooks
├── components/       # Shared UI components (Button, Input, Alert, etc.)
├── features/         # Feature-based modules (Auth, Comments)
├── pages/            # Page components (LoginPage, CommentsPage)
├── routes/           # Routing configuration and wrappers
├── styles/           # Global styles and variables
└── utils/            # Helper functions and environment config
```

## 📡 API Reference & Assumptions

The frontend expects the backend to adhere to the following contract:

**Comments**

- `GET /api/comments`: Fetch paginated comments.
- `POST /api/comments`: Add a new comment.
- `PATCH /api/comments/:id`: Edit a comment.
- `DELETE /api/comments/:id`: Remove a comment.
- `POST /api/comments/:id/reactions`: Toggle like/dislike.

**Authentication**

- `GET /api/auth/me`: Get current user profile.
- `POST /api/auth/login`: Authenticate user.
- `POST /api/auth/register`: Register new user.

---

Made with ❤️ by Myself
# comment-management-frontend
