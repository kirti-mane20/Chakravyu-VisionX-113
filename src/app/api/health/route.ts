import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const userCount = await db.userProgress.count().catch(() => 0)
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      userCount,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({
      status: 'degraded',
      database: 'error',
      message: err.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
