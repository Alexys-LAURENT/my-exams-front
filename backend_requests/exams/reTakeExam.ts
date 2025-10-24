import { Exam, QuestionWithAnswersAndUserReponse } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

type StartExamResponse = Exam & {
	questions: QuestionWithAnswersAndUserReponse[];
};

export const reTakeExam = async (idExam: number) => {
	return (await fetchApi(`/api/exams/${idExam}/retake`, {
		method: 'POST',
	})) as ApiError | SuccessResponse<StartExamResponse>;
};
