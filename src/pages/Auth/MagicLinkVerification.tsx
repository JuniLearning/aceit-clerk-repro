// @see https://clerk.com/docs/authentication/custom-flows/magic-links

import { MagicLinkErrorCode, isMagicLinkError, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

enum VERIFICATION_STATUS {
  'loading' = 'loading',
  'verified' = 'verified',
  'expired' = 'expired',
  'failed' = 'failed',
}

// Handle magic link verification results. This is the final step in the magic link flow.
export function MagicLinkVerification() {
  const { handleMagicLinkVerification } = useClerk();
  const [verificationStatus, setVerificationStatus] = useState(
    VERIFICATION_STATUS.loading,
  );

  useEffect(() => {
    async function verify() {
      try {
        await handleMagicLinkVerification({ redirectUrlComplete: '/' });

        // If we're not redirected at this point, it means
        // that the flow has completed on another device.
        setVerificationStatus(VERIFICATION_STATUS.verified);
      } catch (err) {
        const error = err as Error;
        // Verification has failed.
        if (isMagicLinkError(error) && error.code === MagicLinkErrorCode.Expired) {
          setVerificationStatus(VERIFICATION_STATUS.verified);
        } else {
          setVerificationStatus(VERIFICATION_STATUS.failed);
        }
      }
    }
    verify();
  }, []);

  // Note that in almost all cases, none of this content ever renders.
  // Keeping it here since it is useful for debugging auth flow edge cases.

  if (verificationStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (verificationStatus === 'failed') {
    return <div>Magic link verification failed</div>;
  }

  if (verificationStatus === 'expired') {
    return <div>Magic link expired</div>;
  }

  return <div>Successfully signed in. Return to the original tab to continue.</div>;
}
