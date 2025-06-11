'use client';

/**
 * Página de Gerenciamento de Turmas
 * Permite visualizar, criar, editar e excluir turmas
 * Inclui filtros de busca e modais para operações CRUD
 */

import { useState, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import { Search, Info, Plus, GraduationCap, Users, Trash2 } from 'lucide-react';
import Logo from '@/components/ui/logo';
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

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { handleApiError, handleFetchError, handleUnexpectedError } from '@/utils/errorHandler';
import Cookies from 'js-cookie';

const SHIFT_OPTIONS = [
	{ value: 'Morning', label: 'Manhã' },
	{ value: 'Afternoon', label: 'Tarde' },
	{ value: 'Evening', label: 'Noite' },
];

// Componentes de Formulário
const BaseFormField = ({ control, name, label, type = 'text', placeholder, ...props }) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel>{label}</FormLabel>
				<FormControl>
					<Input type={type} placeholder={placeholder} {...field} {...props} />
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);

const SelectFormField = ({ control, name, label, options, placeholder }) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem>
				<FormLabel>{label}</FormLabel>
				<Select onValueChange={field.onChange} defaultValue={field.value}>
					<FormControl>
						<SelectTrigger>
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
					</FormControl>
					<SelectContent>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<FormMessage />
			</FormItem>
		)}
	/>
);

export default function TurmasPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [teachers, setTeachers] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [selectedAluno, setSelectedAluno] = useState(null);
	const [selectedType, setSelectedType] = useState('todos');
	const [turmas, setTurmas] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedTeacher, setSelectedTeacher] = useState('');
	const [selectedSubject, setSelectedSubject] = useState('');
	const [assignments, setAssignments] = useState([]);
	const [isAtributeTeacherClassOpen, setIsAtributeTeacherClassOpen] = useState(false);
	const [error, setError] = useState(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [alunos, setAlunos] = useState([
		{
			id: 1,
			nome: 'João Silva',
			matricula: '2024001',
			turma: 'A',
			status: 'Ativo',
			email: 'joao.silva@email.com',
			telefone: '(11) 99999-9999',
			endereco: 'Rua das Flores, 123',
			notas: {
				matematica: 8.5,
				portugues: 9.0,
				historia: 7.5,
				geografia: 8.0,
				ciencias: 9.5,
			},
			frequencia: 95,
			observacoes: 'Aluno dedicado e participativo em sala de aula.',
		},
		{
			id: 2,
			nome: 'Maria Santos',
			matricula: '2024002',
			turma: 'A',
			status: 'Ativo',
			email: 'maria.santos@email.com',
			telefone: '(11) 98888-8888',
			endereco: 'Av. Principal, 456',
			notas: {
				matematica: 9.5,
				portugues: 8.5,
				historia: 9.0,
				geografia: 8.5,
				ciencias: 9.0,
			},
			frequencia: 98,
			observacoes: 'Excelente desempenho em todas as disciplinas.',
		},
	]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [turmaToDelete, setTurmaToDelete] = useState(null);

	const router = useRouter();

	const formSchema = z.object({
		name: z.string().min(1, 'Nome é obrigatório'),
		course: z.string().min(1, 'Curso é obrigatório'),
		shift: z.string().min(1, 'Turno é obrigatório'),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			course: '',
			shift: '',
		},
	});

	useEffect(() => {
		const fetchTurmas = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const token = Cookies.get('token');
				const response = await fetch('http://localhost:3000/admin/classes', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				});

				await handleApiError(response, 'buscar turmas');
				const data = await response.json();
				console.log('Dados das turmas recebidos:', data);
				setTurmas(data);
			} catch (error) {
				handleFetchError(error, 'buscar turmas');
				setError('Erro ao carregar turmas');
			} finally {
				setIsLoading(false);
			}
		};
		const fetchTeachers = async () => {
			try {
				const token = Cookies.get('token');
				const response = await fetch('http://localhost:3000/admin/teachers', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`	
					},
				});

				await handleApiError(response, 'buscar professores');
				const data = await response.json();
				console.log('Dados dos professores recebidos:', data);
				setTeachers(data);
			} catch (error) {
				handleFetchError(error, 'buscar professores');
				setError('Erro ao carregar professores');
			} finally {
				setIsLoading(false);
			}
		};

		const fetchSubjects = async () => {
			try {
				const token = Cookies.get('token');
				const response = await fetch('http://localhost:3000/admin/subjects', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
				});

				await handleApiError(response, 'buscar disciplinas');
				const data = await response.json();
				console.log('Dados das disciplinas recebidos:', data);
				setSubjects(data);
			} catch (error) {
				handleFetchError(error, 'buscar disciplinas');
				setError('Erro ao carregar disciplinas');
			} finally {
				setIsLoading(false);
			}
		};

		fetchTurmas();
		fetchTeachers();
		fetchSubjects();
	}, []);

	const types = [
		{ id: 'todos', label: 'Todos' },
		...turmas.map((turma) => ({
			id: turma.id,
			label: turma.name,
		})),
	];

	const filteredTurmas = turmas.filter((turma) => {
		return (
			turma.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			turma.course.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	const handleEdit = (aluno) => {
		setSelectedAluno({ ...aluno }); // Criar uma cópia do aluno para edição
		setIsEditModalOpen(true);
	};

	const handleDetails = (turmaId) => {
		router.push(`/pages/turmas/${turmaId}`);
	};

	const handleSave = () => {
		if (!selectedAluno) return;

		// Validar campos obrigatórios
		if (
			!selectedAluno.nome ||
			!selectedAluno.matricula ||
			!selectedAluno.turma ||
			!selectedAluno.status
		) {
			toast.error('Por favor, preencha todos os campos obrigatórios.');
			return;
		}

		// Atualizar o aluno na lista
		setAlunos(alunos.map((aluno) => (aluno.id === selectedAluno.id ? selectedAluno : aluno)));

		// Fechar o modal e mostrar mensagem de sucesso
		setIsEditModalOpen(false);
		toast.success('Dados do aluno atualizados com sucesso!');
	};

	const handleInputChange = (field, value) => {
		setSelectedAluno((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const calcularMedia = (notas) => {
		const valores = Object.values(notas);
		return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1);
	};

	const uniqueTypes = [...new Set(alunos.map((a) => a.turma))];

	const filterItems = (items) => {
		return items.filter((item) => {
			const matchesSearch =
				item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesType = selectedType === 'todos' || item.type === selectedType;
			return matchesSearch && matchesType;
		});
	};

	const addAssignment = () => {
		if (selectedTeacher && selectedSubject) {
			const newAssignment = {
				teacher_id: parseInt(selectedTeacher),
				subject_id: parseInt(selectedSubject)
			};
			setAssignments([...assignments, newAssignment]);
			setSelectedTeacher('');
			setSelectedSubject('');
			toast.success('Professor atribuído com sucesso!');
		} else {
			toast.error('Selecione um professor e uma disciplina');
		}
	};

	const resetCreateClassFlow = () => {
		setIsCreateModalOpen(false);
		setIsAtributeTeacherClassOpen(false);
		setAssignments([]);
		form.reset();
	};

	const handleDeleteTurma = (turma) => {
		setTurmaToDelete(turma);
		setDeleteDialogOpen(true);
	};

	const confirmDeleteTurma = async () => {
		if (!turmaToDelete) return;
		try {
			setIsLoading(true);
			const token = Cookies.get('token');
			const response = await fetch(`http://localhost:3000/admin/classes/${turmaToDelete.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
			});
			if (!response.ok) throw new Error('Erro ao deletar turma');
			setTurmas(prev => prev.filter(t => t.id !== turmaToDelete.id));
			toast.success('Turma deletada com sucesso!');
		} catch (error) {
			toast.error('Erro ao deletar turma. Tente novamente.');
		} finally {
			setDeleteDialogOpen(false);
			setTurmaToDelete(null);
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
				<div className="container mx-auto p-4 md:p-6">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-gray-200 rounded w-1/4"></div>
						<div className="h-32 bg-gray-200 rounded"></div>
						<div className="h-32 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
				<div className="container mx-auto p-4 md:p-6">
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
						<p>Erro ao carregar dados da turma: {error}</p>
					</div>
				</div>
			</div>
		);
	}



	const onSubmit = async (formData) => {
		setIsLoading(true);
		setError(null);
		const token = Cookies.get('token');
		try {
			// Preparar os dados no formato correto
			const dataToSend = {
				name: formData.name,
				shift: formData.shift,
				course: formData.course,
				assignments: assignments
			};

			console.log('Enviando dados:', dataToSend);
		

			const response = await fetch('http://localhost:3000/admin/classes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(dataToSend),
			});

			await handleApiError(response, 'criar turma');
			const responseData = await response.json();

			setTurmas([...turmas, responseData]);
			setIsCreateModalOpen(false);
			setIsAtributeTeacherClassOpen(false);
			setAssignments([]);
			toast.success('Turma criada com sucesso!');
			window.location.reload();
			form.reset();
		} catch (error) {
			handleFetchError(error, 'criar turma');
			setError('Erro ao criar turma. Tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	const CreateClassModal = () => {
		return (
			<>
				<Dialog open={isCreateModalOpen} onOpenChange={(open) => { if (!open) resetCreateClassFlow(); else setIsCreateModalOpen(true); }}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Nova Turma</DialogTitle>
						</DialogHeader>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<BaseFormField
									control={form.control}
									name="name"
									label="Nome da Turma"
									placeholder="Nome da Turma"
								/>
								<SelectFormField
									control={form.control}
									name="shift"
									label="Turno"
									options={SHIFT_OPTIONS}
									placeholder="Selecione o turno"
								/>
								<BaseFormField
									control={form.control}
									name="course"
									label="Curso"
									placeholder="Nome do Curso"
								/>

								{error && <div className="text-red-500 text-sm">{error}</div>}

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={resetCreateClassFlow}
									>
										Cancelar
									</Button>
									<Button
										type="button"
										onClick={async () => {
											const valid = await form.trigger();
											if (valid) {
												setIsCreateModalOpen(false);
												setTimeout(() => setIsAtributeTeacherClassOpen(true), 300);
											}
										}}
									>
										{isLoading ? 'Avançando...' : 'Avançar'}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>

				<Dialog open={isAtributeTeacherClassOpen} onOpenChange={(open) => { if (!open) resetCreateClassFlow(); else setIsAtributeTeacherClassOpen(true); }}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Atribuir Professor à Turma</DialogTitle>
							<DialogDescription>
								Selecione o professor e a disciplina para atribuir à turma
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="teacher">Professor</Label>
									
									<Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
										<SelectTrigger>
											<SelectValue placeholder="Selecione o professor" />
										</SelectTrigger>
										
										<SelectContent>
											{teachers.slice(0, 5).map((teacher) => (
												<SelectItem key={teacher.id} value={teacher.id.toString()}>
													{teacher.user?.name || teacher.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{teachers.length > 5 && (
										<p className="text-xs text-muted-foreground mt-1">
											Mostrando 5 de {teachers.length} professores
										</p>
									)}
								</div>
								<div>
									<Label htmlFor="subject">Disciplina</Label>
									<Select value={selectedSubject} onValueChange={setSelectedSubject}>
										<SelectTrigger>
											<SelectValue placeholder="Selecione a disciplina" />
										</SelectTrigger>
										<SelectContent>
											{subjects.map((subject) => (
												<SelectItem key={subject.id} value={subject.id.toString()}>
													{subject.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							<Button type="button" onClick={addAssignment} className="w-full">
								Adicionar Atribuição
							</Button>

							{assignments.length > 0 && (
								<div className="mt-4">
									<h3 className="text-sm font-medium mb-2">Atribuições:</h3>
									<ul className="space-y-2">
										{assignments.map((assignment, index) => (
											<li key={index} className="text-sm">
												Professor: {teachers.find(t => t.id === assignment.teacher_id)?.user?.name || 'Não encontrado'} - 
												Disciplina: {subjects.find(s => s.id === assignment.subject_id)?.name || 'Não encontrada'}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={resetCreateClassFlow}
							>
								Cancelar
							</Button>
							<Button
								type="button"
								onClick={() => {
									const formData = form.getValues();
									onSubmit(formData);
								}}
							>
								{isLoading ? 'Cadastrando...' : 'Cadastrar Turma'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="container mx-auto p-4 md:p-6">
				<div className="mx-auto">
					<div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
						<Logo className="h-12 w-12" variant="icon" />
						<h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Gerenciar Turmas</h1>
						<p className="mt-2 text-center text-gray-600">Visualize e gerencie todas as turmas do sistema</p>
						<Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
							<Plus className="h-4 w-4 mr-2" />
							Nova Turma
						</Button>
					</div>

					{/* Barra de Pesquisa */}
					<div className="mb-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								type="text"
								placeholder="Pesquisar por nome ou curso..."
								className="pl-10 py-6 text-lg border-2 border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] rounded-xl shadow-sm"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					{/* Lista de Turmas */}
					<Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 pt-0">
						<CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<GraduationCap className="h-6 w-6" />
									<CardTitle>Turmas Cadastradas</CardTitle>
								</div>
								<span className="bg-white/20 px-3 py-1 rounded-full text-sm">
									{filteredTurmas.length} {filteredTurmas.length === 1 ? 'turma' : 'turmas'}
								</span>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="bg-gray-50">
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
											<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
											<th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{filteredTurmas.map((turma) => (
											<tr key={turma.id} className="hover:bg-gray-50 transition-colors duration-200">
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{turma.name}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{turma.course}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													<span className={`px-2 py-1 rounded-full text-sm ${
														turma.shift === 'Morning' ? 'bg-yellow-100 text-yellow-700' :
														turma.shift === 'Afternoon' ? 'bg-orange-100 text-orange-700' :
														'bg-blue-100 text-blue-700'
													}`}>
														{turma.shift === 'Morning' ? 'Manhã' : turma.shift === 'Afternoon' ? 'Tarde' : 'Noite'}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{turma.created_at && !isNaN(new Date(turma.created_at))
														? new Date(turma.created_at).toLocaleDateString('pt-BR')
														: '-'}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<Button 
														variant="ghost" 
														size="sm" 
														onClick={() => handleDetails(turma.id)}
														className="text-[#133D86] hover:text-[#1e56b3] hover:bg-blue-50"
													>
														<Users className="h-4 w-4 mr-1" />
														Ver Turma
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleDeleteTurma(turma)}
														className="text-red-500 hover:bg2-red-700 ml-2"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Modal de Edição */}
			<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar Aluno</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="nome" className="text-right">
								Nome
							</Label>
							<Input
								id="nome"
								value={selectedAluno?.nome || ''}
								onChange={(e) => handleInputChange('nome', e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="matricula" className="text-right">
								Matrícula
							</Label>
							<Input
								id="matricula"
								value={selectedAluno?.matricula || ''}
								onChange={(e) => handleInputChange('matricula', e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="turma" className="text-right">
								Turma
							</Label>
							<Select
								value={selectedAluno?.turma || ''}
								onValueChange={(value) => handleInputChange('turma', value)}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Selecione a turma" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="A">Turma A</SelectItem>
									<SelectItem value="B">Turma B</SelectItem>
									<SelectItem value="C">Turma C</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="status" className="text-right">
								Status
							</Label>
							<Select
								value={selectedAluno?.status || ''}
								onValueChange={(value) => handleInputChange('status', value)}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Selecione o status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Ativo">Ativo</SelectItem>
									<SelectItem value="Inativo">Inativo</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input
								id="email"
								value={selectedAluno?.email || ''}
								onChange={(e) => handleInputChange('email', e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="telefone" className="text-right">
								Telefone
							</Label>
							<Input
								id="telefone"
								value={selectedAluno?.telefone || ''}
								onChange={(e) => handleInputChange('telefone', e.target.value)}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="endereco" className="text-right">
								Endereço
							</Label>
							<Input
								id="endereco"
								value={selectedAluno?.endereco || ''}
								onChange={(e) => handleInputChange('endereco', e.target.value)}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
							Cancelar
						</Button>
						<Button onClick={handleSave}>Salvar</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Modal de Criar Turma */}
			<CreateClassModal />

			{/* Modal de Deletar Turma */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Deletar Turma</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						Tem certeza que deseja deletar a turma "{turmaToDelete?.name}"? Esta ação não pode ser desfeita.
					</DialogDescription>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
							Cancelar
						</Button>
						<Button className="bg-red-500 hover:bg-red-600" onClick={confirmDeleteTurma}>
							Deletar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
