import { ExamGrade } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

/**
 * Récupère les examGrades d'un étudiant pour une classe spécifique avec des options de filtrage
 * @param idClass - L'identifiant de la classe
 * @param idStudent - L'identifiant de l'étudiant
 * @param options - Les options de filtrage (limit, status)
 * @returns Les examGrades filtrées
 */
export const getExamGradesForStudentInClass = async (idClass: number, idStudent: number, options?: { limit?: number; status?: 'in_progress' | 'to_correct' | 'corrected' }) => {
	const queryParams = new URLSearchParams();

	if (options?.limit) {
		queryParams.append('limit', options.limit.toString());
	}

	if (options?.status) {
		queryParams.append('status', options.status);
	}

	const queryString = queryParams.toString();
	const url = `/api/exam_grades/classes/${idClass}/student/${idStudent}${queryString ? `?${queryString}` : ''}`;

	return (await fetchApi(url)) as ApiError | SuccessResponse<ExamGrade[]>;
};
