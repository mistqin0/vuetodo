<template>
  <div class="app">
    <!-- 未登录：显示登录/注册 -->
    <div v-if="!loggedIn" class="auth-container">
      <h1>🔐 请登录/please log in</h1>

      <div class="tabs">
        <button :class="{ active: tab === 'login' }" @click="tab = 'login'">登录/log in</button>
        <button :class="{ active: tab === 'register' }" @click="tab = 'register'">注册/sign up</button>
      </div>

      <div v-if="tab === 'login'" class="form">
        <input v-model="username" placeholder="用户名/username" />
        <input v-model="password" type="password" placeholder="密码/password" @keyup.enter="doLogin" />
        <button @click="doLogin">登录/log in</button>
      </div>

      <div v-else class="form">
        <input v-model="username" placeholder="用户名/username" />
        <input v-model="password" type="password" placeholder="密码（至少6位）/password(At least 6 characters)" @keyup.enter="doRegister" />
        <button @click="doRegister">注册/sign in</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <!-- ✅ 已登录：显示 Todo -->
    <div v-else>
      <div class="header">
        <h1>📝 {{ username }} 的待办事项/📝 {{ username }} To-do list</h1>
        <button @click="doLogout">退出登录/log out</button>
      </div>

      <div class="input-area">
        <input
          v-model="newTodo"
          @keyup.enter="addTodo"
          placeholder="输入任务，回车添加/Add a task, then press Enter"
        />
        <button @click="addTodo">添加/add</button>
      </div>

      <ul class="todo-list">
        <li
          v-for="todo in todos"
          :key="todo.id"
          :class="{ done: todo.done === 1 }"
        >
          <span @click="toggleTodo(todo.id)">{{ todo.text }}</span>
          <button @click="removeTodo(todo.id)">❌</button>
        </li>
      </ul>

      <p class="footer">
        还剩 {{ remaining }} 个任务未完成/{{ remaining }} task(s) left
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as api from './api/todo'
import { register, login, getMe } from './api/auth'

const loggedIn = ref(false)
const username = ref('')
const password = ref('')
const error = ref('')
const tab = ref<'login' | 'register'>('login')

const todos = ref<api.Todo[]>([])
const newTodo = ref('')

// 检查是否已登录
async function checkAuth() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await getMe()
    username.value = res.data.username
    loggedIn.value = true
    await loadTodos()
  } catch {
    localStorage.removeItem('token')
  }
}

// 注册
async function doRegister() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = '密码至少 6 位/At least 6 characters'
    return
  }
  try {
    await register(username.value, password.value)
    error.value = ''
    tab.value = 'login'
    alert('注册成功，请登录/Registration successful. Please log in.')
  } catch (e: any) {
    error.value = e.response?.data?.error || '注册失败/Registration failed'
  }
}

// 登录
async function doLogin() {
  error.value = ''
  try {
    const res = await login(username.value, password.value)
    localStorage.setItem('token', res.data.token)
    username.value = res.data.username
    loggedIn.value = true
    await loadTodos()
  } catch (e: any) {
    error.value = e.response?.data?.error || '登录失败/Registration failed'
  }
}

// 退出
function doLogout() {
  localStorage.removeItem('token')
  loggedIn.value = false
  username.value = ''
  password.value = ''
  todos.value = []
}

// Todo 操作
async function loadTodos() {
  console.log('📦 loadTodos start')
  const res = await api.getTodos()
  console.log('📦 loadTodos response:', res.data)
  todos.value = res.data
  console.log('📦 todos.value length:', todos.value.length)
}

async function addTodo() {
  if (!newTodo.value.trim()) return
  await api.addTodo(newTodo.value)
  newTodo.value = ''
  await loadTodos()
}

async function toggleTodo(id: number) {
  await api.toggleTodo(id)
  await loadTodos()
}

async function removeTodo(id: number) {
  await api.removeTodo(id)
  await loadTodos()
}

const remaining = computed(() => todos.value.filter(t => t.done === 0).length)

onMounted(checkAuth)
</script>

<style scoped>
.app { max-width: 420px; margin: 40px auto; font-family: sans-serif; }

/* 认证区域 */
.auth-container { text-align: center; }
.tabs { display: flex; gap: 8px; margin-bottom: 16px; justify-content: center; }
.tabs button { padding: 8px 24px; cursor: pointer; border: 1px solid #ccc; background: #fff; }
.tabs .active { background: #42b983; color: #fff; border-color: #42b983; }
.form { display: flex; flex-direction: column; gap: 8px; }
.form input { padding: 8px; font-size: 14px; }
.form button { padding: 8px; background: #42b983; color: #fff; border: none; cursor: pointer; }
.error { color: #e74c3c; font-size: 14px; }

/* 已登录 */
.header { display: flex; justify-content: space-between; align-items: center; }
.header button { padding: 6px 12px; cursor: pointer; }

.input-area { display: flex; gap: 8px; margin: 16px 0; }
input { flex: 1; padding: 6px; }
button { padding: 6px 12px; cursor: pointer; }

.todo-list { list-style: none; padding: 0; }
.todo-list li { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; cursor: pointer; }
.todo-list .done span { text-decoration: line-through; color: #999; }

.footer { margin-top: 12px; font-size: 14px; color: #666; }
</style>


