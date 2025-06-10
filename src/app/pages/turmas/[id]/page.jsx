'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, GraduationCap, Users } from "lucide-react";
import Logo from "@/components/ui/logo";
import { toast } from "sonner";
import Link from "next/link";
import { handleApiError, handleFetchError, handleUnexpectedError } from "@/utils/errorHandler";
import Cookies from "js-cookie";

export default function TurmaDetalhesPage() {
  const params = useParams();
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTurmaDetalhes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = Cookies.get('token');
        const turmaResponse = await fetch(`http://localhost:3000/admin/classes/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Resposta da turma:', turmaResponse.json);
        const turmaData = await turmaResponse.json();
        console.log('Dados da turma:', turmaData);

        await handleApiError(turmaResponse, 'buscar detalhes da turma');
      
        setTurma(turmaData);
        setAlunos(turmaData.students || []);
        setProfessores(turmaData.teachers || []);

      } catch (error) {
        handleUnexpectedError(error, 'carregar página de turma');
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTurmaDetalhes();
    }
  }, [params.id]);

  const filteredAlunos = alunos.filter((aluno) => {
    return aluno.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.enrollment.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Erro ao carregar turma</div>
            <div className="text-red-500">{error}</div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const SHIFT_OPTIONS = [
    { value: 'Morning', label: 'Manhã' },
    { value: 'Afternoon', label: 'Tarde' },
    { value: 'Evening', label: 'Noturno' },
  ];

  const getShiftLabel = (shiftValue) => {
    const shift = SHIFT_OPTIONS.find(option => option.value === shiftValue);
    return shift ? shift.label : shiftValue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Link href="/pages/turmas" className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Turmas
          </Link>
        </div>

        <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <Logo className="h-12 w-12" variant="icon" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">{turma?.name}</h1>
          <div className="mt-2 text-center text-gray-600">
            <p>Curso: {turma?.course}</p>
            <p>Turno: {getShiftLabel(turma?.shift)}</p>
          </div>
        </div>

        <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
          <CardHeader className="bg-gradient-to-r from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                <CardTitle>Professores da Turma</CardTitle>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {professores.length} {professores.length === 1 ? 'professor' : 'professores'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {professores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p>Nenhum professor atribuído a esta turma</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disciplina</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {professores.map((professor) => (
                      <tr key={professor.teacher_id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{professor.teacher_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{professor.teacher_email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-wrap gap-1">
                            {professor.subjects?.map((subject, index) => (
                              <span key={subject.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {subject.name}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Barra de Pesquisa */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Pesquisar aluno por nome ou matrícula..."
              className="pl-10 py-6 text-lg border-2 border-gray-200 focus:border-[#133D86] focus:ring-[#133D86] rounded-xl shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <CardTitle>Alunos da Turma</CardTitle>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {filteredAlunos.length} {filteredAlunos.length === 1 ? 'aluno' : 'alunos'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAlunos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p>{searchTerm ? 'Nenhum aluno encontrado com esse termo de busca' : 'Nenhum aluno matriculado nesta turma'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAlunos.map((aluno) => (
                      <tr key={aluno.student_id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aluno.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aluno.enrollment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aluno.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[#133D86] hover:text-[#1e56b3] hover:bg-blue-50"
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}