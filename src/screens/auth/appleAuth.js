import { appleAuth } from '@invertase/react-native-apple-authentication';

export const appleSignIn = async (cb) => {
    try {
        if (!appleAuth.isSupported) {
            cb({ message: 'Apple Sign-In is not supported on this device' }, false);
            return;
        }

        // FULL_NAME must be first — see official docs issue #293
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const { identityToken, nonce, email, fullName, user } = appleAuthRequestResponse;

        if (!identityToken) {
            cb({ message: 'Apple Sign-In failed - no identity token returned' }, false);
            return;
        }

        // getCredentialStateForUser only works on real device
        // If it throws, we still have identityToken so treat as success
        try {
            const credentialState = await appleAuth.getCredentialStateForUser(user);
            if (credentialState !== appleAuth.State.AUTHORIZED) {
                cb({ message: 'Apple credential state not authorized' }, false);
                return;
            }
        } catch (credentialError) {
            // On some devices/iOS versions this call fails but auth is still valid
            // identityToken presence is the real proof of auth
            console.warn('getCredentialStateForUser failed, proceeding anyway:', credentialError.message);
        }

        cb({ identityToken, nonce, email, fullName, user }, true);

    } catch (error) {
        // Log everything to help diagnose
        console.log('Apple Sign-In raw error:', JSON.stringify({
            code: error.code,
            message: error.message,
            domain: error.domain,
            nativeCode: error.nativeCode,
            userInfo: error.userInfo,
        }, null, 2));

        if (error.code === appleAuth.Error.CANCELED) {
            cb({ message: 'User cancelled Apple Sign-In' }, false);
        } else if (error.code === appleAuth.Error.FAILED) {
            cb({ message: 'Apple Sign-In failed' }, false);
        } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
            cb({ message: 'Invalid response from Apple' }, false);
        } else if (error.code === appleAuth.Error.NOT_HANDLED) {
            cb({ message: 'Apple Sign-In not handled' }, false);
        } else {
            // error.code 1000 = config issue (entitlements/provisioning/capability missing)
            cb({ message: `Apple Sign-In error (code: ${error.code})` }, false);
        }
    }
};

export const appleSignOut = async (cb) => {
    try {
        cb(true);
    } catch (error) {
        cb(false);
    }
};