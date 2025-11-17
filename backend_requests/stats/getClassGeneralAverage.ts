import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

/**
 * Moyenne générale d'une classe
 */
export type ClassGeneralAverageResponse = {
	idClass: number;
	average: number;
};

/**
 * Récupère la moyenne générale d'une classe sur tous les examens (endpoint admin)
 * @param idClass - L'identifiant de la classe
 * @returns La moyenne générale de la classe avec son ID
 */
export const getClassGeneralAverage = async (idClass: number) => {
	return (await fetchApi(`/api/stats/classes/${idClass}/average`)) as
		| ApiError
		| SuccessResponse<ClassGeneralAverageResponse>;
};
