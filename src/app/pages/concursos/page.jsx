'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, Calendar, Shield, Briefcase, School, Building2, Landmark, Scale, Search, Star, StarOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const concursos = [
  {
    title: "ITA",
    description: "Instituto Tecnológico de Aeronáutica",
    link: "https://www.ita.br/",
    icon: School,
    color: "bg-indigo-500",
    date: "Dezembro 2024",
    category: "militares"
  },
  {
    title: "IME",
    description: "Instituto Militar de Engenharia",
    link: "https://www.ime.eb.br/",
    icon: School,
    color: "bg-orange-500",
    date: "Dezembro 2024",
    category: "militares"
  },
  {
    title: "AFA",
    description: "Academia da Força Aérea",
    link: "https://www.afa.eb.mil.br/",
    icon: Shield,
    color: "bg-sky-500",
    date: "Maio 2024",
    category: "militares"
  },
  {
    title: "ESPCEX",
    description: "Escola Preparatória de Cadetes do Exército",
    link: "https://www.espcex.eb.mil.br/",
    icon: Shield,
    color: "bg-emerald-500",
    date: "Setembro 2024",
    category: "militares"
  },
  {
    title: "EN",
    description: "Escola Naval",
    link: "https://www.marinha.mil.br/ensino/",
    icon: Shield,
    color: "bg-blue-600",
    date: "Junho 2024",
    category: "militares"
  },
  {
    title: "EsPCEx",
    description: "Escola Preparatória de Cadetes do Exército",
    link: "https://www.espcex.eb.mil.br/",
    icon: Shield,
    color: "bg-green-600",
    date: "Setembro 2024",
    category: "militares"
  },
  {
    title: "CFO",
    description: "Curso de Formação de Oficiais",
    link: "https://www.eb.mil.br/",
    icon: Shield,
    color: "bg-yellow-600",
    date: "Julho 2024",
    category: "militares"
  },
  {
    title: "CFS",
    description: "Curso de Formação de Sargentos",
    link: "https://www.eb.mil.br/",
    icon: Shield,
    color: "bg-red-600",
    date: "Julho 2024",
    category: "militares"
  },
  {
    title: "PM-SP",
    description: "Polícia Militar de São Paulo",
    link: "https://www.policiamilitar.sp.gov.br/",
    icon: Shield,
    color: "bg-blue-700",
    date: "Março 2024",
    category: "estaduais"
  },
  {
    title: "PC-SP",
    description: "Polícia Civil de São Paulo",
    link: "https://www.policiacivil.sp.gov.br/",
    icon: Shield,
    color: "bg-red-700",
    date: "Abril 2024",
    category: "estaduais"
  },
  {
    title: "PM-RJ",
    description: "Polícia Militar do Rio de Janeiro",
    link: "https://www.policiamilitar.rj.gov.br/",
    icon: Shield,
    color: "bg-green-700",
    date: "Maio 2024",
    category: "estaduais"
  },
  {
    title: "PC-RJ",
    description: "Polícia Civil do Rio de Janeiro",
    link: "https://www.policiacivil.rj.gov.br/",
    icon: Shield,
    color: "bg-yellow-700",
    date: "Junho 2024",
    category: "estaduais"
  },
  {
    title: "PM-MG",
    description: "Polícia Militar de Minas Gerais",
    link: "https://www.policiamilitar.mg.gov.br/",
    icon: Shield,
    color: "bg-blue-800",
    date: "Julho 2024",
    category: "estaduais"
  },
  {
    title: "PC-MG",
    description: "Polícia Civil de Minas Gerais",
    link: "https://www.policiacivil.mg.gov.br/",
    icon: Shield,
    color: "bg-red-800",
    date: "Agosto 2024",
    category: "estaduais"
  },
  {
    title: "BB",
    description: "Banco do Brasil",
    link: "https://www.bb.com.br/",
    icon: Briefcase,
    color: "bg-yellow-700",
    date: "Em breve",
    category: "bancarios"
  },
  {
    title: "Caixa Econômica",
    description: "Banco Caixa Econômica Federal",
    link: "https://www.caixa.gov.br/",
    icon: Briefcase,
    color: "bg-blue-800",
    date: "Em breve",
    category: "bancarios"
  },
  {
    title: "Bradesco",
    description: "Banco Bradesco",
    link: "https://www.bradesco.com.br/",
    icon: Briefcase,
    color: "bg-red-800",
    date: "Em breve",
    category: "bancarios"
  },
  {
    title: "Itaú",
    description: "Banco Itaú",
    link: "https://www.itau.com.br/",
    icon: Briefcase,
    color: "bg-orange-800",
    date: "Em breve",
    category: "bancarios"
  },
  {
    title: "Santander",
    description: "Banco Santander",
    link: "https://www.santander.com.br/",
    icon: Briefcase,
    color: "bg-red-900",
    date: "Em breve",
    category: "bancarios"
  },
  {
    title: "Receita Federal",
    description: "Auditor Fiscal da Receita Federal",
    link: "https://www.gov.br/receitafederal/",
    icon: Scale,
    color: "bg-green-800",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "TCU",
    description: "Tribunal de Contas da União",
    link: "https://portal.tcu.gov.br/",
    icon: Landmark,
    color: "bg-purple-800",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "STF",
    description: "Supremo Tribunal Federal",
    link: "https://www.stf.jus.br/",
    icon: Scale,
    color: "bg-red-800",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "BNDES",
    description: "Banco Nacional de Desenvolvimento",
    link: "https://www.bndes.gov.br/",
    icon: Building2,
    color: "bg-blue-900",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "Câmara dos Deputados",
    description: "Câmara dos Deputados Federais",
    link: "https://www.camara.leg.br/",
    icon: Landmark,
    color: "bg-green-900",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "Senado Federal",
    description: "Senado Federal do Brasil",
    link: "https://www.senado.leg.br/",
    icon: Landmark,
    color: "bg-yellow-900",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "STJ",
    description: "Superior Tribunal de Justiça",
    link: "https://www.stj.jus.br/",
    icon: Scale,
    color: "bg-purple-900",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "TST",
    description: "Tribunal Superior do Trabalho",
    link: "https://www.tst.jus.br/",
    icon: Scale,
    color: "bg-blue-950",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "TRT",
    description: "Tribunal Regional do Trabalho",
    link: "https://www.tst.jus.br/",
    icon: Scale,
    color: "bg-red-950",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "TRF",
    description: "Tribunal Regional Federal",
    link: "https://www.trf1.jus.br/",
    icon: Scale,
    color: "bg-green-950",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "MPF",
    description: "Ministério Público Federal",
    link: "https://www.mpf.mp.br/",
    icon: Scale,
    color: "bg-yellow-950",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "DPF",
    description: "Departamento de Polícia Federal",
    link: "https://www.gov.br/pf/",
    icon: Shield,
    color: "bg-blue-950",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "PRF",
    description: "Polícia Rodoviária Federal",
    link: "https://www.gov.br/prf/",
    icon: Shield,
    color: "bg-red-950",
    date: "Em breve",
    category: "federais"
  },
  {
    title: "TCESP",
    description: "Tribunal de Contas do Estado de SP",
    link: "https://www.tce.sp.gov.br/",
    icon: Scale,
    color: "bg-red-900",
    date: "Em breve",
    category: "estaduais"
  }
];

export default function ConcursosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('concursos_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (title) => {
    const newFavorites = favorites.includes(title)
      ? favorites.filter(fav => fav !== title)
      : [...favorites, title];
    setFavorites(newFavorites);
    localStorage.setItem('concursos_favorites', JSON.stringify(newFavorites));
  };

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'militares', label: 'Militares' },
    { id: 'bancarios', label: 'Bancários' },
    { id: 'federais', label: 'Federais' },
    { id: 'estaduais', label: 'Estaduais' }
  ];

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mx-auto">
          <div className="flex flex-col items-center mb-6 bg-white rounded-lg shadow-lg p-4">
            <Logo className="h-9 w-9" variant="icon" />
            <h1 className="mt-4 text-2xl font-bold tracking-tight">Concursos Públicos</h1>
            <p className="mt-2 text-center">Acompanhe as principais oportunidades de carreira pública</p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar concursos..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filterItems(concursos).map((concurso) => (
              <Card
                key={concurso.title}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-white h-[300px] w-full"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${concurso.color} text-white`}>
                      <concurso.icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(concurso.title)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {favorites.includes(concurso.title) ? (
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-5 w-5" />
                        )}
                      </button>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {concurso.date}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4 h-[32px] line-clamp-1">{concurso.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 h-[48px] line-clamp-2">{concurso.description}</p>
                  <Button
                    className="w-full bg-[#133D86] hover:bg-[#0e2a5c] transition-colors duration-300"
                    onClick={() => window.open(concurso.link, '_blank')}
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