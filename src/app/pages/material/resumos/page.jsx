'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Download, Eye, Lock, Calendar } from 'lucide-react';

export default function ResumosPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResumo, setSelectedResumo] = useState(null);

    const resumos = [
        {
            id: 1,
            titulo: "Resumo de História",
            professor: "Prof. Lima",
            categoria: "História",
            descricao: "Resumo completo sobre o período colonial brasileiro",
            ultimaAtualizacao: "2024-03-15",
            downloadUrl: "https://example.com/resumo1.pdf"
        },
        {
            id: 2,
            titulo: "Resumo de Geografia",
            professor: "Prof. Souza",
            categoria: "Geografia",
            descricao: "Conceitos fundamentais de geografia física",
            ultimaAtualizacao: "2024-03-14",
            downloadUrl: "https://example.com/resumo2.pdf"
        },
        {
            id: 3,
            titulo: "Resumo de Literatura",
            professor: "Prof. Costa",
            categoria: "Literatura",
            descricao: "Movimentos literários brasileiros",
            ultimaAtualizacao: "2024-03-13",
            downloadUrl: "https://example.com/resumo3.pdf",
            bloqueado: true
        }
    ];

    const filteredResumos = resumos.filter(resumo =>
        resumo.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resumo.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Resumos
                </h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Buscar resumos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de resumos */}
                <div className="lg:col-span-1 space-y-4">
                    {filteredResumos.map((resumo) => (
                        <Card
                            key={resumo.id}
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                                selectedResumo?.id === resumo.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedResumo(resumo)}
                        >
                            <CardHeader className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{resumo.titulo}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {resumo.professor}
                                        </CardDescription>
                                    </div>
                                    {resumo.bloqueado ? (
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <BookOpen className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        {resumo.ultimaAtualizacao}
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        {resumo.categoria}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Visualizador de resumo */}
                <div className="lg:col-span-2">
                    {selectedResumo ? (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{selectedResumo.titulo}</CardTitle>
                                        <CardDescription>
                                            {selectedResumo.professor} • Atualizado em {selectedResumo.ultimaAtualizacao}
                                        </CardDescription>
                                    </div>
                                    {!selectedResumo.bloqueado && (
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <Download className="h-4 w-4" />
                                            Download
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {selectedResumo.bloqueado ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Lock className="h-12 w-12 text-gray-400 mb-4" />
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            Conteúdo Bloqueado
                                        </p>
                                        <p className="text-gray-500 text-center mb-4">
                                            Faça upgrade do seu plano para acessar este resumo
                                        </p>
                                        <Button>
                                            Fazer Upgrade
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {selectedResumo.descricao}
                                        </p>
                                        <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">
                                                    Visualizador de PDF será implementado aqui
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full flex items-center justify-center">
                            <div className="text-center p-8">
                                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    Selecione um resumo para visualizar
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
} 