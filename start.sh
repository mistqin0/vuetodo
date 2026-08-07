#!/bin/bash

BASE=~/newvue
BACKEND_PORT=3000
FRONTEND_PORT=5173

# 启动 MariaDB
if pgrep -x mysqld >/dev/null; then
  echo "MariaDB already running"
else
  echo "Starting MariaDB..."
  mysqld --user=root >/dev/null 2>&1 &
fi

sleep 2

# 启动后端
if lsof -i:"$BACKEND_PORT" >/dev/null 2>&1; then
  echo "Backend already running on port $BACKEND_PORT"
else
  echo "Starting backend..."
  cd "$BASE/todo-server"
  nohup npx tsx src/index.ts > backend.log 2>&1 &
fi

# 启动前端
if lsof -i:"$FRONTEND_PORT" >/dev/null 2>&1; then
  echo "Frontend already running on port $FRONTEND_PORT"
else
  echo "Starting frontend..."
  cd ~/myvue/myvue
  nohup npm run dev > frontend.log 2>&1 &
fi

echo "All services checked and started"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo "Frontend: http://localhost:$FRONTEND_PORT"

