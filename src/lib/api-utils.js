import { NextResponse } from 'next/server';
import pool from './db';

/**
 * Safe wrapper for API routes that ensures JSON responses
 * Prevents HTML error pages from being returned to clients
 */
export async function safeApiRoute(handler) {
  try {
    return await handler();
  } catch (error) {
    console.error('API route error:', error);
    
    // Check if it's a database connection error
    if (error.message?.includes('connect') || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { success: false, error: 'Database connection error. Please try again.' },
        { status: 503 }
      );
    }
    
    // Default server error
    return NextResponse.json(
      { success: false, error: 'Server error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Ensure table exists with timeout protection
 */
export async function ensureTableWithTimeout(createTableSQL, timeoutMs = 5000) {
  return Promise.race([
    pool.query(createTableSQL),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Table creation timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Execute query with timeout
 */
export async function queryWithTimeout(query, params = [], timeoutMs = 10000) {
  return Promise.race([
    pool.query(query, params),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
    ),
  ]);
}
