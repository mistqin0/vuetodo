#!/bin/bash

BACKEND_PORT=3000
FRONTEND_PORT=5173

echo "Stopping services..."

# 停止 MariaDB
if pgrep -x mysqld >/dev/null; then
  echo "Stopping MariaDB..."
  mysqladmin shutdown -u root >/dev/null 2>&1
fi

# 停止占用后端端口的进程
if lsof -i:"$BACKEND_PORT" >/dev/null 2>&1; then
  echo "Stopping backend on port $BACKEND_PORT..."
  fuser -k "$BACKEND_PORT"/tcp >/dev/null 2>&1
fi

# 停止占用前端端口的进程
if lsof -i:"$FRONTEND_PORT" >/dev/null 2>&1; then
  echo "Stopping frontend on port $FRONTEND_PORT..."
  fuser -k "$FRONTEND_PORT"/tcp >/dev/null 2>&1
fi

# 兜底清理 tsx / vite 进程
pkill -f "tsx src/index.ts" >/dev/null 2>&1
pkill -f "vite" >/dev/null 2>&1

echo "All services stopped"

