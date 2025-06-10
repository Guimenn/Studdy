'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Componente Logo que pode ser renderizado em três variantes:
 * - icon: apenas o ícone do logo
 * - text: apenas o texto do logo
 * - full: combinação do ícone e texto (padrão)
 */
const Logo = ({ variant = 'full', className = '', iconClassName = '', textClassName = '' }) => {
	const renderDefault = () => (
		<div className="flex items-center gap-2">
			<Image
				src="/assets/logo_icon.svg"
				alt="Logo Icon"
				width={36}
				height={36}
				className={cn('h-9 w-9', iconClassName)}
			/>
			<Image
				src="/assets/logo_text.svg"
				alt="Logo Text"
				width={120}
				height={24}
				className={cn('h-6', textClassName)}
			/>
		</div>
	);

	const renderIcon = () => (
		<Image
			src="/assets/logo_icon.svg"
			alt="Logo Icon"
			width={36}
			height={36}
			className={cn('h-9 w-9', iconClassName)}
		/>
	);

	const renderText = () => (
		<Image
			src="/assets/logo_text.svg"
			alt="Logo Text"
			width={120}
			height={24}
			className={cn('h-6', textClassName)}
		/>
	);

	// Componente para a variante de ícone
	if (variant === 'icon') {
		return <div className={cn('flex items-center', className)}>{renderIcon()}</div>;
	}

	// Componente para a variante de texto
	if (variant === 'text') {
		return <div className={cn('flex items-center', className)}>{renderText()}</div>;
	}

	// Componente para a variante completa (ícone + texto)
	return <div className={cn('flex items-center gap-2', className)}>{renderDefault()}</div>;
};

export default Logo;
