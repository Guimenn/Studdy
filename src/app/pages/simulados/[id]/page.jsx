'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Edit } from "lucide-react";
import Link from "next/link";
import { handleUnexpectedError, handleFetchError, handleApiError } from "@/utils/errorHandler";
import Image from "next/image";
import { QuizVisibility } from "../enums/QuizVisibility";
import { useUser } from "@/contexts/UserContext";
import Cookies from "js-cookie";
import { toast } from "sonner";


export default function SimuladoQuestoesPage() {
    const params = useParams();
    const router = useRouter();
    const { userRole } = useUser();
    const [simulado, setSimulado] = useState(null);
    const [questoes, setQuestoes] = useState([]);
    const [respostasUsuario, setRespostasUsuario] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [mostrarResultado, setMostrarResultado] = useState(false);
    const [attempt, setAttempt] = useState(null);
    const [hasAttemptId, setHasAttemptId] = useState(false);

    // Estado para indicar se o simulado já foi concluído
    const [concluido, setConcluido] = useState(false);

    // Verificar se o usuário é professor
    const isTeacher = userRole === 'teacher';

    // Função para embaralhar array (Fisher-Yates shuffle)
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Função para embaralhar questões e suas alternativas
    const shuffleQuestionsAndAlternatives = (questions) => {
        // Embaralha as questões
        const shuffledQuestions = shuffleArray(questions);
        
        // Para cada questão, embaralha suas alternativas
        return shuffledQuestions.map(question => ({
            ...question,
            alternatives: shuffleArray(question.alternatives)
        }));
    };
    
    // Determinar o modo de visualização baseado no status e papel do usuário
    const getViewMode = () => {
        if (!simulado) return 'start'; // Modo inicial para iniciar simulado
        
        // Se for professor, permite edição independente do status
        if (isTeacher) {
            return 'edit';
        }
        
        switch (simulado.visibility) {
            case QuizVisibility.DRAFT:
                // Draft: não pode ser visualizado por alunos
                return 'restricted';
            case QuizVisibility.PUBLIC:
                // Published: todos podem responder
                return 'answer';
            case QuizVisibility.ARCHIVED:
                // Archived: apenas visualizar resultado
                return 'result';
            default:
                return 'result';
        }
    };
    
    const viewMode = getViewMode();
    const showAnswerStyles = viewMode === 'result' || concluido;
    
    // Função utilitária para buscar dados do quiz atual
    const fetchCurrentQuizData = async () => {
        const token = Cookies.get('token');
        if (!token) return null;

        try {
            const quizzesResponse = await fetch('http://localhost:3000/student/quizzes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Resposta do endpoint /student/quizzes:', quizzesResponse.status);
            if (!quizzesResponse.ok) return null;

            const quizzesData = await quizzesResponse.json();
            
            console.log('Dados completos recebidos:', quizzesData);
            console.log('ID do parâmetro (params.id):', params.id);
            console.log('ID do parâmetro convertido:', parseInt(params.id));
            
            let currentQuiz;
            if (quizzesData.quizzes && Array.isArray(quizzesData.quizzes)) {
                console.log('Array de quizzes:', quizzesData.quizzes.map(q => ({ id: q.id, title: q.title, attempt_id: q.attempt_id, status: q.status })));
                
                // Primeiro, tentar encontrar por attempt_id (para casos de continue)
                currentQuiz = quizzesData.quizzes.find(quiz => quiz.attempt_id === parseInt(params.id));
                
                // Se não encontrar por attempt_id, tentar por quiz.id (para casos normais)
                if (!currentQuiz) {
                    currentQuiz = quizzesData.quizzes.find(quiz => quiz.id === parseInt(params.id));
                    
                    // Se encontrou o quiz por ID, verificar se tem attempt em progresso
                    if (currentQuiz && currentQuiz.status === 'in_progress' && currentQuiz.attempt_id) {
                        console.log('Quiz encontrado com attempt em progresso:', currentQuiz.attempt_id);
                        currentQuiz.hasInProgressAttempt = true;
                        currentQuiz.inProgressAttemptId = currentQuiz.attempt_id;
                    }
                }
                
                console.log('Quiz encontrado:', currentQuiz);
            } else if (quizzesData.data) {
                currentQuiz = quizzesData.data;
                currentQuiz.id = parseInt(params.id);
                console.log('Quiz encontrado em data:', currentQuiz);
            }

            return currentQuiz;
        } catch (error) {
            console.error('Erro ao buscar dados do quiz:', error);
            return null;
        }
    };

    // Função para iniciar um novo simulado
    const iniciarSimulado = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            // Primeiro, verificar se já existe um attempt em progresso
            const currentQuiz = await fetchCurrentQuizData();
            if (!currentQuiz) {
                throw new Error('Erro ao buscar dados do quiz atual');
            }
            
            let data;
            let subjectId;

            if (currentQuiz && currentQuiz.hasInProgressAttempt && currentQuiz.inProgressAttemptId) {
                // Já existe um attempt em progresso, usar ele
                console.log('Attempt em progresso encontrado:', currentQuiz.inProgressAttemptId);
                
                // Usar os dados do attempt em progresso diretamente
                data = {
                    attempt_id: currentQuiz.inProgressAttemptId,
                    started_at: new Date().toISOString(), // Será atualizado com dados reais se necessário
                    status: 'in_progress',
                    quiz: {
                        title: currentQuiz.title,
                        id: parseInt(params.id)
                    },
                    totalAttempts: currentQuiz.attempts_count || 0,
                    maxAttempts: currentQuiz.max_attempts || 1,
                    canStartNewAttempt: false // Já tem um em progresso
                };
                subjectId = currentQuiz.subject?.id;
                
            } else {
                // Não existe attempt em progresso, verificar se pode criar um novo
                console.log('Verificando se pode criar novo attempt para o quiz');
                
                // Só verificar canStartNewAttempt se realmente não há attempt em progresso
                if (currentQuiz && currentQuiz.hasInProgressAttempt === false && !currentQuiz.canStartNewAttempt) {
                    setError('Você já esgotou todas as suas tentativas para este simulado.');
                    return;
                }
                
                // Buscar informações básicas do quiz primeiro para obter o subject_id
                if (simulado?.subject?.id) {
                    subjectId = simulado.subject.id;
                } else {
                    // Se não temos o simulado carregado, precisamos buscar o subject_id
                    const quizInfoResponse = await fetch(`http://localhost:3000/quiz/${params.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (!quizInfoResponse.ok) {
                        throw new Error('Erro ao buscar informações do quiz');
                    }
                    
                    const quizInfo = await quizInfoResponse.json();
                    subjectId = quizInfo.subject?.id;
                    
                    if (!subjectId) {
                        toast.error('Erro: ID do assunto não encontrado');
                        return;
                    }
                }

                // Iniciar novo attempt
                const response = await fetch(`http://localhost:3000/student/subjects/${subjectId}/quizzes/${params.id}/start`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                // Verificar se o usuário já esgotou suas tentativas
                if (response.status === 400) {
                    const errorData = await response.json();
                    if (errorData.message && errorData.message.includes('tentativas')) {
                        setError('Você já esgotou todas as suas tentativas para este simulado.');
                        return;
                    }
                }

                await handleApiError(response, 'iniciar simulado');
                data = await response.json();
            }
            
            // Verificar se é um attempt em progresso ou um novo attempt
            if (currentQuiz && currentQuiz.hasInProgressAttempt) {
                // Para attempt em progresso, precisamos buscar as questões separadamente
                const quizResponse = await fetch(`http://localhost:3000/quiz/${params.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!quizResponse.ok) {
                    throw new Error('Erro ao buscar dados do quiz');
                }
                
                const quizData = await quizResponse.json();
                
                // Atualizar dados do simulado
                const simuladoCompleto = {
                    id: parseInt(params.id),
                    title: data.quiz.title,
                    description: quizData.description,
                    duration_minutes: quizData.duration_minutes,
                    max_points: quizData.max_points,
                    max_attempts: data.maxAttempts || quizData.max_attempts || 1,
                    visibility: simulado?.visibility || QuizVisibility.PUBLIC,
                    subject: simulado?.subject || { id: subjectId },
                    questions: quizData.questions || []
                };
                
                setSimulado(simuladoCompleto);
                
                // Usar as questões do quiz
                const questoesParaEmbaralhar = quizData.questions || [];
                
                // Embaralhar questões e suas alternativas
                const questoesEmbaralhadas = shuffleQuestionsAndAlternatives(questoesParaEmbaralhar);
                
                setQuestoes(questoesEmbaralhadas);
                
            } else {
                // Para novo attempt, usar os dados que vêm da resposta
                const simuladoCompleto = {
                    id: data.id || parseInt(params.id),
                    title: data.title,
                    description: data.description,
                    duration_minutes: data.duration_minutes,
                    max_points: data.max_points,
                    max_attempts: data.max_attempt || simulado?.max_attempts || 1,
                    visibility: simulado?.visibility || QuizVisibility.PUBLIC,
                    subject: simulado?.subject || { id: subjectId },
                    questions: data.questions || []
                };
                
                setSimulado(simuladoCompleto);
                
                // Usar as questões que vêm da resposta da API
                const questoesParaEmbaralhar = data.questions || [];
                
                // Embaralhar questões e suas alternativas
                const questoesEmbaralhadas = shuffleQuestionsAndAlternatives(questoesParaEmbaralhar);
                
                setQuestoes(questoesEmbaralhadas);
            }
            
            // Salvar dados do attempt - o attempt_id vem diretamente na resposta
            setAttempt({ id: data.attempt_id });
            setHasAttemptId(true);
            toast.success('Simulado iniciado com sucesso!');
            
        } catch (error) {
            handleFetchError(error, 'iniciar simulado');
            setError('Erro ao carregar questões do simulado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Effect para inicializar o estado da página
    useEffect(() => {
        setIsLoading(false);
    }, [params.id]);
    


    const handleRespostaChange = (questaoId, alternativa) => {
        if (viewMode !== 'answer' || concluido) return; // Só permite alteração no modo resposta e não concluído
        setRespostasUsuario(prev => ({
            ...prev,
            [questaoId]: alternativa
        }));
    };



    if (isLoading) {
        return (
            <div className="container mx-auto py-10 text-center">
                <span className="text-gray-600">Carregando...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 text-center text-red-500">
                {error}
            </div>
        );
    }

    // Se o modo for 'restricted', mostrar mensagem de acesso negado
    if (viewMode === 'restricted') {
        return (
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/pages/simulados" className="flex items-center text-blue-600 hover:underline font-medium">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar para Simulados
                    </Link>
                </div>
                <Card className="shadow-lg rounded-2xl border border-red-200">
                    <CardContent className="text-center py-10">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Acesso Restrito</h2>
                        <p className="text-gray-600">
                            Este simulado está em modo rascunho e não está disponível para estudantes.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const status = (() => {
        switch (simulado?.visibility) {
            case QuizVisibility.DRAFT:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Rascunho</span>;
            case QuizVisibility.PUBLIC:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Publicado</span>;
            case QuizVisibility.ARCHIVED:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Arquivado</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Desconhecido</span>;
        }
    })();

    const onSubmit = async (formData) => {
        setIsLoading(true);
        setError(null);

        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            // Transformar o objeto respostasUsuario no formato esperado
            const responses = Object.entries(respostasUsuario).map(([questionId, markedAlternativeId]) => ({
                questionId: parseInt(questionId),
                markedAlternativeId: parseInt(markedAlternativeId)
            }));

            const dataToSend = {
                responses: responses
            };

            console.log('Enviando dados das respostas:', dataToSend);
            console.log('Attempt ID:', attempt.id);

            // Enviar as respostas
            const submitResponse = await fetch(`http://localhost:3000/student/attempt/${attempt.id}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const submitData = await submitResponse.json();
            console.log('Resposta da tentativa:', submitData);

            // Marcar o attempt como completed
            await fetch(`http://localhost:3000/student/attempt/${attempt.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'completed'
                }),
            });

            setConcluido(true); // Marcar como concluído
            toast.success('Simulado respondido com sucesso!');
            console.log('Attempt marcado como completed');
            
            // Redirecionar para a página de resultado
            router.push(`/pages/simulados/${attempt.id}/result`);
            
        } catch (error) {
            handleFetchError(error, 'responder simulado');
            setError('Erro ao responder simulado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    


    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex justify-between items-center">
                <Link href="/pages/simulados" className="flex items-center text-blue-600 hover:underline font-medium">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para Simulados
                </Link>
                
                {isTeacher && (
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => router.push(`/pages/simulados/editar-simulado/${params.id}`)}
                    >
                        <Edit className="h-4 w-4" />
                        Editar Simulado
                    </Button>
                )}
            </div>

            <Card className="mb-6 shadow-lg rounded-2xl border border-gray-200">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl font-bold text-gray-800 flex-1">
                            {simulado?.title.toUpperCase()}
                        </CardTitle>
                    </div>
                    <div className="text-sm text-gray-700 font-semibold flex flex-col lg:flex-row md:flex-row md:justify-between lg:justify-between gap-2 align-center mt-4 ">
                        <p>Tentativas máximas: {simulado?.max_attempts}</p>
                        <p>Duração: {simulado?.duration_minutes} minutos</p>
                        <p>Pontos máximos: {simulado?.max_points}</p>
                        <p>Status: {status}</p>
                    </div>
                    {simulado?.description && (
                        <p className="mt-4 text-gray-600">{simulado.description}</p>
                    )}
                </CardHeader>
            </Card>



            {/* Botão para iniciar simulado quando não há dados carregados */}
            {(viewMode === 'start' || (!hasAttemptId && !isTeacher && viewMode === 'answer')) && (
                <Card className="mb-6 shadow-lg rounded-2xl border border-blue-200">
                    <CardContent className="text-center py-10">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4">Pronto para começar?</h2>
                        <p className="text-gray-600 mb-6">
                            Clique no botão abaixo para iniciar o simulado.
                        </p>
                        <Button
                            onClick={iniciarSimulado}
                            disabled={isLoading}
                            className="bg-[#133d86] hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                        >
                            {isLoading ? 'Iniciando...' : 'Iniciar Simulado'}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Questões aparecem quando há attemptId ou para professores */}
            {(hasAttemptId || (isTeacher && simulado?.questions?.length > 0)) && (hasAttemptId ? questoes : simulado.questions).map((questao, index) => (
                <Card key={questao.id} className="mb-6 shadow-md border border-gray-200 rounded-xl">
                    <CardHeader className="mb-2">
                        <CardTitle className="text-xl mb-4 font-bold flex justify-between items-center ">
                            Questão {index + 1}
                            <span className="text-sm text-gray-500">Pontos: {questao.points}</span>
                        </CardTitle>
                        <p className="text-gray-800">{questao.statement}</p>

                        {questao.image && (
                            <div className="relative w-full h-64 my-4 rounded-lg overflow-hidden ">
                                <Image
                                    src={questao.image}
                                    alt={`Imagem da questão ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="rounded-lg"
                                />
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {questao.alternatives.map((alternativa) => {
                                // Define a classe para alternativas corretas e para a seleção do usuário
                                const isSelected = respostasUsuario[questao.id] === alternativa.id;
                                const isCorrect = alternativa.correct_alternative;

                                // Se concluído ou expirado, mostrar corretas em verde e demais neutras
                                const showAnswerStyles = (concluido || simulado?.visibility !== QuizVisibility.PUBLIC);

                                let alternativeClass = 'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ';



                                if (showAnswerStyles) {
                                    if (isCorrect) {
                                        alternativeClass += ' border-green-600 bg-green-100 cursor-default';

                                    } else if (isSelected) {
                                        alternativeClass += ' border-red-600 bg-red-100 cursor-default';

                                    } else {
                                        alternativeClass += ' border-gray-300 bg-white cursor-default';
                                    }
                                } else {
                                    alternativeClass += isSelected
                                        ? 'border-[#133d86] bg-blue-100'
                                        : 'border-gray-300 hover:bg-gray-50';
                                }

                                return (
                                    <div
                                        key={alternativa.id}
                                        className={alternativeClass}
                                        onClick={() => handleRespostaChange(questao.id, alternativa.id)}
                                    >
                                        {viewMode === 'answer' ? (
                                            <input
                                                type="radio"
                                                id={`questao-${questao.id}-${alternativa.id}`}
                                                name={`questao-${questao.id}`}
                                                value={alternativa.id}
                                                checked={isSelected}
                                                onChange={() => handleRespostaChange(questao.id, alternativa.id)}
                                                className={`mt-1 h-4 w-4 accent-blue-600`}
                                                disabled={concluido}
                                            />
                                        ) : viewMode === 'result' ? (
                                            <div className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                                isCorrect ? 'border-green-600 bg-green-100' : 
                                                isSelected ? 'border-red-600 bg-red-100' : 'border-gray-300'
                                            }`}>
                                                {(isCorrect || isSelected) && (
                                                    <div className={`h-2 w-2 rounded-full ${
                                                        isCorrect ? 'bg-green-600' : 'bg-red-600'
                                                    }`} />
                                                )}
                                            </div>
                                        ) : null}
                                        <label htmlFor={`questao-${questao.id}-${alternativa.id}`} className="text-sm text-gray-800 leading-5 select-none">
                                            <strong>{String.fromCharCode(65 + questao.alternatives.findIndex(alt => alt.id === alternativa.id))})</strong> {alternativa.response}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Botão Finalizar aparece no modo 'answer', não concluído e com attemptId */}
            {(viewMode === 'answer' && !concluido && hasAttemptId) && (
                <div className="flex justify-end mt-10">
                    <Button
                        variant="default"
                        size="lg"
                        className={`w-full py-6 text-base font-bold rounded-xl transition 
                            ${Object.keys(respostasUsuario).length !== (hasAttemptId ? questoes : simulado.questions).length
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#133d86] hover:bg-blue-600'}
                        `}
                        disabled={Object.keys(respostasUsuario).length !== (hasAttemptId ? questoes : simulado.questions).length}
                        onClick={onSubmit}
                    >
                        <Send className="h-5 w-5 mr-2" />
                        Finalizar Simulado
                    </Button>
                </div>
            )}
            

            
            {/* Mensagem informativa para modo resultado */}
            {viewMode === 'result' && (hasAttemptId || (isTeacher && simulado?.questions?.length > 0)) && (
                <div className="text-center mt-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700 font-medium">
                        {isTeacher 
                            ? 'Visualização do professor: Este simulado está arquivado.' 
                            : 'Este simulado está arquivado. Você está visualizando apenas o resultado.'}
                    </p>
                </div>
            )}
            
            {/* Mensagem informativa para usuários que concluíram */}
            {(concluido && viewMode === 'answer' && hasAttemptId) && (
                <div className="text-center mt-10 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-700 font-medium">
                        ✅ Simulado concluído! As respostas corretas estão destacadas em verde.
                    </p>
                </div>
            )}
            
            {/* Mensagem informativa para professores visualizando questões */}
            {isTeacher && simulado?.questions?.length > 0 && !hasAttemptId && (
                <div className="text-center mt-10 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-700 font-medium">
                        👨‍🏫 Visualização do Professor: Você está vendo as questões do simulado.
                    </p>
                </div>
            )}
        </div>
    );
}