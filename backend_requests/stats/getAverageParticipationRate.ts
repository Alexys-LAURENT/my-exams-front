import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

/**
 * Taux de participation d'un élève aux examens
 */
export type AverageParticipationRateResponse = {
	idUser: number;
	average_participation_rate: number;
};

/**
 * Récupère le taux de participation moyen des élèves aux examens d'un professeur pour une classe
 * @param idTeacher - L'identifiant du professeur
 * @param idClass - L'identifiant de la classe
 * @returns Un tableau avec le taux de participation de chaque élève
 */
export const getAverageParticipationRate = async (idTeacher: number, idClass: number) => {
	return (await fetchApi(`/api/stats/teachers/${idTeacher}/classes/${idClass}/average_participation_rate`)) as
		| ApiError
		| SuccessResponse<AverageParticipationRateResponse[]>;
};
