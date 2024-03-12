import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { postSchema } from '@/app/validationSchemas';
import cloudinary from '@/config/cloudinary';

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

// export async function POST(request: NextRequest) {
//   const body = await request.json();

//   const validation = postSchema.safeParse(body);

//   if (!validation.success)
//     return NextResponse.json(validation.error.format(), { status: 400 });

//   const newPost = await db.post.create({
//     data: {
//       title: body.title,
//       content: body.content,
//       postUserId: body.postUserId,
//     },
//   });

//   return NextResponse.json(newPost, { status: 201 });
// }

export async function POST(request: NextRequest) {
  // Parse form data
  const formData = await request.formData();
  const body: Record<string, string> = {}; // Define the type of body

  for (const [key, value] of formData.entries()) {
    body[key] = value.toString(); // Convert value to string if needed
  }
  // Validate the data
  const validation = postSchema.safeParse(body);

  // Handle validation errors
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // Get all non empty string image,name
  const images = formData
    .getAll('images')
    .filter((image: any) => image.name !== '');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const userLoggedInId = formData.get('userLoggedInId') as string;
  //
  // console.log(`images: ${images}`);
  // console.log(`title: ${title}`);
  // console.log(`content: ${content}`);
  // return Response.json({});

  try {
    // talk to db
    const newPost = await db.post.create({
      data: {
        title: title,
        content: content,
        postUserId: userLoggedInId,
      },
    });

    // Upload image(s) to Cloudinary
    const imageUploadPromises = [];

    for (const image of images) {
      //
      // const imageBuffer = await image.arrayBuffer();
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

      if (newPost) {
        const postId: number = newPost.id;
        const newPostImage: any = await db.postImages.create({
          data: {
            image_name: result.secure_url, // Assuming the field name is correct
            postImagesPostId: postId,
          },
        });
      }
      console.log(imageUploadPromises);
    }
    return NextResponse.json({}, { status: 201 });

    // return Response.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  } catch (err) {
    console.log(err);
  }
  //   return Response.json({});
}
