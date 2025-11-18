'use client';

import { ExamGrade } from '@/types/entitties';
import { Avatar } from '@heroui/avatar';
import { useRouter } from 'next/navigation';

const getStatusLabel = (status: 'en cours' | 'à corrigé' | 'corrigé' | 'pas remis') => {
	switch (status) {
		case 'en cours':
			return { label: 'En cours', color: 'bg-blue-100 text-blue-800' };
		case 'à corrigé':
			return { label: 'À corriger', color: 'bg-yellow-100 text-yellow-800' };
		case 'corrigé':
			return { label: 'Corrigé', color: 'bg-green-100 text-green-800' };
		case 'pas remis':
			return { label: 'Pas remis', color: 'bg-gray-100 text-gray-800' };
	}
};

const TableStudentsForExamAndClass = ({
	studentsWithStatus,
	idClass,
	exam,
}: {
	studentsWithStatus: (
		| {
				examGrade: ExamGrade;
				status: 'en cours' | 'à corrigé' | 'corrigé';
				idUser: number;
				lastName: string;
				name: string;
				email: string;
				avatarPath: string;
				accountType: 'student' | 'teacher' | 'admin';
		  }
		| {
				examGrade: null;
				status: 'pas remis';
				idUser: number;
				lastName: string;
				name: string;
				email: string;
				avatarPath: string;
				accountType: 'student' | 'teacher' | 'admin';
		  }
	)[];
	idClass: number;
	exam: { idExam: number };
}) => {
	const router = useRouter();
	return (
		<table className="w-full">
			<thead>
				<tr className="border-b border-gray-200">
					<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Avatar</th>
					<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom</th>
					<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prénom</th>
					<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
					<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
					<th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Note</th>
				</tr>
			</thead>
			<tbody>
				{studentsWithStatus.map((student) => {
					const statusInfo = getStatusLabel(student.status);
					return (
						<tr
							onClick={() => {
								router.push(`/student/${idClass}/${student.idUser}/${exam.idExam}`);
							}}
							key={student.idUser}
							className="border-b cursor-pointer border-gray-100 hover:bg-gray-50 transition-colors"
						>
							<td className="py-4 px-4">
								<Avatar src={student.avatarPath || undefined} name={student.name} size="sm" className="shrink-0" />
							</td>
							<td className="py-4 px-4">{student.lastName}</td>
							<td className="py-4 px-4">{student.name}</td>
							<td className="py-4 px-4">{student.email}</td>
							<td className="py-4 px-4">
								<span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
							</td>
							<td className="py-4 px-4">{student.examGrade?.note !== null && student.examGrade?.note !== undefined ? `${student.examGrade.note}/20` : '-'}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default TableStudentsForExamAndClass;
