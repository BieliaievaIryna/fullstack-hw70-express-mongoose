import bcrypt from 'bcrypt'
import User from '../models/User.mjs'

// --- READ: всі користувачі з проекцією ---
export const getUsersHandler = async (req, res) => {
  try {
    const users = await User.find({}, 'name username email createdAt').lean()

    res.render('index', {
      title: 'Users List',
      page: 'users/list',
      locals: { users },
      theme: req.cookies.theme || 'light'
    })
  } catch (error) {
    console.error('Помилка при отриманні користувачів:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- READ: користувач за ID ---
export const getUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId, 'name username email createdAt').lean()

    if (!user) return res.status(404).send('User Not Found')

    res.render('index', {
      title: user.name,
      page: 'users/detail',
      locals: { user },
      theme: req.cookies.theme || 'light'
    })
  } catch (error) {
    console.error('Помилка при отриманні користувача:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- CREATE: один користувач ---
export const postUsersHandler = async (req, res) => {
  try {
    const { name, username, email, password } = req.body
    if (!name || !username || !password)
      return res.status(400).send('Missing required fields')

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      username,
      email: email || '',
      password: hashedPassword
    })

    await newUser.save()

    res.status(201).send('User created')
  } catch (error) {
    console.error('Помилка при створенні користувача:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- UPDATE: один користувач ---
export const putUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params
    const { name, username, email, password } = req.body

    const updateData = { name, username, email }
    if (password) updateData.password = await bcrypt.hash(password, 10)

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true })

    if (!user) return res.status(404).send('User Not Found')

    res.status(200).send(`Updated user: ${userId}`)
  } catch (error) {
    console.error('Помилка при оновленні користувача:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- REPLACE: повна заміна документа користувача ---
export const replaceUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params
    const { name, username, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.findOneAndReplace(
      { _id: userId },
      { name, username, email, password: hashedPassword, createdAt: new Date() },
      { new: true }
    )

    if (!user) return res.status(404).send('User Not Found')

    res.status(200).send(`Replaced user: ${userId}`)
  } catch (error) {
    console.error('Помилка при заміні користувача:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- DELETE: один користувач ---
export const deleteUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params
    const result = await User.findByIdAndDelete(userId)

    if (!result) return res.status(404).send('User Not Found')

    res.status(204).send('')
  } catch (error) {
    console.error('Помилка при видаленні користувача:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- bulk операції ---
export const insertManyUsers = async (usersArray) => {
  return await User.insertMany(usersArray)
}

export const updateManyUsers = async (filter, update) => {
  return await User.updateMany(filter, { $set: update })
}

export const deleteManyUsers = async (filter) => {
  return await User.deleteMany(filter)
}

// --- CURSOR: отримання користувачів з обробкою курсора ---
export const getUsersCursorHandler = async (req, res) => {
  try {
    const cursor = User.find({}, 'name email').cursor()
    const users = []

    for await (const user of cursor) {
      users.push(user)
    }

    res.status(200).json({
      count: users.length,
      users
    })
  } catch (error) {
    console.error('Помилка при обробці курсора користувачів:', error)
    res.status(500).send('Internal Server Error')
  }
}

// --- AGGREGATION: статистика користувачів ---
export const getUsersStatsHandler = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $group: { _id: null, totalUsers: { $sum: 1 }, avgNameLength: { $avg: { $strLenCP: "$name" } } } }
    ])

    res.status(200).json(stats[0])
  } catch (error) {
    console.error('Помилка при агрегації користувачів:', error)
    res.status(500).send('Internal Server Error')
  }
}
