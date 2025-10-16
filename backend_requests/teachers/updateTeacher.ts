import { User } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const updateTeacher = async (
	idTeacher: number,
	body: {
		lastName?: string;
		name?: string;
		email?: string;
		avatarPath?: string;
	}
) => {
	return (await fetchApi(`/api/teachers/${idTeacher}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<User>;
};
