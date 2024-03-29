import { Router } from 'express'
import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
const router = Router()

const hashedPassword = async (pass) => {
  const salt = await bcrypt.genSalt(10)

  // const hashedPassword = await
  const hashed = await bcrypt.hash(pass, salt)
  return hashed
}

// Signup route
router.post('/signup', async (req, res) => {
  console.log('Authed signed up')
  try {
    const { username, password } = req.body
    
    const user = new User({
      username,
      password: await hashedPassword(password),
    })
    await user.save()
    res.status(201).json({ message: 'New user registered successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
const log = (obj, ...msg) => {
  console.log(...msg,(obj))
  return obj
}
// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }
    if (log(user.password, 'user.pass') !== log(await hashedPassword(password), 'bcrypt.pass')) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    )
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
