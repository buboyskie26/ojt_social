import React from 'react';
import SinglePost from './SinglePost';
import Pagination from '@/app/components/Pagination';

interface Props {
  filteredPosts: any[];
  userLoggedInId: string;
  page: number;
  pageSize: number;
  postsCount: number;
}
const PostTable = ({
  filteredPosts,
  userLoggedInId,
  page,
  pageSize,
  postsCount,
}: Props) => {
  //
  //

  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="text-center">
            <th scope="col" className="px-6 py-3">
              Post
            </th>
            <th scope="col" className="px-6 py-3">
              Content
            </th>
            <th scope="col" className="px-6 py-3">
              Image
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredPosts &&
            filteredPosts.map((post, index) => (
              <SinglePost
                userLoggedInId={userLoggedInId || ''}
                key={post.id}
                post={post}
              />
            ))}
          {/*  */}
        </tbody>
      </table>
      <Pagination
        currentPage={page}
        pageSize={pageSize}
        itemCount={postsCount}
      />
    </>
  );
};

export default PostTable;
