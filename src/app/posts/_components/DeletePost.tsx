'use client';
import { useRouter } from 'next/navigation';
import React, { FormEventHandler, useState } from 'react';
import Spinner from '@/app/components/Spinner';
import { AlertDialog, Button, Flex } from '@radix-ui/themes';

const DeletePost = ({ postId }: { postId: number }) => {
  //
  const router = useRouter();
  //
  const [isDeleting, setDeleting] = useState(false);
  //
  const deletePost = async () => {

    if (window.confirm('Are you sure you want to remove the selected post?')) {
    try {
        // const res = await axios.delete('/api/posts/' + postId);
        const res = await fetch('/api/posts/unarchived/' + postId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        //
        if (res.status) {
          console.log(`res: `);
          console.log(res);
          // redirect to dashboard.
          router.push('/dashboard');
          router.refresh();
        }
      } catch (error) {
        console.log(error);
      }}
    };
  //
  return (
    <>
      {/* <h3>test</h3> */}
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button disabled={isDeleting} color="red">
            {isDeleting && <Spinner />} Delete
          </Button>
        </AlertDialog.Trigger>
        {/*  */}
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </AlertDialog.Description>
          <Flex mt="4" gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={deletePost} color="red">
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeletePost;
