import { User } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const updateStudent = async (
	idStudent: number,
	body: {
		lastName?: string;
		name?: string;
		email?: string;
		avatarPath?: string;
	}
) => {
	return (await fetchApi(`/api/students/${idStudent}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<User>;
};
