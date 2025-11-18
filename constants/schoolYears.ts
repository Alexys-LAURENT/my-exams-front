// Constantes pour les dates d'année scolaire
export const SCHOOL_YEAR_START_MONTH = 8; // Septembre (0-indexé : 0=janvier, 8=septembre)
export const SCHOOL_YEAR_START_DAY = 1;
export const SCHOOL_YEAR_END_MONTH = 7; // Août (0-indexé : 0=janvier, 7=août)
export const SCHOOL_YEAR_END_DAY = 31;

export const getCurrentSchoolYearDates = () => {
	const now = new Date();
	const year = now.getMonth() >= SCHOOL_YEAR_START_MONTH ? now.getFullYear() : now.getFullYear() - 1;

	// Créer les dates en format ISO directement pour éviter les problèmes de fuseau horaire
	const startDateStr = `${year}-${String(SCHOOL_YEAR_START_MONTH + 1).padStart(2, '0')}-${String(SCHOOL_YEAR_START_DAY).padStart(2, '0')}`;
	const endDateStr = `${year + 1}-${String(SCHOOL_YEAR_END_MONTH + 1).padStart(2, '0')}-${String(SCHOOL_YEAR_END_DAY).padStart(2, '0')}`;

	return {
		startDate: startDateStr,
		endDate: endDateStr,
	};
};

export const getNextSchoolYearDates = () => {
	const now = new Date();
	const year = now.getMonth() >= SCHOOL_YEAR_START_MONTH ? now.getFullYear() + 1 : now.getFullYear();

	// Créer les dates en format ISO directement pour éviter les problèmes de fuseau horaire
	const startDateStr = `${year}-${String(SCHOOL_YEAR_START_MONTH + 1).padStart(2, '0')}-${String(SCHOOL_YEAR_START_DAY).padStart(2, '0')}`;
	const endDateStr = `${year + 1}-${String(SCHOOL_YEAR_END_MONTH + 1).padStart(2, '0')}-${String(SCHOOL_YEAR_END_DAY).padStart(2, '0')}`;

	return {
		startDate: startDateStr,
		endDate: endDateStr,
	};
};
