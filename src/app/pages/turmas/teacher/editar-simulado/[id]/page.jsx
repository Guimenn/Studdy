'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { QuizVisibility } from '../../enums/QuizVisibility';
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

export default function EditarSimuladoPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id;

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [icone, setIcone] = useState('Calculator');
    const [duracao_minutos, setDuracaoMinutos] = useState(60);
    const [visibilidade, setVisibilidade] = useState(QuizVisibility.PUBLIC);
    const [questions, setQuestions] = useState([]);
    const [loadingSimulado, setLoadingSimulado] = useState(true);
    const [simulado, setSimulado] = useState(null);

    // Monitorar mudanças no estado simulado
    useEffect(() => {
        console.log('Estado simulado atualizado:', simulado);
    }, [simulado]);

    // Carregar dados do simulado
    useEffect(() => {
        const loadSimuladoData = async () => {
            setLoadingSimulado(true);
            try {
                const token = Cookies.get('token');
                if (!token) {
                    toast.error('Token não encontrado');
                    return;
                }

                console.log('Carregando simulado com ID:', quizId);
                const response = await fetch(`https://api-studdy.onrender.com/quiz/${quizId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Erro na resposta:', errorData);
                    throw new Error(errorData.error || 'Erro ao carregar simulado');
                }

                const simuladoData = await response.json();
                console.log('Dados do simulado carregados:', simuladoData);

                if (!simuladoData || !simuladoData.class || !simuladoData.subject) {
                    console.error('Dados do simulado incompletos:', simuladoData);
                    throw new Error('Dados do simulado incompletos');
                }

                // Preencher os campos com os dados do simulado
                setTitulo(simuladoData.title || '');
                setDescricao(simuladoData.description || '');
                setIcone(simuladoData.icon || 'Calculator');
                setDuracaoMinutos(simuladoData.duration_minutes || 60);
                setVisibilidade(simuladoData.visibility || QuizVisibility.DRAFT);

                // Carregar questões se existirem
                if (simuladoData.questions && simuladoData.questions.length > 0) {
                    const formattedQuestions = simuladoData.questions.map((q) => {
                        console.log('Formatando questão:', q);
                        return {
                            id: q.id,
                            statement: q.statement,
                            points: parseInt(q.points),
                            alternatives: q.alternatives.map((alt) => ({
                                id: alt.id,
                                text: alt.response,
                                isCorrect: alt.correct_alternative
                            }))
                        };
                    });
                    console.log('Questões formatadas:', formattedQuestions);
                    setQuestions(formattedQuestions);
                }

                // Definir o estado simulado com os dados completos
                const simuladoCompleto = {
                    ...simuladoData,
                    class: simuladoData.class,
                    subject: simuladoData.subject
                };
                console.log('Definindo estado simulado com:', simuladoCompleto);
                setSimulado(simuladoCompleto);

                toast.success('Simulado carregado com sucesso!');

            } catch (error) {
                console.error('Erro ao carregar simulado:', error);
                toast.error(error.message || 'Erro ao carregar dados do simulado');
                router.push('/pages/turmas/teacher');
            } finally {
                setLoadingSimulado(false);
            }
        };

        if (quizId) {
            loadSimuladoData();
        }
    }, [quizId, router]);

    const handleAddQuestion = () => {
        setQuestions(prev => [...prev, {
            id: Date.now(),
            statement: '',
            points: 1,
            alternatives: []
        }]);
    };

    const handleDeleteQuestion = (questionId) => {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
    };

    const handleAlternativesGenerated = (data) => {
        const { questionId, question, correct_answer, alternativas } = data;
        console.log('Gerando alternativas:', data);
        
        setQuestions(prevQuestions => {
            const questionIndex = prevQuestions.findIndex(q => q.id === questionId);
            const newQuestion = {
                id: questionId,
                statement: question,
                points: 1,
                alternatives: [
                    { id: Date.now(), text: correct_answer, isCorrect: true },
                    { id: Date.now() + 1, text: alternativas.alternativa1, isCorrect: false },
                    { id: Date.now() + 2, text: alternativas.alternativa2, isCorrect: false },
                    { id: Date.now() + 3, text: alternativas.alternativa3, isCorrect: false }
                ]
            };

            if (questionIndex === -1) {
                return [...prevQuestions, newQuestion];
            }

            const updatedQuestions = [...prevQuestions];
            updatedQuestions[questionIndex] = newQuestion;
            return updatedQuestions;
        });
    };

    const handleQuestionChange = (updatedQuestion) => {
        setQuestions(prev => prev.map(q => 
            q.id === updatedQuestion.id ? updatedQuestion : q
        ));
    };

    const handleSubmit = async (e, visibility = QuizVisibility.PUBLIC) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            if (!simulado || !simulado.class || !simulado.subject) {
                console.error('Estado simulado atual:', simulado);
                toast.error('Dados do simulado não carregados corretamente');
                return;
            }

            const payload = {
                title: titulo,
                description: descricao,
                icon: icone,
                duration_minutes: duracao_minutos,
                visibility: visibility,
                max_attempt: 1,
                questions: questions.map((question) => ({
                    statement: question.statement,
                    points: parseInt(question.points),
                    alternatives: question.alternatives.map((alternative) => ({
                        response: alternative.text || alternative.response,
                        correct_alternative: Boolean(alternative.isCorrect || alternative.correct_alternative)
                    }))
                }))
            };
            console.log('Dados a serem enviados:', payload);
            console.log('URL da requisição:', `https://api-studdy.onrender.com/teacher/quiz/${quizId}`);

            const response = await fetch(`https://api-studdy.onrender.com/teacher/quiz/${quizId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
           if (!response.ok) {
                let errorData;
                try {
                    const responseText = await response.text();
                    console.log('Resposta do servidor:', responseText);
                    errorData = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('Erro ao fazer parse da resposta:', parseError);
                    errorData = { message: 'Erro desconhecido do servidor' };
                }
                console.error('Erro na resposta:', errorData);
                throw new Error('Erro ao atualizar simulado');
            }

            toast.success('Simulado atualizado com sucesso!');
            router.push(`/pages/turmas/teacher/classes/${simulado.class.id}`);
        } catch (error) {
            console.error('Erro ao atualizar simulado:', error);
            toast.error('Erro ao atualizar simulado');
        }
    };

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
                        Editar Simulado
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Editando simulado • Você pode salvar como rascunho ou publicar
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-[#133D86] mb-6">Informações do Simulado</h2>
                        
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Título do Simulado</label>
                                <Input
                                    type="text"
                                    placeholder="Ex: Simulado de Programação Web"
                                    className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                    value={titulo}
                                    onChange={(e) => {
                                        console.log('Alterando título para:', e.target.value);
                                        setTitulo(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Descrição</label>
                                <Input
                                    type="text"
                                    placeholder="Ex: Questões sobre HTML, CSS e JavaScript"
                                    className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                    value={descricao}
                                    onChange={(e) => {
                                        console.log('Alterando descrição para:', e.target.value);
                                        setDescricao(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Duração (minutos)</label>
                                <Input
                                    type="number"
                                    placeholder="Ex: 60"
                                    className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                    value={duracao_minutos}
                                    onChange={(e) => {
                                        console.log('Alterando duração para:', e.target.value);
                                        setDuracaoMinutos(parseInt(e.target.value));
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg">
                        {questions.map((question, index) => {
                            
                            return (
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
                            );
                        })}
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
                                    onClick={handleAddQuestion}
                                >
                                    <PlusCircle className="h-5 w-5 mr-2" />
                                    Nova Questão
                                </Button>
                                <Button 
                                    size="lg" 
                                    type="button"
                                    variant="outline"
                                    className="border-[#133D86] text-[#133D86] hover:bg-[#133D86] hover:text-white"
                                    onClick={(e) => handleSubmit(e, QuizVisibility.DRAFT)}
                                >
                                    <Edit className="h-5 w-5 mr-2" />
                                    Salvar como Rascunho
                                </Button>
                                <Button 
                                    size="lg" 
                                    type="submit" 
                                    className="bg-[#133D86] hover:bg-[#0e2a5c] text-white"
                                    onClick={(e) => handleSubmit(e, QuizVisibility.PUBLIC)}
                                >
                                    <Save className="h-5 w-5 mr-2" />
                                    Atualizar e Publicar
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}