import { QuestionWithAnswersAndUserReponse, QuestionWithDetails } from '@/types/entitties';

/**
 * Mélange les questions de manière déterministe en fonction du prénom et nom de l'étudiant.
 * Garantit que le même étudiant aura toujours le même ordre de questions.
 *
 * @param questions - Le tableau de questions à mélanger
 * @param firstname - Le prénom de l'étudiant
 * @param lastname - Le nom de famille de l'étudiant
 * @returns Le tableau de questions mélangé de manière déterministe
 */
export const shuffleQuestions = <T extends QuestionWithAnswersAndUserReponse | QuestionWithDetails>(questions: T[], firstname: string, lastname: string): T[] => {
	// Génère une seed unique basée sur le prénom et nom de l'étudiant
	const seed = Array.from((firstname + lastname).toLowerCase()).reduce((acc, char) => acc + char.charCodeAt(0), 0);

	// Crée un générateur de nombres pseudo-aléatoires déterministe
	const random = (function (seed: number) {
		return function () {
			const x = Math.sin(seed++) * 10000;
			return x - Math.floor(x);
		};
	})(seed);

	// Applique l'algorithme de Fisher-Yates pour mélanger les questions
	const shuffledQuestions = [...questions];
	for (let i = shuffledQuestions.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
	}
	return shuffledQuestions;
};
