import { getToken, JWT } from 'next-auth/jwt';
import { NextMiddleware, NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_SECURE, SESSION_TIMEOUT } from './config/data/internalData';
import { $api } from './utils/$api';


export async function refreshAccessToken(token: JWT): Promise<JWT> {
	try {
		const response = await fetch($api('api/auth/refresh'), {
			method: 'POST',
			body: JSON.stringify({
				refresh_token: token.refreshToken,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const tokensOrError = await response.json();

		const newTokens = tokensOrError as {
			success: 'true';
			data: {
				accessToken: {
					type: 'Bearer';
					token: string;
					expiresAt: string;
				};
				refreshToken: {
					token: string;
					expiresAt: string;
				};
			};
		};

		return {
			...token,
			error: undefined,
			accessToken: newTokens.data.accessToken.token,
			accessTokenExpiresAt: newTokens.data.accessToken.expiresAt,
			refreshToken: newTokens.data.refreshToken.token,
			refreshTokenExpiresAt: newTokens.data.refreshToken.expiresAt,
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export function updateCookie(sessionToken: string | null, request: NextRequest, response: NextResponse, currentPath: string): NextResponse<unknown> {
	/*
	 * BASIC IDEA:
	 *
	 * 1. Set request cookies for the incoming getServerSession to read new session
	 * 2. Updated request cookie can only be passed to server if it's passed down here after setting its updates
	 * 3. Set response cookies to send back to browser
	 */

	if (sessionToken) {
		// Set the session token in the request and response cookies for a valid session
		request.cookies.set(SESSION_COOKIE, sessionToken);
		response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
		response.cookies.set(SESSION_COOKIE, sessionToken, {
			httpOnly: true,
			maxAge: SESSION_TIMEOUT,
			secure: SESSION_SECURE,
			sameSite: 'lax',
		});
	} else {
		// Clear the session token in both request and response cookies
		request.cookies.delete(SESSION_COOKIE);
		response.cookies.delete(SESSION_COOKIE);
		if (currentPath !== '/login') {
			const newResponse = NextResponse.redirect(new URL('/login', request.url));
			newResponse.cookies.delete(SESSION_COOKIE);
			return newResponse;
		}
	}

	return response;
}

export const middleware: NextMiddleware = async (request: NextRequest) => {
	const regexUnprotectedRoutes = /^\/(?:login|register(?:\/.*)??)$/;
	const loggedUser = await getToken({ req: request });
	const currentPath = request.nextUrl.pathname;

	let response = NextResponse.next();

	// Protect all routes except unprotected ones
	if (!loggedUser && !regexUnprotectedRoutes.test(currentPath)) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// Redirect logged in users from login/register pages (but allow root)
	if (loggedUser && /^\/(?:login|register)(?:\/.*)?$/.test(currentPath)) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return response;
};

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|terms).*)'],
};
