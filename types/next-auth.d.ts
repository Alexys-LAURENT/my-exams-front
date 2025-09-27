import 'next-auth';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/** The user's postal address. */
			name: string;
			email: string;
			image: string;
			accountType: string;
			idUser: string;
			apiToken: string;
			alias: string;
			language: string;
		};
	}
}
