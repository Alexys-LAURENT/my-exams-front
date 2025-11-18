import { Class } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

/**
 * Met à jour une classe existante
 * @param idClass - L'identifiant de la classe
 * @param body - Les données de la classe à mettre à jour
 * @returns La classe mise à jour
 */
export const updateClass = async (idClass: number, body: { name: string; startDate: string; endDate: string; idDegree: number }) => {
	return (await fetchApi(`/api/classes/${idClass}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})) as ApiError | SuccessResponse<Class>;
};
