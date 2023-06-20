import { FormEventHandler, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';

enum STATE {
  init = 'init' /** the user has not submitted the form */,
  authenticating = 'authenticating' /** the form was just submitted, loading... */,
  sent = 'sent' /** a magic link is in the user's inbox */,
}

export const SignUp = () => {
  const navigate = useNavigate();
  const { isLoaded, setSession, signUp } = useSignUp(); // @see https://clerk.com/docs/reference/clerk-react/usesignup
  const [firstName, setFirstName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [signUpState, setSignUpState] = useState(STATE.init);

  // this will never occur as long as <SignUp> is wrapped in a <ClerkLoaded>
  if (!isLoaded) {
    return null;
  }

  const { startMagicLinkFlow } = signUp.createMagicLinkFlow();

  const performSignUp: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setSignUpState(STATE.authenticating);

    // begin the signup flow within Clerk
    await signUp.create({ emailAddress, firstName, lastName: 'example' });

    // display ui telling the user to go check their email:
    setSignUpState(STATE.sent);

    // Clerk will just be long polling here until the user clicks the link.
    const signUpFlow = await startMagicLinkFlow({
      // this is the URL that users will navigate to when they click
      // the magic link from their email inbox.
      redirectUrl: import.meta.env.DEV
        ? 'http://localhost:5173/verification'
        : 'https://aceit.ai/verification',
    });

    if (signUpFlow.status === 'complete') {
      setSession(signUpFlow.createdSessionId, () => {
        navigate('/');
      });
    }
  };

  return (
    <div>
      <h1>Create an account</h1>
      <form onSubmit={performSignUp}>
        {signUpState === STATE.sent ? (
          <p>Check your inbox for a sign in link.</p>
        ) : (
          <>
            <input
              type="text"
              required
              placeholder="First name"
              autoComplete="given-name"
              value={firstName}
              onInput={e => setFirstName(e.currentTarget.value)}
              disabled={signUpState === STATE.authenticating}
            />
            <input
              type="email"
              required
              placeholder="Email"
              autoComplete="email"
              value={emailAddress}
              onInput={e => setEmailAddress(e.currentTarget.value)}
              disabled={signUpState === STATE.authenticating}
            />
            <button
              type="submit"
              className="btn-md"
              disabled={signUpState === STATE.authenticating}
            >
              Sign Up
            </button>
          </>
        )}
      </form>
      <p>
        Already have an account? <Link to={'/sign-in'}>Sign In</Link>
      </p>
    </div>
  );
};
