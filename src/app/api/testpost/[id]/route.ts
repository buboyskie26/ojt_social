import { postSchema } from '@/app/validationSchemas';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import cloudinary from '@/config/cloudinary';
import crypto from 'crypto';
import axios from 'axios';

interface Props {
  params: { id: string };
}
export async function DELETE(request: NextRequest, { params }: Props) {
  //
  const postImageId = parseInt(params.id as string); // Assuming you're using Next.js routing with parameters

  if (!isNaN(postImageId)) {
    //
    //
    // This is for removal.
    //
    // Under posts folder.

    const getPostImage = await db.postImages.findUnique({
      where: { id: postImageId }, // Corrected to use the id field
    });
    const imageName = getPostImage?.image_name || '';

    const regex = /\/posts\/([^./]+)\.\w{3,4}$/;

    const getPublicIdFromUrl = (url: any) => {
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const publicId = getPublicIdFromUrl(imageName);
    console.log(`public id: ${publicId}`);

    const res = await deleteimage(publicId);
    if (res.result == 'ok') {
      console.log(res);
      const removeSingleImage = await db.postImages.delete({
        where: { id: getPostImage?.id },
      });
    }
    return NextResponse.json({});
  }
}
const deleteimage = async (publicId: any) => {
  // Post images are under in the posts folder in our cloudinary
  return await cloudinary.uploader.destroy(
    `posts/${publicId}`,
    { invalidate: true, resource_type: 'image' },
    function (err, res) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          ok: false,
          menssage: 'Error deleting file',
          errors: err,
        });
      }

      return res;
      // console.log(res);
    }
  );
};
// async function deleteImageByUrl(secureUrl: string) {
//   // Extract public_id from the secure_url
//   const publicId = secureUrl.split('/').pop()?.split('.')[0];

//   console.log(publicId);
//   if (!publicId) {
//     throw new Error('Invalid secure_url');
//   }
//   try {
//     // Make request to delete image from Cloudinary
//     const result = await cloudinary.uploader.destroy(publicId);
//     if (result) {
//       console.log('Image deleted successfully:', result);
//       return result;
//     }
//   } catch (error) {
//     console.error('Error deleting image:', error);
//     throw error;
//   }
// }

async function deleteImageByUrl(cloudinaryUrl: string) {
  //

  // const cloudinaryUrl =
  //   'https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/public_id.jpg';

  // Under posts folder.
  const regex = /\/posts\/([^./]+)\.\w{3,4}$/;

  const getPublicIdFromUrl = (url: any) => {
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const publicId = getPublicIdFromUrl(cloudinaryUrl);

  // console.log(`backend publicId: ${publicId}`);
  // console.log(`generateSignature: ${generateSignature}`);

  await handleDeleteImage(publicId);
  //
}

const handleDeleteImage = async (publicId: any) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const timestamp = new Date().getTime();
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!;
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
  const signature = generateSHA1(generateSignature(publicId, apiSecret));
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/posts/image/destroy`;

  console.log(`cloudName: ${cloudName}`);
  console.log(`apiKey: ${apiKey}`);
  console.log(`apiSecret: ${apiSecret}`);
  console.log(`url: ${url}`);

  try {
    //
    const response = await axios.post(url, {
      public_id: publicId,
      signature: signature,
      api_key: apiKey,
      timestamp: timestamp,
    });
    console.error(response);
  } catch (error) {
    console.error(error);
  }
};

const generateSHA1 = (data: any) => {
  const hash = crypto.createHash('sha1');
  hash.update(data);
  return hash.digest('hex');
};

const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime();
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};

//
//
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

      console.log(result);

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
