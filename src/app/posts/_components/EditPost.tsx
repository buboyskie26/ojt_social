import { Pencil2Icon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import Link from 'next/link';
import React from 'react';

const EditPost = ({ postId }: { postId: number }) => {
  //
  //
  return (
    <>
      <Button className="mr-3">
        <Pencil2Icon />
        <Link href={`/posts/edit/${postId}`}>Edit</Link>
      </Button>
    </>
  );
};

export default EditPost;
