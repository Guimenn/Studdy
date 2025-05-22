'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, GraduationCap, Calendar, BookOpen, School, Search, Star, StarOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const vestibulares = [
  {
    title: "ENEM",
    description: "Exame Nacional do Ensino Médio",
    link: "https://www.gov.br/inep/pt-br/assuntos/noticias/enem/enem-2024",
    icon: GraduationCap,
    color: "bg-blue-500",
    date: "Novembro 2024",
    type: "Público",
    state: "Nacional"
  },
  {
    title: "FUVEST",
    description: "Fundação Universitária para o Vestibular",
    link: "https://www.fuvest.br/",
    icon: BookOpen,
    color: "bg-red-500",
    date: "Janeiro 2025",
    type: "Público",
    state: "SP"
  },
  {
    title: "UNICAMP",
    description: "Universidade Estadual de Campinas",
    link: "https://www.comvest.unicamp.br/",
    icon: GraduationCap,
    color: "bg-green-500",
    date: "Janeiro 2025",
    type: "Público",
    state: "SP"
  },
  {
    title: "UNESP",
    description: "Universidade Estadual Paulista",
    link: "https://www.vunesp.com.br/",
    icon: BookOpen,
    color: "bg-yellow-500",
    date: "Janeiro 2025",
    type: "Público",
    state: "SP"
  },
  {
    title: "UNIFESP",
    description: "Universidade Federal de São Paulo",
    link: "https://www.unifesp.br/",
    icon: GraduationCap,
    color: "bg-purple-500",
    date: "Janeiro 2025",
    type: "Público",
    state: "SP"
  },
  {
    title: "USP",
    description: "Universidade de São Paulo - Vestibular",
    link: "https://www.usp.br/",
    icon: School,
    color: "bg-red-600",
    date: "Janeiro 2025",
    type: "Público",
    state: "SP"
  },
  {
    title: "UNB",
    description: "Universidade de Brasília",
    link: "https://www.unb.br/",
    icon: School,
    color: "bg-green-600",
    date: "Julho 2024",
    type: "Público",
    state: "DF"
  },
  {
    title: "UFMG",
    description: "Universidade Federal de Minas Gerais",
    link: "https://www.ufmg.br/",
    icon: School,
    color: "bg-yellow-600",
    date: "Novembro 2024",
    type: "Público",
    state: "MG"
  },
  {
    title: "UFRJ",
    description: "Universidade Federal do Rio de Janeiro",
    link: "https://www.ufrj.br/",
    icon: School,
    color: "bg-blue-700",
    date: "Janeiro 2025",
    type: "Público",
    state: "RJ"
  },
  {
    title: "UFRGS",
    description: "Universidade Federal do Rio Grande do Sul",
    link: "https://www.ufrgs.br/",
    icon: School,
    color: "bg-red-700",
    date: "Janeiro 2025",
    type: "Público",
    state: "RS"
  },
  {
    title: "UFSC",
    description: "Universidade Federal de Santa Catarina",
    link: "https://www.ufsc.br/",
    icon: School,
    color: "bg-green-700",
    date: "Dezembro 2024",
    type: "Público",
    state: "SC"
  },
  {
    title: "UFBA",
    description: "Universidade Federal da Bahia",
    link: "https://www.ufba.br/",
    icon: School,
    color: "bg-blue-800",
    date: "Dezembro 2024",
    type: "Público",
    state: "BA"
  },
  {
    title: "UFPE",
    description: "Universidade Federal de Pernambuco",
    link: "https://www.ufpe.br/",
    icon: School,
    color: "bg-red-800",
    date: "Dezembro 2024",
    type: "Público",
    state: "PE"
  },
  {
    title: "UFRN",
    description: "Universidade Federal do Rio Grande do Norte",
    link: "https://www.ufrn.br/",
    icon: School,
    color: "bg-green-800",
    date: "Novembro 2024",
    type: "Público",
    state: "RN"
  },
  {
    title: "PUC-SP",
    description: "Pontifícia Universidade Católica de São Paulo",
    link: "https://www.pucsp.br/",
    icon: School,
    color: "bg-purple-800",
    date: "Dezembro 2024",
    type: "Privado",
    state: "SP"
  },
  {
    title: "PUC-Rio",
    description: "Pontifícia Universidade Católica do Rio de Janeiro",
    link: "https://www.puc-rio.br/",
    icon: School,
    color: "bg-blue-900",
    date: "Dezembro 2024",
    type: "Privado",
    state: "RJ"
  },
  {
    title: "PUC-MG",
    description: "Pontifícia Universidade Católica de Minas Gerais",
    link: "https://www.pucminas.br/",
    icon: School,
    color: "bg-red-900",
    date: "Dezembro 2024",
    type: "Privado",
    state: "MG"
  },
  {
    title: "PUC-RS",
    description: "Pontifícia Universidade Católica do Rio Grande do Sul",
    link: "https://www.pucrs.br/",
    icon: School,
    color: "bg-green-900",
    date: "Dezembro 2024",
    type: "Privado",
    state: "RS"
  },
  {
    title: "PUC-Campinas",
    description: "Pontifícia Universidade Católica de Campinas",
    link: "https://www.puc-campinas.edu.br/",
    icon: School,
    color: "bg-yellow-900",
    date: "Dezembro 2024",
    type: "Privado",
    state: "SP"
  },
  {
    title: "Mackenzie",
    description: "Universidade Presbiteriana Mackenzie",
    link: "https://www.mackenzie.br/",
    icon: School,
    color: "bg-blue-950",
    date: "Dezembro 2024",
    type: "Privado",
    state: "SP"
  },
  {
    title: "Insper",
    description: "Instituto de Ensino e Pesquisa",
    link: "https://www.insper.edu.br/",
    icon: School,
    color: "bg-red-950",
    date: "Dezembro 2024",
    type: "Privado",
    state: "SP"
  },
  {
    title: "FGV",
    description: "Fundação Getúlio Vargas",
    link: "https://www.fgv.br/",
    icon: School,
    color: "bg-green-950",
    date: "Dezembro 2024",
    type: "Privado",
    state: "SP"
  },
  {
    title: "ESPM",
    description: "Escola Superior de Propaganda e Marketing",
    link: "https://www.espm.br/",
    icon: School,
    color: "bg-yellow-950",
    date: "Dezembro 2024",
    type: "Privado",
    state: "SP"
  }
];

export default function VestibularesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [favorites, setFavorites] = useState([]);

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
    { id: 'Público', label: 'Públicos' },
    { id: 'Privado', label: 'Privados' }
  ];

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'todos' || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  };

  const uniqueDates = [...new Set(vestibulares.map(v => v.date))];
  const uniqueTypes = [...new Set(vestibulares.map(v => v.type))];
  const uniqueStates = [...new Set(vestibulares.map(v => v.state))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mx-auto">
          <div className="flex flex-col items-center mb-6 bg-white rounded-lg shadow-lg p-4">
            <Logo className="h-9 w-9" variant="icon" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Vestibulares</h1>
            <p className="mt-2 text-center">Acompanhe os principais vestibulares do Brasil</p>
          </div>

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
                    <div className={`p-3 rounded-lg ${vestibular.color} text-white`}>
                      <vestibular.icon className="h-6 w-6" />
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
  );
} 