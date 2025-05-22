'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Download, Eye, Lock } from 'lucide-react';

export default function ApostilasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApostila, setSelectedApostila] = useState(null);

    const apostilas = [
        {
            id: 1,
            titulo: "Apostila de Física",
            professor: "Prof. Oliveira",
            categoria: "Física",
            tamanho: "2.5 MB",
            descricao: "Material completo sobre mecânica clássica",
            dataUpload: "2024-03-15",
            downloadUrl: "https://example.com/apostila1.pdf"
        },
        {
            id: 2,
            titulo: "Apostila de Química",
            professor: "Prof. Costa",
            categoria: "Química",
            tamanho: "1.8 MB",
            descricao: "Conceitos fundamentais de química",
            dataUpload: "2024-03-14",
            downloadUrl: "https://example.com/apostila2.pdf"
        },
        {
            id: 3,
            titulo: "Apostila de Biologia",
            professor: "Prof. Santos",
            categoria: "Biologia",
            tamanho: "3.2 MB",
            descricao: "Biologia celular e molecular",
            dataUpload: "2024-03-13",
            downloadUrl: "https://example.com/apostila3.pdf",
            bloqueado: true
        }
    ];

    const filteredApostilas = apostilas.filter(apostila =>
        apostila.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apostila.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Apostilas
                </h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Buscar apostilas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de apostilas */}
                <div className="lg:col-span-1 space-y-4">
                    {filteredApostilas.map((apostila) => (
                        <Card
                            key={apostila.id}
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                                selectedApostila?.id === apostila.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedApostila(apostila)}
                        >
                            <CardHeader className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{apostila.titulo}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {apostila.professor}
                                        </CardDescription>
                                    </div>
                                    {apostila.bloqueado ? (
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        {apostila.tamanho}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        {apostila.categoria}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Visualizador de apostila */}
                <div className="lg:col-span-2">
                    {selectedApostila ? (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{selectedApostila.titulo}</CardTitle>
                                        <CardDescription>
                                            {selectedApostila.professor} • {selectedApostila.dataUpload}
                                        </CardDescription>
                                    </div>
                                    {!selectedApostila.bloqueado && (
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <Download className="h-4 w-4" />
                                            Download
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {selectedApostila.bloqueado ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Lock className="h-12 w-12 text-gray-400 mb-4" />
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            Conteúdo Bloqueado
                                        </p>
                                        <p className="text-gray-500 text-center mb-4">
                                            Faça upgrade do seu plano para acessar esta apostila
                                        </p>
                                        <Button>
                                            Fazer Upgrade
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {selectedApostila.descricao}
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
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    Selecione uma apostila para visualizar
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
} 