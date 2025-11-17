import { Class } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

/**
 * Crée une nouvelle classe
 * @param body - Les données de la classe à créer
 * @returns La classe créée
 */
export const createClass = async (body: { name: string; startDate: string; endDate: string; idDegree: number }) => {
	return (await fetchApi('/api/classes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<Class>;
};
