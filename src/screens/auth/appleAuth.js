import { appleAuth } from '@invertase/react-native-apple-authentication';

export const appleSignIn = async (cb) => {
    console.log("hello")
    try {

        if (!appleAuth.isSupported) {
            cb({ message: 'Apple Sign-In is not supported on this device' }, false);
            return;
        }

       
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const { identityToken, nonce, email, fullName, user } = appleAuthRequestResponse;

        if (!identityToken) {
            cb({ message: 'Apple Sign-In failed - no identity token returned' }, false);
            return;
        }

        const credentialState = await appleAuth.getCredentialStateForUser(user);

        if (credentialState === appleAuth.State.AUTHORIZED) {
            cb({
                identityToken,
                nonce,
                email,     
                fullName,        
                user,    
            }, true);
        } else {
            cb({ message: 'Apple credential state not authorized' }, false);
        }

    } catch (error) {
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);

        if (error.code === appleAuth.Error.CANCELED) {
            cb({ message: 'User cancelled Apple Sign-In' }, false);
        } else if (error.code === appleAuth.Error.FAILED) {
            cb({ message: 'Apple Sign-In failed' }, false);
        } else if (error.code === appleAuth.Error.INVALID_RESPONSE) {
            cb({ message: 'Invalid response from Apple' }, false);
        } else if (error.code === appleAuth.Error.NOT_HANDLED) {
            cb({ message: 'Apple Sign-In not handled' }, false);
        } else if (error.code === appleAuth.Error.UNKNOWN) {
            cb({ message: 'Unknown Apple Sign-In error' }, false);
        } else {
            console.log('APPLE_SIGN_IN_ERROR', error);
            cb(error, false);
        }
    }
};

export const appleSignOut = async (cb) => {
    try {
        // Apple doesn't have a true sign-out SDK method
        // Just clear your local session/token
        cb(true);
    } catch (error) {
        cb(false);
    }
};