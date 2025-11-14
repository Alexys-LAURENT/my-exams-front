'use client';

import React, { ReactNode } from 'react';
import { Accordion, AccordionItem } from '@heroui/accordion';
import { Button } from '@heroui/button';

interface AddEntityFormProps {
	title: string;
	icon?: string;
	iconBgColor?: string;
	submitButtonText: string;
	children: ReactNode;
	onSubmit: (e: React.FormEvent) => void;
	error?: string;
	successMessage?: string;
	onClearError?: () => void;
	onClearSuccess?: () => void;
	defaultExpanded?: boolean;
}

export const AddEntityForm: React.FC<AddEntityFormProps> = ({
	title,
	icon = '➕',
	iconBgColor = 'bg-blue-500',
	submitButtonText,
	children,
	onSubmit,
	error,
	successMessage,
	onClearError,
	onClearSuccess,
	defaultExpanded = true,
}) => {
	return (
		<div className="bg-white rounded-lg shadow">
			<Accordion defaultExpandedKeys={defaultExpanded ? ['1'] : []}>
				<AccordionItem
					key="1"
					aria-label={title}
					title={
						<div className="flex items-center gap-3">
							<div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center text-white text-xl`}>{icon}</div>
							<span className="text-xl font-semibold text-gray-800">{title}</span>
						</div>
					}
				>
					<div className="pt-4">
						{successMessage && (
							<div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
								{successMessage}
								{onClearSuccess && (
									<button onClick={onClearSuccess} className="float-right font-bold">
										×
									</button>
								)}
							</div>
						)}

						{error && (
							<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
								{error}
								{onClearError && (
									<button onClick={onClearError} className="float-right font-bold">
										×
									</button>
								)}
							</div>
						)}

						<form onSubmit={onSubmit}>
							{children}

							<div className="flex justify-end mt-4">
								<Button type="submit" color="primary" className="px-6 font-medium" size="lg">
									{submitButtonText}
								</Button>
							</div>
						</form>
					</div>
				</AccordionItem>
			</Accordion>
		</div>
	);
};
