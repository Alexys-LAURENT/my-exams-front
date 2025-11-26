'use client';
import { User } from '@/types/entitties';
import { useRouter } from 'next/navigation';

interface StudentsTableProps {
	students: User[];
	idClass: number;
}

const StudentsTable = ({ students, idClass }: StudentsTableProps) => {
	const router = useRouter();
	return (
		<table className="w-full">
			<thead>
				<tr className="border-b border-gray-200">
					<th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
					<th className="text-left py-3 px-4 font-semibold text-gray-700">Prénom</th>
					<th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
				</tr>
			</thead>
			<tbody>
				{students.map((student, index) => (
					<tr
						onClick={() => {
							router.push(`/student/${idClass}/${student.idUser}/grades-summary`);
						}}
						key={student.idUser}
						className={`border-b cursor-pointer border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
					>
						<td className="py-3 px-4 text-gray-900">{student.lastName}</td>
						<td className="py-3 px-4 text-gray-900">{student.name}</td>
						<td className="py-3 px-4 text-gray-600">{student.email}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default StudentsTable;
