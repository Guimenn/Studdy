'use client';

import { useState } from "react";
import Question from "@/components/ui/question";
import Logo from '@/components/ui/logo';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input'
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
  
  
export default function SimuladosPage() {
    const [questoes, setQuestoes] = useState([1]);
    const [titulo, setTitulo] = useState("");
    const [icone, setIcone] = useState("Calculator");
    const [resumo, setResumo] = useState("");

    const adicionarQuestao = () => {
        setQuestoes(prev => [...prev, prev.length + 1]);
    };

    const excluirQuestao = (numeroQuestao) => {
        setQuestoes(prev => prev.filter(num => num !== numeroQuestao));
    };

    const salvarSimulado = () => {
        // TODO: Implementar lógica para salvar o simulado
        console.log({ titulo, icone, resumo });
    };

    return (
        <div className="bg-slate-100 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <Logo className="h-12 w-12" variant="icon" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Gerar Simulado</h1>
                </div>
                <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-8 border border-gray-100 w-full max-w-6xl mx-auto">
                    <h2 className="text-xl font-semibold text-[#133D86] mb-6">Informações do Simulado</h2>
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#133D86] text-base">Título do Simulado</label>
                            <Input
                                type="text"
                                placeholder="Ex: Matemática Básica ENEM"
                                className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                value={titulo}
                                onChange={e => setTitulo(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[#133D86] text-base">Ícone do Simulado</label>
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
                                                tabIndex={-1}
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
                            <Input
                                type="text"
                                placeholder="Ex: Questões de álgebra, geometria e funções"
                                className="text-base font-normal h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] shadow-sm"
                                value={resumo}
                                onChange={e => setResumo(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg">
                    {questoes.map((_, index) => (
                        <Question
                            key={index}
                            numeroQuestao={index + 1}
                            onAddQuestion={adicionarQuestao}
                            onDeleteQuestion={() => excluirQuestao(questoes[index])}
                        />
                    ))}
                </div>

                <div className="mt-6 space-y-4 ">
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex items-center gap-2 ">
                            <FileText className="h-5 w-5 text-slate-600" />
                            <span className="text-slate-600 font-medium">
                                {questoes.length} {questoes.length === 1 ? 'Questão' : 'Questões'}
                            </span>
                        </div>
                        <div className="flex gap-3 flex-col lg:flex-row">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                                onClick={adicionarQuestao}
                            >
                                <PlusCircle className="h-5 w-5 mr-2" />
                                Nova Questão
                            </Button>
                            <Button
                                size="lg"
                                className=" text-white"
                                onClick={salvarSimulado}
                            >
                                <Save className="h-5 w-5 mr-2" />
                                Finalizar Simulado
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}   