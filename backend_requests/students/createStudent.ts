import { User } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const createStudent = async (body: { lastName: string; name: string; email: string; password: string; avatarPath?: string }) => {
	return (await fetchApi('/api/students', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<User>;
};
