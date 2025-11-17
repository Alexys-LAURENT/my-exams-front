import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

/**
 * Moyenne générale d'un élève dans une classe
 */
export type UserAverageInClassResponse = {
	average: number;
};

/**
 * Récupère la moyenne générale d'un élève dans une classe spécifique
 * @param idClass - L'identifiant de la classe
 * @param idUser - L'identifiant de l'élève
 * @returns La moyenne de l'élève dans cette classe
 */
export const getUserAverageInClass = async (idClass: number, idUser: number) => {
	return (await fetchApi(`/api/stats/classes/${idClass}/users/${idUser}/average`)) as
		| ApiError
		| SuccessResponse<UserAverageInClassResponse>;
};
