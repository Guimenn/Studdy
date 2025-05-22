'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
import Logo from '@/components/ui/logo';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Alert from "@/components/ui/alerts";

const formSchema = z.object({
    tipo: z.string().min(1, "Selecione um tipo de usuário"),
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    matricula: z.string().optional(),
    curso: z.string().optional(),
    formacao: z.string().optional(),
    area: z.string().optional(),
});

function CadastroForm() {
    const [areas, setAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isGeneratingMatricula, setIsGeneratingMatricula] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipo: "selecione",
            nome: "",
            email: "",
            senha: "",
            matricula: "",
            curso: "",
            formacao: "",
            area: "",
        },
    });

    const tipo = form.watch("tipo");

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('https://api-studdy.onrender.com/api/disciplinas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    mode: 'cors',
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar áreas: ${response.status}`);
                }

                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('Formato de resposta inválido');
                }

                const areasList = data.map(item => item.nome || item.name || item);
                setAreas(areasList);
            } catch (error) {
                console.error('Erro ao buscar áreas:', error);
                setError(error.message || 'Não foi possível carregar as áreas');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAreas();
    }, []);

    const gerarMatriculaUnica = async () => {
        try {
            setIsGeneratingMatricula(true);
            let matriculaUnica = false;
            let novaMatricula = "";

            while (!matriculaUnica) {
                const numeroAleatorio = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                novaMatricula = "2425" + numeroAleatorio;

                const response = await fetch(`https://api-studdy.onrender.com/api/alunos/matricula/${novaMatricula}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (response.status === 404) {
                    matriculaUnica = true;
                } else if (!response.ok) {
                    throw new Error('Erro ao verificar matrícula');
                }
            }

            form.setValue("matricula", novaMatricula);
        } catch (error) {
            console.error('Erro ao gerar matrícula:', error);
            setSubmitError('Erro ao gerar matrícula. Tente novamente.');
        } finally {
            setIsGeneratingMatricula(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);

            let payload;
            if (data.tipo === "professores") {
                payload = {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    formacao: data.formacao,
                    area_atuacao: data.area
                };
            } else {
                payload = {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    matricula: data.matricula,
                    curso: data.curso
                };
            }

            const response = await fetch(`https://api-studdy.onrender.com/api/${data.tipo}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || errorData.error || 'Erro ao realizar cadastro';
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log(`${data.tipo === "professores" ? "Professor" : "Aluno"} cadastrado:`, result);

            setSubmitSuccess(true);
            form.reset();
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            setSubmitError(error.message || 'Erro ao realizar cadastro');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col items-center mb-6">
                    <Logo className="h-9 w-9" variant="icon" />
                    <h1 className="mt-4 text-2xl font-bold tracking-tight">Cadastro</h1>
                </div>

                <Alert submitSuccess={submitSuccess} submitError={submitError} />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem className="mb-6">
                                    <FormLabel>Tipo de Usuário</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo de usuário" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="selecione">Selecione</SelectItem>
                                            <SelectItem value="alunos">Alunos</SelectItem>
                                            <SelectItem value="professores">Professores</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {tipo && tipo !== "selecione" && (
                            <>
                                {tipo === "alunos" && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="nome"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nome" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="Email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="senha"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Senha</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Senha" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="matricula"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Matrícula</FormLabel>
                                                    <FormControl>
                                                        <Input maxLength={8} placeholder="Matrícula" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button 
                                            className="w-full" 
                                            onClick={gerarMatriculaUnica}
                                            disabled={isGeneratingMatricula}
                                        >
                                            {isGeneratingMatricula ? 'Gerando...' : 'Gerar Número de Matrícula'}
                                        </Button>

                                        <FormField
                                            control={form.control}
                                            name="curso"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Curso</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Curso" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {tipo === "professores" && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="nome"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nome" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="Email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="senha"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Senha</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Senha" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="formacao"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Formação</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Formação" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="area"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Área</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        disabled={isLoading}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione uma área" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {areas.map((area, index) => (
                                                                <SelectItem key={`area-${index}`} value={area}>
                                                                    {area}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                                    {isLoading && <p className="text-sm text-muted-foreground">Carregando áreas...</p>}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full mt-6"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                                </Button>
                            </>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default function Cadastro() {
    return <CadastroForm />;
}