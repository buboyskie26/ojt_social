import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import SinglePost from '../posts/_components/SinglePost';
import { db } from '@/lib/db';
import SearchPostFilter from '../posts/_components/SearchPostFilter';

interface Props {
  searchParams: { page: string };
}
const DashboardPage = async ({ searchParams }: Props) => {
  //
  const session = await getServerSession(options);
  const userLoggedInId = session!.user?.id;

  // const userLoggedInId = 'Hey';

  // console.log(session?.user);
  // console.log(userLoggedInId);
  // console.log(session?.user?.email);
  // console.log(session?.user?.firstName);

  // const posts = await db.post.findMany({
  //   orderBy: { createdAt: 'desc' },
  // });

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 3;
  //
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'asc' },
    where: { isArchived: false },
    include: {
      postImages: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const postsCount = await db.post.count();

  return (
    <div>
      Welcome to your dashboard {session?.user?.email} <br />{' '}
      {session?.user?.firstName} <br />
      <SearchPostFilter
        page={page}
        pageSize={pageSize}
        postsCount={postsCount}
        //
        posts={posts}
        userLoggedInId={userLoggedInId || ''}
      />
    </div>
  );
};
export default DashboardPage;
