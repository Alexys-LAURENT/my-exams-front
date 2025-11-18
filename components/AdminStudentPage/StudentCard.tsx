'use client';

import { deleteStudent } from '@/backend_requests/students/deleteStudent';
import { ToastContext } from '@/Context/ToastContext';
import { User } from '@/types/entitties';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

interface StudentCardProps {
	student: User;
}

export const StudentCard = ({ student }: StudentCardProps) => {
	const router = useRouter();
	const { customToast } = useContext(ToastContext);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant "${student.name} ${student.lastName}" ?`)) {
			return;
		}

		try {
			setIsDeleting(true);
			const res = await deleteStudent(student.idUser);
			if (!('success' in res)) {
				throw new Error("Erreur lors de la suppression de l'étudiant");
			}
			customToast.success('Étudiant supprimé avec succès');
			router.refresh();
		} catch (error) {
			console.error('StudentCard:Error::', error);
			customToast.error("Erreur lors de la suppression de l'étudiant");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleViewDetails = () => {
		router.push(`/admin/students/${student.idUser}`);
	};

	return (
		<div className="p-6 w-full rounded-lg border border-gray-200 hover:shadow-md transition-shadow bg-white">
			<div className="flex justify-between items-start">
				<div className="flex gap-3 items-center">
					<Avatar src={student.avatarPath || undefined} name={student.name} size="lg" className="shrink-0" />
					<div className="flex flex-col">
						<h3 className="text-xl font-bold text-gray-900">
							{student.name} {student.lastName}
						</h3>
						<p className="text-sm text-gray-600">{student.email}</p>
					</div>
				</div>
				<div className="flex gap-2">
					<Button onPress={handleViewDetails} size="sm" className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
						Voir les détails
					</Button>
					<Button onPress={handleDelete} size="sm" color="danger" variant="light" className="px-4 py-2 text-sm font-medium" isLoading={isDeleting}>
						Supprimer
					</Button>
				</div>
			</div>
		</div>
	);
};
