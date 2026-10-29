import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'default-user'
    const record = await db.userProgress.findUnique({
      where: { userId },
    })

    if (!record) {
      return NextResponse.json({
        exists: false,
        progress: null,
      })
    }

    return NextResponse.json({
      exists: true,
      progress: {
        points: record.points,
        labRuns: record.labRuns,
        gateRuns: record.gateRuns,
        novaQuestions: record.novaQuestions,
        achievements: JSON.parse(record.achievements || '[]'),
        completedLessons: JSON.parse(record.completedLessons || '{}'),
        doctorResults: JSON.parse(record.doctorResults || '{}'),
        challengeSessions: JSON.parse(record.challengeSessions || '[]'),
        projectActivities: JSON.parse(record.projectActivities || '{}'),
        activity: JSON.parse(record.activity || '[]'),
      },
    })
  } catch (err: any) {
    console.error('Error fetching progress from DB:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = req.headers.get('x-user-id') || 'default-user'

    const payload = {
      points: typeof body.points === 'number' ? body.points : 0,
      labRuns: typeof body.labRuns === 'number' ? body.labRuns : 0,
      gateRuns: typeof body.gateRuns === 'number' ? body.gateRuns : 0,
      novaQuestions: typeof body.novaQuestions === 'number' ? body.novaQuestions : 0,
      achievements: JSON.stringify(body.achievements || []),
      completedLessons: JSON.stringify(body.completedLessons || {}),
      doctorResults: JSON.stringify(body.doctorResults || {}),
      challengeSessions: JSON.stringify(body.challengeSessions || []),
      projectActivities: JSON.stringify(body.projectActivities || {}),
      activity: JSON.stringify(body.activity || []),
    }

    const saved = await db.userProgress.upsert({
      where: { userId },
      update: payload,
      create: {
        userId,
        ...payload,
      },
    })

    return NextResponse.json({
      success: true,
      updatedAt: saved.updatedAt,
    })
  } catch (err: any) {
    console.error('Error saving progress to DB:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id') || 'default-user'
    await db.userProgress.deleteMany({
      where: { userId },
    })

    return NextResponse.json({
      success: true,
      message: 'Progress reset in database',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
