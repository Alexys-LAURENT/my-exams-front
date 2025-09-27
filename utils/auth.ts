import { SESSION_COOKIE, SESSION_SECURE, SESSION_TIMEOUT } from '@/config/data/internalData';
import { $api } from '@/utils/$api';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const config = {
	// Make the cookie that NextAuth uses to store the session sameSite=strict
	cookies: {
		sessionToken: {
			name: SESSION_COOKIE,
			options: {
				httpOnly: true,
				sameSite: 'strict',
				path: '/',
				secure: SESSION_SECURE,
			},
		},
	},
	pages: {
		signIn: '/login',
		error: '/login',
	},
	session: {
		strategy: 'jwt',
		// WARNING : If You want to change the session duration, remember to change it in the backend too for the token expiration
		maxAge: SESSION_TIMEOUT,
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'email', type: 'text', placeholder: 'email@exemple.com' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value
				// that is false/null if the credentials are invalid.
				// e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
				// You can also use the `req` object to obtain additional parameters
				// (i.e., the request IP address)

				if (!credentials?.email || !credentials?.password) {
					throw new Error('Veuillez remplir tous les champs');
				}

				const response = await fetch($api('api/auth/login'), {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: credentials.email,
						password: credentials.password,
					}),
				});

				console.log('Login response', response.json);

				let res: {
					success?: boolean;
					error?: boolean;
					message?: string;
					data: {
						idUser: string;
						lastName: string;
						name: string;
						email: string;
						avatarPath: string;
						accountType: string;
						accessToken: { token: string; expiresAt: string };
					};
				};

				try {
					const json = await response.json();
					res = json;
				} catch {
					throw new Error(encodeURI('Nous rencontrons un problème technique, veuillez réessayer ultérieurement'));
				}

				if (res.error) {
					throw new Error(encodeURI(res.message || 'Une erreur est survenue'));
				}

				if (res.success && res.data.idUser && res.data.name && res.data.email && res.data.accountType) {
					return {
						id: res.data.idUser.toString(), // NextAuth requires an 'id' field
						idUser: parseInt(res.data.idUser),
						lastName: res.data.lastName,
						name: res.data.name,
						email: res.data.email,
						avatarPath: res.data.avatarPath,
						accountType: res.data.accountType as 'student' | 'teacher' | 'admin',
						accessToken: res.data.accessToken.token,
						accessTokenExpiresAt: res.data.accessToken.expiresAt,
					};
				}
				
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger }) {
			// First time login
			if (user) {
				return {
					...token,
					accountType: user.accountType,
					idUser: user.idUser,
					lastName: user.lastName,
					avatarPath: user.avatarPath,
					accessToken: user.accessToken,
					accessTokenExpiresAt: user.accessTokenExpiresAt,
				};
			}

			// Session update
			if (trigger === 'update') {
				console.log('JWT : UPDATE TRIGGERED');
				return token;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user = {
					...session.user,
					idUser: token.idUser,
					lastName: token.lastName,
					avatarPath: token.avatarPath,
					accountType: token.accountType,
					accessToken: token.accessToken,
				};
			}

			return session;
		},
	},
	events: {
		// Callback triggered when a user signs out
		signOut(message) {
			// Call the API to logout the user (API will invalidate the access token)
			const callApiToLogout = async () => {
				const res = await fetch($api('api/auth/logout'), {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${message.token.accessToken}`,
					},
				});
				if (!res.ok) {
					console.error('Error logging out', res);
					return;
				}
				const data = await res.json();
				if (data.error) {
					console.error('Error logging out', data.error);
					return;
				}
			};
			callApiToLogout();
		},
	},
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(...args: [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']] | [NextApiRequest, NextApiResponse] | []) {
	return getServerSession(...args, config);
}

declare module 'next-auth' {
	interface User {
		id: string;
		idUser: number;
		lastName: string;
		name: string;
		email: string;
		avatarPath: string;
		accountType: 'student' | 'teacher' | 'admin';
		accessToken: string;
		accessTokenExpiresAt: string;
	}
}

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			idUser: number;
			lastName: string;
			name: string;
			email: string;
			avatarPath: string;
			accountType: 'student' | 'teacher' | 'admin';
			accessToken: string;
		};
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken: string;
		accessTokenExpiresAt: string;
		idUser: number;
		accountType: 'student' | 'teacher' | 'admin';
		lastName: string;
		avatarPath: string;
	}
}
