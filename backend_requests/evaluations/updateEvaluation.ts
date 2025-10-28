import { Evaluation } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const updateEvaluation = async (
	idEvaluation: number,
	data: {
		note: number;
		commentary?: string | null;
	}
) => {
	return (await fetchApi(`/api/evaluations/${idEvaluation}`, {
		method: 'PUT',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	})) as ApiError | SuccessResponse<Evaluation>;
};
