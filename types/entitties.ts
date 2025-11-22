export type Matiere = {
	idMatiere: number;
	nom: string;
};

export type User = {
	idUser: number;
	lastName: string;
	name: string;
	email: string;
	avatarPath: string;
	accountType: 'student' | 'teacher' | 'admin';
};

export type Meta = {
	total: number;
	perPage: number;
	currentPage: number;
	lastPage: number;
	firstPage: number;
	firstPageUrl: string;
	lastPageUrl: string;
	nextPageUrl: string | null;
	previousPageUrl: string | null;
};

export type Class = {
	idClass: number;
	name: string;
	startDate: string;
	endDate: string;
	idDegree: number;
};

export type Degree = {
	idDegree: number;
	name: string;
	createdAt: string;
	updatedAt: string | null;
};

export type ClassWithDegree = Class & {
	degree: Degree;
};

export type Exam = {
	idExam: number;
	title: string;
	desc: string | null;
	time: number;
	idTeacher: number;
	idMatiere: number;
	imagePath: string | null;
	createdAt: string;
	updatedAt: string | null;
};

export type ExamClass = {
	idExam: number;
	idClass: number;
	start_date: string;
	end_date: string;
};

export type ExamWithDates = Exam & {
	start_date: string;
	end_date: string;
};

export type Question = {
	idQuestion: number;
	title: string;
	commentary: string | null;
	isMultiple: boolean;
	isQcm: boolean;
	maxPoints: number;
	idExam: number;
	createdAt: string;
	updatedAt: string | null;
};

export type Answer = {
	idAnswer: number;
	answer: string;
	isCorrect: boolean;
	idQuestion: number;
	idExam: number;
	createdAt: string;
	updatedAt: string | null;
};

export type AnswerWithoutCorrect = {
	idAnswer: number;
	answer: string;
	createdAt: string;
	updatedAt: string | null;
};

export type UserResponse = {
	idUserResponse: number;
	custom: string | null;
	idUser: number;
	idQuestion: number;
	idExam: number;
	createdAt: string;
	updatedAt: string | null;
};

export type UserResponseAnswer = {
	id_user_response: number;
	id_answer: number;
	id_question: number;
	id_exam: number;
};

export type Evaluation = {
	idEvaluation: number;
	note: string | null;
	commentary: string | null;
	idStudent: number;
	idTeacher: number;
	idUserResponse: number;
	createdAt: string;
	updatedAt: string | null;
};

export type ExamGrade = {
	idExamGrade: number;
	note: number | null;
	status: 'en cours' | 'à corrigé' | 'corrigé';
	idUser: number;
	idExam: number;
	idClass: number;
	createdAt: string;
	updatedAt: string | null;
};

export type QuestionWithDetails = Question & {
	answers: Answer[];
	correctAnswers: Answer[];
	userResponse: UserResponse & {
		selectedAnswers: UserResponseAnswer[];
	};
	evaluation: Evaluation | null;
};

export type ExamRecap =
	| (Exam & {
			isExamTimeFinished: true;
			questions: QuestionWithDetails[];
			examGrade: ExamGrade | null;
	  })
	| (Exam & {
			isExamTimeFinished: false;
			examGrade: ExamGrade | null;
	  });

export type QuestionWithAnswers = Question & {
	answers: AnswerWithoutCorrect[];
};

export type QuestionWithAnswersAndUserReponse = QuestionWithAnswers & {
	userResponse?: {
		idUserResponse: number;
		custom: string | null;
		selectedAnswers: number[];
	};
};
