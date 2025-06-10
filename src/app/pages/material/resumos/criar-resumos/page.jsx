'use client';

import { useState, useEffect } from "react";
import Logo from '@/components/ui/logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    // Matemática
    Calculator, Pi, Ruler, Sigma, ChartBar, ChartLine,

    // Física
    Atom, Telescope, Beaker,

    // Química
    Microscope, FlaskConical, TestTube, FlaskRound,

    // História
    History, Landmark, ScrollText, Book,

    // Geografia
    Globe, Map, Compass,

    // Português
    BookText, BookOpenText, Type, Pen, PenTool, FileText, PlusCircle, Save
} from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

const ICON_OPTIONS = [
    // Matemática
    { label: 'Matemática - Calculadora', value: 'Calculator', icon: Calculator },
    { label: 'Matemática - Pi', value: 'Pi', icon: Pi },
    { label: 'Matemática - Régua', value: 'Ruler', icon: Ruler },
    { label: 'Matemática - Sigma', value: 'Sigma', icon: Sigma },
    { label: 'Matemática - Gráfico de Barras', value: 'ChartBar', icon: ChartBar },
    { label: 'Matemática - Gráfico de Linha', value: 'ChartLine', icon: ChartLine },

    // Física
    { label: 'Física - Átomo', value: 'Atom', icon: Atom },
    { label: 'Física - Telescópio', value: 'Telescope', icon: Telescope },
    { label: 'Física - Béquer', value: 'Beaker', icon: Beaker },

    // Química
    { label: 'Química - Microscópio', value: 'Microscope', icon: Microscope },
    { label: 'Química - Tubo de Ensaio', value: 'TestTube', icon: TestTube },
    { label: 'Química - Frasco Cônico', value: 'FlaskConical', icon: FlaskConical },
    { label: 'Química - Frasco Redondo', value: 'FlaskRound', icon: FlaskRound },

    // História
    { label: 'História - Livro Antigo', value: 'Book', icon: Book },
    { label: 'História - Rolos de Texto', value: 'ScrollText', icon: ScrollText },
    { label: 'História - Monumento', value: 'Landmark', icon: Landmark },
    { label: 'História - Relógio Antigo', value: 'History', icon: History },

    // Geografia
    { label: 'Geografia - Globo', value: 'Globe', icon: Globe },
    { label: 'Geografia - Mapa', value: 'Map', icon: Map },
    { label: 'Geografia - Bússola', value: 'Compass', icon: Compass },

    // Português
    { label: 'Português - Livro de Texto', value: 'BookText', icon: BookText },
    { label: 'Português - Livro Aberto', value: 'BookOpenText', icon: BookOpenText },
    { label: 'Português - Tipografia', value: 'Type', icon: Type },
    { label: 'Português - Caneta', value: 'Pen', icon: Pen },
    { label: 'Português - Ferramenta de Escrita', value: 'PenTool', icon: PenTool }
];

export default function CriarResumosPage() {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [icone, setIcone] = useState("Calculator");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [resumo, setResumo] = useState("");

    const gerarResumo = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);

            console.log('Iniciando geração do resumo...');

            const response = await fetch('http://localhost:3002/api/resumos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo,
                    descricao,
                    icone
                })
            });

            console.log('Resposta recebida:', response.status);

            const data = await response.json();
            console.log('Dados recebidos:', data);

            if (response.ok) {
                setSuccess(true);
                setResumo(data.resumo); // Adiciona o resumo recebido ao textarea
                setTitulo("");
                setDescricao("");
            } else {
                setError(data.message || 'Erro ao gerar resumo');
            }
        } catch (error) {
            console.error('Erro ao gerar resumo:', error);
            setError(error.message || 'Não foi possível gerar o resumo');
        } finally {
            setIsLoading(false);
        }
    };

    const salvarResumo = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setSuccess(false);

            console.log('Iniciando envio do resumo...');

            const response = await fetch('http://localhost:3002/api/resumos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo,
                    descricao,
                    icone,
                    resumo // Inclui o resumo no payload
                })
            });

            console.log('Resposta recebida:', response.status);

            const data = await response.json();
            console.log('Dados recebidos:', data);

            if (response.ok) {
                setSuccess(true);
                // Limpar o formulário após sucesso
                setTitulo("");
                setDescricao("");
                setIcone("Calculator");
                setResumo(""); // Limpa o resumo após salvar
            } else {
                setError(data.message || 'Erro ao enviar resumo');
            }
        } catch (error) {
            console.error('Erro ao enviar resumo:', error);
            setError(error.message || 'Não foi possível enviar o resumo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <Logo className="h-12 w-12" variant="icon" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Criar Resumo</h1>
                </div>

                {success && (
                    <div className="mb-4 p-4 bg-greenm-100 text-green-700 rounded-md justify-center flex flex-row gap-3">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAACD0lEQVR4nM1WP2sUURBfxUYtlLuZ29MIGtCIqI2iXpKZXVDyCQRLK0kl2CiWv9m9CKLoJzBWBr9AJCkULGy0sPZPpxwm2PgRZDZncuutm93jOBxYHvvezO838968mRcE/4sQZJGgzznR603MHfWRIc8IemssBAw1hn4ii+4QZJ0hv3z0fzb9zKbJqMB32eQNmfxgk/ftB8JFej7v665H0NduV5EgPkmQjVYSLTSWOlNVbBpLnSnXdztKo1O7GhDkkX+VPKpti3gfQ1IPPezqdDCChF2dzrYYkjrekAJDVtnkFSNu1wJO588y9PYOTtzewpHVIpIvBJmp5TqCvQR95yk+ON1M50575hWRfGgm0aU6HORpDH0bBMGewfkwkSuedTnl8PHCQTbtNdLoTFWCEPEJMvlZFL3jON4RXDywE4VpwpAXtaKArLPJ/X+ts8mKX+RBkp6H+Leib1+7O3t8CADzNxnysTCDclumvXwkJisF3i4y5Fsrjc5vG2O2lV066IWySLNIBktO2ZkQoht90Kjv0EuCPiwj+HMmjls5u5rQq2S6ydCnnurHnnT2l5JALzve0AKZfC2rOyHic2zyvZXItTKCDAsy486MdOMPIT68G0HpjZ9I7ZpMFZ5kP8l1RshGtc6om67PpveCUWSr5PR7vOla1uNN17Z7vO//OMRfJWy6nHutmC6P7bUyDvkNKEfqWvhHuk8AAAAASUVORK5CYII=" alt="approval--v1" />
                        Resumo criado com sucesso!
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md justify-center flex flex-row gap-3 items-center">
                        <img src="/assets/alert_error_icon.png" alt="error--v1" />
                        {error}
                    </div>
                )}

                <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100 w-full max-w-6xl mx-auto">
                    <h2 className="text-xl font-semibold text-[#133D86] mb-6">Informações do Resumo</h2>
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#133D86] text-base">Título do Resumo</label>
                            <Input
                                type="text"
                                placeholder="Ex: Matemática Básica ENEM"
                                className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                value={titulo}
                                onChange={e => setTitulo(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#133D86] text-base">Ícone do Resumo</label>
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex gap-2 flex-wrap">
                                    {ICON_OPTIONS.map(opt => {
                                        const Icon = opt.icon;
                                        return (
                                            <button
                                                type="button"
                                                key={opt.value}
                                                className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${icone === opt.value ? 'bg-[#133D86] text-white border-[#133D86] scale-110 shadow-lg' : 'bg-white text-[#133D86] border-gray-200 hover:bg-[#e6eefc]'} `}
                                                onClick={() => setIcone(opt.value)}
                                                title={opt.label}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#133D86] text-base">Resumo</label>
                            <Textarea
                                placeholder="Ex: Questões de álgebra, geometria e funções"
                                className="text-base font-normal h-55 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm resize-none"
                                value={resumo}
                                onChange={e => setResumo(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={gerarResumo}
                            disabled={isLoading || !titulo }
                            className="w-full mt-4"
                        >
                            {isLoading ? 'Gerando...' : 'Gerar Resumo'}
                        </Button>
                        <Button
                            onClick={salvarResumo}
                            disabled={isLoading || !titulo || !resumo}
                            className="w-full mt-4"
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Resumo'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}   