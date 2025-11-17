import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

/**
 * Question la plus échouée avec son taux d'échec
 */
export type MostFailedQuestionResponse = {
	idQuestion: number;
	fail_rate: number;
};

/**
 * Récupère les 5 questions les plus échouées d'un examen
 * @param idExam - L'identifiant de l'examen
 * @returns Un tableau des 5 questions avec leur taux d'échec (max 5)
 */
export const getMostFailedQuestions = async (idExam: number) => {
	return (await fetchApi(`/api/stats/exams/${idExam}/most_failed_questions`)) as
		| ApiError
		| SuccessResponse<MostFailedQuestionResponse[]>;
};
