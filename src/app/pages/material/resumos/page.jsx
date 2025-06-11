'use client';

/**
 * Página de Resumos
 * Permite visualizar resumos de matérias disponíveis para o estudante
 * Inclui funcionalidades de busca e visualização de conteúdo dos resumos
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Calendar, User, GraduationCap, FileText } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

/**
 * Componente da página de resumos
 * Exibe lista de resumos com busca e visualização
 */
export default function ResumosPage() {
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

                const response = await fetch('https://api-studdy.onrender.com/student/resumes', {
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

    const filteredResumos = resumos.filter(resumo =>
        (resumo.resume?.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (resumo.subject?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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
                    <div className="bg-purple-50 p-3 rounded-full mb-4">
                        <BookOpen className="h-8 w-8 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#133D86] mb-2">
                        Resumos
                    </h1>
                    <p className="text-gray-600 text-center max-w-2xl">
                        Acesse resumos detalhados para complementar seus estudos
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
                                        <div className="flex items-start gap-4">
                                            <div className="bg-purple-50 p-3 rounded-lg flex-shrink-0">
                                                <FileText className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg text-[#133D86] line-clamp-2">
                                                    {resumo.resume.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1 flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span className="truncate">{resumo.teacher.user.name}</span>
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                                {resumo.subject.name}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(resumo.modified_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="bg-purple-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="h-8 w-8 text-purple-600" />
                                </div>
                                <p className="text-gray-500">Nenhum resumo encontrado</p>
                            </div>
                        )}
                    </div>

                    {/* Visualizador de resumo */}
                    <div className="lg:col-span-2">
                        {selectedResumo ? (
                            <Card className="bg-white shadow-lg border border-gray-100">
                                <CardHeader className="p-6">
                                    <div>
                                        <CardTitle className="text-2xl text-[#133D86] mb-2">{selectedResumo.resume.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-4">
                                            <span className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                {selectedResumo.teacher.user.name}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4" />
                                                {selectedResumo.class.name} • {selectedResumo.class.course}
                                            </span>
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                                            <p className="text-gray-600">
                                                {selectedResumo.resume.description}
                                            </p>
                                        </div>
                                        <div className="prose max-w-none bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conteúdo</h3>
                                            <div className="whitespace-pre-wrap text-gray-600">
                                                {selectedResumo.resume.resume}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                                <div className="text-center">
                                    <div className="bg-purple-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="h-10 w-10 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione um Resumo</h3>
                                    <p className="text-gray-500">Escolha um resumo da lista para visualizar seu conteúdo</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}