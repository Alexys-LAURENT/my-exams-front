import { Evaluation } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const createEvaluation = async (data: { idUserResponse: number; note: number; commentary?: string | null }) => {
	return (await fetchApi(`/api/evaluations/`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	})) as ApiError | SuccessResponse<Evaluation>;
};
