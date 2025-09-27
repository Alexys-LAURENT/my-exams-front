export const $api = (path: string) => {
	return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};
