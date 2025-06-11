'use client';

/**
 * Página de Concursos
 * Permite visualizar, criar, editar e excluir concursos públicos
 * Inclui funcionalidades de busca, filtros e favoritos
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import {
	ExternalLink,
	Calendar,
	Shield,
	Briefcase,
	School,
	Building2,
	Landmark,
	Scale,
	Search,
	Star,
	StarOff,
	Plus,
	Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import React from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { BaseFormField, SelectFormField, IconSelector } from '@/components/ui/formfield';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { PageLoader } from '@/components/ui/loader';
import { useRouter } from 'next/navigation';

const CONCURSO_CATEGORIES = [
	{ value: 'militares', label: 'Militares' },
	{ value: 'federais', label: 'Federais' },
	{ value: 'estaduais', label: 'Estaduais' },
	{ value: 'municipais', label: 'Municipais' },
];

const ICON_OPTIONS = {
	concursos: [
		{ label: 'Escudo', value: 'Shield', icon: Shield },
		{ label: 'Escola', value: 'School', icon: School },
		{ label: 'Pasta', value: 'Briefcase', icon: Briefcase },
		{ label: 'Prédio', value: 'Building2', icon: Building2 },
		{ label: 'Monumento', value: 'Landmark', icon: Landmark },
		{ label: 'Balança', value: 'Scale', icon: Scale },
	],
};

export default function ConcursosPage() {
	const { userRole } = useUser();
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('todos');
	const [favorites, setFavorites] = useState([]);
	const [isCreateConcursoModalOpen, setIsCreateConcursoModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [concursos, setConcursos] = useState([]);
	const [error, setError] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [concursoToDelete, setConcursoToDelete] = useState(null);

	const iconMap = {
		Shield: Shield,
		School: School,
		Briefcase: Briefcase,
		Building2: Building2,
		Landmark: Landmark,
		Scale: Scale,
	};

	const renderIcon = (iconName) => {
		const IconComponent = iconMap[iconName];
		if (!IconComponent) return null;
		return <IconComponent className="h-6 w-6" />;
	};

	useEffect(() => {
		const savedFavorites = localStorage.getItem('concursos_favorites');
		if (savedFavorites) {
			setFavorites(JSON.parse(savedFavorites));
		}
	}, []);

	useEffect(() => {
		// Simulate loading user role
		const timer = setTimeout(() => {
			setIsAuthorized(true);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const fetchConcursos = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const token = Cookies.get('token');
				if (!token) throw new Error('Token não encontrado');

				console.log('Buscando lista de concursos');
				const response = await fetch('https://api-studdy.onrender.com/contestsEntrace/contests', {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Erro ao buscar lista de concursos');
				}

				const data = await response.json();
				console.log('Lista de concursos recebida:', data);

				// Transformar os dados para o formato esperado pelo componente
				const formattedConcursos = data.map(concurso => ({
					...concurso,
					id: concurso.id,
					category: concurso.type, // Mapear type para category para compatibilidade com o filtro
					date: new Date(concurso.date).toLocaleDateString('pt-BR') // Formatar data
				}));

				setConcursos(formattedConcursos);
			} catch (err) {
				console.error('Erro ao buscar concursos:', err);
				setError(err.message);
				toast.error(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchConcursos();
	}, []);

	const toggleFavorite = (title) => {
		const newFavorites = favorites.includes(title)
			? favorites.filter((fav) => fav !== title)
			: [...favorites, title];
		setFavorites(newFavorites);
		localStorage.setItem('concursos_favorites', JSON.stringify(newFavorites));
	};

	const categories = [
		{ id: 'todos', label: 'Todos' },
		{ id: 'militares', label: 'Militares' },
		{ id: 'bancarios', label: 'Bancários' },
		{ id: 'federais', label: 'Federais' },
		{ id: 'estaduais', label: 'Estaduais' },
	];

	const CreateConcursoModal = () => {
		const [isSubmitting, setIsSubmitting] = useState(false);
		const contests = z.object({
			title: z.string().min(1, { message: 'Title is required' }),
			link: z.string().url({ message: 'Invalid URL' }),
			type: z.string().min(1, { message: 'Type is required' }),
			icon: z.string().min(1, { message: 'Icon is required' }),
			color: z.string().min(1, { message: 'Color is required' }),
			description: z.string().min(1, { message: 'Description is required' }),
			date: z.coerce.date({ message: 'Invalid date' }),
		});

		const form = useForm({
			resolver: zodResolver(contests),
			defaultValues: {
				title: '',
				link: '',
				type: '',
				icon: '',
				color: '',
				description: '',
				date: '',
			},
		});

		const onSubmit = async (formData) => {
			setIsSubmitting(true);

			try {
				const token = Cookies.get('token');
				if (!token) {
					throw new Error('Token não encontrado');
				}

				// Preparar dados do concurso para envio
				const concursoData = {
					title: formData.title,
					link: formData.link,
					type: formData.type,
					icon: formData.icon,
					color: formData.color,
					description: formData.description,
					date: formData.date,
				};

				console.log('Enviando dados do concurso:', concursoData);

				// Enviar dados do concurso para o backend
				const response = await fetch('https://api-studdy.onrender.com/contestsEntrace/contests', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(concursoData),
				});

				if (!response.ok) {
					throw new Error(`Erro HTTP: ${response.status}`);
				}

				const result = await response.json();
				console.log('Concurso criado:', result);

				// Mostrar mensagem de sucesso
				toast.success('Concurso criado com sucesso!');
				window.location.reload();
				setIsCreateConcursoModalOpen(false);
				form.reset();
			} catch (error) {
				console.error('Erro ao criar concurso:', error);
				toast.error('Erro ao criar concurso. Tente novamente.');
			} finally {
				setIsSubmitting(false);
			}
		};

		return (
			<>
				<Dialog open={isCreateConcursoModalOpen} onOpenChange={setIsCreateConcursoModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Novo Concurso</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<BaseFormField
									control={form.control}
									name="title"
									label="Título do Concurso"
									placeholder="Título do Concurso"
								/>
								<BaseFormField
									control={form.control}
									name="link"
									label="Link do Concurso"
									placeholder="https://..."
								/>
								<SelectFormField
									control={form.control}
									name="type"
									label="Categoria"
									options={CONCURSO_CATEGORIES}
									placeholder="Selecione a categoria"
								/>
								<BaseFormField
									control={form.control}
									name="date"
									label="Data do Concurso"
									type="date"
								/>
								<IconSelector
									control={form.control}
									name="icon"
									label="Ícone"
									options={ICON_OPTIONS.concursos}
									form={form}
								/>
								
								<BaseFormField
									control={form.control}
									name="description"
									label="Descrição"
									placeholder="Descrição do concurso"
								/>

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setIsCreateConcursoModalOpen(false);
											form.reset();
										}}
										disabled={isSubmitting}
									>
										Cancelar
									</Button>
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? 'Cadastrando...' : 'Cadastrar Concurso'}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</>
		);
	};

	const filterItems = (items) => {
		return items.filter((item) => {
			const matchesSearch =
				item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	};

	const handleDeleteConcurso = async (concurso) => {
		setConcursoToDelete(concurso);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		try {
			const token = Cookies.get('token');
			if (!token) throw new Error('Token não encontrado');

			const response = await fetch(`https://api-studdy.onrender.com/contestsEntrace/contests/${concursoToDelete.id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Erro ao deletar concurso');
			}

			setConcursos(prev => prev.filter(c => c.id !== concursoToDelete.id));
			toast.success('Concurso deletado com sucesso!');
		} catch (error) {
			console.error('Erro ao deletar concurso:', error);
			toast.error('Erro ao deletar concurso. Tente novamente.');
		} finally {
			setDeleteDialogOpen(false);
			setConcursoToDelete(null);
		}
	};

	if (isLoading) {
		return <PageLoader />;
	}

	return (
		<>
			<div className="min-h-screen bg-gray-50 ">
				<div className="container mx-auto p-4 md:p-6">
					<div className="mx-auto">
						<div className="flex flex-col items-center mb-6 bg-white rounded-lg shadow-lg p-4">
							<Logo className="h-9 w-9" variant="icon" />
							<h1 className="mt-4 text-2xl font-bold tracking-tight">Concursos Públicos</h1>
							<p className="mt-2 text-center">
								Acompanhe as principais oportunidades de carreira pública
							</p>
						</div>
						{isAuthorized && (userRole === 'admin' || userRole === 'teacher') && (
							<Button onClick={() => setIsCreateConcursoModalOpen(true)} className="mb-4">
								<Plus className="h-4 w-4 mr-2 " />
								Novo Concurso
							</Button>
						)}
						<div className="mb-6 space-y-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
								<Input
									type="text"
									placeholder="Buscar concursos..."
									className="pl-10 w-full"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>

							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<Button
										key={category.id}
										variant={selectedCategory === category.id ? 'default' : 'outline'}
										className="text-sm"
										onClick={() => setSelectedCategory(category.id)}
									>
										{category.label}
									</Button>
								))}
							</div>
						</div>

						<div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{filterItems(concursos).map((concurso) => (
								<Card
									key={concurso.title}
									className="hover:shadow-xl transition-all duration-300 border-0 bg-white h-[300px] w-full"
								>
									<CardHeader className="pb-2">
										<div className="flex items-center justify-between">
											<div className="p-3 rounded-lg text-white" style={{ backgroundColor: concurso.color }}>
												{renderIcon(concurso.icon)}
											</div>
											<div className="flex items-center gap-2">
												<button
													onClick={() => toggleFavorite(concurso.title)}
													className="text-gray-400 hover:text-yellow-500 transition-colors"
												>
													{favorites.includes(concurso.title) ? (
														<Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
													) : (
														<StarOff className="h-5 w-5" />
													)}
												</button>
												<div className="flex items-center text-sm text-gray-500">
													<Calendar className="h-4 w-4 mr-1" />
													{concurso.date}
												</div>
												{(userRole === 'admin' || userRole === 'teacher') && (
													<button
														onClick={() => handleDeleteConcurso(concurso)}
														className="text-gray-400 hover:text-red-500 transition-colors ml-2"
													>
														<Trash2 className="h-5 w-5" />
													</button>
												)}
											</div>
										</div>
										<CardTitle className="text-xl mt-4 h-[32px] line-clamp-1">
											{concurso.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-gray-600 mb-6 h-[48px] line-clamp-2">
											{concurso.description}
										</p>
										<Button
											className="w-full bg-[#133D86] hover:bg-[#0e2a5c] transition-colors duration-300"
											onClick={() => window.open(concurso.link, '_blank')}
										>
											Acessar Site Oficial
											<ExternalLink className="ml-2 h-4 w-4" />
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</div>
			</div>
			<CreateConcursoModal />
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Deletar Concurso</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						Você tem certeza de que deseja deletar este concurso?
					</DialogDescription>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							Cancelar
						</Button>
						<Button
							type="button"
							onClick={confirmDelete}
							className="bg-red-500 hover:bg-red-600"
						>
							Deletar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
