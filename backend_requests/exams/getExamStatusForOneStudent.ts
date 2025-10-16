import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getExamStatusForOneStudent = async (idStudent: number, idExam: number) => {
	return (await fetchApi(`/api/students/${idStudent}/exams/${idExam}/status`)) as ApiError | SuccessResponse<{ status: boolean }>;
};
