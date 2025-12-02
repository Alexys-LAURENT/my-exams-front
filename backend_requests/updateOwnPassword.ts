import { ApiError, SuccessMessageResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const updateOwnPassword = async (currentPassword: string, newPassword: string) => {
	return (await fetchApi(`/api/auth/update-password`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			currentPassword,
			newPassword,
		}),
	})) as ApiError | SuccessMessageResponse;
};
