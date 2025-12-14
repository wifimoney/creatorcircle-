import { PrivyClient } from '@privy-io/server-auth';
import { env } from '../env';
export const privyClient = new PrivyClient(env.PRIVY_APP_ID, env.PRIVY_APP_SECRET);
export async function verifyToken(token) {
    try {
        const claims = await privyClient.verifyAuthToken(token);
        // Fetch user to get wallet address
        let walletAddress;
        try {
            const user = await privyClient.getUser(claims.userId);
            const walletAccount = user.linkedAccounts?.find((account) => account.type === 'wallet');
            // Wallet accounts have walletClientType and address in different structures
            walletAddress = walletAccount?.address ||
                walletAccount?.walletClientType ?
                walletAccount.wallet?.address : undefined;
        }
        catch {
            // If getUser fails, walletAddress remains undefined
        }
        return {
            userId: claims.userId,
            walletAddress
        };
    }
    catch (error) {
        throw new Error('Invalid token');
    }
}
