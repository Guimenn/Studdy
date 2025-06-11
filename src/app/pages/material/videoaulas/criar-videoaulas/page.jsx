'use client';

import { useState } from "react";
import Logo from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, Video, Clock, User } from 'lucide-react';
import YouTube from 'react-youtube';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from 'js-cookie';

export default function CriarVideoaulasPage() {
    const [videoUrl, setvideoUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [videoPreview, setVideoPreview] = useState(null);

    const extractVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const infoVideo = async (videoId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const videoInfo = data.items[0];
                const duration = videoInfo.contentDetails.duration;
                const minutes = Math.floor(parseInt(duration.match(/PT(\d+)M/)?.[1] || 0));
                const seconds = parseInt(duration.match(/PT(?:\d+M)?(\d+)S/)?.[1] || 0);

                return {
                    titulo: videoInfo.snippet.title,
                    professor: videoInfo.snippet.channelTitle,
                    duracao: `${minutes}:${seconds.toString().padStart(2, '0')}`,
                    descricao: videoInfo.snippet.description,
                    thumbnail: videoInfo.snippet.thumbnails.high.url,
                    videoId: videoId
                };
            }
            return null;
        } catch (error) {
            console.error('Erro ao buscar informações do vídeo:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreviewVideo = async () => {
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            setError('URL do YouTube inválida');
            return;
        }

        const videoInfo = await infoVideo(videoId);
        if (!videoInfo) {
            setError('Não foi possível obter informações do vídeo');
            return;
        }

        setVideoPreview(videoInfo);
        setError(null);
    };

    const salvarVideoaula = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);

            const token = Cookies.get('token');

            if (!videoUrl) {
                setError('Por favor, insira uma URL do YouTube');
                return;
            }

            const response = await fetch('http://localhost:3000/teacher/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ videoUrl })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setvideoUrl("");
                setVideoPreview(null);
            } else {
                setError(data.message || 'Erro ao salvar videoaula');
            }
        } catch (error) {
            console.error('Erro ao salvar videoaula:', error);
            setError(error.message || 'Não foi possível salvar a videoaula');
        } finally {
            setIsLoading(false);
        }
    };

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <div className="bg-slate-100 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <Logo className="h-12 w-12" variant="icon" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Criar Videoaula</h1>
                </div>

                {success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md justify-center flex flex-row gap-3">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAACD0lEQVR4nM1WP2sUURBfxUYtlLuZ29MIGtCIqI2iXpKZXVDyCQRLK0kl2CiWv9m9CKLoJzBWBr9AJCkULGy0sPZPpxwm2PgRZDZncuutm93jOBxYHvvezO838968mRcE/4sQZJGgzznR603MHfWRIc8IemssBAw1hn4ii+4QZJ0hv3z0fzb9zKbJqMB32eQNmfxgk/ftB8JFej7v665H0NduV5EgPkmQjVYSLTSWOlNVbBpLnSnXdztKo1O7GhDkkX+VPKpti3gfQ1IPPezqdDCChF2dzrYYkjrekAJDVtnkFSNu1wJO588y9PYOTtzewpHVIpIvBJmp5TqCvQR95yk+ON1M50575hWRfGgm0aU6HORpDH0bBMGewfkwkSuedTnl8PHCQTbtNdLoTFWCEPEJMvlZFL3jON4RXDywE4VpwpAXtaKArLPJ/X+ts8mKX+RBkp6H+Leib1+7O3t8CADzNxnysTCDclumvXwkJisF3i4y5Fsrjc5vG2O2lV066IWySLNIBktO2ZkQoht90Kjv0EuCPiwj+HMmjls5u5rQq2S6ydCnnurHnnT2l5JALzve0AKZfC2rOyHic2zyvZXItTKCDAsy486MdOMPIT68G0HpjZ9I7ZpMFZ5kP8l1RshGtc6om67PpveCUWSr5PR7vOla1uNN17Z7vO//OMRfJWy6nHutmC6P7bUyDvkNKEfqWvhHuk8AAAAASUVORK5CYII=" alt="approval--v1" />
                        Videoaula criada com sucesso!
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md justify-center flex flex-row gap-3 items-center">
                        <img src="/assets/alert_error_icon.png" alt="error--v1" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulário */}
                    <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-[#133D86] mb-6">Informações da Videoaula</h2>
                        <div className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">URL do YouTube</label>
                                <div className="relative">
                                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="text"
                                        placeholder="Cole o link do YouTube aqui..."
                                        className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm pl-8"
                                        value={videoUrl}
                                        onChange={e => setvideoUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-10">
                                <Button
                                    onClick={handlePreviewVideo}
                                    disabled={isLoading || !videoUrl}
                                    className="w-full"
                                >
                                    {isLoading ? 'Carregando...' : 'Visualizar'}
                                </Button>
                                <Button
                                    onClick={salvarVideoaula}
                                    disabled={isLoading || !videoPreview}
                                    className="w-full"
                                >
                                    {isLoading ? 'Salvando...' : 'Salvar Videoaula'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Prévia */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-[#133D86] mb-6">Prévia da Videoaula</h2>
                        {videoPreview ? (
                            <div className="space-y-4">
                                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                    <YouTube
                                        videoId={videoPreview.videoId}
                                        opts={opts}
                                        className="w-full h-full"
                                    />
                                </div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{videoPreview.titulo}</CardTitle>
                                        <CardDescription className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                {videoPreview.professor}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {videoPreview.duracao}
                                            </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {videoPreview.descricao}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                                <Video className="h-12 w-12 mb-4" />
                                <p>Cole uma URL do YouTube para visualizar a prévia</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}   