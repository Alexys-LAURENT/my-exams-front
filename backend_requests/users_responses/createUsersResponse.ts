import { UserResponse, UserResponseAnswer } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

type CreateUsersResponseData = {
	userResponse: UserResponse;
	userResponseAnswers: UserResponseAnswer[];
};

export const createUsersResponse = async (body: { idExam: number; idQuestion: number; custom?: string; idClass: number; answers?: number[] }) => {
	return (await fetchApi('/api/users_responses', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<CreateUsersResponseData>;
};
