import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Props {
  params: { postImageId: string };
}

export async function PUT(request: NextRequest, { params }: Props) {
  //
  console.log(params.postImageId);
  const getPostImageId = parseInt(params.postImageId as string); // Assuming you're using Next.js routing with parameters
  if (!isNaN(getPostImageId)) {
    try {
      await db.postImages.update({
        where: { id: getPostImageId },
        data: {
          isArchived: true, // Assuming 'isArchived' is the field you want to update
        },
      });
      console.log('Post image archived successfully.');
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
