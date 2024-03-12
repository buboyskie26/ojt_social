import { postSchema } from '@/app/validationSchemas';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import cloudinary from '@/config/cloudinary';

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
    // console.log(`search1: ${paramsId}`);
    // console.log(`emptySearch1: ${emptySearch}`);
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
    // console.log(`search2: ${paramsId}`);
    // console.log(`emptySearch2: ${emptySearch}`);
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

// export async function PUT(request: NextRequest, { params }: Props) {
//   //
//   // Checking users session

//   // const session = await getServerSession(authOptions);
//   // if (!session) return NextResponse.json({}, { status: 401 });

//   const body = await request.json();

//   const validation = postSchema.safeParse(body);

//   if (!validation.success)
//     return NextResponse.json(validation.error.format(), { status: 400 });

//   const { title, content } = body;

//   const post = await db.post.findUnique({
//     where: { id: parseInt(params.id) },
//   });

//   if (!post)
//     return NextResponse.json({ error: 'Invalid Post' }, { status: 400 });
//   //
//   const updatedIssue = await db.post.update({
//     where: { id: post.id },
//     data: {
//       title,
//       content,
//     },
//   });
//   //
//   return NextResponse.json(updatedIssue);
// }

export async function PUT(request: NextRequest, { params }: Props) {
  //
  const postId = parseInt(params.id as string); // Assuming you're using Next.js routing with parameters
  const formData = await request.formData();
  //   console.log(formData);
  const images = formData
    .getAll('images')
    .filter((image: any) => image.name !== '');

  const editTitle = formData.get('title') as string;
  const editContent = formData.get('content') as string;

  // console.log(`title: ${title}`);
  // console.log(`content: ${content}`);
  // Annotation of  object.
  const updateData: { title?: string; content?: string } = {};

  if (typeof editTitle === 'string') {
    updateData.title = editTitle;
  }

  if (typeof editContent === 'string') {
    updateData.content = editContent;
  }
  let doesUpdated = false;
  if (Object.keys(updateData).length > 0) {
    const updatePost = await db.post.update({
      where: { id: postId },
      data: updateData,
    });
    doesUpdated = true;
  }

  // return NextResponse.json({});
  if (images.length > 0 && !isNaN(postId)) {
    // Fetch existing post images from the database
    const deletingPostImageAssociatedWithPostId =
      await db.postImages.deleteMany({
        where: { postImagesPostId: postId },
      });
    //
    // console.log('has image');

    const imageUploadPromises = [];

    // Delete all images associated with the PostID
    // Insert new Images.
    // Only update the post object if there's any.
    //
    for (const image of images) {
      //
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      // Convert the image data to base64
      const imageBase64 = imageData.toString('base64');

      // Make request to upload to Cloudinary
      const result: any = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: 'posts',
        }
      );

      // console.log(result);

      imageUploadPromises.push(result.secure_url);

      const newPostImage: any = await db.postImages.create({
        data: {
          image_name: result.secure_url, // Assuming the field name is correct
          postImagesPostId: postId,
        },
      });
      //
    }
    return Response.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  }

  if (doesUpdated)
    return NextResponse.json(
      { message: `Post ID ${postId} Successfully updated` },
      { status: 200 }
    );
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
