# Vue Todo App

A full-stack Todo application built with Vue.js frontend and a Node.js backend.

## Project Structure

```
vuetodo/
├── myvue/          # Vue.js frontend
├── todo-server/    # Node.js backend API
└── start.sh        # One-click startup script
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

### Quick Start (Recommended)

Run the following command in the project root directory:

```bash
./start.sh
```

### Manual Start

#### 1. Start the Backend Server

```bash
cd todo-server
npm install
npm run start
```

#### 2. Start the Frontend

Open a new terminal:

```bash
cd myvue
npm install
npm run dev
```

## Available Scripts

### Frontend (`myvue/`)

| Script        | Description                  |
| ------------- | ---------------------------- |
| `npm run dev` | Start the development server  |

### Backend (`todo-server/`)

| Script          | Description             |
| --------------- | ----------------------- |
| `npm run start` | Start the backend server |

## Tech Stack

### Frontend
- Vue 3
- TypeScript
- Vite

### Backend
- Node.js
- Express / Koa

## License

This project is open source. Feel free to use it for learning or personal projects.
