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
          timestamp: new Date().toISOString(),
          database_url_configured: !!process.env.DATABASE_URL,
          node_env: process.env.NODE_ENV,
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      database_url_configured: !!process.env.DATABASE_URL,
      node_env: process.env.NODE_ENV,
      cloudinary_configured: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      email_configured: !!(
        (process.env.SMTP_HOST || process.env.EMAIL_HOST)
        && (process.env.SMTP_USER || process.env.EMAIL_USER)
        && (process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD)
      ),
      email_transport: (process.env.SMTP_HOST || process.env.EMAIL_HOST) ? 'smtp' : 'none',
      email_port: Number(process.env.SMTP_PORT || 587),
    });
  } catch (error) {
    console.error('Health check error:', error.message);
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
        database_url_configured: !!process.env.DATABASE_URL,
        node_env: process.env.NODE_ENV,
      },
      { status: 503 }
    );
  }
}
