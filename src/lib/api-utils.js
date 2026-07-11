import { NextResponse } from 'next/server';
import pool from './db';

export function isDatabaseConnectionError(error) {
  const message = String(error?.message || error?.cause?.message || '').toLowerCase();
  const code = error?.code || error?.cause?.code;

  return (
    message.includes('connect') ||
    message.includes('connection terminated') ||
    message.includes('connection timeout') ||
    message.includes('control plane request failed') ||
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    message.includes('etimedout') ||
    message.includes('ehostunreach') ||
    message.includes('timeout') ||
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'ETIMEDOUT' ||
    code === 'EHOSTUNREACH' ||
    code === 'XX000'
  );
}

/**
 * Safe wrapper for API routes that ensures JSON responses
 * Prevents HTML error pages from being returned to clients
 */
export function handleApiError(error) {
  const errorMsg = error?.message || 'Unknown error';
  console.error('API Error:', errorMsg);

  // Database connection errors
  if (isDatabaseConnectionError(error)) {
    return NextResponse.json(
      { success: false, error: 'Database connection unavailable' },
      { status: 503 }
    );
  }

  // Validation errors
  if (error?.code === '23505') {
    // Unique constraint violation
    return NextResponse.json(
      { success: false, error: 'Record already exists' },
      { status: 400 }
    );
  }

  if (error?.code === '23503') {
    // Foreign key constraint
    return NextResponse.json(
      { success: false, error: 'Invalid reference' },
      { status: 400 }
    );
  }

  // Default server error
  return NextResponse.json(
    { success: false, error: 'Server error' },
    { status: 500 }
  );
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
 * Execute query with timeout and error handling
 */
export async function queryWithTimeout(query, params = [], timeoutMs = 10000) {
  try {
    return await Promise.race([
      pool.query(query, params),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
      ),
    ]);
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}

/**
 * Wrap async route handlers with automatic error handling
 */
export function withErrorHandler(handler) {
  return async (req) => {
    try {
      return await handler(req);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Create a wrapped GET handler
 */
export function GET(handler) {
  return withErrorHandler(handler);
}
