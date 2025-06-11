'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Search, Plus, Calculator, Atom, Pen, ScrollText, Trash2, Users, BookOpen, BarChart2, Filter, PlayCircle, Clock, CheckCircle, Eye, BarChart3, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { QuizVisibility, getVisibilityText, getVisibilityColor } from '../../enums/QuizVisibility';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizResults from './quiz-results';
import ClassStatistics from "./class-statistics";
import StudentPerformance from './student-performance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";

const statusFilters = [
    { id: 'todos', label: 'Todos', icon: BookOpen },
    { id: 'public', label: 'Público', icon: Eye },
    { id: 'draft', label: 'Rascunho', icon: Pen }
];
const SHIFT_OPTIONS = [
    { value: 'Morning', label: 'Manhã' },
    { value: 'Afternoon', label: 'Tarde' },
    { value: 'Night', label: 'Noite' }
]

export default function ClassDetailsClient({ classId }) {
    const router = useRouter();
    const { userRole } = useUser();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [quizToDelete, setQuizToDelete] = useState(null);
    const [activeTab, setActiveTab] = useState("simulados");
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userRole !== 'teacher') {
            router.push('/pages/simulados');
            return;
        }
        fetchClassData();
    }, [userRole, classId]);

    const fetchClassData = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch(`https://api-studdy.onrender.com/teacher/classes/${classId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar dados da turma');
            }

            const data = await response.json();
            console.log('Dados da turma:', data); // Para debug
            setClassData(data);
        } catch (error) {
            console.error('Erro ao carregar dados da turma:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getIconComponent = (iconName) => {
        switch (iconName) {
            case 'Calculator':
                return <Calculator className="h-6 w-6" />;
            case 'Atom':
                return <Atom className="h-6 w-6" />;
            case 'Pen':
                return <Pen className="h-6 w-6" />;
            case 'ScrollText':
                return <ScrollText className="h-6 w-6" />;
            default:
                return <Calculator className="h-6 w-6" />;
        }
    };

    const filterItems = (items) => {
        if (!items) return [];
        return items.filter(item => {
            const matchesSearch = (item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase()));
            
            let matchesStatus = true;
            if (statusFilter === 'todos') {
                matchesStatus = true;
            } else if (statusFilter === 'public') {
                matchesStatus = item.visibility === 'public';
            } else if (statusFilter === 'draft') {
                matchesStatus = item.visibility === 'draft';

            }
            
            return matchesSearch && matchesStatus;
        });
    };

    const handleDeleteQuiz = async (quiz) => {
        toast.promise(
            (async () => {
                const token = Cookies.get('token');
                if (!token) {
                    throw new Error('Token não encontrado');
                }

                const response = await fetch(`https://api-studdy.onrender.com/teacher/quiz/${quiz.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erro ao deletar simulado');
                }

                await fetchClassData();
                return 'Simulado deletado com sucesso';
            })(),
            {
                loading: 'Deletando simulado...',
                success: (message) => message,
                error: (error) => error.message || 'Erro ao deletar simulado'
            }
        );
        setQuizToDelete(null);
    };

    if (loading) return <PageLoader />;
    if (!classData) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">{classData.name}</h1>
                        <p className="mt-2 text-center text-gray-600">{classData.course} • {classData.shift === 'Morning' ? 'Manhã' : classData.shift === 'Afternoon' ? 'Tarde' : 'Noite'}</p>
                    </div>

                    {selectedQuiz ? (
                        <div className="space-y-4">
                            <Button
                                variant="outline"
                                className="mb-4"
                                onClick={() => setSelectedQuiz(null)}
                            >
                                Voltar para Simulados
                            </Button>
                            <QuizResults classId={classId} quizId={selectedQuiz.id} />
                        </div>
                    ) : (
                        <Tabs defaultValue="simulados" className="w-full" onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="simulados" className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Simulados
                                </TabsTrigger>
                                <TabsTrigger value="desempenho" className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Desempenho
                                </TabsTrigger>
                                <TabsTrigger value="informacoes" className="flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    Informações
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="simulados">
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
                                                    if (!classData?.quizzes) return 0;
                                                    return classData.quizzes.filter(q => {
                                                        if (filterId === 'todos') return true;
                                                        if (filterId === 'public') {
                                                            return q.visibility === 'public';
                                                        }
                                                        if (filterId === 'draft') {
                                                            return q.visibility === 'draft';
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
                                                                ? 'bg-[#133D86] hover:bg-[#0e2a5c] text-white shadow-md' 
                                                                : 'hover:bg-gray-50 hover:border-[#133D86] hover:text-[#133D86]'
                                                        }`}
                                                    >
                                                        <IconComponent className="h-4 w-4" />
                                                        <span>{filter.label}</span>
                                                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
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

                                <div className="mb-6 flex gap-4">
                                    <Button
                                        className="bg-[#133D86] hover:bg-[#0e2a5c] text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium flex items-center gap-2"
                                        onClick={() => router.push(`/pages/turmas/teacher/criar-simulados?classId=${classId}`)}
                                    >
                                        <Plus className="h-5 w-5" />
                                        Criar Novo Simulado
                                    </Button>
                                    <Button
                                        className="bg-[#133D86] hover:bg-[#0e2a5c] text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium flex items-center gap-2"
                                        onClick={() => router.push(`/pages/turmas/teacher/criar-resumos?classId=${classId}`)}
                                    >
                                        <Plus className="h-5 w-5" />
                                        Criar Novo Resumo
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filterItems(classData.quizzes).map((quiz) => (
                                        <Card
                                            key={quiz.id}
                                            className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white group overflow-hidden rounded-xl"
                                        >
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="p-3 rounded-xl bg-[#133D86] text-white group-hover:scale-110 transition-transform duration-300 shadow-md">
                                                        {getIconComponent(quiz.icon)}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setQuizToDelete(quiz)}
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                                <CardTitle className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#133D86] transition-colors duration-300">
                                                    {quiz.title}
                                                </CardTitle>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {quiz.description}
                                                </p>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-sm text-gray-500">
                                                        Duração: {quiz.duration_minutes} min
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVisibilityColor(quiz.visibility)}`}>
                                                        {getVisibilityText(quiz.visibility)}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        className="flex-1 bg-[#133D86] hover:bg-[#0e2a5c] text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-3 py-4"
                                                        onClick={() => router.push(`/pages/turmas/teacher/editar-simulado/${quiz.id}`)}
                                                    >
                                                        Gerenciar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2"
                                                        onClick={() => setSelectedQuiz(quiz)}
                                                    >
                                                        <BarChart2 className="h-4 w-4" />
                                                        Resultados
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="desempenho">
                                <StudentPerformance classId={classId} />
                            </TabsContent>

                            <TabsContent value="informacoes">
                                <div className="space-y-8">
                                    <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-5 w-5" />
                                                    <CardTitle>Informações da Turma</CardTitle>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-8">
                                                {/* Detalhes da Turma */}
                                            <div>
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                        <Info className="h-5 w-5 text-[#133D86]" />
                                                        Detalhes da Turma
                                                    </h3>
                                                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                                        <Table>
                                                            <TableBody>
                                                                <TableRow className="hover:bg-gray-50/50 border-b border-gray-100">
                                                                    <TableCell className="font-medium w-1/3 bg-gray-50/80 text-gray-700 py-4 px-6">Nome</TableCell>
                                                                    <TableCell className="text-gray-600 py-4 px-6">{classData?.name || 'Não informado'}</TableCell>
                                                                </TableRow>
                                                                <TableRow className="hover:bg-gray-50/50">
                                                                    <TableCell className="font-medium bg-gray-50/80 text-gray-700 py-4 px-6">Curso</TableCell>
                                                                    <TableCell className="text-gray-600 py-4 px-6">{classData?.course || 'Não informado'}</TableCell>
                                                                </TableRow>
                                                                <TableRow className="hover:bg-gray-50/50">
                                                                    <TableCell className="font-medium bg-gray-50/80 text-gray-700 py-4 px-6">Turno</TableCell>
                                                                    <TableCell className="text-gray-600 py-4 px-6">{classData?.shift ? SHIFT_OPTIONS.find(option => option.value === classData.shift)?.label : 'Não informado'}</TableCell>
                                                                </TableRow>
                                                               
                                                                <TableRow className="hover:bg-gray-50/50">
                                                                    <TableCell className="font-medium bg-gray-50/80 text-gray-700 py-4 px-6">Total de Alunos</TableCell>
                                                                    <TableCell className="text-gray-600 py-4 px-6">{classData?.students?.length || 0}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                            </div>
                                        </div>

                                                {/* Lista de Alunos */}
                                                <div className="pt-6 border-t border-gray-200">
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                        <Users className="h-5 w-5 text-[#133D86]" />
                                                        Alunos Matriculados
                                                    </h3>
                                                    {classData?.students?.length > 0 ? (
                                                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                                                                        <TableHead className="text-gray-700 font-semibold py-4 px-6">Nome</TableHead>
                                                                        <TableHead className="text-gray-700 font-semibold py-4 px-6">Email</TableHead>
                                                                        <TableHead className="text-gray-700 font-semibold py-4 px-6">Matrícula</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {classData.students.map((student, index) => (
                                                                        <TableRow 
                                                                            key={student.student_id} 
                                                                            className={`hover:bg-gray-50/50 ${index !== classData.students.length - 1 ? 'border-b border-gray-100' : ''}`}
                                                                        >
                                                                            <TableCell className="text-gray-600 py-4 px-6">{student.name || 'Não informado'}</TableCell>
                                                                            <TableCell className="text-gray-600 py-4 px-6">{student.email || 'Não informado'}</TableCell>
                                                                            <TableCell className="text-gray-600 py-4 px-6">{student.enrollment || 'Não informado'}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                                </div>
                                                    ) : (
                                                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center text-gray-500">
                                                            <Users className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                                                            <p className="text-lg">Nenhum aluno matriculado</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Matérias */}
                                                <div className="pt-6 border-t border-gray-200">
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                                        <BookOpen className="h-5 w-5 text-[#133D86]" />
                                                        Matérias
                                                    </h3>
                                                    {classData?.teachers?.[0]?.subjects?.length > 0 ? (
                                                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-200">
                                                                        <TableHead className="text-gray-700 font-semibold py-4 px-6">Nome</TableHead>
                                                                        <TableHead className="text-gray-700 font-semibold py-4 px-6">Professor</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {classData.teachers.map((teacher, teacherIndex) => (
                                                                        teacher.subjects.map((subject, subjectIndex) => (
                                                                            <TableRow 
                                                                                key={subject.id} 
                                                                                className={`hover:bg-gray-50/50 ${
                                                                                    teacherIndex !== classData.teachers.length - 1 || 
                                                                                    subjectIndex !== teacher.subjects.length - 1 
                                                                                        ? 'border-b border-gray-100' 
                                                                                        : ''
                                                                                }`}
                                                                            >
                                                                                <TableCell className="text-gray-600 py-4 px-6">{subject.name}</TableCell>
                                                                                <TableCell className="text-gray-600 py-4 px-6">{teacher.teacher_name}</TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center text-gray-500">
                                                            <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                                                            <p className="text-lg">Nenhuma matéria cadastrada</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>

            <Dialog open={!!quizToDelete} onOpenChange={() => setQuizToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            Deletar Simulado
                        </DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja deletar o simulado "{quizToDelete?.title}"? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setQuizToDelete(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteQuiz(quizToDelete)}
                        >
                            Deletar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}