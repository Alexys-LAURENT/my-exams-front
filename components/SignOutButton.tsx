'use client';

import { Button } from '@heroui/button';
import { signOut } from 'next-auth/react';

const SignOutButton = () => {
	return (
		<Button
			onPress={() => {
				signOut();
			}}
			className="mt-2"
		>
			Déconnexion
		</Button>
	);
};

export default SignOutButton;
