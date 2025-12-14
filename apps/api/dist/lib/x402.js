// Stub payment configuration
const PAYMENT_AMOUNT = '0.001'; // 0.001 USDC or native token
const PAYMENT_TOKEN = '0x0000000000000000000000000000000000000000'; // Native token address (stub)
const RECIPIENT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Stub recipient
export function createTipPaymentRequest() {
    // Return x402 payment metadata following the protocol
    return {
        scheme: 'exact',
        amount: PAYMENT_AMOUNT,
        token: PAYMENT_TOKEN,
        recipient: RECIPIENT_ADDRESS,
        network: 'movement', // Stub network
    };
}
export async function verifyTipPayment(paymentProof) {
    // Stub verification - in production, verify against facilitator or on-chain
    // For now, accept any non-empty payment proof as valid
    if (!paymentProof || paymentProof.trim().length === 0) {
        return {
            valid: false,
            error: 'Empty payment proof',
        };
    }
    // Extract tx hash from payment proof (stub - assumes format like "tx:0x...")
    const txHashMatch = paymentProof.match(/0x[a-fA-F0-9]{64}/);
    const txHash = txHashMatch ? txHashMatch[0] : paymentProof;
    return {
        valid: true,
        txHash,
    };
}
