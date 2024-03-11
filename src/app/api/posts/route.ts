import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { postSchema } from '@/app/validationSchemas';

export async function GET(request: NextRequest) {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      postImages: true,
    },
  });

  const response = NextResponse.json(posts);
  response.headers.set('Cache-Control', 'no-store');

  return response;
  // console.log(posts);
  // return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = postSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const newPost = await db.post.create({
    data: {
      title: body.title,
      content: body.content,
      postUserId: body.postUserId,
    },
  });

  return NextResponse.json(newPost, { status: 201 });
}
