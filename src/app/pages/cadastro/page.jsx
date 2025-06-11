'use client';

/**
 * Página de Cadastro de Usuários
 * Permite cadastro de estudantes e professores com validação de formulário
 * Inclui seleção de turmas, matérias e turnos baseados no tipo de usuário
 */

import { useState, useEffect } from "react";
import {
    Form,
    FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Logo from '@/components/ui/logo';
import { BaseFormField, SelectFormField, MultiSelectFormField } from "@/components/ui/formfield";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';

/**
 * Endpoints da API para diferentes recursos
 */
const API_ENDPOINTS = {
    student: "http://localhost:3000/admin/students",
    teacher: "http://localhost:3000/admin/teachers",
    classes: "http://localhost:3000/admin/classes",
    subjects: "http://localhost:3000/admin/subjects"
};

const SHIFT_OPTIONS = [
    { value: "Morning", label: "Manhã" },
    { value: "Afternoon", label: "Tarde" },
    { value: "Evening", label: "Noite" }
];

const shiftTurma = (shift) => {
    const shiftOption = SHIFT_OPTIONS.find(option => option.value === shift);
    return shiftOption ? shiftOption.label : shift;
};

const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR') : null;

const formSchema = z.object({
    tipo: z.enum(["student", "teacher", "subjects"], {
        required_error: "Selecione um tipo",
    }),
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome deve ter no máximo 100 caracteres"),
    email: z.string().optional().or(z.literal('')),
    password: z.string().optional().or(z.literal('')),
    cpf: z.string().optional().or(z.literal('')),
    birth_date: z.string().optional().or(z.literal('')),
    class: z.string().optional().or(z.literal('')), 
    curso: z.string().max(100, "Curso deve ter no máximo 100 caracteres").optional().or(z.literal('')),
    subjects: z.array(z.string()).optional().or(z.literal([])),
}).refine((data) => {
    // Validações específicas por tipo
    if (data.tipo === 'teacher') {
        // Validações para professor
        if (!data.email || data.email === '') {
            return false;
        }
        if (!z.string().email().safeParse(data.email).success) {
            return false;
        }
        if (!data.password || data.password === '') {
            return false;
        }
        if (!z.string().min(6).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).safeParse(data.password).success) {
            return false;
        }
        if (!data.cpf || data.cpf === '') {
            return false;
        }
        if (!z.string().min(11).max(14).regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/).safeParse(data.cpf).success) {
            return false;
        }
        if (!data.birth_date || data.birth_date === '') {
            return false;
        }
        if (!z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(data.birth_date).success) {
            return false;
        }
        if (!data.subjects || data.subjects.length === 0) {
            return false;
        }
        if (data.subjects.length > 5) {
            return false;
        }
    }
    
    if (data.tipo === 'student') {
        // Validações para estudante
        if (!data.email || data.email === '') {
            return false;
        }
        if (!z.string().email().safeParse(data.email).success) {
            return false;
        }
        if (!data.password || data.password === '') {
            return false;
        }
        if (!z.string().min(6).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).safeParse(data.password).success) {
            return false;
        }
        if (!data.cpf || data.cpf === '') {
            return false;
        }
        if (!z.string().min(11).max(14).regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/).safeParse(data.cpf).success) {
            return false;
        }
        if (!data.birth_date || data.birth_date === '') {
            return false;
        }
        if (!z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(data.birth_date).success) {
            return false;
        }
        if (!data.class || data.class === '') {
            return false;
        }
    }
    
    if (data.tipo === 'subjects') {
        // Validação para disciplina
        if (!data.name || data.name.trim() === '') {
            return false;
        }
    }
    
    return true;
}, {
    message: "Preencha todos os campos obrigatórios corretamente",
    path: ["tipo"]
});

// Formulários específicos
const SubjectForm = ({ control }) => (
    <BaseFormField
        control={control}
        name="name"
        label="Nome da Disciplina"
        placeholder="Nome da Disciplina"
    />
);

const ProfessorForm = ({ control, subjects, isLoading, error }) => (
    <>
        <BaseFormField
            control={control}
            name="name"
            label="Nome"
            placeholder="Nome"
        />
        <BaseFormField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
        />
        <BaseFormField
            control={control}
            name="password"
            label="Senha"
            type="password"
            placeholder="Senha"
        />
        <BaseFormField
            control={control}
            name="cpf"
            label="CPF"
            placeholder="CPF"
        />
        <BaseFormField
            control={control}
            name="birth_date"
            label="Data de Nascimento"
            type="date"
            placeholder="Data de Nascimento"
        />
        <MultiSelectFormField
            control={control}
            name="subjects"
            label="Disciplinas"
            options={subjects.map((subject, index) => ({
                value: (index + 1).toString(),
                label: subject.charAt(0).toUpperCase() + subject.slice(1)
            }))}
            placeholder="Selecione as disciplinas"
            disabled={isLoading}
            maxSelections={5}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {isLoading && <p className="text-sm text-muted-foreground">Carregando disciplinas...</p>}
    </>
);

const AlunoForm = ({ control, classes, isLoading, error }) => (
    <>
        <BaseFormField
            control={control}
            name="name"
            label="Nome"
            placeholder="Nome"
        />
        <BaseFormField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
        />
        <BaseFormField
            control={control}
            name="password"
            label="Senha"
            type="password"
            placeholder="Senha"
        />
        <BaseFormField
            control={control}
            name="cpf"
            label="CPF"
            placeholder="CPF"
        />
        <BaseFormField
            control={control}
            name="birth_date"
            label="Data de Nascimento"
            type="date"
            placeholder="Data de Nascimento"
        />

        <div className="space-y-2">
            <FormLabel>Turma</FormLabel>
            {isLoading ? (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span>Carregando turmas...</span>
                </div>
            ) : error ? (
                <div className="text-sm text-red-500">
                    {error}
                </div>
            ) : classes.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                    Nenhuma turma disponível
                </div>
            ) : (
                <SelectFormField
                    control={control}
                    name="class"
                    label=""
                    options={classes.map((turma) => ({
                        value: turma.id.toString(),
                        label: `${turma.name} - ${shiftTurma(turma.shift)} (${turma.course})`
                    }))}
                    placeholder="Selecione uma turma"
                />
            )}
        </div>
    </>
);

function CadastroForm() {
    const { userRole } = useUser();
    const router = useRouter();
    const [state, setState] = useState({
        subjects: [],
        classes: [],
        isLoading: false,
        isLoadingClasses: false,
        error: null,
        errorClasses: null,
        isSubmitting: false,
        submitError: null,
        submitSuccess: false
    });
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipo: "",
            name: "",
            email: "",
            password: "",
            cpf: "",
            birth_date: "",
            subjects: [],
            class: "",
        },
    });

    const tipo = form.watch("tipo");

    const fetchData = async (endpoint, setter, loadingKey) => {
        const token = Cookies.get('token');
        try {
            setState(prev => ({ ...prev, [loadingKey]: true }));
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 }
            });

            if (!response.ok) throw new Error(`Erro ao buscar dados de ${endpoint}`);

            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error(`Erro ao buscar dados:`, error);
            setState(prev => ({
                ...prev,
                error: error.message,
                [loadingKey]: false
            }));
        } finally {
            setState(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    // Carregar dados iniciais apenas uma vez
    useEffect(() => {
        const loadInitialData = async () => {
            await fetchData(
                API_ENDPOINTS.classes,
                data => setState(prev => ({ ...prev, classes: data })),
                'isLoadingClasses'
            );
            await fetchData(
                API_ENDPOINTS.subjects,
                data => setState(prev => ({ ...prev, subjects: data.map(item => item.name) })),
                'isLoading'
            );
        };

        loadInitialData();
    }, []);

    // Recarregar turmas apenas quando o tipo mudar para students
    useEffect(() => {
        if (tipo === 'student' && state.classes.length === 0) {
            fetchData(
                API_ENDPOINTS.classes,
                data => setState(prev => ({ ...prev, classes: data })),
                'isLoadingClasses'
            );
        }
    }, [tipo]);

    useEffect(() => {
        // Simulate loading user role
        const timer = setTimeout(() => {
            if (userRole !== "admin") {
                router.push("/not-found");
            } else {
                setIsAuthorized(true);
            }
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [userRole, router]);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!isAuthorized) {
        return null;
    }

    const formatPayload = (data, tipo) => {
        const payloads = {
            subjects: { name: data.name.trim() },
            teacher: {
                user: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    birth_date: data.birth_date.split('-').reverse().join('/'),
                    cpf: data.cpf,
                    role: "Teacher"
                },
                teacher: {
                    subjects: data.subjects.map(subjectId => ({ id: parseInt(subjectId) }))
                }
            },
            student: {
                user: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    birth_date: data.birth_date.split('-').reverse().join('/'),
                    cpf: data.cpf,
                    role: "Student"
                },
                student: {
                    class_id: parseInt(data.class)
                }
            }
        };
        return payloads[tipo];
    };

    const onSubmit = async (data) => {
        const token = Cookies.get('token');
        try {
            setState(prev => ({ ...prev, isSubmitting: true, submitError: null, submitSuccess: false }));

            const endpoint = API_ENDPOINTS[data.tipo];
            if (!endpoint) throw new Error("Tipo de cadastro inválido");

            const cleanData = formatPayload(data, data.tipo);
            if (!cleanData) throw new Error("Formato de dados inválido para o tipo selecionado");
            console.log('Dados enviados:', cleanData);
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                mode: 'cors',
                credentials: 'include',
                body: JSON.stringify(cleanData)
            });

            const responseText = await response.text();
            const responseData = responseText ? JSON.parse(responseText) : {};

            if (!response.ok) {
                throw new Error(responseData.message || `Erro ao cadastrar: ${response.status}`);
            }

            setState(prev => ({ ...prev, submitSuccess: true }));
            window.location.reload();
            form.reset();
        } catch (error) {
            console.error("Erro no cadastro:", error);
            setState(prev => ({ ...prev, submitError: error.message }));
        } finally {
            setState(prev => ({ ...prev, isSubmitting: false }));
        }
    };

    const renderFormByType = () => {
        switch (tipo) {
            case "subjects":
                return <SubjectForm control={form.control} />;
            case "teacher":
                return <ProfessorForm
                    control={form.control}
                    subjects={state.subjects}
                    classes={state.classes}
                    isLoading={state.isLoading}
                    error={state.error}
                />;
            case "student":
                return <AlunoForm
                    control={form.control}
                    classes={state.classes}
                    isLoading={state.isLoadingClasses}
                    error={state.errorClasses}
                />;
            default:
                return null;
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6eefc] via-[#f8fafc] to-[#c3dafe] p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                <div className="flex flex-col items-center mb-8">
                    <Logo className="h-12 w-12" variant="icon" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Cadastro</h1>
                </div>

                {state.submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex flex-row gap-3 items-center border border-green-200 animate-fade-in">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Cadastro realizado com sucesso!
                    </div>
                )}

                {state.submitError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex flex-row gap-3 items-center border border-red-200 animate-fade-in">
                        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        {state.submitError}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <SelectFormField
                            control={form.control}
                            name="tipo"
                            options={[
                                { value: "student", label: "Alunos" },
                                { value: "teacher", label: "Professores" },
                                { value: "subjects", label: "Disciplinas" }
                            ]}
                            placeholder="Selecione o tipo de cadastro"
                            disabled={state.isSubmitting}
                        />

                        {tipo && (
                            <div className="space-y-6">
                                {renderFormByType()}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full mt-8 h-12 text-lg bg-[#133D86] hover:bg-[#0e2a5c] transition-all duration-300 rounded-xl shadow-md font-semibold"
                            disabled={state.isSubmitting || !tipo}
                        >
                            {state.isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
export default function Cadastro() {
    return <CadastroForm />;
}
