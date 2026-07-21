import express from 'express'
import cors from 'cors'
import { db } from './db'
import { hashPassword, verifyPassword, generateToken, verifyToken } from './auth'

const app = express()
app.use(cors())
app.use(express.json())

// 🔹 注册
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少 6 位' })
  }

  try {
    const hash = await hashPassword(password)
    await db.query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hash]
    )
    res.json({ message: '注册成功' })
  } catch (e: any) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: '用户名已存在' })
    }
    res.status(500).json({ error: '服务器错误' })
  }
})

// 🔹 登录
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' })
  }

  const [rows]: any = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  )

  if (rows.length === 0) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }

  const user = rows[0]
  const valid = await verifyPassword(password, user.password_hash)

  if (!valid) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }

  const token = generateToken(user.id, user.username)
  res.json({ token, username: user.username })
})

// 🔹 中间件：验证登录态
async function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' })
  }

  const token = authHeader.slice(7)
  const payload = verifyToken(token)

  if (!payload) {
    return res.status(401).json({ error: '登录已过期' })
  }

  req.userId = payload.userId
  req.username = payload.username
  next()
}

// 🔹 获取当前用户
app.get('/api/me', authMiddleware, (req: any, res) => {
  res.json({ username: req.username })
})

// 🔹 退出登录（前端删除 token 即可）
app.post('/api/logout', (_req, res) => {
  res.json({ message: '退出成功' })
})

// ====== Todo 接口（需要登录） ======

app.get('/api/todos', authMiddleware, async (req: any, res) => {
  const [rows] = await db.query(
    'SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC',
    [req.userId]
  )
  res.json(rows)
})

app.post('/api/todos', authMiddleware, async (req: any, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'text required' })

  const [result]: any = await db.query(
    'INSERT INTO todos (text, done, user_id) VALUES (?, ?, ?)',
    [text, 0, req.userId]
  )
  res.json({ id: result.insertId, text, done: 0 })
})

app.put('/api/todos/:id', authMiddleware, async (req: any, res) => {
  const id = Number(req.params.id)
  await db.query(
    'UPDATE todos SET done = 1 - done WHERE id = ? AND user_id = ?',
    [id, req.userId]
  )
  res.json({ success: true })
})

app.delete('/api/todos/:id', authMiddleware, async (req: any, res) => {
  const id = Number(req.params.id)
  await db.query(
    'DELETE FROM todos WHERE id = ? AND user_id = ?',
    [id, req.userId]
  )
  res.json({ success: true })
})

app.listen(3000, () => {
  console.log(' API server running at http://localhost:3000')
})

