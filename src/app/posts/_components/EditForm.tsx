'use client';
import { Post } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useState } from 'react';
import { quotelessJson } from 'zod';

interface Props {
  userLoggedInId: string;
  // post: Post;
  post: any;
}

const EditForm = ({ userLoggedInId, post }: Props) => {
  //
  console.log(post);
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleImageChange = (e: any) => {
    const { files } = e.target;
    console.log(files);
  };

  const handleSubmit = async (e: any) => {
    //
    e.preventDefault();

    try {
      //
      const formData = new FormData(e.target);

      // const res = await fetch(`/api/testpost/${post.id}`, {
        const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (res.status) {
        // redirect to dashboard.
        router.push('/dashboard');
        router.refresh();
      }
      console.log(res);
      //
    } catch (err) {
      console.log(err);
    }
  };

  const archivingImage = async (postImageId: any) => {

  if (window.confirm('Are you sure you want to remove the selected image?')) {
    console.log(`postImageId: ${postImageId}`);
    try {
      // const res = await fetch(`/api/posts/archived/${postImageId}`, {
      //   method: 'PUT',
      // });
      const res = await fetch(`/api/posts/image/${postImageId}/archived`, {
        method: 'PUT',
      });
      console.log(res);
      if (res.status === 200) {
        router.refresh();
      }
      //
    } catch (err) {
      console.log(err);
    }
    }
  };

  // const cloudinaryUrl =
  //   'https://res.cloudinary.com/dvuaavhj0/image/upload/v1709863171/posts/glh39qlo6pkhblvtlp2r.png';

  // const getPublicIdFromUrl = (url: string) => {
  //   const regex = /\/posts\/([^./]+)\.\w{3,4}$/;
  //   const match = url.match(regex);
  //   return match ? match[1] : null;
  // };

  // const publicId = getPublicIdFromUrl(cloudinaryUrl);
  // console.log(`publicId: ${publicId}`);

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2 className="text-3xl text-center font-semibold mb-6">
          You're editing {post.title} Post
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            name="title"
            className="border rounded w-full py-2 px-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <textarea
            name="content"
            className="border rounded w-full py-2 px-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="images"
            className="block text-gray-700 font-bold mb-2"
          >
            Images (Select up to 4 images)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            className="border rounded w-full py-2 px-3"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            // required
          />
          {post?.postImages.length > 0 && (
            <>
              {post?.postImages.map(
                (image: any) =>
                  !image.isArchived && (
                    <React.Fragment key={image.id}>
                      {/* <span>{image.image_name} </span> */}
                      <span
                        key={image.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => archivingImage(image.id)}
                      >
                        (XX)
                        <img
                          src={image.image_name}
                          alt=""
                          style={{ width: '50px', height: '50px' }}
                          className="rounded-t-xl"
                        />
                      </span>
                    </React.Fragment>
                  )
              )}
            </>
          )}
        </div>
        <input type="hidden" name="userLoggedInId" value={userLoggedInId} />
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Edit Post
          </button>
        </div>
        {/*  */}
      </form>
    </div>
  );
};

export default EditForm;
