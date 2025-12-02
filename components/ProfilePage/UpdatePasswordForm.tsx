'use client';

import { updateOwnPassword } from '@/backend_requests/updateOwnPassword';
import { ToastContext } from '@/Context/ToastContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useContext, useState } from 'react';

export const UpdatePasswordForm = () => {
	const { customToast } = useContext(ToastContext);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation côté client
		if (!currentPassword || !newPassword || !confirmPassword) {
			customToast.error('Tous les champs sont requis');
			return;
		}

		if (newPassword !== confirmPassword) {
			customToast.error('Les nouveaux mots de passe ne correspondent pas');
			return;
		}

		// Validation du mot de passe avec regex (⚠️ le même côté bakend dans le validator ⚠️)
		// Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(newPassword)) {
			customToast.error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)');
			return;
		}

		if (currentPassword === newPassword) {
			customToast.error("Le nouveau mot de passe doit être différent de l'ancien");
			return;
		}

		try {
			setIsLoading(true);
			const result = await updateOwnPassword(currentPassword, newPassword);
			console.log(result);

			if ('success' in result && result.success) {
				customToast.success('Mot de passe mis à jour avec succès');
				// Réinitialiser le formulaire
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
			} else {
				customToast.error('Erreur lors de la mise à jour du mot de passe. Vérifiez votre mot de passe actuel.');
			}
		} catch (error) {
			console.error(error);
			customToast.error('Une erreur est survenue');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<Input
				label="Mot de passe actuel"
				placeholder="Entrez votre mot de passe actuel"
				type={showCurrentPassword ? 'text' : 'password'}
				value={currentPassword}
				onValueChange={setCurrentPassword}
				isRequired
				endContent={
					<button className="focus:outline-none" type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
						{showCurrentPassword ? <EyeSlashIcon className="w-5 h-5 text-gray-400" /> : <EyeIcon className="w-5 h-5 text-gray-400" />}
					</button>
				}
			/>

			<Input
				label="Nouveau mot de passe"
				placeholder="Entrez votre nouveau mot de passe"
				type={showNewPassword ? 'text' : 'password'}
				value={newPassword}
				onValueChange={setNewPassword}
				isRequired
				endContent={
					<button className="focus:outline-none" type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
						{showNewPassword ? <EyeSlashIcon className="w-5 h-5 text-gray-400" /> : <EyeIcon className="w-5 h-5 text-gray-400" />}
					</button>
				}
			/>

			<Input
				label="Confirmer le nouveau mot de passe"
				placeholder="Confirmez votre nouveau mot de passe"
				type={showConfirmPassword ? 'text' : 'password'}
				value={confirmPassword}
				onValueChange={setConfirmPassword}
				isRequired
				endContent={
					<button className="focus:outline-none" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
						{showConfirmPassword ? <EyeSlashIcon className="w-5 h-5 text-gray-400" /> : <EyeIcon className="w-5 h-5 text-gray-400" />}
					</button>
				}
			/>

			<Button type="submit" color="primary" isLoading={isLoading} className="mt-2">
				Mettre à jour le mot de passe
			</Button>
		</form>
	);
};
