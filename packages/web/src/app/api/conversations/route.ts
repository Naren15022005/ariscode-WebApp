import { NextRequest, NextResponse } from 'next/server';
import { SqliteConversationRepository } from '@ariscode/core';
import type { Conversation } from '@ariscode/shared';

export const dynamic = 'force-dynamic';

const repo = new SqliteConversationRepository();

export async function GET() {
  try {
    const conversations = await repo.findAll();
    return NextResponse.json({ conversations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load conversations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, userId } = await request.json();
    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

    const conversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: userId ?? 'local',
      title,
      description,
      messages: [],
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await repo.create(conversation);
    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
