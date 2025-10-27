import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.mjs';
import Article from './models/Article.mjs';

dotenv.config();

const hashedPasswordAdmin = await bcrypt.hash('12345', 10);
const hashedPasswordDefault = await bcrypt.hash('password', 10);

const users = [
  { name: 'Admin Admin', username: 'admin', email: 'admin@example.com', password: hashedPasswordAdmin },
  { name: 'Alice Johnson', username: 'alice', email: 'alice.johnson@example.com', password: hashedPasswordDefault },
  { name: 'Bob Smith', username: 'bob', email: 'bob.smith@example.com', password: hashedPasswordDefault },
  { name: 'Carol Williams', username: 'carol', email: 'carol.williams@example.com', password: hashedPasswordDefault },
  { name: 'David Brown', username: 'david', email: 'david.brown@example.com', password: hashedPasswordDefault },
  { name: 'Eva Davis', username: 'eva', email: 'eva.davis@example.com', password: hashedPasswordDefault },
  { name: 'Frank Miller', username: 'frank', email: 'frank.miller@example.com', password: hashedPasswordDefault },
];

const articles = [
  { title: 'Introduction to Node.js', content: 'Node.js is a JavaScript runtime built on Chrome’s V8 engine.', author: 'admin' },
  { title: 'Getting Started with Express', content: 'Express is a minimal and flexible Node.js web application framework.', author: 'admin' },
  { title: 'Understanding REST APIs', content: 'REST stands for Representational State Transfer.', author: 'bob' },
  { title: 'JavaScript ES6 Features', content: 'ES6 introduced let/const, arrow functions, template literals, and more.', author: 'admin' },
  { title: 'Async/Await in JavaScript', content: 'Async/await makes asynchronous code easier to write and read.', author: 'david' },
  { title: 'Handling Errors in Express', content: 'Proper error handling is essential for stable web applications.', author: 'bob' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.DB_URI, { dbName: 'myapp_db' });

    await User.deleteMany({});
    await Article.deleteMany({});

    await User.insertMany(users);
    await Article.insertMany(articles);

    console.log('✅ Seed completed successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
