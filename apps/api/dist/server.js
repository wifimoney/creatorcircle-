import { Hono } from 'hono';
import { verifyToken } from './lib/privy';
export const app = new Hono();
// Auth middleware
const authMiddleware = async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: 'Missing or invalid Authorization header' }, 401);
    }
    const token = authHeader.substring(7);
    try {
        const user = await verifyToken(token);
        c.set('user', user);
        await next();
    }
    catch (error) {
        return c.json({ error: 'Invalid token' }, 401);
    }
};
app.get('/health', c => {
    return c.json({ status: 'ok' });
});
app.get('/me', authMiddleware, c => {
    const user = c.get('user');
    return c.json(user);
});
