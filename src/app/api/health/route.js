import { NextResponse } from 'next/server';
import pool, { checkPoolHealth } from '@/lib/db';

export async function GET() {
  try {
    const isHealthy = await checkPoolHealth();
    
    if (!isHealthy) {
      return NextResponse.json(
        { 
          success: false, 
          status: 'unhealthy',
          message: 'Database pool is not responding',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error.message);
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
