'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/ui/logo";
import { ArrowLeft, Save, User } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export default function EditUserPage() {
    const { userRole } = useUser();
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birth_date: '',
        cpf: '',
        role: ''
    });

    useEffect(() => {
        if (userRole !== 'admin') {
            router.push('/');
            return;
        }
        if (params?.id) {
            fetchUser();
        }
    }, [userRole, params?.id]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const response = await fetch(`http://localhost:3000/user/${params.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao carregar usuário');
            }

            const data = await response.json();
            setUser(data);
            
            // Formatar a data de DD/MM/YYYY para YYYY-MM-DD (formato do input date)
            const [day, month, year] = data.birth_date.split('/');
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

            setFormData({
                name: data.name,
                email: data.email,
                birth_date: formattedDate,
                cpf: data.cpf,
                role: data.role
            });
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            toast.error(error.message || 'Erro ao carregar usuário');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = Cookies.get('token');
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            // Formatar a data de YYYY-MM-DD para DD/MM/YYYY antes de enviar
            const [year, month, day] = formData.birth_date.split('-');
            const formattedDate = `${day}/${month}/${year}`;

            const dataToSend = {
                ...formData,
                birth_date: formattedDate
            };

            console.log('Dados a serem enviados:', dataToSend);
            
            const response = await fetch(`http://localhost:3000/user/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao atualizar usuário');
            }

            toast.success('Usuário atualizado com sucesso!');
            router.push('/pages/administracao');
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            toast.error(error.message || 'Erro ao atualizar usuário');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) return <PageLoader />;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto max-w-3xl">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Editar Usuário</h1>
                        <p className="mt-2 text-center text-gray-600">Atualize as informações do usuário</p>
                    </div>

                    <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <CardTitle>Informações do Usuário</CardTitle>
                                </div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                    {user.role === 'Teacher' ? 'Professor' : 'Aluno'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-11 border-2 focus:border-[#133D86] focus:ring-[#133D86] rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-11 border-2 focus:border-[#133D86] focus:ring-[#133D86] rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date" className="text-sm font-medium text-gray-700">Data de Nascimento</Label>
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={formData.birth_date}
                                            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                            className="h-11 border-2 focus:border-[#133D86] focus:ring-[#133D86] rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">CPF</Label>
                                        <Input
                                            id="cpf"
                                            value={formData.cpf}
                                            onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                            className="h-11 border-2 focus:border-[#133D86] focus:ring-[#133D86] rounded-lg"
                                            required
                                        />
                                    </div>

                                   
                                </div>

                                <div className="flex justify-between pt-6 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2 border-2 hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => router.push('/pages/administracao')}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Voltar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-[#133D86] hover:bg-[#0e2a5c] text-white flex items-center gap-2 px-6 transition-colors duration-200"
                                        disabled={loading}
                                    >
                                        <Save className="h-4 w-4" />
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}