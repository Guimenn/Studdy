'use client';

import { useState } from 'react';
import {
	User,
	Mail,
	Phone,
	MapPin,
	GraduationCap,
	Calendar,
	Edit2,
	Save,
	X,
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function Profile() {
	const [isEditing, setIsEditing] = useState(false);
	const [profile, setProfile] = useState({
		name: 'Sarah Johnson',
		email: 'sarah.johnson@example.com',
		phone: '+1 (555) 123-4567',
		location: 'New York, USA',
		education: 'Bachelor of Science in Computer Science',
		graduationYear: '2024',
		avatar: '/img/avatars/avatar-1.jpg',
	});

	const handleSave = () => {
		// Aqui você implementaria a lógica para salvar as alterações
		setIsEditing(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
						Perfil do Usuário
					</h1>
					<Button
						variant={isEditing ? "outline" : "default"}
						onClick={() => setIsEditing(!isEditing)}
						className="gap-2"
					>
						{isEditing ? (
							<>
								<X className="h-4 w-4" />
								Cancelar
							</>
						) : (
							<>
								<Edit2 className="h-4 w-4" />
								Editar Perfil
							</>
						)}
					</Button>
				</div>

				{/* Profile Content */}
				<div className="grid gap-6">
					{/* Avatar and Basic Info */}
					<Card className="overflow-hidden">
						<div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10">
							<div className="absolute -bottom-16 left-8">
								<div className="relative h-32 w-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
									<Image
										src={profile.avatar}
										alt="Profile Avatar"
										fill
										className="object-cover"
									/>
								</div>
							</div>
						</div>
						<CardContent className="pt-20">
							<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
								<div>
									<h2 className="text-2xl font-bold">{profile.name}</h2>
									<p className="text-muted-foreground">Estudante</p>
								</div>
								{isEditing && (
									<Button
										onClick={handleSave}
										className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
									>
										<Save className="h-4 w-4" />
										Salvar Alterações
									</Button>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Contact Information */}
					<Card>
						<CardContent className="pt-6">
							<h3 className="text-xl font-semibold mb-4">Informações de Contato</h3>
							<div className="grid gap-4">
								<div className="flex items-center gap-3">
									<Mail className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="email"
											value={profile.email}
											onChange={(e) => setProfile({ ...profile, email: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">{profile.email}</span>
									)}
								</div>
								<div className="flex items-center gap-3">
									<Phone className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="tel"
											value={profile.phone}
											onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">{profile.phone}</span>
									)}
								</div>
								<div className="flex items-center gap-3">
									<MapPin className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="text"
											value={profile.location}
											onChange={(e) => setProfile({ ...profile, location: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">{profile.location}</span>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Education Information */}
					<Card>
						<CardContent className="pt-6">
							<h3 className="text-xl font-semibold mb-4">Informações Acadêmicas</h3>
							<div className="grid gap-4">
								<div className="flex items-center gap-3">
									<GraduationCap className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="text"
											value={profile.education}
											onChange={(e) => setProfile({ ...profile, education: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">{profile.education}</span>
									)}
								</div>
								<div className="flex items-center gap-3">
									<Calendar className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="text"
											value={profile.graduationYear}
											onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">Ano de Formatura: {profile.graduationYear}</span>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
} 