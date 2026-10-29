import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = req.headers.get('x-user-id') || 'default-user'

    const saved = await db.labExperiment.create({
      data: {
        userId,
        type: body.type || 'circuit',
        data: JSON.stringify(body.data || {}),
      },
    })

    return NextResponse.json({
      success: true,
      id: saved.id,
      createdAt: saved.createdAt,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'default-user'
    const experiments = await db.labExperiment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({
      experiments: experiments.map((e) => ({
        id: e.id,
        type: e.type,
        data: JSON.parse(e.data || '{}'),
        createdAt: e.createdAt,
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
