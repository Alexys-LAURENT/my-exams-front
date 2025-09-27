export const SESSION_TIMEOUT = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
export const SESSION_SECURE = process.env.NEXTAUTH_URL?.startsWith('https://');
export const SESSION_COOKIE = SESSION_SECURE ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
