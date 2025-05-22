'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, FileText, BookOpen, PenTool } from 'lucide-react';
import Link from 'next/link';

export default function MaterialPage() {
    const [activeTab, setActiveTab] = useState('videoaulas');

    const materiais = {
        videoaulas: [
            {
                id: 1,
                titulo: "Introdução à Matemática",
                professor: "Prof. Silva",
                duracao: "45 min",
                categoria: "Matemática",
                thumbnail: "/thumbnails/math.jpg"
            },
            {
                id: 2,
                titulo: "Gramática Básica",
                professor: "Prof. Santos",
                duracao: "30 min",
                categoria: "Português",
                thumbnail: "/thumbnails/portugues.jpg"
            }
        ],
        apostilas: [
            {
                id: 1,
                titulo: "Apostila de Física",
                professor: "Prof. Oliveira",
                categoria: "Física",
                tamanho: "2.5 MB"
            },
            {
                id: 2,
                titulo: "Apostila de Química",
                professor: "Prof. Costa",
                categoria: "Química",
                tamanho: "1.8 MB"
            }
        ],
        resumos: [
            {
                id: 1,
                titulo: "Resumo de História",
                professor: "Prof. Lima",
                categoria: "História",
                ultimaAtualizacao: "2024-03-15"
            },
            {
                id: 2,
                titulo: "Resumo de Geografia",
                professor: "Prof. Souza",
                categoria: "Geografia",
                ultimaAtualizacao: "2024-03-14"
            }
        ],
        exercicios: [
            {
                id: 1,
                titulo: "Exercícios de Matemática",
                professor: "Prof. Silva",
                categoria: "Matemática",
                quantidade: 50
            },
            {
                id: 2,
                titulo: "Exercícios de Português",
                professor: "Prof. Santos",
                categoria: "Português",
                quantidade: 30
            }
        ]
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Material de Estudo
            </h1>

            <Tabs defaultValue="videoaulas" className="space-y-4">
                <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                    <TabsTrigger value="videoaulas" className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Videoaulas
                    </TabsTrigger>
                    <TabsTrigger value="apostilas" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Apostilas
                    </TabsTrigger>
                    <TabsTrigger value="resumos" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Resumos
                    </TabsTrigger>
                    <TabsTrigger value="exercicios" className="flex items-center gap-2">
                        <PenTool className="h-4 w-4" />
                        Exercícios
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="videoaulas" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materiais.videoaulas.map((video) => (
                            <Card key={video.id} className="overflow-hidden">
                                <div className="aspect-video bg-gray-200 dark:bg-gray-800">
                                    {/* Thumbnail placeholder */}
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg">{video.titulo}</CardTitle>
                                    <CardDescription>
                                        {video.professor} • {video.duracao}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {video.categoria}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="apostilas" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materiais.apostilas.map((apostila) => (
                            <Card key={apostila.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{apostila.titulo}</CardTitle>
                                    <CardDescription>
                                        {apostila.professor} • {apostila.tamanho}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        {apostila.categoria}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="resumos" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materiais.resumos.map((resumo) => (
                            <Card key={resumo.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{resumo.titulo}</CardTitle>
                                    <CardDescription>
                                        {resumo.professor} • Atualizado em {resumo.ultimaAtualizacao}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        {resumo.categoria}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="exercicios" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materiais.exercicios.map((exercicio) => (
                            <Card key={exercicio.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{exercicio.titulo}</CardTitle>
                                    <CardDescription>
                                        {exercicio.professor} • {exercicio.quantidade} exercícios
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        {exercicio.categoria}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 