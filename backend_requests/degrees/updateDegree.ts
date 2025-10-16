import { Degree } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const updateDegree = async (idDegree: number, body: { name: string }) => {
	return (await fetchApi(`/api/degrees/${idDegree}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<Degree>;
};
