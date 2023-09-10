import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNylas } from '@nylas/nylas-react';

interface NylasLoginProps {
  email: string;
  setEmail: (email: string) => void;
}

const NylasLogin: React.FC<NylasLoginProps> = ({ email, setEmail }) => {
  const nylas = useNylas();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginUser = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    sessionStorage.setItem('userEmail', email);

    nylas.authWithRedirect({
      emailAddress: email,
      successRedirectUrl: '', // Consider setting the redirect URL here
    });
  };

  return (
    <section className="login">
      <form onSubmit={loginUser}>
        <input
          required
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect email'}
        </button>
      </form>
    </section>
  );
};

export default NylasLogin;
