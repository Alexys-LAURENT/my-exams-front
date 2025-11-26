import { Exam, ExamGrade, Matiere } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

type ExamWithGradeType = Exam & {
	examGrade: ExamGrade | null;
};

export type UserAverageInClassResponse = {
	subjects: Matiere[];
	examsWithGrades: ExamWithGradeType[];
	subjectAverages: {
		idMatiere: number;
		average: number | null;
	}[];
};

/**
 * Récupère le résumé des notes d'un utilisateur dans une classe donnée.
 * @param idClass - L'identifiant de la classe
 * @param idUser - L'identifiant de l'élève
 * @returns Un objet contenant le résumé des notes de l'utilisateur dans la classe spécifiée.
 */
export const getUserInClassGradesSummary = async (idClass: number, idUser: number) => {
	return (await fetchApi(`/api/classes/${idClass}/students/${idUser}/grades-summary`)) as ApiError | SuccessResponse<UserAverageInClassResponse>;
};
