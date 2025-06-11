'use client';

/**
 * Página de Detalhes da Turma
 * Permite visualizar e gerenciar estudantes de uma turma específica
 * Inclui funcionalidades de busca, adição e remoção de estudantes
 */

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
import { Search, ArrowLeft, GraduationCap, Users, Plus, X, Eye, Mail, IdCard, BookOpen, User as UserIcon } from "lucide-react";
import Logo from "@/components/ui/logo";
import { toast } from "sonner";
import Link from "next/link";
import { handleApiError, handleFetchError, handleUnexpectedError } from "@/utils/errorHandler";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function TurmaDetalhesPage() {
  const params = useParams();
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAtribuirProfessorOpen, setIsAtribuirProfessorOpen] = useState(false);
  const [todosProfessores, setTodosProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedDisciplina, setSelectedDisciplina] = useState("");
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [professorDetalhes, setProfessorDetalhes] = useState(null);
  const [isVerDetalhesOpen, setIsVerDetalhesOpen] = useState(false);
  const [isDeletando, setIsDeletando] = useState(false);
  const [alunoDetalhes, setAlunoDetalhes] = useState(null);
  const [isVerDetalhesAlunoOpen, setIsVerDetalhesAlunoOpen] = useState(false);
  const [professorParaDeletar, setProfessorParaDeletar] = useState(null);
  const [isDialogDeletarOpen, setIsDialogDeletarOpen] = useState(false);

  const fetchTurmaDetalhes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get('token');
      const turmaResponse = await fetch(`https://api-studdy.onrender.com/admin/classes/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!turmaResponse.ok) {
        throw new Error('Erro ao carregar detalhes da turma');
      }

      const turmaData = await turmaResponse.json();
      setTurma(turmaData);
      setAlunos(turmaData.students || []);
      setProfessores(turmaData.teachers || []);
    } catch (error) {
      console.error('Erro ao carregar turma:', error);
      setError(error.message);
      toast.error('Erro ao carregar detalhes da turma');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTurmaDetalhes();
  }, [params.id]);

  const filteredAlunos = alunos.filter((aluno) => {
    return aluno.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.enrollment.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchTodosProfessores = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch('https://api-studdy.onrender.com/admin/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erro ao carregar professores');
      
      const data = await response.json();
      setTodosProfessores(data);
    } catch (error) {
      toast.error('Erro ao carregar lista de professores');
      console.error(error);
    }
  };

  const fetchDisciplinas = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch('https://api-studdy.onrender.com/admin/subjects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erro ao carregar disciplinas');
      
      const data = await response.json();
      setDisciplinas(data);
    } catch (error) {
      toast.error('Erro ao carregar lista de disciplinas');
      console.error(error);
    }
  };

  const handleAddDisciplina = () => {
    if (!selectedDisciplina) {
      toast.error('Selecione uma disciplina');
      return;
    }

    // Verifica se a disciplina já foi selecionada
    if (selectedDisciplinas.some(d => d.id === parseInt(selectedDisciplina))) {
      toast.error('Esta disciplina já foi selecionada');
      return;
    }

    const disciplina = disciplinas.find(d => d.id === parseInt(selectedDisciplina));
    setSelectedDisciplinas([...selectedDisciplinas, disciplina]);
    setSelectedDisciplina("");
  };

  const handleRemoveDisciplina = (disciplinaId) => {
    setSelectedDisciplinas(selectedDisciplinas.filter(d => d.id !== disciplinaId));
  };

  const handleAtribuirProfessor = async () => {
    if (!selectedProfessor || selectedDisciplinas.length === 0) {
      toast.error('Selecione um professor e pelo menos uma disciplina');
      return;
    }

    try {
      setIsLoading(true);
      const token = Cookies.get('token');
      
      // Preparar os dados para atualização
      const updatedAssignments = [
        ...professores.map(p => ({
          teacher_id: p.teacher_id,
          subject_id: p.subjects[0].id
        })),
        ...selectedDisciplinas.map(d => ({
          teacher_id: parseInt(selectedProfessor),
          subject_id: d.id
        }))
      ];

      const response = await fetch(`https://api-studdy.onrender.com/admin/classes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: turma.name,
          shift: turma.shift,
          course: turma.course,
          assignments: updatedAssignments
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atribuir professor');
      }

      toast.success('Professor atribuído com sucesso!');
      setIsAtribuirProfessorOpen(false);
      setSelectedProfessor("");
      setSelectedDisciplinas([]);
      setSelectedDisciplina("");
      
      // Recarregar os dados da turma
      await fetchTurmaDetalhes();
    } catch (error) {
      console.error('Erro ao atribuir professor:', error);
      toast.error(error.message || 'Erro ao atribuir professor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerDetalhes = (professor) => {
    setProfessorDetalhes(professor);
    setIsVerDetalhesOpen(true);
  };

  const handleClickDeletarProfessor = (professor) => {
    setProfessorParaDeletar(professor);
    setIsDialogDeletarOpen(true);
  };

  const handleConfirmarDeletarProfessor = async () => {
    if (!professorParaDeletar) return;
    setIsDeletando(true);
    try {
      const token = Cookies.get('token');
      // Remove todas as disciplinas desse professor na turma
      const updatedAssignments = [
        ...professores
          .filter(p => p.teacher_id !== professorParaDeletar.teacher_id)
          .flatMap(p => p.subjects.map(s => ({
            teacher_id: p.teacher_id,
            subject_id: s.id
          })))
      ];

      console.log('DADOS a serem enviados:', {
        name: turma.name,
        shift: turma.shift,
        course: turma.course,
        assignments: updatedAssignments
      });
      
      const response = await fetch(`https://api-studdy.onrender.com/admin/classes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: turma.name,
          shift: turma.shift,
          course: turma.course,
          assignments: updatedAssignments
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao remover professor');
      }
      toast.success('Professor removido da turma!');
      await fetchTurmaDetalhes();
      setIsDialogDeletarOpen(false);
      setProfessorParaDeletar(null);
    } catch (error) {
      toast.error(error.message || 'Erro ao remover professor');
    } finally {
      setIsDeletando(false);
    }
  };

  const handleVerDetalhesAluno = (aluno) => {
    setAlunoDetalhes(aluno);
    setIsVerDetalhesAlunoOpen(true);
  };

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
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Detalhes da Turma</h1>
        </div>

        {/* Detalhes da Turma */}
        <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
          <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <CardTitle>Informações da Turma</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nome</label>
                <p className="text-lg font-semibold text-gray-900">{turma?.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Curso</label>
                <p className="text-lg font-semibold text-gray-900">{turma?.course}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Turno</label>
                <p className="text-lg font-semibold text-gray-900">{getShiftLabel(turma?.shift)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total de Alunos</label>
                <p className="text-lg font-semibold text-blue-600">{alunos.length}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total de Professores</label>
                <p className="text-lg font-semibold text-green-600">{professores.length}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</label>
                <Badge className="bg-green-100 text-green-800">Ativa</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
          <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                <CardTitle>Professores da Turma</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {professores.length} {professores.length === 1 ? 'professor' : 'professores'}
                </span>
                <Button
                  onClick={() => {
                    fetchTodosProfessores();
                    fetchDisciplinas();
                    setIsAtribuirProfessorOpen(true);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Atribuir Professor
                </Button>
              </div>
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
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disciplinas</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {professores.map((professor, idx) => (
                      <tr key={professor.teacher_id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-blue-50 transition-colors"}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{professor.teacher_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{professor.teacher_email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-2">
                            {professor.subjects.map((disciplina) => (
                              <Badge key={disciplina.id}>{disciplina.name}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Ver detalhes"
                            onClick={() => handleVerDetalhes(professor)}
                            className="text-[#133D86] hover:text-[#1e56b3] hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            title="Remover professor da turma"
                            onClick={() => handleClickDeletarProfessor(professor)}
                            disabled={isDeletando}
                            className="bg-white text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <X className="h-4 w-4" />
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

        {/* Matérias da Turma */}
        <Card className="border-2 pt-0 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6">
          <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <CardTitle>Matérias da Turma</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {professores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p>Nenhuma matéria atribuída a esta turma</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome da Matéria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {professores.flatMap(professor => 
                      professor.subjects.map((subject, idx) => (
                        <tr key={`${professor.teacher_id}-${subject.id}`} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-blue-50 transition-colors"}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{subject.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{professor.teacher_name}</td>
                        </tr>
                      ))
                    )}
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
          <CardHeader className="bg-gradient-to-r pt-1 from-[#133D86] to-[#1e56b3] text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <CardTitle>Alunos da Turma</CardTitle>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {alunos.length} {alunos.length === 1 ? 'aluno' : 'alunos'}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {alunos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p>Nenhum aluno nesta turma</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {alunos.map((aluno, idx) => (
                      <tr key={aluno.student_id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-blue-50 transition-colors"}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{aluno.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{aluno.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{aluno.enrollment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Ver detalhes"
                            onClick={() => handleVerDetalhesAluno(aluno)}
                            className="text-[#133D86] hover:text-[#1e56b3] hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
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

      <Dialog open={isAtribuirProfessorOpen} onOpenChange={(open) => {
        if (!open) {
          setSelectedProfessor("");
          setSelectedDisciplinas([]);
          setSelectedDisciplina("");
        }
        setIsAtribuirProfessorOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir Professor à Turma</DialogTitle>
            <DialogDescription>
              Selecione o professor e as disciplinas que ele irá lecionar nesta turma
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="professor">Professor</Label>
              <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                  {todosProfessores.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id.toString()}>
                      {professor.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disciplina">Disciplinas</Label>
              <div className="flex gap-2">
                <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas
                      .filter(d => !selectedDisciplinas.some(sd => sd.id === d.id))
                      .map((disciplina) => (
                        <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                          {disciplina.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleAddDisciplina}
                  disabled={!selectedDisciplina}
                >
                  Adicionar
                </Button>
              </div>

              {selectedDisciplinas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedDisciplinas.map((disciplina) => (
                    <Badge
                      key={disciplina.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {disciplina.name}
                      <button
                        onClick={() => handleRemoveDisciplina(disciplina.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAtribuirProfessorOpen(false);
                setSelectedProfessor("");
                setSelectedDisciplinas([]);
                setSelectedDisciplina("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAtribuirProfessor}
              disabled={isLoading || !selectedProfessor || selectedDisciplinas.length === 0}
            >
              {isLoading ? 'Atribuindo...' : 'Atribuir Professor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de detalhes do professor */}
      <Dialog open={isVerDetalhesOpen} onOpenChange={setIsVerDetalhesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5 text-[#133D86]" /> Detalhes do Professor
            </DialogTitle>
          </DialogHeader>
          {professorDetalhes && (
            <div className="space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 font-medium">Nome:</span>
                <span className="text-gray-900 font-semibold">{professorDetalhes.teacher_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="text-gray-900 font-semibold">{professorDetalhes.teacher_email}</span>
              </div>
              <div className="flex items-center gap-2 items-start">
                <BookOpen className="h-4 w-4 text-gray-500 mt-1" />
                <span className="text-gray-500 font-medium mt-1">Disciplinas:</span>
                <div className="flex flex-wrap gap-2">
                  {professorDetalhes.subjects.map((s) => (
                    <Badge key={s.id} className="bg-[#133D86] text-white font-medium px-2 py-1 rounded-md text-xs shadow">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerDetalhesOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de detalhes do aluno */}
      <Dialog open={isVerDetalhesAlunoOpen} onOpenChange={setIsVerDetalhesAlunoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserIcon className="h-5 w-5 text-[#133D86]" /> Detalhes do Aluno
            </DialogTitle>
          </DialogHeader>
          {alunoDetalhes && (
            <div className="space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 font-medium">Nome:</span>
                <span className="text-gray-900 font-semibold">{alunoDetalhes.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 font-medium">Email:</span>
                <span className="text-gray-900 font-semibold">{alunoDetalhes.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 font-medium">Matrícula:</span>
                <span className="text-gray-900 font-semibold">{alunoDetalhes.enrollment}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerDetalhesAlunoOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogDeletarOpen} onOpenChange={setIsDialogDeletarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Professor</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o professor <b>{professorParaDeletar?.teacher_name}</b> desta turma? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogDeletarOpen(false)} disabled={isDeletando}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmarDeletarProfessor} disabled={isDeletando}>
              {isDeletando ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}