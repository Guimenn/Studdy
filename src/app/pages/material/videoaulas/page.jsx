'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Search, Clock, Play, Lock } from 'lucide-react';

export default function VideoaulasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);

    const videoaulas = [
        {
            id: 1,
            titulo: "Introdução à Matemática",
            professor: "Prof. Silva",
            duracao: "45 min",
            categoria: "Matemática",
            descricao: "Aula introdutória sobre conceitos básicos de matemática",
            thumbnail: "/thumbnails/math.jpg",
            videoUrl: "https://example.com/video1"
        },
        {
            id: 2,
            titulo: "Gramática Básica",
            professor: "Prof. Santos",
            duracao: "30 min",
            categoria: "Português",
            descricao: "Fundamentos da gramática portuguesa",
            thumbnail: "/thumbnails/portugues.jpg",
            videoUrl: "https://example.com/video2"
        },
        {
            id: 3,
            titulo: "Física Moderna",
            professor: "Prof. Oliveira",
            duracao: "60 min",
            categoria: "Física",
            descricao: "Conceitos avançados de física moderna",
            thumbnail: "/thumbnails/fisica.jpg",
            videoUrl: "https://example.com/video3",
            bloqueado: true
        }
    ];

    const filteredVideos = videoaulas.filter(video =>
        video.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Videoaulas
                </h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Buscar videoaulas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de videoaulas */}
                <div className="lg:col-span-1 space-y-4">
                    {filteredVideos.map((video) => (
                        <Card
                            key={video.id}
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                                selectedVideo?.id === video.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedVideo(video)}
                        >
                            <CardHeader className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{video.titulo}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {video.professor}
                                        </CardDescription>
                                    </div>
                                    {video.bloqueado ? (
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        {video.duracao}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {video.categoria}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Player de vídeo */}
                <div className="lg:col-span-2">
                    {selectedVideo ? (
                        <Card>
                            <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                                {selectedVideo.bloqueado ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="text-center">
                                            <Lock className="h-12 w-12 text-white mx-auto mb-4" />
                                            <p className="text-white text-lg font-medium">
                                                Conteúdo Bloqueado
                                            </p>
                                            <p className="text-white text-sm mt-2">
                                                Faça upgrade do seu plano para acessar
                                            </p>
                                            <Button className="mt-4">
                                                Fazer Upgrade
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="h-16 w-16 text-white" />
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl">{selectedVideo.titulo}</CardTitle>
                                <CardDescription>
                                    {selectedVideo.professor} • {selectedVideo.duracao}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {selectedVideo.descricao}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full flex items-center justify-center">
                            <div className="text-center p-8">
                                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    Selecione uma videoaula para começar
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
} 