import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export default async function PostForm() {
  const { userId } = await auth();
  async function handleSubmit(formData) {
    'use server';
    const content = formData.get('content');

    db.query(`INSERT INTO posts (content, clerk_id) VALUES ($1, $2)`, [
      content,
      userId,
    ]);

    revalidatePath('/posts');
  }

  return (
    <form action={handleSubmit}>
      <textarea name="content" placeholder="Write your post here..."></textarea>
      <button>Submit</button>
    </form>
  );
}
