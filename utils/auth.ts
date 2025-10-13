
import NextAuth, { DefaultSession } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { $api } from "./$api";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's ID */
			id: string;
			idUser: number;
			lastName: string;
			name: string;
			email: string;
			avatarPath: string;
			accountType: "student" | "teacher" | "admin";
			accessToken: string;
			accessTokenExpiresAt: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }

	interface User {
		id: string;
		idUser: number;
		lastName: string;
		name: string;
		email: string;
		avatarPath: string;
		accountType: "student" | "teacher" | "admin";
		accessToken: string;
		accessTokenExpiresAt: string;
	}
	
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken: string;
		accessTokenExpiresAt: string;
		idUser: number;
		accountType: "student" | "teacher" | "admin";
		lastName: string;
		avatarPath: string;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
		Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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

				console.log('Login response', response!.json);

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
					const json = await response!.json();
					console.log('Login response JSON', json);
					
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
				console.log('JWT : FIRST TIME LOGIN', { user, token });
				
				token = {
					...token,
					accountType: user.accountType,
					idUser: user.idUser,
					lastName: user.lastName,
					avatarPath: user.avatarPath,
					accessToken: user.accessToken,
					accessTokenExpiresAt: user.accessTokenExpiresAt,
				};
				return token;
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
				console.log('SESSION CALLBACK', { session, token });
				
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
})

