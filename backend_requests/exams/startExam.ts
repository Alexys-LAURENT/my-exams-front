import { Exam, QuestionWithAnswers } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

type StartExamResponse = Exam & {
	questions: QuestionWithAnswers[];
};

export const startExam = async (idStudent: number, idClass: number, idExam: number) => {
	return (await fetchApi(`/api/classes/${idClass}/students/${idStudent}/exams/${idExam}/start`, {
		method: 'POST',
	})) as ApiError | SuccessResponse<StartExamResponse>;
};
