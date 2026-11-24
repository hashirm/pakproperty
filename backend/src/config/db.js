import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    const isProduction = process.env.NODE_ENV === 'production';

    const mongooseOptions = {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    };

    if (mongoUri) {
      console.log('Connecting to production MongoDB...');
      await mongoose.connect(mongoUri, mongooseOptions);
      console.log('Connected to MongoDB successfully');
    } else {
      if (isProduction) {
        console.warn(
          '⚠️ WARNING: Running in production mode without MONGODB_URI. In-memory MongoDB will be used, but data will NOT persist across server restarts. Set MONGODB_URI in your environment variables for persistent storage.'
        );
      } else {
        console.log('No MONGODB_URI provided. Initializing in-memory development MongoDB server...');
      }

      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, mongooseOptions);
      console.log(`In-memory MongoDB started and connected at ${uri}`);
    }

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection runtime error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection lost. Reconnecting...');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
