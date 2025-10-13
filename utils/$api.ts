export const $api = (path: string) => {
	let apiPath = process.env.NEXT_PUBLIC_API_URL;

	if (!apiPath) {
		throw new Error('NEXT_PUBLIC_API_URL is not defined in the environment variables');
	}

	if (!apiPath?.endsWith('/') && !path.startsWith('/')) {
		apiPath += '/';
	}

	if (apiPath.endsWith('/') && path.startsWith('/')) {
		path = path.substring(1);
	}

	return `${apiPath}${path}`;
};
