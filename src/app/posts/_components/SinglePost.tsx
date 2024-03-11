import { Post } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import EditPost from './EditPost';
import DeletePost from './DeletePost';
import EditForm from './EditForm';

interface Props {
  post: any;
  userLoggedInId: string;
}

const SinglePost = ({ post, userLoggedInId }: Props) => {
  // console.log(`post.postUserId: ${post.postUserId}`);
  // console.log(`post.userLoggedInId: ${userLoggedInId}`);
  //
  // Testing
  const hasOwnedPost = post.postUserId === userLoggedInId;
  return (
    <tr
      key={post.id}
      className="text-center odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
    >
      <td className="px-6 py-3">
        <Link href={`../comment/list/${post.id}`}>{post.title}</Link>
      </td>{' '}
      <td className="px-6 py-3">{post.content}</td>{' '}
      <td className="px-6 py-3">
        {post?.postImages.map(
          (image: any) =>
            // Check if the image is not archived before rendering
            !image.isArchived && (
              <img
                key={image.id}
                src={image.image_name}
                alt=""
                style={{ width: '100px', height: '100px' }}
                className="rounded-t-xl"
              />
            )
        )}
      </td>
      <td className="px-6 py-3">
        {hasOwnedPost && (
          <>
            <EditPost postId={post.id} />
            <DeletePost postId={post.id} />
          </>
        )}
        {/* </Button> */}
      </td>
    </tr>
    //
  );
};

export default SinglePost;
