import { ExamWithDates } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

/**
 * Récupère les examens d'un type spécifique pour un étudiant dans une classe donnée.
 * @param idClass - L'ID de la classe.
 * @param idStudent - L'ID de l'étudiant.
 * @param status - Le type d'examens à récupérer ('completed', 'pending', 'comming').
 * @param queryParams - Paramètres de requête optionnels (comme la limite).
 * @returns Une promesse contenant soit une erreur API, soit une réponse réussie avec une liste d'examens.
 */
export const getExamsByTypeOfStudentInClass = async (
	idClass: number,
	idStudent: number,
	status: 'completed' | 'pending' | 'comming',
	queryParams?: {
		limit?: number;
	}
) => {
	let url = `/api/classes/${idClass}/students/${idStudent}/exams/${status}`;
	if (queryParams) {
		const params = new URLSearchParams();
		if (queryParams.limit) params.append('limit', queryParams.limit.toString());
		if (params.toString()) {
			url += `?${params.toString()}`;
		}
	}
	return (await fetchApi(url)) as ApiError | SuccessResponse<ExamWithDates[]>;
};
