import { NextRequest, NextResponse } from 'next/server';
import { postSchema } from '@/app/validationSchemas';
import { db } from '@/lib/db';
import cloudinary from '@/config/cloudinary';

// export async function POST(request: NextRequest) {
//   //
//   //
//   const formData = await request.formData();

//   const images = formData
//     .getAll('images')
//     .filter((image: any) => image.name !== '');

//   const title = formData.get('title');
//   const content = formData.get('content');
//   const userLoggedInId = formData.get('userLoggedInId');

//   console.log(`images: ${images}`);
//   console.log(`title: ${title}`);
//   console.log(`content: ${content}`);

//   const newPost = await db.post.create({
//     data: {
//       title: title,
//       content: content,
//       postUserId: userLoggedInId,
//     },
//   });
//   //
//   //
//   console.log(formData);

//   // Upload image(s) to Cloudinary
//   const imageUploadPromises = [];

//   for (const image of images) {
//     // const imageBuffer = await image.arrayBuffer();
//     const imageBuffer = await image.arrayBuffer();
//     const imageArray = Array.from(new Uint8Array(imageBuffer));
//     const imageData = Buffer.from(imageArray);

//     // Convert the image data to base64
//     const imageBase64 = imageData.toString('base64');

//     // Make request to upload to Cloudinary
//     const result: any = await cloudinary.uploader.upload(
//       `data:image/png;base64,${imageBase64}`,
//       {
//         folder: 'posts',
//       }
//     );

//     console.log(result);

//     imageUploadPromises.push(result.secure_url);

//     if (newPost) {
//       const postId: number = newPost.id;
//       const newPostImage: any = await db.postImages.create({
//         data: {
//           image_name: result.secure_url, // Assuming the field name is correct
//           postImagesPostId: postId,
//         },
//       });
//     }
//     console.log(imageUploadPromises);
//   }
//     return Response.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
// //   return Response.json({});
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
