import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Props {
  params: { id: string };
}
//
// User sshould request for unarchieving, this action should perform by admin, or upper than users

export async function PUT(request: NextRequest, { params }: Props) {
  //
  const postId = parseInt(params.id as string); // Assuming you're using Next.js routing with parameters
  //   console.log(postImageId);
  if (!isNaN(postId)) {
    try {
      await db.post.update({
        where: { id: postId },
        data: {
          isArchived: false, // Assuming 'isArchived' is the field you want to update
        },
      });
      console.log('Post unarchived successfully.');
      return NextResponse.json({}, { status: 200 }); // Send 200 status code on success
    } catch (error) {
      console.error('Error archiving post image:', error);
      // Handle error case if needed
      return NextResponse.json({}, { status: 500 }); // Send 500 status code on failure
    }
  } else {
    return NextResponse.json({}, { status: 400 }); // Send 400 status code for invalid request
  }
}
