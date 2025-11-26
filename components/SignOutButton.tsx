'use client';

import { Button } from '@heroui/button';
import { signOut } from 'next-auth/react';

const SignOutButton = () => {
	return (
		<Button
			size="sm"
			color="danger"
			variant="light"
			onPress={() => {
				signOut();
			}}
			className="w-full"
		>
			Déconnexion
		</Button>
	);
};

export default SignOutButton;
