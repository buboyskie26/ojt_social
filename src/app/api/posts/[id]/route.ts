import { postSchema } from '@/app/validationSchemas';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  //   const session = await getServerSession(authOptions);
  //   if (!session) return NextResponse.json({}, { status: 401 });
  //
  const paramsId = params.id.toString().toLowerCase().trim();

  const emptySearch: string = ':id'; // Ensure emptySearch is typed as string
  // return NextResponse.json(paramsId);

  if (paramsId !== emptySearch) {
    console.log(`search1: ${paramsId}`);
    console.log(`emptySearch1: ${emptySearch}`);
    const filteredPost = await db.post.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        postImages: true,
      },
      where: {
        title: {
          contains: paramsId, // Match any occurrence of the input string
          mode: 'insensitive', // Make the search case-insensitive
        },
      },
    });
    return NextResponse.json(filteredPost);
  } else if (paramsId === emptySearch) {
    //
    console.log(`search2: ${paramsId}`);
    console.log(`emptySearch2: ${emptySearch}`);
    //
    const nonFilteredPosts = await db.post.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        postImages: true,
      },
    });
    // console.log(nonFilteredPosts);
    return NextResponse.json(nonFilteredPosts);
  }

  //
}

export async function PUT(request: NextRequest, { params }: Props) {
  //
  // Checking users session

  // const session = await getServerSession(authOptions);
  // if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();

  const validation = postSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const { title, content } = body;

  const post = await db.post.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!post)
    return NextResponse.json({ error: 'Invalid Post' }, { status: 400 });
  //
  const updatedIssue = await db.post.update({
    where: { id: post.id },
    data: {
      title,
      content,
    },
  });
  //
  return NextResponse.json(updatedIssue);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // Checking user's session
  // const session = await getServerSession(authOptions);
  // if (!session) return NextResponse.json({}, { status: 401 });

  const post = await db.post.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!post) {
    return NextResponse.json({ error: 'Invalid Post' }, { status: 404 });
  }

  try {
    const doesRemove = await db.post.delete({ where: { id: post.id } });
    if (doesRemove) {
      return NextResponse.json(
        { message: 'Post successfully removed.' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Could not delete post. Please try again later.' },
      { status: 500 }
    );
  }
}
