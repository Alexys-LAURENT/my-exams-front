import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

/**
 * Moyenne d'une classe pour un examen
 */
export type ClassAverageForExamResponse = {
	average: number;
};

/**
 * Récupère la moyenne générale d'une classe pour un examen spécifique
 * @param idExam - L'identifiant de l'examen
 * @param idClass - L'identifiant de la classe
 * @returns La moyenne de la classe pour cet examen
 */
export const getClassAverageForExam = async (idExam: number, idClass: number) => {
	return (await fetchApi(`/api/stats/exams/${idExam}/classes/${idClass}/average`)) as
		| ApiError
		| SuccessResponse<ClassAverageForExamResponse>;
};
