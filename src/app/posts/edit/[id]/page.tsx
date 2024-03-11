import React from 'react';
import PostForm from '../../_components/PostForm';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import EditForm from '../../_components/EditForm';

// import prisma from '@/prisma/client';

interface Props {
  params: { id: string };
}
const EditPostFunction = async ({ params }: Props) => {
  //
  // console.log(params.id);

  const session = await getServerSession(options);
  const userLoggedInId = session!.user?.id;

  const post = await db.post.findUnique({
    where: { id: parseInt(params.id) },
    include: { postImages: true },
  });

  if (!post) return notFound();

  return (
    <>
      {/* <PostForm post={post} userLoggedInId={userLoggedInId || ''} /> */}
      <EditForm post={post} userLoggedInId={userLoggedInId || ''} />
      {/* <PostForm post={post} userLoggedInId={userLoggedInId || ''} /> */}
    </>
  );
};

export default EditPostFunction;
