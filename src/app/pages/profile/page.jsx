'use client';

import { useState, useEffect } from 'react';
import {
	User,
	Mail,
	Calendar,
	Edit2,
	Save,
	X,
	Clock,
	UserCheck,
	IdCard,
	Shield,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export default function Profile() {
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [profile, setProfile] = useState({
		name: '',
		email: '',
		birthDate: '',
		cpf: '',
		role: '',
		createdAt: '',
		modifiedAt: '',
		id: ''
	});

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userId = Cookies.get('userId');

				if (!userId) {
					toast.error('Usuário não autenticado');
					return;
				}

				const response = await fetch(`http://localhost:3000/user/${userId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('Erro ao buscar dados do usuário');
				}

				const userData = await response.json();
				
				// Formata as datas para o formato brasileiro
				const birthDate = userData.birth_date || '';
				const createdAt = userData.created_at ? new Date(userData.created_at).toLocaleDateString('pt-BR') : '';
				const modifiedAt = userData.modified_at ? new Date(userData.modified_at).toLocaleDateString('pt-BR') : '';
				
				setProfile({
					name: userData.name || '',
					email: userData.email || '',
					birthDate: birthDate,
					cpf: userData.cpf || '',
					role: userData.role || '',
					createdAt: createdAt,
					modifiedAt: modifiedAt,
					id: userData.id || ''
				});
			} catch (error) {
				console.error('Erro ao buscar dados do usuário:', error);
				toast.error('Erro ao carregar dados do perfil');
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleSave = async () => {
		try {
			const userId = Cookies.get('userId');
			
			const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(profile),
			});

			if (!response.ok) {
				throw new Error('Erro ao atualizar perfil');
			}

			toast.success('Perfil atualizado com sucesso!');
			setIsEditing(false);
		} catch (error) {
			console.error('Erro ao atualizar perfil:', error);
			toast.error('Erro ao atualizar perfil');
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4 text-muted-foreground">Carregando perfil...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
						Perfil do Usuário
					</h1>
				</div>

				{/* Profile Content */}
				<div className="grid gap-6">
					{/* Basic Info */}
					<Card>
						<CardContent className="pt-6">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">{profile.name}</h2>
									<p className="text-lg text-muted-foreground mt-1">
										{profile.role === 'admin' ? 'Administrador' : 
										 profile.role === 'Teacher' ? 'Professor' : 
										 profile.role === 'Student' ? 'Aluno' :
										 profile.role}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Personal Information */}
					<Card>
						<CardContent className="pt-6">
							<h3 className="text-xl font-semibold mb-4">Informações Pessoais</h3>
							<div className="grid gap-4">
								<div className="flex items-center gap-3">
									<User className="h-5 w-5 text-primary" />
									<Label className="min-w-[120px] font-medium">Nome Completo:</Label>
									<span className="text-muted-foreground">{profile.name}</span>
								</div>
								<div className="flex items-center gap-3">
									<Mail className="h-5 w-5 text-primary" />
									<Label className="min-w-[120px] font-medium">E-mail:</Label>
									<span className="text-muted-foreground">{profile.email}</span>
								</div>
								<div className="flex items-center gap-3">
									<Calendar className="h-5 w-5 text-primary" />
									<Label className="min-w-[120px] font-medium">Data de Nascimento:</Label>
									<span className="text-muted-foreground">{profile.birthDate || 'Não informado'}</span>
								</div>
								<div className="flex items-center gap-3">
									<IdCard className="h-5 w-5 text-primary" />
									<Label className="min-w-[120px] font-medium">CPF:</Label>
									<span className="text-muted-foreground">{profile.cpf || 'Não informado'}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Account Information */}
					<Card>
						<CardContent className="pt-6">
							<h3 className="text-xl font-semibold mb-4">Informações da Conta</h3>
							<div className="grid gap-4">
								<div className="flex items-center gap-3">
									<UserCheck className="h-5 w-5 text-primary" />
									<Label className="min-w-[120px] font-medium">Tipo de Conta:</Label>
									<span className="text-muted-foreground">
										{profile.role === 'admin' ? 'Administrador' : 
										 profile.role === 'Teacher' ? 'Professor' : 
										 profile.role === 'Student' ? 'Aluno' :
										 profile.role}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<Clock className="h-5 w-5 text-primary" />
									<Label className="min-w-[120px] font-medium">Membro desde:</Label>
									<span className="text-muted-foreground">{profile.createdAt}</span>
								</div>
								<div className="flex items-center gap-3">
									<Shield className="h-5 w-5 text-primary" />
									<Label className="min-w-[120px] font-medium">ID do Usuário:</Label>
									<span className="text-muted-foreground">{profile.id}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}