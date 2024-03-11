'use client';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postSchema } from '@/app/validationSchemas';
import ErrorMessage from '@/app/components/ErrorMessage';
import { Callout } from '@radix-ui/themes';

interface Props {
  userLoggedInId: string;
}

type PostFormData = z.infer<typeof postSchema>;

const AddForm = ({ userLoggedInId }: Props) => {
  //
  // const [formState, action] = useFormState(yourAction, { message: '' });
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean | undefined>(false); // State to track form submission
  const [error, setError] = useState('');

  const handleImageChange = (e: any) => {
    const { files } = e.target;
    console.log(files);
  };

  // const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
  // const handleSubmit = async (e: any) => {
  //   // Your form submission logic here
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData(e.target);

  //     const res = await fetch(`/api/testpost`, {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     //
  //     // console.log(res);
  //     if (res.status) {
  //       router.push('/dashboard');
  //       router.refresh();
  //     }
  //     //
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });
  // Test next with zod validation with image validation
  // Test with react-hook-form edit with images,

  const onSubmit = handleSubmit(async (data, e: any) => {
    // console.log(data);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('userLoggedInId', userLoggedInId);
    //
    // Append each selected image to the FormData object
    const { files } = e.target.images;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    }

    try {
      setIsSubmitting(true);
      // Perform your API request with formData
      const response = await fetch(`/api/testpost`, {
        method: 'POST',
        body: formData,
      });

      // Handle response accordingly
      console.log('Response:', response);

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error:', error);
      setError('Unexpected error: ' + error);
    }
    console.log(formData);
  });
  //
  //
  return (
    <div>
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form onSubmit={(e) => onSubmit(e)} encType="multipart/form-data">
        <h2 className="text-3xl text-center font-semibold mb-6">Add Post</h2>
        {errors.title && <ErrorMessage>{errors.title?.message}</ErrorMessage>}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            className="border rounded w-full py-2 px-3"
            defaultValue={''}
            {...register('title')}
            // required
          />
        </div>

        {errors.content && (
          <ErrorMessage>{errors.content?.message}</ErrorMessage>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <textarea
            className="border rounded w-full py-2 px-3"
            defaultValue={''}
            {...register('content')}
            // required
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
            // name="images"
            className="border rounded w-full py-2 px-3"
            accept="image/*"
            multiple
            {...register('images')}
            onChange={handleImageChange}
            // required
          />
        </div>
        <input type="hidden" name="userLoggedInId" value={userLoggedInId} />
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;

// AddForm Working

// return (
//   <div>
//     {/* <form action="/api/testpost" method="POST" encType="multipart/form-data"> */}
//     {/* <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data"> */}
//     <form onSubmit={onSubmit} encType="multipart/form-data">
//       <h2 className="text-3xl text-center font-semibold mb-6">Add Post</h2>
//       <div className="mb-4">
//         <label className="block text-gray-700 font-bold mb-2">Title</label>
//         <input
//           type="text"
//           // name="title"
//           className="border rounded w-full py-2 px-3"
//           // value={title}
//           // onChange={(e) => setTitle(e.target.value)}
//           defaultValue={''}
//           {...register('title')}
//           required
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-gray-700 font-bold mb-2">Content</label>
//         <textarea
//           className="border rounded w-full py-2 px-3"
//           // name="content"
//           // value={content}
//           // onChange={(e) => setContent(e.target.value)}
//           defaultValue={''}
//           {...register('content')}
//           required
//         ></textarea>
//       </div>

//       <div className="mb-4">
//         <label htmlFor="images" className="block text-gray-700 font-bold mb-2">
//           Images (Select up to 4 images)
//         </label>
//         <input
//           type="file"
//           id="images"
//           name="images"
//           className="border rounded w-full py-2 px-3"
//           accept="image/*"
//           multiple
//           onChange={handleImageChange}
//           // required
//         />
//       </div>

//       <input type="hidden" name="userLoggedInId" value={userLoggedInId} />
//       <div>
//         <button
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
//           type="submit"
//         >
//           Add Property
//         </button>
//       </div>
//     </form>
//   </div>
// );
