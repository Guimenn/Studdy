'use client';

/**
 * Página de Vestibulares
 * Permite visualizar, criar, editar e excluir vestibulares
 * Inclui funcionalidades de busca, filtros e favoritos para vestibulares
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, GraduationCap, Calendar, BookOpen, School, Search, Star, StarOff, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { BaseFormField, SelectFormField, IconSelector } from "@/components/ui/formfield";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@/contexts/UserContext";
import { PageLoader } from "@/components/ui/loader";


const VESTIBULAR_CATEGORIES = [
  { value: 'publico', label: 'Público' },
  { value: 'privado', label: 'Privado' }
];

const ICON_OPTIONS = {
  vestibulares: [
    { label: 'Graduação', value: 'GraduationCap', icon: GraduationCap },
    { label: 'Livro', value: 'BookOpen', icon: BookOpen },
    { label: 'Escola', value: 'School', icon: School },
    { label: 'Calendário', value: 'Calendar', icon: Calendar }
  ]
};



const iconMap = {
  GraduationCap: GraduationCap,
  BookOpen: BookOpen,
  School: School,
  Calendar: Calendar
};

export default function VestibularesPage() {
  const { userRole } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [isCreateVestibularModalOpen, setIsCreateVestibularModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [vestibularToDelete, setVestibularToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vestibulares, setVestibulares] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading user role
    const timer = setTimeout(() => {
      setIsAuthorized(true);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchVestibulares = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('Token não encontrado');

        console.log('Buscando lista de vestibulares');
        const response = await fetch('https://api-studdy.onrender.com/contestsEntrace/entrance-exams', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao buscar lista de vestibulares');
        }

        const data = await response.json();
        console.log('Lista de vestibulares recebida:', data);
        
        // Transformar os dados para o formato esperado pelo componente
        const formattedVestibulares = data.map(vestibular => ({
          ...vestibular,
          category: vestibular.type, // Mapear type para category para compatibilidade com o filtro
          date: new Date(vestibular.date).toLocaleDateString('pt-BR') // Formatar data
        }));
        
        setVestibulares(formattedVestibulares);
      } catch (err) {
        console.error('Erro ao buscar vestibulares:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVestibulares();
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('vestibulares_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (title) => {
    const newFavorites = favorites.includes(title)
      ? favorites.filter(fav => fav !== title)
      : [...favorites, title];
    setFavorites(newFavorites);
    localStorage.setItem('vestibulares_favorites', JSON.stringify(newFavorites));
  };

  const types = [
    { id: 'todos', label: 'Todos' },
    { id: 'publico', label: 'Públicos' },
    { id: 'privado', label: 'Privados' }
  ];

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'todos' || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  };



  const vestibularSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    link: z.string().url({ message: 'Invalid URL' }),
    type: z.string().min(1, { message: 'Type is required' }),
    icon: z.string().min(1, { message: 'Icon is required' }),
    color: z.string().min(1, { message: 'Color is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    date: z.coerce.date({ message: 'Invalid date' }),
  });

  const CreateVestibularModal = () => {
    const form = useForm({
      resolver: zodResolver(vestibularSchema),
      defaultValues: {
        title: '',
        link: '',
        type: '',
        icon: '',
        color: '',
        description: '',
        date: '',
      },
    });

    const onSubmit = async (formData) => {
      setIsSubmitting(true);

      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        // Preparar dados do vestibular para envio
        const vestibularData = {
          title: formData.title,
          link: formData.link,
          type: formData.type,
          icon: formData.icon,
          color: formData.color,
          description: formData.description,
          date: formData.date,
        };

        console.log('Enviando dados do vestibular:', vestibularData);

        // Enviar dados do vestibular para o backend
        const response = await fetch(
          'https://api-studdy.onrender.com/contestsEntrace/entrance-exams',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(vestibularData),
          },
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('Vestibular criado:', result);

        // Mostrar mensagem de sucesso
        toast.success('Vestibular criado com sucesso!');
        window.location.reload();
        setIsCreateVestibularModalOpen(false);
        form.reset();

      } catch (error) {
        console.error('Erro ao criar vestibular:', error);
        toast.error('Erro ao criar vestibular. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    };
    return (
      <>
        <Dialog open={isCreateVestibularModalOpen} onOpenChange={setIsCreateVestibularModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Vestibular</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <BaseFormField
                  control={form.control}
                  name="title"
                  label="Nome do Vestibular"
                  placeholder="Nome do Vestibular"
                />
                <BaseFormField
                  control={form.control}
                  name="link"
                  label="Link do Vestibular"
                  placeholder="https://..."
                />
                <SelectFormField
                  control={form.control}
                  name="type"
                  label="Categoria"
                  options={VESTIBULAR_CATEGORIES}
                  placeholder="Selecione a categoria"
                />
                <BaseFormField
                  control={form.control}
                  name="date"
                  label="Data do Vestibular"
                  type="date"
                />
                <IconSelector
                  control={form.control}
                  name="icon"
                  label="Ícone"
                  options={ICON_OPTIONS.vestibulares}
                  form={form}
                />
                <BaseFormField
                  control={form.control}
                  name="color"
                  label="Cor"
                  placeholder="bg-blue-500"
                />
                <BaseFormField
                  control={form.control}
                  name="description"
                  label="Descrição"
                  placeholder="Descrição do vestibular"
                />


                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateVestibularModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar Vestibular'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </>
    );
  };

  const handleDeleteClick = (vestibular) => {
    setVestibularToDelete(vestibular);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vestibularToDelete) return;

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`https://api-studdy.onrender.com/contestsEntrace/entrance-exams/${vestibularToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar vestibular');
      }

      // Atualizar a lista de vestibulares
      setVestibulares(prev => prev.filter(v => v.id !== vestibularToDelete.id));
      toast.success('Vestibular deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar vestibular:', error);
      toast.error('Erro ao deletar vestibular. Tente novamente.');
    } finally {
      setIsDeleteConfirmOpen(false);
      setVestibularToDelete(null);
    }
  };

  const uniqueDates = [...new Set(vestibulares.map(v => v.date))];
  const uniqueTypes = [...new Set(vestibulares.map(v => v.type))];
  const uniqueStates = [...new Set(vestibulares.map(v => v.state))];

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="h-6 w-6" />;
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mx-auto">
          <div className="flex flex-col items-center mb-6 bg-white rounded-lg shadow-lg p-4">
            <Logo className="h-9 w-9" variant="icon" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Vestibulares</h1>
            <p className="mt-2 text-center">Acompanhe os principais vestibulares do Brasil</p>
          </div>
          {isAuthorized && (userRole === "admin" || userRole === "teacher") && (
            <Button onClick={() => setIsCreateVestibularModalOpen(true)} className="mb-4">
              <Plus className="h-4 w-4 mr-2 " />
              Novo Vestibular
            </Button>
          )}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar vestibulares..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => setSelectedType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filterItems(vestibulares).map((vestibular) => (
              <Card
                key={vestibular.title}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-white h-[300px] w-full"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg text-white" style={{ backgroundColor: vestibular.color || '#133D86' }}>
                      {renderIcon(vestibular.icon)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(vestibular.title)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {favorites.includes(vestibular.title) ? (
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {vestibular.date}
                      </div>
                      {(userRole === 'admin' || userRole === 'teacher') && (
                        <button
                          onClick={() => handleDeleteClick(vestibular)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4 h-[32px] line-clamp-1">{vestibular.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 h-[48px] line-clamp-2">{vestibular.description}</p>
                  <Button
                    className="w-full bg-[#133D86] hover:bg-[#0e2a5c] transition-colors duration-300"
                    onClick={() => window.open(vestibular.link, '_blank')}
                  >
                    Acessar Site Oficial
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    <CreateVestibularModal />
    <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o vestibular "{vestibularToDelete?.title}"? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsDeleteConfirmOpen(false);
              setVestibularToDelete(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleDeleteConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}