'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Search, Play, Calendar, Clock, Youtube, ExternalLink } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import Image from 'next/image';

export default function VideoaulasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    toast.error('Token não encontrado');
                    return;
                }

                const response = await fetch('http://localhost:3000/student/videos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar videoaulas');
                }

                const data = await response.json();
                setVideos(data);
            } catch (error) {
                console.error('Erro ao carregar videoaulas:', error);
                toast.error('Erro ao carregar videoaulas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const filteredVideos = videos.filter(video =>
        (video?.title_video?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (video?.name_channel?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#133D86] mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Carregando videoaulas...</p>
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
                        <Video className="h-8 w-8 text-[#133D86]" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#133D86] mb-2">
                        Videoaulas
                    </h1>
                    <p className="text-gray-600 text-center max-w-2xl">
                        Assista videoaulas de qualidade para complementar seus estudos
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            placeholder="Buscar videoaulas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de videoaulas */}
                    <div className="lg:col-span-1 space-y-4">
                        {filteredVideos.length > 0 ? (
                            filteredVideos.map((video) => (
                                <Card
                                    key={video.id}
                                    className={`cursor-pointer transition-all hover:shadow-lg ${
                                        selectedVideo?.id === video.id ? 'ring-2 ring-[#133D86]' : ''
                                    }`}
                                    onClick={() => setSelectedVideo(video)}
                                >
                                    <CardHeader className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={video.thumbnail}
                                                    alt={video.title_video}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                                    {video.duration_video}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-lg text-[#133D86] line-clamp-2">
                                                    {video.title_video}
                                                </CardTitle>
                                                <CardDescription className="mt-1 flex items-center gap-2">
                                                    <Youtube className="h-4 w-4 text-red-600" />
                                                    <span className="truncate">{video.name_channel}</span>
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
                                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Nenhuma videoaula encontrada</p>
                            </div>
                        )}
                    </div>

                    {/* Visualizador de videoaula */}
                    <div className="lg:col-span-2">
                        {selectedVideo ? (
                            <Card className="bg-white shadow-lg border border-gray-100">
                                <CardHeader className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl text-[#133D86] mb-2">{selectedVideo.title_video}</CardTitle>
                                            <CardDescription className="flex items-center gap-4">
                                                <span className="flex items-center gap-2">
                                                    <Youtube className="h-4 w-4 text-red-600" />
                                                    {selectedVideo.name_channel}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {selectedVideo.duration_video}
                                                </span>
                                            </CardDescription>
                                        </div>
                                       
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                                                className="w-full h-full"
                                                allowFullScreen
                                                title={selectedVideo.title_video}
                                            />
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                                            <p className="text-gray-600 whitespace-pre-wrap">
                                                {selectedVideo.description || 'Nenhuma descrição disponível'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                                <div className="text-center">
                                    <div className="bg-blue-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                        <Video className="h-10 w-10 text-[#133D86]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione uma Videoaula</h3>
                                    <p className="text-gray-500">Escolha uma videoaula da lista para assistir</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 