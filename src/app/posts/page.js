import { db } from '@/lib/db';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function PostPage() {
  const { userId } = await auth();
  const response = await db.query('SELECT * FROM posts');
  const posts = response.rows;
  async function handleSubmit(formData) {
    'use server';
    const content = formData.get('content');

    db.query(`INSERT INTO posts(content,clerk_id) VALUES($1,$2)`, [
      content,
      userId,
    ]);
  }
  return (
    <div>
      <h2>Posts</h2>
      <SignedIn>
        <form action={handleSubmit}>
          <textarea name="content" placeholder="write your post"></textarea>
          <button>submit</button>
        </form>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">please sign in</Link>
      </SignedOut>
      <p>here we can show post if we can get them from db</p>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <h3>the user says</h3>
            <p>{post.content}</p>
          </div>
        );
      })}
    </div>
  );
}
