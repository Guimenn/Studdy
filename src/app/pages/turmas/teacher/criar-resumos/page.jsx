'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save, Edit, Calculator, Atom, Lightbulb, Dumbbell, Microscope, TestTube, FlaskConical, FlaskRound, Book, ScrollText, Landmark, History, Globe, Map, Compass, BookText, BookOpenText, Type, Pen, PenTool, Ruler, LineChart, Zap, Wand2 } from 'lucide-react';
import Logo from '@/components/ui/logo';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const ICON_OPTIONS = [
    // Matemática
    { label: 'Matemática - Calculadora', value: 'Calculator', icon: Calculator },
    { label: 'Matemática - Régua', value: 'Ruler', icon: Ruler },
    { label: 'Matemática - Compasso', value: 'Compass', icon: Compass },
    { label: 'Matemática - Gráfico', value: 'LineChart', icon: LineChart },

    // Física
    { label: 'Física - Átomo', value: 'Atom', icon: Atom },
    { label: 'Física - Luz', value: 'Lightbulb', icon: Lightbulb },
    { label: 'Física - Energia', value: 'Zap', icon: Zap },
    { label: 'Física - Força', value: 'Dumbbell', icon: Dumbbell },

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

    // Português
    { label: 'Português - Livro de Texto', value: 'BookText', icon: BookText },
    { label: 'Português - Livro Aberto', value: 'BookOpenText', icon: BookOpenText },
    { label: 'Português - Tipografia', value: 'Type', icon: Type },
    { label: 'Português - Caneta', value: 'Pen', icon: Pen },
    { label: 'Português - Ferramenta de Escrita', value: 'PenTool', icon: PenTool },
];

const SummaryVisibility = {
    DRAFT: 'DRAFT',
    PUBLIC: 'PUBLIC'
};

export default function CriarResumosPage() {
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
    const [titulo, setTitulo] = useState('');
    const [icone, setIcone] = useState('Book');
    const [visibilidade, setVisibilidade] = useState(SummaryVisibility.PUBLIC);
    const [descricao, setDescricao] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [state, setState] = useState({
        isSubmitting: false,
        submitError: null,
        submitSuccess: false,
    });

    // Carregar classes do professor
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    toast.error('Token não encontrado');
                    return;
                }

                const response = await fetch('https://api-studdy.onrender.com/teacher/classes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar classes');
                }

                const data = await response.json();
                setClasses(data);
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

                    const response = await fetch(`https://api-studdy.onrender.com/teacher/classes/${selectedClass}/subjects`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao carregar disciplinas');
                    }

                    const data = await response.json();
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

    const gerarResumo = async () => {
        try {
            setIsLoading(true);
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            if (!titulo) {
                toast.error('Por favor, insira um título para o resumo');
                return;
            }


            const response = await fetch('https://api-studdy.onrender.com/generate/generate-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: titulo
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao gerar resumo');
            }

            const data = await response.json();
            setConteudo(data.resume);
            toast.success('Resumo gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar resumo:', error);
            toast.error('Erro ao gerar resumo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e, visibility = SummaryVisibility.PUBLIC) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const payload = {
               
                subject_id: selectedSubject,
                class_id: selectedClass,
                title: titulo,
                icon: icone,
                description: descricao,
                resume: conteudo
            };

            const url = isEditMode 
                ? `https://api-studdy.onrender.com/teacher/resumes/${editId}`
                : 'https://api-studdy.onrender.com/teacher/resumes';

            const method = isEditMode ? 'PUT' : 'POST';

            console.log('Dados a serem enviados:', payload);
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar resumo');
            }

            toast.success(isEditMode ? 'Resumo atualizado com sucesso!' : 'Resumo criado com sucesso!');
            router.push('/pages/turmas/teacher');
        } catch (error) {
            console.error('Erro ao salvar resumo:', error);
            toast.error('Erro ao salvar resumo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <Logo className="h-12 w-12" variant="icon" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">
                        {isEditMode ? 'Editar Resumo' : 'Criar Resumo'}
                    </h1>
                    {isEditMode && (
                        <p className="mt-2 text-sm text-gray-600">
                            Editando resumo • Você pode salvar como rascunho ou publicar
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-[#133D86] mb-6">Informações do Resumo</h2>

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
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Título do Resumo</label>
                                <Input
                                    type="text"
                                    placeholder="Ex: Resumo de Programação Web"
                                    className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Ícone do Resumo</label>
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
                                    placeholder="Ex: Resumo sobre HTML, CSS e JavaScript"
                                    className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="font-semibold text-[#133D86] text-base">Conteúdo</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        onClick={gerarResumo}
                                        disabled={isLoading || !titulo}
                                    >
                                        <Wand2 className="h-4 w-4" />
                                        {isLoading ? 'Gerando...' : 'Gerar com IA'}
                                    </Button>
                                </div>
                                <Textarea
                                    placeholder="Digite o conteúdo do resumo aqui..."
                                    className="min-h-[300px] text-base font-normal rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                    value={conteudo}
                                    onChange={(e) => setConteudo(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            size="lg"
                            type="button"
                            variant="outline"
                            className="border-[#133D86] text-[#133D86] hover:bg-[#133D86] hover:text-white"
                            disabled={!selectedClass || !selectedSubject || !titulo || isLoading}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit(e, SummaryVisibility.DRAFT);
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
                                handleSubmit(e, SummaryVisibility.PUBLIC);
                            }}
                        >
                            <Save className="h-5 w-5 mr-2" />
                            {isLoading ? (isEditMode ? 'Atualizando...' : 'Publicando...') : (isEditMode ? 'Atualizar e Publicar' : 'Publicar Resumo')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}