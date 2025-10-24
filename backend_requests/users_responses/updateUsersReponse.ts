import { UserResponse, UserResponseAnswer } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

type UpdateUsersResponseData = {
	userResponse: UserResponse;
	userResponseAnswers: UserResponseAnswer[];
};

export const updateUsersResponse = async (idUserResponse: number, body: { custom?: string; answers?: number[] }) => {
	return (await fetchApi(`/api/users_responses/${idUserResponse}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<UpdateUsersResponseData>;
};
