'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MinusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import Alert from "@/components/ui/alerts";

const formSchema = z.object({
    pergunta: z.string().min(1, "Digite uma pergunta"),
    respostaCorreta: z.string().min(1, "Digite a resposta correta"),
});

function QuestionForm({ numeroQuestao, onAddQuestion, onDeleteQuestion }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [alternativas, setAlternativas] = useState({
        alternativa1: '',
        alternativa2: '',
        alternativa3: ''
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pergunta: "",
            respostaCorreta: ""
        },
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);
            setAlternativas({
                alternativa1: '',
                alternativa2: '',
                alternativa3: ''
            });

            const payload = {
                pergunta: data.pergunta,
                respostaCorreta: data.respostaCorreta
            };

            const response = await fetch(`https://api-studdy.onrender.com/api/gerar-alternativas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || errorData.error || 'Erro ao gerar alternativas';
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log(`Alternativas geradas:`, result);

            if (result.alternativasErradas && result.alternativasErradas.length >= 3) {
                setAlternativas({
                    alternativa1: result.alternativasErradas[0].trim(),
                    alternativa2: result.alternativasErradas[1].trim(),
                    alternativa3: result.alternativasErradas[2].trim()
                });
            }

            setSubmitSuccess(true);
        } catch (error) {
            console.error(error);
            setSubmitError(error.message || 'Erro ao gerar alternativas');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Questão {numeroQuestao}</h2>

            <Alert
                submitSuccess={submitSuccess}
                submitError={submitError}
                successMessage="Alternativas geradas com sucesso!"
                errorMessage="Erro ao gerar alternativas"
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="pergunta"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pergunta</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Digite sua pergunta"
                                        {...field}
                                        disabled={isSubmitting}
                                        className="min-h-[100px] resize-none focus-visible:border-[#1e40af] focus-visible:ring-[#1e40af] focus-visible:ring-[3px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="respostaCorreta"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-green-500">Resposta Correta</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Digite a resposta correta"
                                        {...field}
                                        disabled={isSubmitting}
                                        className="focus-visible:border-green-500 focus-visible:ring-green-500/50 focus-visible:ring-[3px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {submitSuccess && (
                        <div className="space-y-4">
                            <FormItem>
                                <FormLabel className="text-red-500">Alternativa Incorreta 1</FormLabel>
                                <FormControl>
                                    <Input
                                        value={alternativas.alternativa1}
                                        onChange={(e) => setAlternativas(prev => ({
                                            ...prev,
                                            alternativa1: e.target.value
                                        }))}
                                        className="focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]"
                                    />
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel className="text-red-500">Alternativa Incorreta 2</FormLabel>
                                <FormControl>
                                    <Input
                                        value={alternativas.alternativa2}
                                        onChange={(e) => setAlternativas(prev => ({
                                            ...prev,
                                            alternativa2: e.target.value
                                        }))}
                                        className="focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]"
                                    />
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel className="text-red-500">Alternativa Incorreta 3</FormLabel>
                                <FormControl>
                                    <Input
                                        value={alternativas.alternativa3}
                                        onChange={(e) => setAlternativas(prev => ({
                                            ...prev,
                                            alternativa3: e.target.value
                                        }))}
                                        className="focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]"
                                    />
                                </FormControl>
                            </FormItem>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Gerando...' : 'Gerar Alternativas'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onDeleteQuestion}
                            className="flex items-center gap-2 bg-red-700 text-white hover:bg-red-600"
                        >
                            <MinusCircle className="h-4 w-4" />
                            Excluir Questão 
                        </Button>
                    </div>
                </form>
            </Form>
            <Separator className="my-10" />
        </div>
    );
}

export default function Question({ numeroQuestao, onAddQuestion, onDeleteQuestion }) {
    return <QuestionForm 
        numeroQuestao={numeroQuestao} 
        onAddQuestion={onAddQuestion} 
        onDeleteQuestion={onDeleteQuestion}
    />;
}   