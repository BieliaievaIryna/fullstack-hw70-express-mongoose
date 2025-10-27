import { connectToDB } from './config/mongooseClient.mjs'
import mongoose from 'mongoose'
import User from './models/User.mjs'
import Article from './models/Article.mjs'

async function testDB() {
  try {
    await connectToDB()

    // ===== USERS =====
    await User.deleteMany({})
    console.log('Users collection cleared')

    // InsertOne
    const user1 = await User.create({
      name: 'Test User 1',
      username: 'testuser1',
      email: 'user1@example.com',
      password: '1234'
    })
    console.log('Inserted one user:', user1._id.toString())

    // InsertMany
    const users = await User.insertMany([
      { name: 'Test User 2', username: 'testuser2', email: 'user2@example.com', password: '1234' },
      { name: 'Test User 3', username: 'testuser3', email: 'user3@example.com', password: '1234' }
    ])
    console.log('Inserted many users:', users.length)

    // Find with projection
    const foundUsers = await User.find({}, 'name username email')
    console.log('Users in collection:', foundUsers)

    // UpdateOne
    const updateOneResult = await User.updateOne(
      { username: 'testuser1' },
      { email: 'updated1@example.com' }
    )
    console.log('Updated one user:', updateOneResult.modifiedCount)

    // UpdateMany
    const updateManyResult = await User.updateMany({}, { updatedAt: new Date() })
    console.log('Updated many users:', updateManyResult.modifiedCount)

    // ReplaceOne
    const replaceOneResult = await User.replaceOne(
      { username: 'testuser2' },
      {
        name: 'Replaced User',
        username: 'replaceduser',
        email: 'replaced@example.com',
        password: 'pass',
        createdAt: new Date()
      }
    )
    console.log('Replaced one user:', replaceOneResult.modifiedCount)

    // DeleteOne
    const deleteOneResult = await User.deleteOne({ username: 'testuser3' })
    console.log('Deleted one user:', deleteOneResult.deletedCount)

    // DeleteMany
    const deleteManyResult = await User.deleteMany({ username: /testuser/ })
    console.log('Deleted many users:', deleteManyResult.deletedCount)

    // ===== ARTICLES =====
    await Article.deleteMany({})
    console.log('Articles collection cleared')

    // InsertOne
    const article1 = await Article.create({
      title: 'Test Article 1',
      content: 'Content 1',
      author: 'testuser1'
    })
    console.log('Inserted one article:', article1._id.toString())

    // InsertMany
    const articles = await Article.insertMany([
      { title: 'Test Article 2', content: 'Content 2', author: 'testuser2' },
      { title: 'Test Article 3', content: 'Content 3', author: 'testuser3' }
    ])
    console.log('Inserted many articles:', articles.length)

    // Find with projection
    const foundArticles = await Article.find({}, 'title author')
    console.log('Articles in collection:', foundArticles)

    // UpdateOne
    const updateArticleOne = await Article.updateOne(
      { title: 'Test Article 1' },
      { content: 'Updated Content 1' }
    )
    console.log('Updated one article:', updateArticleOne.modifiedCount)

    // UpdateMany
    const updateArticlesMany = await Article.updateMany({}, { updatedAt: new Date() })
    console.log('Updated many articles:', updateArticlesMany.modifiedCount)

    // ReplaceOne
    const replaceArticleOne = await Article.replaceOne(
      { title: 'Test Article 2' },
      { title: 'Replaced Article', content: 'New Content', author: 'admin', createdAt: new Date() }
    )
    console.log('Replaced one article:', replaceArticleOne.modifiedCount)

    // DeleteOne
    const deleteArticleOne = await Article.deleteOne({ title: 'Test Article 3' })
    console.log('Deleted one article:', deleteArticleOne.deletedCount)

    // DeleteMany
    const deleteArticlesMany = await Article.deleteMany({ title: /Test Article/ })
    console.log('Deleted many articles:', deleteArticlesMany.deletedCount)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Connection closed')
  }
}

testDB()
