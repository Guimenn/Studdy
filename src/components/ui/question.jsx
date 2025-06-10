'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MinusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const formSchema = z.object({
    question: z.string().min(1, 'A pergunta é obrigatória'),
    correct_answer: z.string().min(1, 'A resposta correta é obrigatória')
});

function QuestionForm({ questionId, numeroQuestao, onAddQuestion, onDeleteQuestion, onAlternativesGenerated, existingQuestion, onQuestionChange }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alternativas, setAlternativas] = useState({
        alternativa1: existingQuestion?.alternatives?.find(alt => !alt.isCorrect)?.text || '',
        alternativa2: existingQuestion?.alternatives?.filter(alt => !alt.isCorrect)[1]?.text || '',
        alternativa3: existingQuestion?.alternatives?.filter(alt => !alt.isCorrect)[2]?.text || ''
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: existingQuestion?.statement || '',
            correct_answer: existingQuestion?.alternatives?.find(alt => alt.isCorrect)?.text || ''
        }
    });

    const question = form.watch('question');
    const correctAnswer = form.watch('correct_answer');

    // Função para atualizar a questão
    const updateQuestion = useCallback(() => {
        if (!onQuestionChange) return;

            const updatedQuestion = {
                id: questionId,
                statement: question,
            points: existingQuestion?.points || 1,
                alternatives: [
                    { 
                    id: existingQuestion?.alternatives?.find(alt => alt.isCorrect)?.id || Date.now(), 
                        text: correctAnswer, 
                        isCorrect: true 
                    },
                    { 
                    id: existingQuestion?.alternatives?.filter(alt => !alt.isCorrect)[0]?.id || Date.now() + 1, 
                        text: alternativas.alternativa1, 
                        isCorrect: false 
                    },
                    { 
                    id: existingQuestion?.alternatives?.filter(alt => !alt.isCorrect)[1]?.id || Date.now() + 2, 
                        text: alternativas.alternativa2, 
                        isCorrect: false 
                    },
                    { 
                    id: existingQuestion?.alternatives?.filter(alt => !alt.isCorrect)[2]?.id || Date.now() + 3, 
                        text: alternativas.alternativa3, 
                        isCorrect: false 
                    }
                ]
            };
            onQuestionChange(updatedQuestion);
    }, [question, correctAnswer, alternativas, questionId, onQuestionChange, existingQuestion]);

    // Atualizar quando os valores mudarem, com debounce
    useEffect(() => {
        const timeoutId = setTimeout(updateQuestion, 500);
        return () => clearTimeout(timeoutId);
    }, [updateQuestion]);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const payload = {
                question: data.question,
                correct_answer: data.correct_answer
            };

            const response = await fetch(`http://localhost:3000/generate/generate-alternatives`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
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

            if (result.incorrectAnswers && result.incorrectAnswers.length >= 3) {
                const novasAlternativas = {
                    alternativa1: result.incorrectAnswers[0].trim(),
                    alternativa2: result.incorrectAnswers[1].trim(),
                    alternativa3: result.incorrectAnswers[2].trim()
                };
                setAlternativas(novasAlternativas);
                
                // Atualizar a questão com as novas alternativas
                if (onQuestionChange) {
                    const updatedQuestion = {
                        id: questionId,
                        statement: data.question,
                        points: existingQuestion?.points || 1,
                        alternatives: [
                            { 
                                id: existingQuestion?.alternatives?.find(alt => alt.isCorrect)?.id || Date.now(), 
                                text: data.correct_answer, 
                                isCorrect: true 
                            },
                            { 
                                id: existingQuestion?.alternatives?.filter(alt => !alt.isCorrect)[0]?.id || Date.now() + 1, 
                                text: novasAlternativas.alternativa1, 
                                isCorrect: false 
                            },
                            { 
                                id: existingQuestion?.alternatives?.filter(alt => !alt.isCorrect)[1]?.id || Date.now() + 2, 
                                text: novasAlternativas.alternativa2, 
                                isCorrect: false 
                            },
                            { 
                                id: existingQuestion?.alternatives?.filter(alt => !alt.isCorrect)[2]?.id || Date.now() + 3, 
                                text: novasAlternativas.alternativa3, 
                                isCorrect: false 
                            }
                        ]
                    };
                    onQuestionChange(updatedQuestion);
                }

                toast.success('Alternativas geradas com sucesso!');
            } else {
                throw new Error('Não foi possível gerar as alternativas corretamente');
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Erro ao gerar alternativas');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Questão {numeroQuestao}</h2>

            <Form {...form}>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pergunta</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Digite sua question"
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
                        name="correct_answer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-green-600">Resposta Correta</FormLabel>
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

                    <div className="space-y-4">
                        <FormItem>
                            <FormLabel className="text-red-500">Alternativa Incorreta 1</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Clique em 'Gerar Alternativas' para preencher automaticamente"
                                    value={alternativas.alternativa1}
                                    onChange={(e) => {
                                        setAlternativas(prev => ({
                                            ...prev,
                                            alternativa1: e.target.value
                                        }));
                                    }}
                                    className="focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]"
                                />
                            </FormControl>
                        </FormItem>

                        <FormItem>
                            <FormLabel className="text-red-500">Alternativa Incorreta 2</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Clique em 'Gerar Alternativas' para preencher automaticamente"
                                    value={alternativas.alternativa2}
                                    onChange={(e) => {
                                        setAlternativas(prev => ({
                                            ...prev,
                                            alternativa2: e.target.value
                                        }));
                                    }}
                                    className="focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]"
                                />
                            </FormControl>
                        </FormItem>

                        <FormItem>
                            <FormLabel className="text-red-500">Alternativa Incorreta 3</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Clique em 'Gerar Alternativas' para preencher automaticamente"
                                    value={alternativas.alternativa3}
                                    onChange={(e) => {
                                        setAlternativas(prev => ({
                                            ...prev,
                                            alternativa3: e.target.value
                                        }));
                                    }}
                                    className="focus-visible:border-red-500 focus-visible:ring-red-500/50 focus-visible:ring-[3px]"
                                />
                            </FormControl>
                        </FormItem>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            className="flex-1"
                            disabled={isSubmitting}
                            onClick={form.handleSubmit(onSubmit)}
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
                </div>
            </Form>
            <Separator className="my-10" />
        </div>
    );
}

export default function Question({ questionId, numeroQuestao, onAddQuestion, onDeleteQuestion, onAlternativesGenerated, existingQuestion, onQuestionChange }) {
    return <QuestionForm 
        questionId={questionId}
        numeroQuestao={numeroQuestao} 
        onAddQuestion={onAddQuestion} 
        onDeleteQuestion={onDeleteQuestion}
        onAlternativesGenerated={onAlternativesGenerated}
        existingQuestion={existingQuestion}
        onQuestionChange={onQuestionChange}
    />;
}