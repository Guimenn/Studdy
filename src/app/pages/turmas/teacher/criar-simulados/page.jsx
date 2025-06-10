'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Question from '@/components/ui/question';
import Logo from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { QuizVisibility } from '../enums/QuizVisibility';
import {
	Calculator,
	Pi,
	Ruler,
	Sigma,
	ChartBar,
	ChartLine,
	Atom,
	Telescope,
	Beaker,
	Microscope,
	FlaskConical,
	TestTube,
	FlaskRound,
	History,
	Landmark,
	ScrollText,
	Book,
	Globe,
	Map,
	Compass,
	BookText,
	BookOpenText,
	Type,
	Pen,
	PenTool,
	FileText,
	PlusCircle,
	Save,
	Edit,
} from 'lucide-react';
import Cookies from 'js-cookie';

const ICON_OPTIONS = [
	// Matemática
	{ label: 'Matemática - Calculadora', value: 'Calculator', icon: Calculator },
	{ label: 'Matemática - Pi', value: 'Pi', icon: Pi },
	{ label: 'Matemática - Régua', value: 'Ruler', icon: Ruler },
	{ label: 'Matemática - Sigma', value: 'Sigma', icon: Sigma },
	{ label: 'Matemática - Gráfico de Barras', value: 'ChartBar', icon: ChartBar },
	{ label: 'Matemática - Gráfico de Linha', value: 'ChartLine', icon: ChartLine },

	// Física
	{ label: 'Física - Átomo', value: 'Atom', icon: Atom },
	{ label: 'Física - Telescópio', value: 'Telescope', icon: Telescope },
	{ label: 'Física - Béquer', value: 'Beaker', icon: Beaker },

	// Química
	{ label: 'Química - Microscópio', value: 'Microscope', icon: Microscope },
	{ label: 'Química - Tubo de Ensaio', value: 'TestTube', icon: TestTube },
	{ label: 'Química - Frasco Cônico', value: 'FlaskConical', icon: FlaskConical },
	{ label: 'Química - Frasco Redondo', value: 'FlaskRound', icon: FlaskRound },

	// História
	{ label: 'História - Livro Antigo', value: 'Book', icon: Book },
	{ label: 'História - Rolos de Texto', value: 'ScrollText', icon: ScrollText },
	{ label: 'História - Monumento', value: 'Landmark', icon: Landmark },
	{ label: 'História - Relógio Antigo', value: 'History', icon: History },

	// Geografia
	{ label: 'Geografia - Globo', value: 'Globe', icon: Globe },
	{ label: 'Geografia - Mapa', value: 'Map', icon: Map },
	{ label: 'Geografia - Bússola', value: 'Compass', icon: Compass },

	// Português
	{ label: 'Português - Livro de Texto', value: 'BookText', icon: BookText },
	{ label: 'Português - Livro Aberto', value: 'BookOpenText', icon: BookOpenText },
	{ label: 'Português - Tipografia', value: 'Type', icon: Type },
	{ label: 'Português - Caneta', value: 'Pen', icon: Pen },
	{ label: 'Português - Ferramenta de Escrita', value: 'PenTool', icon: PenTool },
];

export default function CriarSimuladosPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const editId = searchParams.get('edit');
	const classId = searchParams.get('classId');
	const isEditMode = !!editId;
	
	const [classes, setClasses] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [selectedClass, setSelectedClass] = useState(classId || '');
	const [selectedSubject, setSelectedSubject] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [questoes, setQuestoes] = useState([1]);
	const [titulo, setTitulo] = useState('');
	const [icone, setIcone] = useState('Calculator');
	const [tentativas_maximas, setTentativasMaximas] = useState(3);
	const [duracao_minutos, setDuracaoMinutos] = useState(60);
	const [visibilidade, setVisibilidade] = useState(QuizVisibility.PUBLIC);
	const [descricao, setdescricao] = useState('');
	const [state, setState] = useState({
		isSubmitting: false,
		submitError: null,
		submitSuccess: false,
	});
	const [questions, setQuestions] = useState([]);
	const [loadingSimulado, setLoadingSimulado] = useState(false);

	// Carregar classes do professor
	useEffect(() => {
		const fetchClasses = async () => {
			try {
				const token = Cookies.get('token');
				if (!token) {
					toast.error('Token não encontrado');
					return;
				}

				console.log('Buscando turmas...');
				const response = await fetch('http://localhost:3000/teacher/classes', {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (!response.ok) {
					throw new Error('Erro ao carregar classes');
				}

				const data = await response.json();
				console.log('Dados recebidos:', data);
				
				if (!Array.isArray(data)) {
					console.error('Dados inválidos recebidos:', data);
					toast.error('Formato de dados inválido');
					return;
				}

				setClasses(data);
				console.log('Turmas atualizadas:', data);
			} catch (error) {
				toast.error('Erro ao carregar classes');
				console.error('Erro detalhado:', error);
			}
		};

		fetchClasses();
	}, []);

	// Carregar disciplinas quando uma classe for selecionada
	useEffect(() => {
		if (selectedClass) {
			const fetchSubjects = async () => {
				try {
					const token = Cookies.get('token');
					if (!token) {
						toast.error('Token não encontrado');
						return;
					}

					const response = await fetch(`http://localhost:3000/teacher/classes/${selectedClass}/subjects`, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});

					if (!response.ok) {
						throw new Error('Erro ao carregar disciplinas');
					}

					const data = await response.json();
					console.log('Disciplinas recebidas:', data);

					if (!Array.isArray(data)) {
						console.error('Dados inválidos recebidos:', data);
						toast.error('Formato de dados inválido');
						return;
					}

					setSubjects(data);
				} catch (error) {
					toast.error('Erro ao carregar disciplinas');
					console.error(error);
				}
			};

			fetchSubjects();
		} else {
			setSubjects([]);
		}
	}, [selectedClass]);

	// Carregar dados do simulado para edição
	useEffect(() => {
		if (isEditMode && editId) {
			const loadSimuladoData = async () => {
				setLoadingSimulado(true);
				try {
					const token = Cookies.get('token');
					if (!token) {
						toast.error('Token não encontrado');
						return;
					}

					const response = await fetch(`http://localhost:3000/teacher/simulados/${editId}`, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});

					if (!response.ok) {
						throw new Error('Erro ao carregar simulado');
					}

					const simulado = await response.json();
					console.log('Simulado carregado:', simulado);

					// Preencher os campos com os dados do simulado
					setTitulo(simulado.title || '');
					setdescricao(simulado.description || '');
					setIcone(simulado.icon || 'Calculator');
					setTentativasMaximas(simulado.max_attempts || 1);
					setDuracaoMinutos(simulado.duration_minutes || 60);
					setVisibilidade(simulado.visibility || QuizVisibility.DRAFT);
					setSelectedClass(simulado.class_id || '');
					setSelectedSubject(simulado.subject_id || '');

					// Carregar questões se existirem
					if (simulado.questions && simulado.questions.length > 0) {
						setQuestions(simulado.questions);
						setQuestoes(simulado.questions.map((_, index) => index + 1));
					}

				} catch (error) {
					console.error('Erro ao carregar simulado:', error);
					toast.error('Erro ao carregar dados do simulado');
					router.push('/pages/turmas/teacher');
				} finally {
					setLoadingSimulado(false);
				}
			};

			loadSimuladoData();
		}
	}, [isEditMode, editId, router]);

	const adicionarQuestao = () => {
		setQuestoes((prev) => [...prev, prev.length + 1]);
	};

	const excluirQuestao = (numeroQuestao) => {
		setQuestoes((prev) => prev.filter((num) => num !== numeroQuestao));
	};

	const formatPayload = (visibility) => {
		const payload = {
			title: titulo,
			description: descricao,
			icon: icone,
			class_id: parseInt(selectedClass),
			subject_id: parseInt(selectedSubject),
			max_attempt: tentativas_maximas,
			duration_minutes: duracao_minutos,
			visibility: visibility.toLowerCase(),
			questions: questions.map((question) => ({
				statement: question.statement,
				points: question.points,
				alternatives: question.alternatives.map((alternative) => ({
					response: alternative.text,
					correct_alternative: alternative.isCorrect
				}))
			}))
		};
		return payload;
	};

	const handleSubmit = async (e, visibility = QuizVisibility.PUBLIC) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const token = Cookies.get('token');
			if (!token) {
				toast.error('Token não encontrado');
				return;
			}

			console.log('Dados a serem enviados:', formatPayload(visibility));

			const payload = formatPayload(visibility);
			
			// Determinar URL e método baseado no modo de edição
			const url = isEditMode 
				? `http://localhost:3000/teacher/simulados/${editId}`
				: `http://localhost:3000/teacher/classes/${selectedClass}/subjects/${selectedSubject}/quiz`;
			
			const method = isEditMode ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(payload)
			});

			console.log('Resposta do servidor:', response);

			if (!response.ok) {
				const action = isEditMode ? 'atualizar' : 'criar';
				throw new Error(`Erro ao ${action} simulado`);
			}

			const action = isEditMode ? 'atualizado' : (visibility === QuizVisibility.DRAFT ? 'salvo' : 'publicado');
			const successMessage = isEditMode 
				? `Simulado ${action} com sucesso!`
				: (visibility === QuizVisibility.DRAFT ? 'Rascunho salvo com sucesso!' : 'Simulado publicado com sucesso!');
			
			toast.success(successMessage);
			router.push('/pages/turmas/teacher');
		} catch (error) {
			const action = isEditMode ? 'atualizar' : (visibility === QuizVisibility.DRAFT ? 'salvar rascunho' : 'publicar simulado');
			const errorMessage = `Erro ao ${action}`;
			toast.error(errorMessage);
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddQuestion = () => {
		setQuestions([...questions, {
			id: Date.now(),
			statement: '',
			points: 1,
			alternatives: [
				{ id: Date.now(), text: '', isCorrect: true },
				{ id: Date.now() + 1, text: '', isCorrect: false },
				{ id: Date.now() + 2, text: '', isCorrect: false },
				{ id: Date.now() + 3, text: '', isCorrect: false }
			]
		}]);
	};

	const handleDeleteQuestion = (questionId) => {
		setQuestions(questions.filter(q => q.id !== questionId));
	};

	const handleAlternativesGenerated = (data) => {
		const { questionId, question, correct_answer, alternativas } = data;
		setQuestions(questions.map(q => {
			if (q.id === questionId) {
				return {
					...q,
					statement: question,
					alternatives: [
						{ text: correct_answer, isCorrect: true },
						{ text: alternativas.alternativa1, isCorrect: false },
						{ text: alternativas.alternativa2, isCorrect: false },
						{ text: alternativas.alternativa3, isCorrect: false }
					]
				};
			}
			return q;
		}));
	};

	const handleQuestionChange = (updatedQuestion) => {
		setQuestions(prev => prev.map(q => 
			q.id === updatedQuestion.id ? updatedQuestion : q
		));
	};

	// Mostrar loading enquanto carrega dados do simulado
	if (loadingSimulado) {
		return (
			<div className="bg-slate-100 min-h-screen p-4 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#133D86] mx-auto mb-4"></div>
					<p className="text-gray-600">Carregando dados do simulado...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-slate-100 min-h-screen p-4">
			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
					<Logo className="h-12 w-12" variant="icon" />
					<h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">
						{isEditMode ? 'Editar Simulado' : 'Gerar Simulado'}
					</h1>
					{isEditMode && (
						<p className="mt-2 text-sm text-gray-600">
							Editando simulado • Você pode salvar como rascunho ou publicar
						</p>
					)}
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
						<h2 className="text-xl font-semibold text-[#133D86] mb-6">Informações do Simulado</h2>
						
						<div className="space-y-6">
							<div>
								<label className="block text-sm font-medium mb-2">Classe</label>
								<Select
									value={selectedClass}
									onValueChange={setSelectedClass}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione uma classe" />
									</SelectTrigger>
									<SelectContent>
										{Array.isArray(classes) && classes.length > 0 ? (
											classes.map((classItem) => (
												<SelectItem 
													key={classItem.class_id} 
													value={classItem.class_id.toString()}
												>
													{classItem.class_name} - {classItem.class_course}
												</SelectItem>
											))
										) : (
											<SelectItem value="no-classes" disabled>
												Nenhuma turma encontrada
											</SelectItem>
										)}
									</SelectContent>
								</Select>
								{Array.isArray(classes) && classes.length === 0 && (
									<p className="text-sm text-red-500 mt-1">
										Nenhuma turma disponível
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Disciplina</label>
								<Select
									value={selectedSubject}
									onValueChange={setSelectedSubject}
									disabled={!selectedClass}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecione uma disciplina" />
									</SelectTrigger>
									<SelectContent>
										{Array.isArray(subjects) && subjects.length > 0 ? (
											subjects.map((subject) => (
												<SelectItem 
													key={subject.subject_id} 
													value={subject.subject_id.toString()}
												>
													{subject.subject_name}
												</SelectItem>
											))
										) : (
											<SelectItem value="no-subjects" disabled>
												Nenhuma disciplina encontrada
											</SelectItem>
										)}
									</SelectContent>
								</Select>
								{Array.isArray(subjects) && subjects.length === 0 && selectedClass && (
									<p className="text-sm text-red-500 mt-1">
										Nenhuma disciplina disponível para esta turma
									</p>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<label className="font-semibold text-[#133D86] text-base">Título do Simulado</label>
								<Input
									type="text"
									placeholder="Ex: Simulado de Programação Web"
									className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
									value={titulo}
									onChange={(e) => setTitulo(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-2">
							<label className="font-semibold text-[#133D86] text-base">Ícone do Simulado</label>
							<div className="flex items-center gap-3 flex-wrap">
								<div className="flex gap-2 flex-wrap">
									{ICON_OPTIONS.map((opt) => {
										const Icon = opt.icon;
										return (
											<button
												type="button"
												key={opt.value}
												className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${icone === opt.value ? 'bg-[#133D86] text-white border-[#133D86] scale-110 shadow-lg' : 'bg-white text-[#133D86] border-gray-200 hover:bg-[#e6eefc]'} `}
												onClick={() => setIcone(opt.value)}
												tabIndex={-1}
											>
												<Icon className="h-6 w-6" />
											</button>
										);
									})}
								</div>
							</div>
						</div>

							<div className="flex flex-col gap-2">
								<label className="font-semibold text-[#133D86] text-base">Descrição</label>
								<Input
									type="text"
									placeholder="Ex: Questões sobre HTML, CSS e JavaScript"
									className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
									value={descricao}
									onChange={(e) => setdescricao(e.target.value)}
								/>
							</div>

							
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-lg">
						{questions.map((question, index) => (
							<Question
								key={question.id}
								questionId={question.id}
								numeroQuestao={index + 1}
								onAddQuestion={handleAddQuestion}
								onDeleteQuestion={() => handleDeleteQuestion(question.id)}
								onAlternativesGenerated={handleAlternativesGenerated}
								existingQuestion={question}
								onQuestionChange={handleQuestionChange}
							/>
						))}
					</div>

					<div className="mt-6 space-y-4">
						<div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg">
							<div className="flex items-center gap-2">
								<FileText className="h-5 w-5 text-slate-600" />
								<span className="text-slate-600 font-medium">
									{questions.length} {questions.length === 1 ? 'Questão' : 'Questões'}
								</span>
							</div>
							<div className="flex gap-3 flex-col lg:flex-row">
								<Button
									variant="outline"
									size="lg"
									type="button"
									className="border-slate-200 hover:bg-slate-50 hover:text-slate-900"
									onClick={(e) => {
										e.preventDefault();
										handleAddQuestion();
									}}
								>
									<PlusCircle className="h-5 w-5 mr-2" />
									Nova Questão
								</Button>
								<Button 
									size="lg" 
									type="button"
									variant="outline"
									className="border-[#133D86] text-[#133D86] hover:bg-[#133D86] hover:text-white"
									disabled={!selectedClass || !selectedSubject || !titulo || isLoading}
									onClick={(e) => {
										e.preventDefault();
										handleSubmit(e, QuizVisibility.DRAFT);
									}}
								>
									<Edit className="h-5 w-5 mr-2" />
									{isLoading ? 'Salvando...' : (isEditMode ? 'Salvar como Rascunho' : 'Salvar Rascunho')}
								</Button>
								<Button 
									size="lg" 
									type="submit" 
									className="bg-[#133D86] hover:bg-[#0e2a5c] text-white"
									disabled={!selectedClass || !selectedSubject || !titulo || isLoading}
									onClick={(e) => {
										e.preventDefault();
										handleSubmit(e, QuizVisibility.PUBLIC);
									}}
								>
									<Save className="h-5 w-5 mr-2" />
									{isLoading ? (isEditMode ? 'Atualizando...' : 'Publicando...') : (isEditMode ? 'Atualizar e Publicar' : 'Publicar Simulado')}
								</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
