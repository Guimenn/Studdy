'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenTool, Search, Download, Eye, Lock, ListChecks } from 'lucide-react';

export default function ExerciciosPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExercicio, setSelectedExercicio] = useState(null);

    const exercicios = [
        {
            id: 1,
            titulo: "Exercícios de Matemática",
            professor: "Prof. Silva",
            categoria: "Matemática",
            descricao: "50 exercícios de álgebra e geometria",
            quantidade: 50,
            nivel: "Intermediário",
            downloadUrl: "https://example.com/exercicios1.pdf"
        },
        {
            id: 2,
            titulo: "Exercícios de Português",
            professor: "Prof. Santos",
            categoria: "Português",
            descricao: "30 exercícios de gramática e interpretação",
            quantidade: 30,
            nivel: "Básico",
            downloadUrl: "https://example.com/exercicios2.pdf"
        },
        {
            id: 3,
            titulo: "Exercícios de Física",
            professor: "Prof. Oliveira",
            categoria: "Física",
            descricao: "40 exercícios de mecânica e termodinâmica",
            quantidade: 40,
            nivel: "Avançado",
            downloadUrl: "https://example.com/exercicios3.pdf",
            bloqueado: true
        }
    ];

    const filteredExercicios = exercicios.filter(exercicio =>
        exercicio.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercicio.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Exercícios
                </h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Buscar exercícios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de exercícios */}
                <div className="lg:col-span-1 space-y-4">
                    {filteredExercicios.map((exercicio) => (
                        <Card
                            key={exercicio.id}
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                                selectedExercicio?.id === exercicio.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedExercicio(exercicio)}
                        >
                            <CardHeader className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{exercicio.titulo}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {exercicio.professor}
                                        </CardDescription>
                                    </div>
                                    {exercicio.bloqueado ? (
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <PenTool className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <ListChecks className="h-4 w-4" />
                                        {exercicio.quantidade} exercícios
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        {exercicio.categoria}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Visualizador de exercícios */}
                <div className="lg:col-span-2">
                    {selectedExercicio ? (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{selectedExercicio.titulo}</CardTitle>
                                        <CardDescription>
                                            {selectedExercicio.professor} • {selectedExercicio.nivel}
                                        </CardDescription>
                                    </div>
                                    {!selectedExercicio.bloqueado && (
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <Download className="h-4 w-4" />
                                            Download
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {selectedExercicio.bloqueado ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Lock className="h-12 w-12 text-gray-400 mb-4" />
                                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            Conteúdo Bloqueado
                                        </p>
                                        <p className="text-gray-500 text-center mb-4">
                                            Faça upgrade do seu plano para acessar estes exercícios
                                        </p>
                                        <Button>
                                            Fazer Upgrade
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {selectedExercicio.descricao}
                                        </p>
                                        <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500">
                                                    Visualizador de exercícios será implementado aqui
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
                                <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    Selecione um conjunto de exercícios para visualizar
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
} 