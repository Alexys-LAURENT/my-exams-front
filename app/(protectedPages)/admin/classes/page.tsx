import { getAllClasses } from '@/backend_requests/classes/getAllClasses';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { ClassesAccordion } from '@/components/AdminClassPage/ClassesAccordion';
import ModalCreateClassButton from '@/components/AdminClassPage/ModalCreateClassButton';
import { SearchFilter } from '@/components/AdminPage/SearchFilter';
import { SCHOOL_YEAR_START_MONTH } from '@/constants/schoolYears';
import { Class } from '@/types/entitties';

interface ClassWithDegree extends Class {
	degreeName: string;
}

interface PageProps {
	searchParams: Promise<{ search?: string }>;
}

// Fonction pour grouper les classes par année scolaire
const groupClassesBySchoolYear = (classes: ClassWithDegree[]) => {
	const grouped: { [key: string]: ClassWithDegree[] } = {};

	classes.forEach((classe) => {
		const startDate = new Date(classe.startDate);
		const year = startDate.getMonth() >= SCHOOL_YEAR_START_MONTH ? startDate.getFullYear() : startDate.getFullYear() - 1;
		const schoolYear = `${year}-${year + 1}`;

		if (!grouped[schoolYear]) {
			grouped[schoolYear] = [];
		}
		grouped[schoolYear].push(classe);
	});

	// Trier par année scolaire décroissante
	return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
};

// Fonction pour déterminer l'année scolaire actuelle
const getCurrentSchoolYear = () => {
	const now = new Date();
	const year = now.getMonth() >= SCHOOL_YEAR_START_MONTH ? now.getFullYear() : now.getFullYear() - 1;
	return `${year}-${year + 1}`;
};

const Page = async ({ searchParams }: PageProps) => {
	const { search } = await searchParams;

	const classesReponse = await getAllClasses();
	if (!('success' in classesReponse)) {
		throw new Error('Erreur lors de la récupération des classes');
	}

	// Récupérer les degrés pour chaque classe
	const classesWithDegrees: ClassWithDegree[] = await Promise.all(
		classesReponse.data.map(async (classe) => {
			const degreeResponse = await getClassDegree(classe.idClass);

			if (!('success' in degreeResponse) || !degreeResponse.success) {
				throw new Error(`Impossible de récupérer le diplôme pour la classe ${classe.name}`);
			}

			return {
				...classe,
				degreeName: degreeResponse.data.name,
			};
		})
	);

	// Filtrer les classes par recherche
	let filteredClasses = classesWithDegrees;
	if (search) {
		const searchLower = search.toLowerCase();
		filteredClasses = filteredClasses.filter((classe) => classe.name.toLowerCase().includes(searchLower) || classe.degreeName.toLowerCase().includes(searchLower));
	}

	const groupedClasses = groupClassesBySchoolYear(filteredClasses);
	const currentSchoolYear = getCurrentSchoolYear();

	return (
		<div className="flex flex-col w-full gap-6 p-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Gestion des classes</h1>
				<ModalCreateClassButton />
			</div>

			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<SearchFilter placeholder="Rechercher une classe..." />
			</div>

			{filteredClasses.length === 0 ? (
				<div className="flex justify-center items-center h-64">
					<p className="text-xl text-gray-500">{search ? 'Aucune classe trouvée pour cette recherche' : 'Aucune classe disponible.'}</p>
				</div>
			) : (
				<ClassesAccordion groupedClasses={groupedClasses} currentSchoolYear={currentSchoolYear} />
			)}
		</div>
	);
};

export default Page;
