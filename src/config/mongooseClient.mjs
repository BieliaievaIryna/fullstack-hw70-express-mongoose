import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectToDB() {
  try {
    await mongoose.connect(process.env.DB_URI, {
      dbName: 'myapp_db',
      autoIndex: true,
      bufferCommands: false
    });

    console.log('✅ Connected to MongoDB Atlas via Mongoose');
  } catch (err) {
    console.error('❌ Mongoose connection error:', err);
    process.exit(1);
  }
}
