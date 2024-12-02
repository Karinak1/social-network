import PostForm from '@/components/postForm';
import UserForm from '@/components/userForm';
import { db } from '@/lib/db';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function PostsPage() {
  const { userId } = await auth();

  const responsePosts = await db.query(`
    SELECT
      posts.id,
      posts.content,
      users.username,
      users.id as user_id
    FROM posts
    JOIN users ON posts.clerk_id = users.clerk_id`);
  const posts = responsePosts.rows;

  const responseUser = await db.query(
    `SELECT * FROM users WHERE clerk_id = '${userId}'`
  );
  const numUsers = responseUser.rowCount;

  return (
    <div>
      <h2>Posts</h2>

      <SignedIn>{numUsers === 1 ? <PostForm /> : <UserForm />}</SignedIn>

      <SignedOut>
        <Link href="/sign-in">Please sign in to make a post</Link>
      </SignedOut>

      <p>Here we can show the posts if we get them from the db</p>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <h3>
              <Link href={`/user/${post.user_id}`}>{post.username}</Link> says
            </h3>
            <p>{post.content}</p>
          </div>
        );
      })}
    </div>
  );
}
