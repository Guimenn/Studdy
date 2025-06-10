'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Download, User, Calendar, GraduationCap } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export default function ApostilasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApostila, setSelectedApostila] = useState(null);
    const [apostilas, setApostilas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApostilas = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    toast.error('Token não encontrado');
                    return;
                }

                const response = await fetch('https://api-studdy.onrender.com/student/apostilas', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar apostilas');
                }

                const data = await response.json();
                setApostilas(data);
            } catch (error) {
                console.error('Erro ao carregar apostilas:', error);
                toast.error('Erro ao carregar apostilas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchApostilas();
    }, []);

    const filteredApostilas = apostilas.filter(apostila =>
        (apostila.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (apostila.teacher?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#133D86] mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Carregando apostilas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h1 className="text-3xl font-bold tracking-tight text-[#133D86] mb-2">
                        Apostilas
                    </h1>
                    <p className="text-gray-600 text-center max-w-2xl">
                        Acesse apostilas completas para seus estudos
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            placeholder="Buscar apostilas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de apostilas */}
                    <div className="lg:col-span-1 space-y-4">
                        {filteredApostilas.length > 0 ? (
                            filteredApostilas.map((apostila) => (
                                <Card
                                    key={apostila.id}
                                    className={`cursor-pointer transition-all hover:shadow-lg ${
                                        selectedApostila?.id === apostila.id ? 'ring-2 ring-[#133D86]' : ''
                                    }`}
                                    onClick={() => setSelectedApostila(apostila)}
                                >
                                    <CardHeader className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg text-[#133D86]">{apostila.title}</CardTitle>
                                                <CardDescription className="mt-1 flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {apostila.teacher.name}
                                                </CardDescription>
                                            </div>
                                            <FileText className="h-5 w-5 text-[#133D86]" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                                {apostila.subject}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(apostila.updated_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Nenhuma apostila encontrada</p>
                            </div>
                        )}
                    </div>

                    {/* Visualizador de apostila */}
                    <div className="lg:col-span-2">
                        {selectedApostila ? (
                            <Card className="bg-white shadow-lg border border-gray-100">
                                <CardHeader className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl text-[#133D86] mb-2">{selectedApostila.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-4">
                                                <span className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {selectedApostila.teacher.name}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4" />
                                                    {selectedApostila.class?.name || 'Turma não informada'}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" className="gap-2">
                                            <Download className="h-4 w-4" />
                                            Baixar PDF
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-600">
                                                {selectedApostila.description || 'Nenhuma descrição disponível'}
                                            </p>
                                        </div>
                                        <div className="prose max-w-none whitespace-pre-wrap bg-white p-6 rounded-lg border border-gray-100">
                                            {selectedApostila.content || 'Conteúdo não disponível'}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                                <div className="text-center">
                                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione uma Apostila</h3>
                                    <p className="text-gray-500">Escolha uma apostila da lista para visualizar seu conteúdo</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}