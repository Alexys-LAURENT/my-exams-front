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
	startDate: string;
	endDate: string;
	idDegree: number;
};

export type Degree = {
	idDegree: number;
	name: string;
};
