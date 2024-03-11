export { default } from 'next-auth/middleware';

export const config = { matcher: ['/dashboard/:path*', '/posts/list', '/posts/new', '/profile']  };