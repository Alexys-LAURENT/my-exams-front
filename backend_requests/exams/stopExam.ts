import { ApiError } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

type StopExamResponse = {
	success: true;
	message: string;
	data: {
		status: 'corrigé' | 'à corrigé';
		score?: number;
	};
};

export const stopExam = async (idStudent: number, idClass: number, idExam: number) => {
	return (await fetchApi(`/api/classes/${idClass}/students/${idStudent}/exams/${idExam}/stop`, {
		method: 'POST',
	})) as ApiError | StopExamResponse;
};
