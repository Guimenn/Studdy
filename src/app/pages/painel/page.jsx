'use client';

import { FileText, CheckCircle, LineChart, Users, Bell, Award, BookOpen, Calendar, Clock, Target, ExternalLink, GraduationCap, Frame } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/logo';
import { toast } from 'sonner';

// Dados do usuário
const user = {
	name: 'Gi Johnson',
	avatar: '/img/avatars/avatar-1.jpg',
}

// Dados das plataformas
const plataformas = [
	{
		nome: "Alura",
		img: "/assets/alura.png",
		link: "https://www.alura.com.br/"
	},
	{
		nome: "SPeak",
		img: "/assets/speak.png",
		link: "https://www.speak.com.br/"
	},
	{
		nome: "Educação Profissional",
		img: "/assets/educacaoprofissional.png",
		link: "https://www.educacaoprofissional.com.br/"
	},
	{
		nome: "Prepara SP",
		img: "/assets/prepara-sp.png",
		link: "https://www.prepara.sp.gov.br/"
	},
	{
		nome: "Khan Academy",
		img: "/assets/khan.png",
		link: "https://www.khanacademy.org/"
	},
	{
		nome: "Projeto de Empreendedorismo",
		img: "/assets/empre.jfif",
		link: "https://www.empreendedorismo.sp.gov.br/"
	},
	{
		nome: "São Paulo em Ação",
		img: "/assets/spsp.jpeg",
		link: "https://www.sao-paulo-em-acao.sp.gov.br/"
	},
	{
		nome: "LeiaSP",
		img: "/assets/leia-sp.png",
		link: "https://www.leia.sp.gov.br/"
	}
];

export default function Dashboard() {
	const router = useRouter();
	const { userRole } = useUser();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [quizzes, setQuizzes] = useState([]);
	const [userData, setUserData] = useState(null);

	// Buscar dados baseado na role do usuário
	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = Cookies.get('token');
				const userId = Cookies.get('userId');

				if (!token || !userId) {
					toast.error('Token ou userId não encontrado');
					return;
				}

				setLoading(true);

				// Buscar dados do usuário
				const userResponse = await fetch(`http://localhost:3000/user/${userId}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (!userResponse.ok) {
					throw new Error('Erro ao carregar dados do usuário');
				}

				const userData = await userResponse.json();
				setUserData(userData);

				// Buscar dados específicos da role
				let endpoint = '';
				switch (userRole) {
					case 'student':
						endpoint = 'http://localhost:3000/student/status';
						break;
					case 'teacher':
						endpoint = 'http://localhost:3000/teacher/status';
						break;
					case 'admin':
						endpoint = 'http://localhost:3000/admin/status';
						break;
					default:
						setLoading(false);
						return;
				}

				const response = await fetch(endpoint, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (!response.ok) {
					throw new Error('Erro ao carregar dados');
				}

				const data = await response.json();
				setData(data);
				if (data.lastCompletedQuizzes) {
					setQuizzes(data.lastCompletedQuizzes);
				}
				setError(null);
			} catch (error) {
				console.error('Erro ao carregar dados:', error);
				toast.error('Erro ao carregar dados');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [userRole]);

	// Mensagens personalizadas baseadas no papel do usuário
	const getWelcomeMessage = () => {
		switch (userRole) {
			case 'teacher':
				return {
					greeting: `Bem-vindo(a), Professor(a) ${userData?.name || user.name}!`,
					subtitle: 'Bom dia! Pronto para inspirar seus alunos hoje?'
				};
			case 'admin':
				return {
					greeting: `Bem-vindo(a), ${userData?.name || user.name}!`,
					subtitle: 'Bom dia! Vamos gerenciar a plataforma hoje?'
				};
			default: // student
				return {
					greeting: `Bem-vindo(a), ${userData?.name || user.name}!`,
					subtitle: 'Bom dia! Que tal começar seus estudos hoje?'
				};
		}
	};

	const { greeting, subtitle } = getWelcomeMessage();

	// Título das plataformas baseado no papel
	const plataformasTitle = userRole === 'professor' || userRole === 'teacher'
		? "Plataformas de Ensino"
		: "Plataformas de Aprendizagem";

	// Funções do Overview
	const getDashAlunos = () => {
		if (loading) {
			return [
				{
					title: 'Quizzes Disponíveis',
					value: '...',
					subtitle: 'Carregando...',
					icon: <FileText className="h-6 w-6 text-purple-600" />,
					iconBg: 'bg-purple-100',
					textColor: 'text-purple-600'
				},
				{
					title: 'Média de Acertos',
					value: '...',
					subtitle: 'Carregando...',
					icon: <CheckCircle className="h-6 w-6 text-green-600" />,
					iconBg: 'bg-green-100',
					textColor: 'text-green-600'
				},
				{
					title: 'Tempo de Estudo',
					value: '...',
					subtitle: 'Carregando...',
					icon: <LineChart className="h-6 w-6 text-blue-600" />,
					iconBg: 'bg-blue-100',
					textColor: 'text-blue-600'
				}
			];
		}

		if (error) {
			return [
				{
					title: 'Quizzes Disponíveis',
					value: 'Erro',
					subtitle: 'Falha ao carregar dados',
					icon: <FileText className="h-6 w-6 text-red-600" />,
					iconBg: 'bg-red-100',
					textColor: 'text-red-600'
				},
				{
					title: 'Média de Acertos',
					value: 'Erro',
					subtitle: 'Falha ao carregar dados',
					icon: <CheckCircle className="h-6 w-6 text-red-600" />,
					iconBg: 'bg-red-100',
					textColor: 'text-red-600'
				},
				{
					title: 'Tempo de Estudo',
					value: 'Erro',
					subtitle: 'Falha ao carregar dados',
					icon: <LineChart className="h-6 w-6 text-red-600" />,
					iconBg: 'bg-red-100',
					textColor: 'text-red-600'
				}
			];
		}

		if (data) {
			return [
				{
					title: 'Simulados Disponíveis',
					value: data.availableQuizzesCount || 0,
					subtitle: data.availableQuizzesCount === 0 ? 'Parabéns! Você completou todos os simulados disponíveis!' : 'Vamos resolver mais simulados?',
					icon: <FileText className="h-6 w-6 text-purple-600" />,
					iconBg: 'bg-purple-100',
					textColor: 'text-purple-600'
				},
				{
					title: 'Média de Acertos',
					value: `${data.averageCorrectResponses}%`,
					subtitle: `${data.completionPercentageOverall}% concluído`,
					icon: <CheckCircle className="h-6 w-6 text-green-600" />,
					iconBg: 'bg-green-100',
					textColor: 'text-green-600'
				},
				{
					title: 'Tempo de Estudo',
					value: `${Math.floor(data.totalTimeSpentMinutes / 60)}h ${data.totalTimeSpentMinutes % 60}m`,
					subtitle: 'Total acumulado',
					icon: <LineChart className="h-6 w-6 text-blue-600" />,
					iconBg: 'bg-blue-100',
					textColor: 'text-blue-600'
				}
			];
		}

		return [
			{
				title: 'Simulados Disponíveis',
				value: 0,
				subtitle: 'Sem simulados disponíveis',
				icon: <FileText className="h-6 w-6 text-purple-600" />,
				iconBg: 'bg-purple-100',
				textColor: 'text-purple-600'
			},
			{
				title: 'Média de Acertos',
				value: '0%',
				subtitle: 'Sem dados disponíveis',
				icon: <CheckCircle className="h-6 w-6 text-green-600" />,
				iconBg: 'bg-green-100',
				textColor: 'text-green-600'
			},
			{
				title: 'Tempo de Estudo',
				value: '0h',
				subtitle: 'Sem tempo registrado',
				icon: <LineChart className="h-6 w-6 text-blue-600" />,
				iconBg: 'bg-blue-100',
				textColor: 'text-blue-600'
			}
		];
	};

	const getDashProfessor = () => {
		if (loading) {
			return [
				{
					title: 'Total de Alunos',
					value: '...',
					subtitle: 'Carregando...',
					icon: <Users className="h-6 w-6 text-primary" />,
					iconBg: 'bg-primary/10',
					textColor: 'text-primary'
				},
				{
					title: 'Taxa de Conclusão',
					value: '...',
					subtitle: 'Carregando...',
					icon: <CheckCircle className="h-6 w-6 text-green-600" />,
					iconBg: 'bg-green-100',
					textColor: 'text-green-600'
				},
				{
					title: 'Média da Turma',
					value: '...',
					subtitle: 'Carregando...',
					icon: <LineChart className="h-6 w-6 text-blue-600" />,
					iconBg: 'bg-blue-100',
					textColor: 'text-blue-600'
				}
			];
		}

		if (error) {
			return [
				{
					title: 'Total de Alunos',
					value: 'Erro',
					subtitle: 'Falha ao carregar dados',
					icon: <Users className="h-6 w-6 text-red-600" />,
					iconBg: 'bg-red-100',
					textColor: 'text-red-600'
				},
				{
					title: 'Taxa de Conclusão',
					value: 'Erro',
					subtitle: 'Falha ao carregar dados',
					icon: <CheckCircle className="h-6 w-6 text-red-600" />,
					iconBg: 'bg-red-100',
					textColor: 'text-red-600'
				},
				{
					title: 'Média da Turma',
					value: 'Erro',
					subtitle: 'Falha ao carregar dados',
					icon: <LineChart className="h-6 w-6 text-red-600" />,
					iconBg: 'bg-red-100',
					textColor: 'text-red-600'
				}
			];
		}

		if (data) {
			return [
				{
					title: 'Total de Alunos',
					value: data.totalStudents,
					subtitle: 'Alunos ativos',
					icon: <Users className="h-6 w-6 text-primary" />,
					iconBg: 'bg-primary/10',
					textColor: 'text-primary'
				},
				{
					title: 'Taxa de Conclusão',
					value: `${data.quizCompletionRate}%`,
					subtitle: 'Quizzes concluídos pelos alunos',
					icon: <CheckCircle className="h-6 w-6 text-green-600" />,
					iconBg: 'bg-green-100',
					textColor: 'text-green-600'
				},
				{
					title: 'Média da Geral de Acertos',
					value: `${data.classAverageScoreGlobal}`,
					subtitle: 'Pontuação média',
					icon: <LineChart className="h-6 w-6 text-blue-600" />,
					iconBg: 'bg-blue-100',
					textColor: 'text-blue-600'
				}
			];
		}

		return [
			{
				title: 'Total de Alunos',
				value: 0,
				subtitle: 'Sem alunos registrados',
				icon: <Users className="h-6 w-6 text-primary" />,
				iconBg: 'bg-primary/10',
				textColor: 'text-primary'
			},
			{
				title: 'Taxa de Conclusão',
				value: '0%',
				subtitle: 'Sem dados disponíveis',
				icon: <CheckCircle className="h-6 w-6 text-green-600" />,
				iconBg: 'bg-green-100',
				textColor: 'text-green-600'
			},
			{
				title: 'Média da Turma',
				value: '0',
				subtitle: 'Sem pontuações registradas',
				icon: <LineChart className="h-6 w-6 text-blue-600" />,
				iconBg: 'bg-blue-100',
				textColor: 'text-blue-600'
			}
		];
	};

	const getDashAdmin = () => {
		if (loading) {
			return [
				{
					title: 'Total de Usuários',
					value: '...',
					subtitle: 'Carregando...',
					icon: <Users className="h-6 w-6 text-primary" />,
					iconBg: 'bg-primary/10',
					textColor: 'text-primary'
				},
				{
					title: 'Total de Professores',
					value: '...',
					subtitle: 'Carregando...',
					icon: <FileText className="h-6 w-6 text-green-600" />,
					iconBg: 'bg-green-100',
					textColor: 'text-green-600'
				},
				{
					title: 'Total de Alunos',
					value: '...',
					subtitle: 'Carregando...',
					icon: <LineChart className="h-6 w-6 text-blue-600" />,
					iconBg: 'bg-blue-100',
					textColor: 'text-blue-600'
				}
			];
		}

		if (error) {
			return [
				{
					title: 'Total de Usuários',
					value: 'Erro',
					subtitle: 'Falha ao carregar dados',
					icon: <Users className="h-6 w-6 text-red-600" />,
					iconBg: 'bg-red-100',
					textColor: 'text-red-600'
				},
				{
					title: 'Total de Professores',
					value: 'Erro',
					subtitle: 'Falha ao carregar dados',
					icon: <FileText className="h-6 w-6 text-red-600" />,
					iconBg: 'bg-red-100',
					textColor: 'text-red-600'
				},
				{
					title: 'Total de Alunos',
					value: 'Erro',
					subtitle: 'Falha ao carregar dados',
					icon: <LineChart className="h-6 w-6 text-red-600" />,
					iconBg: 'bg-red-100',
					textColor: 'text-red-600'
				}
			];
		}

		if (data) {
			return [
				{
					title: 'Total de Usuários',
					value: data.totalUsers,
					subtitle: 'Usuários ativos',
					icon: <Users className="h-6 w-6 text-primary" />,
					iconBg: 'bg-primary/10',
					textColor: 'text-primary'
				},
				{
					title: 'Total de Professores',
					value: data.totalTeachers,
					subtitle: 'Professores ativos',
					icon: <FileText className="h-6 w-6 text-green-600" />,
					iconBg: 'bg-green-100',
					textColor: 'text-green-600'
				},
				{
					title: 'Total de Alunos',
					value: data.totalStudents,
					subtitle: 'Alunos ativos',
					icon: <LineChart className="h-6 w-6 text-blue-600" />,
					iconBg: 'bg-blue-100',
					textColor: 'text-blue-600'
				}
			];
		}

		return [
			{
				title: 'Total de Usuários',
				value: 0,
				subtitle: 'Sem usuários registrados',
				icon: <Users className="h-6 w-6 text-primary" />,
				iconBg: 'bg-primary/10',
				textColor: 'text-primary'
			},
			{
				title: 'Total de Professores',
				value: 0,
				subtitle: 'Sem professores registrados',
				icon: <FileText className="h-6 w-6 text-green-600" />,
				iconBg: 'bg-green-100',
				textColor: 'text-green-600'
			},
			{
				title: 'Total de Alunos',
				value: 0,
				subtitle: 'Sem alunos registrados',
				icon: <LineChart className="h-6 w-6 text-blue-600" />,
				iconBg: 'bg-blue-100',
				textColor: 'text-blue-600'
			}
		];
	};

	// Seleciona o dashboard com base no papel
	const dashData =
		userRole === 'teacher'
			? getDashProfessor()
			: userRole === 'admin'
				? getDashAdmin()
				: getDashAlunos();

	return (
		<div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			{/* Main Content */}
			<div className="flex flex-col flex-1 overflow-hidden">
				{/* Main Content Area */}
				<div className="flex-1 overflow-auto p-6">
					<div className="max-w-7xl mx-auto">
						{/* Welcome Section */}
						<div className="flex items-center justify-between mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/50">
							<div className="flex items-center gap-6">
								<div className="relative h-16 w-16 text-center rounded-2xl overflow-hidden ring-4 ring-primary/10 shadow-lg flex items-center justify-center">
									<Logo variant="icon" />
								</div>
								<div>
									<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">{greeting}</h1>
									<p className="text-muted-foreground text-lg">{userData?.name ? `Bem-vindo(a), ${userData.name}!` : 'Bem-vindo(a)!'}</p>
								</div>
							</div>
							
						</div>

						{/* Overview Section */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
							{dashData.map((item, index) => (
								<Card
									key={index}
									className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
								>
									<CardContent className="pt-6">
										<div className="flex items-center justify-between mb-4">
											<span className="text-muted-foreground text-lg">{item.title}</span>
											<div className={`p-2 rounded-lg ${item.iconBg}`}>
												{item.icon}
											</div>
										</div>
										<p className={`text-4xl font-bold ${item.textColor}`}>{item.value}</p>
										<p className="text-sm text-muted-foreground mt-2">{item.subtitle}</p>
									</CardContent>
								</Card>
							))}
						</div>

						{/* Plataformas Section */}
						<div className="mb-8">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-gray-800">{plataformasTitle}</h2>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{plataformas.map((plataforma) => (
									<a
										key={plataforma.nome}
										href={plataforma.link}
										target="_blank"
										rel="noopener noreferrer"
										className="h-full"
									>
										<Card className="h-full bg-white hover:bg-gray-50 transition-colors duration-200">
											<div className="p-4 flex items-center gap-2">
												<div className="w-10 h-10 flex-shrink-0">
													<Image
														src={plataforma.img}
														alt={plataforma.nome}
														width={40}
														height={40}
														className="w-full h-full object-contain"
													/>
												</div>
												<h3 className="font-medium text-gray-900">
													{plataforma.nome}
												</h3>
											</div>
										</Card>
									</a>
								))}
							</div>
						</div>

						{/* Results Section */}
						{userRole === 'professor' || userRole === 'teacher' ? (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<Card className="p-6">
										<div className="flex items-center gap-4">
											<div className="p-3 bg-primary/10 rounded-lg">
												<Users className="w-6 h-6 text-primary" />
											</div>
											<div>
												<p className="text-sm text-gray-500">Total de Alunos</p>
												<p className="text-2xl font-semibold">{data?.totalStudents || 0}</p>
											</div>
										</div>
									</Card>
									<Card className="p-6">
										<div className="flex items-center gap-4">
											<div className="p-3 bg-primary/10 rounded-lg">
												<Target className="w-6 h-6 text-primary" />
											</div>
											<div>
												<p className="text-sm text-gray-500">Taxa de Conclusão</p>
												<p className="text-2xl font-semibold">{data?.quizCompletionRate || 0}%</p>
											</div>
										</div>
									</Card>
									<Card className="p-6">
										<div className="flex items-center gap-4">
											<div className="p-3 bg-primary/10 rounded-lg">
												<Award className="w-6 h-6 text-primary" />
											</div>
											<div>
												<p className="text-sm text-gray-500">Média da Turma</p>
												<p className="text-2xl font-semibold">{data?.classAverageScoreGlobal || 0}%</p>
											</div>
										</div>
									</Card>
								</div>

								<Card>
									<div className="p-6">
										<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
											<BookOpen className="w-5 h-5 text-primary" />
											Desempenho por Disciplina
										</h3>
										<div className="space-y-4">
											{data?.performanceBySubject?.map((subject, index) => (
												<div key={index} className="space-y-2">
													<div className="flex justify-between items-center">
														<span className="font-medium capitalize">{subject.subjectName}</span>
														<Badge variant="outline" className="bg-primary/5">
															{subject.accuracy}%
														</Badge>
													</div>
													<Progress value={subject.accuracy} className="h-2" />
												</div>
											))}
										</div>
									</div>
								</Card>
							</div>
						) : userRole === 'student' || userRole === 'aluno' ? (
							<div className="space-y-6">
								<Card className="border-none shadow-lg">
									<div className="p-6">
										<div className="flex items-center justify-between mb-6">
											<h3 className="text-xl font-bold text-gray-800">Últimos Quizzes Completados</h3>
											<Button
												variant="default"
												size="lg"
												className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
												onClick={() => router.push('/simulados')}
											>
												<ExternalLink className="h-4 w-4" />
												Ver todos os simulados
											</Button>
										</div>
										<div className="overflow-x-auto rounded-lg border border-gray-200">
											<Table>
												<TableHeader>
													<TableRow className="bg-gray-50/50">
														<TableHead className="font-semibold text-gray-600">Quiz</TableHead>
														<TableHead className="font-semibold text-gray-600">Matéria</TableHead>
														<TableHead className="font-semibold text-gray-600">Nota</TableHead>
														<TableHead className="font-semibold text-gray-600">Pontuação</TableHead>
														<TableHead className="font-semibold text-gray-600">Data</TableHead>
														<TableHead className="font-semibold text-gray-600">Tempo</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{data?.lastCompletedQuizzes?.map((quiz, index) => (
														<TableRow key={index}>
															<TableCell>{quiz.quizTitle}</TableCell>
															<TableCell className="capitalize">{quiz.subjectName}</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Award className="h-4 w-4 text-yellow-500" />
																	<span>{quiz.score}/{quiz.maxScore}</span>
																</div>
															</TableCell>
															<TableCell>
																<Badge variant="outline" className="bg-green-50 text-green-600">
																	{quiz.scorePercentage}%
																</Badge>
															</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Calendar className="h-4 w-4 text-gray-500" />
																	<span>{new Date(quiz.completedAt).toLocaleDateString('pt-BR')}</span>
																</div>
															</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Clock className="h-4 w-4 text-gray-500" />
																	<span>{quiz.timeSpentMinutes} min</span>
																</div>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</div>
								</Card>
							</div>
						) : (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-6">Atalhos Administrativos</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
										<CardContent className="p-6">
											<div className="flex items-center gap-4">
												<div className="p-3 bg-primary/10 rounded-lg">
													<Users className="w-6 h-6 text-primary" />
												</div>
												<div>
													<h3 className="font-medium text-lg">Gerenciar Usuários</h3>
													<p className="text-sm text-gray-500">Cadastro e edição de usuários</p>
												</div>
											</div>
											<Button
												variant="ghost"
												className="w-full mt-4"
												onClick={() => router.push('/pages/administracao')}
											>
												Acessar
											</Button>
										</CardContent>
									</Card>

									<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
										<CardContent className="p-6">
											<div className="flex items-center gap-4">
												<div className="p-3 bg-primary/10 rounded-lg">
													<BookOpen className="w-6 h-6 text-primary" />
												</div>
												<div>
													<h3 className="font-medium text-lg">Cadastros</h3>
													<p className="text-sm text-gray-500">Cadastro de novos usuários</p>
												</div>
											</div>
											<Button
												variant="ghost"
												className="w-full mt-4"
												onClick={() => router.push('/pages/cadastro')}
											>
												Acessar
											</Button>
										</CardContent>
									</Card>

									<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
										<CardContent className="p-6">
											<div className="flex items-center gap-4">
												<div className="p-3 bg-primary/10 rounded-lg">
													<Calendar className="w-6 h-6 text-primary" />
												</div>
												<div>
													<h3 className="font-medium text-lg">Concursos</h3>
													<p className="text-sm text-gray-500">Gerenciar concursos</p>
												</div>
											</div>
											<Button
												variant="ghost"
												className="w-full mt-4"
												onClick={() => router.push('/pages/concursos')}
											>
												Acessar
											</Button>
										</CardContent>
									</Card>

									<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
										<CardContent className="p-6">
											<div className="flex items-center gap-4">
												<div className="p-3 bg-primary/10 rounded-lg">
													<GraduationCap className="w-6 h-6 text-primary" />
												</div>
												<div>
													<h3 className="font-medium text-lg">Vestibulares</h3>
													<p className="text-sm text-gray-500">Gerenciar vestibulares</p>
												</div>
											</div>
											<Button
												variant="ghost"
												className="w-full mt-4"
												onClick={() => router.push('/pages/vestibulares')}
											>
												Acessar
											</Button>
										</CardContent>
									</Card>

									<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
										<CardContent className="p-6">
											<div className="flex items-center gap-4">
												<div className="p-3 bg-primary/10 rounded-lg">
													<Frame className="w-6 h-6 text-primary" />
												</div>
												<div>
													<h3 className="font-medium text-lg">Turmas</h3>
													<p className="text-sm text-gray-500">Gerenciar turmas</p>
												</div>
											</div>
											<Button
												variant="ghost"
												className="w-full mt-4"
												onClick={() => router.push('/pages/turmas')}
											>
												Acessar
											</Button>
										</CardContent>
									</Card>

									<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
										<CardContent className="p-6">
											<div className="flex items-center gap-4">
												<div className="p-3 bg-primary/10 rounded-lg">
													<BookOpen className="w-6 h-6 text-primary" />
												</div>
												<div>
													<h3 className="font-medium text-lg">Material</h3>
													<p className="text-sm text-gray-500">Gerenciar materiais</p>
												</div>
											</div>
											<Button
												variant="ghost"
												className="w-full mt-4"
												onClick={() => router.push('/pages/material')}
											>
												Acessar
											</Button>
										</CardContent>
									</Card>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
