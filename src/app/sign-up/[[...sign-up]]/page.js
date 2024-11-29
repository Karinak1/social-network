import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div>
      <p>Welcome to the sign up page</p>
      <div>
        <SignUp />
      </div>
    </div>
  );
}
