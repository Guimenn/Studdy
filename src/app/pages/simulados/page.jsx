'use client';

import { useState } from "react";
import Question from "@/components/ui/question";
import Logo from '@/components/ui/logo';
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, FileText } from "lucide-react";

export default function SimuladosPage() {
    const [questoes, setQuestoes] = useState([1]);

    const adicionarQuestao = () => {
        setQuestoes(prev => [...prev, prev.length + 1]);
    };

    const excluirQuestao = (numeroQuestao) => {
        setQuestoes(prev => prev.filter(num => num !== numeroQuestao));
    };

    const salvarSimulado = () => {
        // TODO: Implementar lógica para salvar o simulado
        console.log("Salvando simulado...");
    };

    return (
        <div className="bg-slate-100 min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center mb-6 bg-white rounded-lg shadow-lg p-4">
                    <Logo className="h-9 w-9" variant="icon" />
                    <h1 className="mt-4 text-2xl font-bold tracking-tight">Gerar Simulado</h1>
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

                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-slate-600" />
                            <span className="text-slate-600 font-medium">
                                {questoes.length} {questoes.length === 1 ? 'Questão' : 'Questões'}
                            </span>
                        </div>
                        <div className="flex gap-3">
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
        </div>
    );
}   