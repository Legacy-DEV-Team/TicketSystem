import mongoose from 'mongoose';
import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

export class DatabaseService {
  private static instance: DatabaseService;
  private mongoose: typeof mongoose | null = null;
  private redis: RedisClientType | null = null;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connectMongoDB(uri: string): Promise<void> {
    try {
      this.mongoose = await mongoose.connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      });

      logger.info('MongoDB connected successfully');

      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async connectRedis(url: string): Promise<void> {
    try {
      this.redis = createClient({ url });
      
      this.redis.on('error', (error) => {
        logger.error('Redis connection error:', error);
      });

      this.redis.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      this.redis.on('disconnect', () => {
        logger.warn('Redis disconnected');
      });

      await this.redis.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  getRedis(): RedisClientType {
    if (!this.redis) {
      throw new Error('Redis not connected');
    }
    return this.redis;
  }

  getMongoose(): typeof mongoose {
    if (!this.mongoose) {
      throw new Error('MongoDB not connected');
    }
    return this.mongoose;
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }

    if (this.mongoose) {
      await this.mongoose.disconnect();
      this.mongoose = null;
    }

    logger.info('All database connections closed');
  }

  async isHealthy(): Promise<{ mongodb: boolean; redis: boolean }> {
    const mongodb = mongoose.connection.readyState === 1;
    const redis = this.redis?.isReady || false;

    return { mongodb, redis };
  }
}