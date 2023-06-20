import { FormEventHandler, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';

enum STATE {
  init = 'init' /** the user has not submitted the form */,
  authenticating = 'authenticating' /** the form was just submitted, loading... */,
  sent = 'sent' /** a magic link is in the user's inbox */,
}

export const SignIn = () => {
  const navigate = useNavigate();
  const { isLoaded, setSession, signIn } = useSignIn(); // @see https://clerk.com/docs/reference/clerk-react/usesignin
  const [emailAddress, setEmailAddress] = useState('');
  const [signInState, setSignInState] = useState(STATE.init);
  const [error, setError] = useState('');

  // this will never occur as long as <SignIn> is wrapped in a <ClerkLoaded>
  if (!isLoaded) {
    return null;
  }

  // @see https://clerk.com/docs/authentication/custom-flows/magic-links
  const { startMagicLinkFlow } = signIn.createMagicLinkFlow();

  const performSignIn: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    setError('');
    setSignInState(STATE.authenticating);

    // start the sign in flow, by collecting the user's email address:
    const { supportedFirstFactors } = await signIn.create({
      identifier: emailAddress,
    });
    const factor = supportedFirstFactors.find(
      factor =>
        factor.strategy === 'email_link' && factor.safeIdentifier === emailAddress,
    );
    if (!factor || factor.strategy !== 'email_link') {
      setError('Unable to sign in.');
      setSignInState(STATE.init);
      return;
    }

    // although *technically* we haven't sent the email until the next line,
    // that `await` doesn't complete until the link is also clicked. so this
    // is close enough, allowing us to render some ui telling the user to go
    // check their email:
    setSignInState(STATE.sent);

    // Clerk will just be long polling here until the user clicks the link.
    const signInFlow = await startMagicLinkFlow({
      emailAddressId: factor.emailAddressId,
      // this is the URL that users will navigate to when they click the
      // magic link from their email inbox:
      redirectUrl: import.meta.env.DEV
        ? 'http://localhost:5173/verification'
        : 'https://aceit.ai/verification',
    });

    if (signInFlow.status === 'complete') {
      setSession(signInFlow.createdSessionId, () => {
        navigate('/');
      });
    }
  };

  return (
    <div>
      <h1>Sign in</h1>
      <form onSubmit={performSignIn}>
        {error && <p>{error}</p>}
        {signInState === STATE.sent ? (
          <p>Check your inbox for a sign in link.</p>
        ) : (
          <>
            <input
              type="email"
              required
              placeholder="Email"
              autoComplete="email"
              value={emailAddress}
              onInput={e => setEmailAddress(e.currentTarget.value)}
              disabled={signInState === STATE.authenticating}
            />
            <button type="submit" disabled={signInState === STATE.authenticating}>
              Continue
            </button>
          </>
        )}
      </form>
      <p>
        Don't have an account? <Link to={'/sign-up'}>Sign Up</Link>
      </p>
    </div>
  );
};
