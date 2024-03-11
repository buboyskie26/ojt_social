import React from 'react';
import PostForm from '../_components/PostForm';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import AddForm from '../_components/AddForm';
import TestFile from '../_components/TestFile';

const NewPostPage = async () => {
  const session = await getServerSession(options);
  const userLoggedInId = session!.user?.id;

  // console.log(userLoggedInId);

  return (
    <>
      {/* <PostForm userLoggedInId={userLoggedInId} /> */}
      <AddForm userLoggedInId={userLoggedInId || ''} />
      {/* <TestFile /> */}
    </>
  );
};

export default NewPostPage;
