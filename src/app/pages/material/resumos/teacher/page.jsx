'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, GraduationCap, User, Trash2, FileText } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export default function TeacherResumosPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResumo, setSelectedResumo] = useState(null);
    const [resumos, setResumos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResumos = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    toast.error('Token não encontrado');
                    return;
                }

                const response = await fetch('https://api-studdy.onrender.com/teacher/resumes', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar resumos');
                }

                const data = await response.json();
                setResumos(data);
            } catch (error) {
                console.error('Erro ao carregar resumos:', error);
                toast.error('Erro ao carregar resumos');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResumos();
    }, []);

    const handleDeleteResumo = async (resumoId) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const response = await fetch(`https://api-studdy.onrender.com/teacher/resumes/${resumoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar resumo');
            }

            setResumos(resumos.filter(resumo => resumo.id !== resumoId));
            if (selectedResumo?.id === resumoId) {
                setSelectedResumo(null);
            }
            toast.success('Resumo deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar resumo:', error);
            toast.error('Erro ao deletar resumo');
        }
    };

    const filteredResumos = resumos.filter(resumo =>
        (resumo?.resume?.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (resumo?.resume?.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#133D86] mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Carregando resumos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="bg-blue-50 p-3 rounded-full mb-4">
                        <BookOpen className="h-8 w-8 text-[#133D86]" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#133D86] mb-2">
                        Meus Resumos
                    </h1>
                    <p className="text-gray-600 text-center max-w-2xl">
                        Gerencie seus resumos e acompanhe o desempenho dos alunos
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            placeholder="Buscar resumos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de resumos */}
                    <div className="lg:col-span-1 space-y-4">
                        {filteredResumos.length > 0 ? (
                            filteredResumos.map((resumo) => (
                                <Card
                                    key={resumo.id}
                                    className={`cursor-pointer transition-all hover:shadow-lg ${
                                        selectedResumo?.id === resumo.id ? 'ring-2 ring-[#133D86]' : ''
                                    }`}
                                    onClick={() => setSelectedResumo(resumo)}
                                >
                                    <CardHeader className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg text-[#133D86]">{resumo.resume.title}</CardTitle>
                                                <CardDescription className="mt-1 flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4" />
                                                    {resumo.class.name} • {resumo.class.course}
                                                </CardDescription>
                                            </div>
                                            <FileText className="h-5 w-5 text-[#133D86]" />
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
                                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Nenhum resumo encontrado</p>
                            </div>
                        )}
                    </div>

                    {/* Visualizador de resumo */}
                    <div className="lg:col-span-2">
                        {selectedResumo ? (
                            <Card className="bg-white shadow-lg border border-gray-100">
                                <CardHeader className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl text-[#133D86] mb-2">{selectedResumo.resume.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-4">
                                                <span className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4" />
                                                    {selectedResumo.class.name} • {selectedResumo.class.course}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {selectedResumo.subject.name}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {selectedResumo.teacher.user.name}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        <Button 
                                            variant="destructive" 
                                            className="gap-2"
                                            onClick={() => handleDeleteResumo(selectedResumo.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Deletar
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                                            <p className="text-gray-600">
                                                {selectedResumo.resume.description || 'Nenhuma descrição disponível'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Conteúdo</h3>
                                            <div className="prose max-w-none">
                                                <p className="text-gray-600 whitespace-pre-wrap">
                                                    {selectedResumo.resume.resume || 'Nenhum conteúdo disponível'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                                <div className="text-center">
                                    <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="h-10 w-10 text-[#133D86]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione um Resumo</h3>
                                    <p className="text-gray-500">Escolha um resumo da lista para visualizar</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}