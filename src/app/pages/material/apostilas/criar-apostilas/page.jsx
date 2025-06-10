'use client';

import { useState } from "react";
import Logo from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Calendar, BookOpen, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CriarApostilasPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        categoria: '',
        serie: '',
        descricao: '',
        arquivo: null,
        link: ''
    });

    const categorias = [
        "Matemática",
        "Português",
        "História",
        "Geografia",
        "Biologia",
        "Física",
        "Química",
        "Literatura",
        "Inglês",
        "Arte",
        "Educação Física",
        "Filosofia",
        "Sociologia"
    ];

    const series = [
        "6º Ano",
        "7º Ano",
        "8º Ano",
        "9º Ano"
    ];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                arquivo: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);

            if (!formData.arquivo && !formData.link) {
                setError('Por favor, faça o upload de um arquivo ou forneça um link do PDF.');
                return;
            }

            // Aqui você implementaria a lógica para enviar o arquivo e os dados para o servidor
            // Por enquanto, vamos apenas simular um sucesso
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess(true);
            setFormData({
                titulo: '',
                categoria: '',
                serie: '',
                descricao: '',
                arquivo: null,
                link: ''
            });
        } catch (error) {
            setError('Erro ao criar apostila. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <Logo className="h-12 w-12" variant="icon" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Criar Apostila</h1>
                </div>

                {success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md justify-center flex flex-row gap-3">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAACD0lEQVR4nM1WP2sUURBfxUYtlLuZ29MIGtCIqI2iXpKZXVDyCQRLK0kl2CiWv9m9CKLoJzBWBr9AJCkULGy0sPZPpxwm2PgRZDZncuutm93jOBxYHvvezO838968mRcE/4sQZJGgzznR603MHfWRIc8IemssBAw1hn4ii+4QZJ0hv3z0fzb9zKbJqMB32eQNmfxgk/ftB8JFej7v665H0NduV5EgPkmQjVYSLTSWOlNVbBpLnSnXdztKo1O7GhDkkX+VPKpti3gfQ1IPPezqdDCChF2dzrYYkjrekAJDVtnkFSNu1wJO588y9PYOTtzewpHVIpIvBJmp5TqCvQR95yk+ON1M50575hWRfGgm0aU6HORpDH0bBMGewfkwkSuedTnl8PHCQTbtNdLoTFWCEPEJMvlZFL3jON4RXDywE4VpwpAXtaKArLPJ/X+ts8mKX+RBkp6H+Leib1+7O3t8CADzNxnysTCDclumvXwkJisF3i4y5Fsrjc5vG2O2lV066IWySLNIBktO2ZkQoht90Kjv0EuCPiwj+HMmjls5u5rQq2S6ydCnnurHnnT2l5JALzve0AKZfC2rOyHic2zyvZXItTKCDAsy486MdOMPIT68G0HpjZ9I7ZpMFZ5kP8l1RshGtc6om67PpveCUWSr5PR7vOla1uNN17Z7vO//OMRfJWy6nHutmC6P7bUyDvkNKEfqWvhHuk8AAAAASUVORK5CYII=" alt="approval--v1" />
                        Apostila criada com sucesso!
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
                        <h2 className="text-xl font-semibold text-[#133D86] mb-6">Informações da Apostila</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Título</label>
                                <Input
                                    type="text"
                                    placeholder="Digite o título da apostila..."
                                    className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Categoria</label>
                                <Select
                                    value={formData.categoria}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
                                    required
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((categoria) => (
                                            <SelectItem key={categoria} value={categoria}>
                                                {categoria}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Série</label>
                                <Select
                                    value={formData.serie}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, serie: value }))}
                                    required
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Selecione uma série" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {series.map((serie) => (
                                            <SelectItem key={serie} value={serie}>
                                                {serie}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Descrição</label>
                                <textarea
                                    placeholder="Digite uma descrição para a apostila..."
                                    className="min-h-[100px] p-3 text-base font-normal rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm resize-none"
                                    value={formData.descricao}
                                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                    requiredqqqq
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-[#133D86] text-base">Arquivo PDF</label>
                                <Tabs defaultValue="upload" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="upload">Upload</TabsTrigger>
                                        <TabsTrigger value="link">Link</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="upload">
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#133D86] transition-colors"
                                            >
                                                <Upload className="h-6 w-6 text-gray-500" />
                                                <span className="text-gray-600">
                                                    {formData.arquivo ? formData.arquivo.name : 'Clique para selecionar um arquivo PDF'}
                                                </span>
                                            </label>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="link">
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <Input
                                                type="url"
                                                placeholder="Cole o link do PDF aqui..."
                                                className="pl-9"
                                                value={formData.link}
                                                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4"
                            >
                                {isLoading ? 'Criando...' : 'Criar Apostila'}
                            </Button>
                        </form>
                    </div>

                    {/* Prévia */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-[#133D86] mb-6">Prévia da Apostila</h2>
                        {(formData.arquivo || formData.link) ? (
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-xl">{formData.titulo || 'Título da Apostila'}</CardTitle>
                                                <CardDescription>
                                                    {formData.serie} • {formData.categoria}
                                                </CardDescription>
                                            </div>
                                            <FileText className="h-6 w-6 text-gray-400" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {formData.descricao || 'Descrição da apostila...'}
                                        </p>
                                        <div className="mt-4 aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            {formData.link ? (
                                                <iframe
                                                    src={`${formData.link}#toolbar=0`}
                                                    className="w-full h-full rounded-lg"
                                                    title={formData.titulo || 'PDF Preview'}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="text-center">
                                                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-gray-500">
                                                            Visualizador de PDF será implementado aqui
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    Selecione um arquivo ou forneça um link para ver a prévia
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}