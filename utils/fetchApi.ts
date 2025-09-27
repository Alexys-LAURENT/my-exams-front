'use server';
import { $api } from '@/utils/$api';
import { auth } from '@/utils/auth';

export const fetchApi = async (url: string, options?: RequestInit, allowEmptyToken = false) => {
	try {
		const session = await auth();

		if (session === null && !allowEmptyToken) {
			throw new Error('Utilisateur non connecté');
		}

		const token = session?.user.accessToken;

		// console.log(`fetchApi::token : ${token}`);

		if (!token && !allowEmptyToken) {
			console.error(`Token not found : ${url}`);
		}

		const response = await fetch($api(url), {
			...options,
			credentials: 'include',
			headers: {
				...options?.headers,
				Authorization: 'Bearer ' + token,
			},
		});

		const contentType = response.headers.get('content-type');
		let data;
		if (contentType && contentType.includes('application/json')) {
			data = await response.json();
		} else {
			data = await response.text();
		}

		if (data) {
			return data;
		}
		throw new Error(data.message);
	} catch (error: any) {
		console.error(`fetchApi::error : ${url}`);
		console.error(error.message ? error.message : error);
		throw new Error('Une erreur est survenue');
	}
};
