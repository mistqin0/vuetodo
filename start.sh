#!/bin/bash

BASE=~/newvue

echo " Starting MariaDB..."
mysqld --user=root >/dev/null 2>&1 &

sleep 2
echo " Starting backend..."
cd "./todo-server"
nohup npx tsx src/index.ts > backend.log 2>&1 &

echo " Starting frontend..."
cd "/root/myvue/myvue"
nohup npm run dev  > frontend.log 2>&1 &

echo "All services started"
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"

