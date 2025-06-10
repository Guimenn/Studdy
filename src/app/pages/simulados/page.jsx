'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, Search, Calculator, Atom, Microscope, Globe, History, BookText, Brain, BookMarked, BookOpen, LineChart, TestTube, Dna, Landmark, BookOpenCheck, BookOpenText, BookOpenIcon, BookOpenCheckIcon, CircleCheck, CircleDashed, CircleOff, Ban, Eye, Edit, Archive, HelpCircle, Clock, CheckCircle, PlayCircle, Play, Users, AlertTriangle, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { QuizVisibility, getVisibilityText, getVisibilityColor, getVisibilityIcon } from './enums/QuizVisibility';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";

const statusVisibility = [
    { id: 'todos', label: 'Todos' },
    { id: QuizVisibility.DRAFT, label: 'Rascunho' },
    { id: QuizVisibility.PUBLIC, label: 'Público' },
    { id: QuizVisibility.ARCHIVED, label: 'Arquivado' }
];

const statusFilters = [
    { id: 'todos', label: 'Todos', icon: BookOpen },
    { id: 'disponivel', label: 'Disponível', icon: PlayCircle },
    { id: 'em_progresso', label: 'Em Progresso', icon: Clock },
    { id: 'concluido', label: 'Concluído', icon: CheckCircle }
];

export default function SimuladosPage() {
    const { userRole } = useUser();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [selectedSimulado, setSelectedSimulado] = useState(null);
    const [abandonedAttempt, setAbandonedAttempt] = useState(null);

    // Função para buscar simulados do aluno
    const fetchSimulados = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }
            const response = await fetch('http://localhost:3000/student/quizzes', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao carregar simulados');
            }
            const responseData = await response.json();
            setQuiz(responseData.quizzes || []);
            
            // Verificar se existe um attempt abandonado (in_progress)
            const quizzesWithAttempts = responseData.quizzes || [];
            const abandonedQuiz = quizzesWithAttempts.find(q => q.attempt_id && q.status === 'in_progress');
            if (abandonedQuiz) {
                setAbandonedAttempt(abandonedQuiz);
            }
        } catch (error) {
            console.error('Erro ao carregar simulados:', error);
            toast.error(error.message || 'Erro ao carregar simulados');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Só busca simulados se não for professor
        if (userRole !== 'teacher') {
            fetchSimulados();
        }
    }, [userRole]);

    if (userRole === 'teacher') {
        // Opcional: pode mostrar um aviso ou redirecionar para /simulados/teacher
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
                    <h1 className="text-2xl font-bold text-[#133D86] mb-2">Acesse o painel do professor</h1>
                    <p className="text-gray-600 mb-4">Vá para <b>/simulados/teacher</b> para gerenciar simulados.</p>
                </div>
            </div>
        );
    }

    // Layout de simulados para alunos
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Simulados Educacionais</h1>
                        <p className="mt-2 text-center text-gray-600">Pratique com Simulados de várias disciplinas</p>
                    </div>

                    {/* Card de Simulado Abandonado */}
                    {abandonedAttempt && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Simulado Abandonado
                            </h2>
                            <Card className="border-2 border-red-200 bg-red-50 hover:shadow-xl transition-all duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 rounded-xl bg-red-500 text-white shadow-md">
                                            <AlertTriangle className="h-6 w-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                                                Abandonado
                                            </span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                                        {abandonedAttempt.title}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Você tem um simulado em andamento que foi interrompido. Continue de onde parou.
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{abandonedAttempt.duration_minutes} min</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{abandonedAttempt.subject?.name}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-3">
                                        <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-800 font-medium">
                                                ⚠️ Este simulado foi iniciado mas não foi finalizado. Clique em "Continuar" para retomar de onde parou.
                                            </p>
                                        </div>
                                        <Button
                                            className="w-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-4"
                                            onClick={() => {
                                                router.push(`/pages/simulados/${abandonedAttempt.attempt_id}/continue`);
                                            }}
                                        >
                                            Continuar Simulado
                                            <Play className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="mb-8 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Buscar Simulados..."
                                className="pl-10 w-full h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Filtros de Status */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Filter className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Filtrar por status:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {statusFilters.map((filter) => {
                                    const IconComponent = filter.icon;
                                    
                                    // Calcular contagem para cada filtro
                                     const getFilterCount = (filterId) => {
                                         return quiz.filter(q => {
                                             if (filterId === 'todos') return true;
                                             if (filterId === 'disponivel') {
                                                 return q.status === 'not_started';
                                             }
                                             if (filterId === 'em_progresso') {
                                                 return q.status === 'in_progress' && q.attempt_id;
                                             }
                                             if (filterId === 'concluido') {
                                                 return q.status === 'completed';
                                             }
                                             return true;
                                         }).length;
                                     };
                                    
                                    const count = getFilterCount(filter.id);
                                    
                                    return (
                                        <Button
                                            key={filter.id}
                                            variant={statusFilter === filter.id ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setStatusFilter(filter.id)}
                                            className={`flex items-center gap-2 transition-all duration-200 ${
                                                statusFilter === filter.id 
                                                    ? 'bg-[#133D86] text-white hover:bg-[#0f2d6b]' 
                                                    : 'hover:bg-gray-50 border-gray-200'
                                            }`}
                                        >
                                            <IconComponent className="h-4 w-4" />
                                            {filter.label}
                                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                                                statusFilter === filter.id 
                                                    ? 'bg-white/20 text-white' 
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {count}
                                            </span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <PageLoader />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {quiz
                                .filter(q => q.title?.toLowerCase().includes(searchTerm.toLowerCase()))
                                .filter(q => {
                                    // Filtro por status
                                    if (statusFilter === 'todos') return true;
                                    
                                    if (statusFilter === 'disponivel') {
                                        return q.status === 'not_started';
                                    }
                                    
                                    if (statusFilter === 'em_progresso') {
                                        return q.status === 'in_progress' && q.attempt_id;
                                    }
                                    
                                    if (statusFilter === 'concluido') {
                                        return q.status === 'completed';
                                    }
                                    
                                    return true;
                                })
                                .map((simulado) => (
                                <Card
                                    key={simulado.id}
                                    className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white h-[320px] w-full group overflow-hidden rounded-xl"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`p-3 rounded-xl bg-[#133D86] text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    simulado.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : (simulado.status === 'in_progress' && simulado.attempt_id)
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {simulado.status === 'completed'
                                                        ? 'Concluído'
                                                        : (simulado.status === 'in_progress' && simulado.attempt_id)
                                                        ? 'Em Progresso'
                                                        : 'Disponível'}
                                                </span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#133D86] transition-colors duration-300">
                                            {simulado.title}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 line-clamp-2 h-[48px] mb-3">
                                            {simulado.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{simulado.duration_minutes} min</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{simulado.subject?.name}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-4">
                                            <Button
                                                className={`w-full ${
                                                    simulado.status === 'completed'
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : (simulado.status === 'in_progress' && simulado.attempt_id)
                                                        ? 'bg-orange-500 hover:bg-orange-600'
                                                        : 'bg-[#133D86] hover:bg-[#0e2a5c]'
                                                    } text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-4`}
                                                onClick={() => {
                                                    if (simulado.status === 'completed') {
                                                        router.push(`/pages/simulados/${simulado.attempt_id}/result`);
                                                    } else if (simulado.status === 'in_progress' && simulado.attempt_id) {
                                                        router.push(`/pages/simulados/${simulado.attempt_id}/continue`);
                                                    } else {
                                                        setSelectedSimulado(simulado);
                                                        setIsStartModalOpen(true);
                                                    }
                                                }}
                                            >
                                                {simulado.status === 'completed'
                                                    ? 'Ver Resultados'
                                                    : (simulado.status === 'in_progress' && simulado.attempt_id)
                                                    ? 'Continuar Simulado'
                                                    : 'Iniciar Simulado'}
                                                {simulado.status === 'completed'
                                                    ? <CheckCircle className="h-5 w-5" />
                                                    : (simulado.status === 'in_progress' && simulado.attempt_id)
                                                    ? <Play className="h-5 w-5" />
                                                    : <Play className="h-5 w-5" />}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Confirmação para Iniciar Simulado */}
            <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Iniciar Simulado</DialogTitle>
                        <DialogDescription>
                            Você está prestes a iniciar o simulado "{selectedSimulado?.title}". 
                            Certifique-se de que tem tempo suficiente para completá-lo.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedSimulado && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Duração:</span>
                                    <span>{selectedSimulado.duration_minutes} minutos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Matéria:</span>
                                    <span>{selectedSimulado.subject?.name}</span>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <HelpCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div className="text-sm text-yellow-800">
                                        <p className="font-medium mb-1">Instruções importantes:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>O tempo começará a contar assim que você iniciar</li>
                                            <li>Certifique-se de ter uma conexão estável com a internet</li>
                                            <li>Não feche a aba do navegador durante o simulado</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsStartModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={() => {
                                if (!selectedSimulado) return;
                                
                                setIsStartModalOpen(false);
                                
                                // Redirecionar para a página [id] onde o start será feito
                                router.push(`/pages/simulados/${selectedSimulado.id}`);
                            }}
                            className="bg-[#133D86] hover:bg-[#0e2a5c]"
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar Agora
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}