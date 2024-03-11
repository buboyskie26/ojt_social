'use client';

import { Post } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SinglePost from './SinglePost';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import Spinner from '@/app/components/Spinner';
import { db } from '@/lib/db';
import Pagination from '@/app/components/Pagination';
import PostTable from './Table';

interface Props {
  userLoggedInId: string;
  posts?: any[];
  page: number;
  pageSize: number;
  postsCount: number;
}

const SearchPostFilter = ({
  userLoggedInId,
  posts,
  page,
  pageSize,
  postsCount,
}: Props) => {
  //
  // console.log(`userLoggedInId: ${userLoggedInId}`);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  // State variable to store filtered posts
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to handle input change
  const handleInputChange = (event: any) => {
    setSearchInput(event.target.value);
    // console.log(searchInput);
  };
  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    if (searchInput !== '') {
      router.push(`/dashboard?searchInput=${searchInput}`);
    } else {
      router.push(`/dashboard`);
    }
  };

  const search = useSearchParams();
  let searchQuery = search ? search.get('searchInput') : '';
  searchQuery = searchQuery === null ? '' : searchQuery;
  // console.log(searchQuery);

  useEffect(() => {
    //
    const fetchPosts = async () => {
      try {
        // Alternative Way
        // const res = await fetch(
        //   `http://localhost:3000/api/posts/${searchQuery}`,
        //   {
        //     cache: 'no-store',
        //   }
        // );

        // if (res.ok) {
        //   const data: any[] = await res.json();
        //   console.log(data);
        //   setFilteredPosts(data);
        // }

        posts = posts?.filter((post) => {
          return post.title.toLowerCase().includes(searchQuery.toLowerCase());
        });

        if (posts) {
          setFilteredPosts(posts);
        }
        //
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    inputRef.current?.focus();
    fetchPosts();
  }, [searchQuery, setFilteredPosts, page]);

  // console.log(filteredPosts);

  return (
    <div>
      <div>
        <form onSubmit={handleFormSubmit}>
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search post..."
              value={searchInput}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      {/*  */}
      <button
        type="button"
        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        <Link href={'/posts/new'}>New Post</Link>
      </button>
      {loading ? (
        <Spinner />
      ) : (
        <PostTable
          filteredPosts={filteredPosts}
          userLoggedInId={userLoggedInId}
          page={page}
          pageSize={pageSize}
          postsCount={postsCount}
        />
      )}
    </div>
  );
};

export default SearchPostFilter;
