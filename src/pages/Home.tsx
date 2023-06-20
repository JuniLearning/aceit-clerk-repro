import { FC } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';

export const Home: FC = () => {
  const { user } = useUser();
  console.log(user);
  return (
    <div>
      <h1>Logged in!</h1>
      <UserButton />
    </div>
  );
};
