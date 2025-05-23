'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ExternalLink, Search, Calculator, Atom, Microscope, Globe, History, BookText, Brain, BookMarked, BookOpen, LineChart, TestTube, Dna, Landmark, BookOpenCheck, BookOpenText, BookOpenIcon, BookOpenCheckIcon, CircleCheck, CircleDashed, CircleOff, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";

const simulados = {
    exatas: [
        {
            title: "Matemática Básica",
            description: "Fundamentos de matemática com foco em álgebra e geometria",
            link: "https://exemplo.com/matematica-basica",
            date: "Disponível",
            status: "pendente"
        },
        {
            title: "Matemática Avançada",
            description: "Cálculo, trigonometria e geometria analítica",
            link: "https://exemplo.com/matematica-avancada",
            date: "Disponível",
            status: "pendente"
        },
        {
            title: "Física Mecânica",
            description: "Mecânica clássica e termodinâmica",
            link: "https://exemplo.com/fisica-mecanica",
            date: "Disponível",
            status: "concluido"
        },
        {
            title: "Física Moderna",
            description: "Relatividade e física quântica",
            link: "https://exemplo.com/fisica-moderna",
            date: "Disponível",
            status: "pendente"
        },
        {
            title: "Química Geral",
            description: "Fundamentos e reações químicas",
            link: "https://exemplo.com/quimica-geral",
            date: "Disponível",
            status: "pendente"
        },
        {
            title: "Química Orgânica",
            description: "Compostos orgânicos e reações",
            link: "https://exemplo.com/quimica-organica",
            date: "Disponível",
            status: "pendente"
        }
    ],
    humanas: [
        {
            title: "História do Brasil",
            description: "Períodos coloniais e república",
            link: "https://exemplo.com/historia-brasil",
            date: "Disponível",
            status: "pendente"
        },
        {
            title: "História Geral",
            description: "História antiga e contemporânea",
            link: "https://exemplo.com/historia-geral",
            date: "Disponível",
            status: "pendente"
        },
        {
            title: "Geografia Física",
            description: "Relevo, clima e hidrografia",
            link: "https://exemplo.com/geografia-fisica",
            date: "Disponível",
            status: "expirado"
        },
        {
            title: "Geografia Humana",
            description: "População, urbanização e economia",
            link: "https://exemplo.com/geografia-humana",
            date: "Disponível",
            status: "pendente"
        }
    ],
    linguagens: [
        {
            title: "Português - Gramática",
            description: "Morfologia, sintaxe e semântica",
            link: "https://exemplo.com/portugues-gramatica",
            date: "Disponível",
            status: "concluido"
        },
        {
            title: "Literatura Brasileira",
            description: "Principais obras e autores brasileiros",
            link: "https://exemplo.com/literatura-brasileira",
            date: "Disponível",
            status: "expirado"
        },
        {
            title: "Literatura Portuguesa",
            description: "Autores e obras da literatura portuguesa",
            link: "https://exemplo.com/literatura-portuguesa",
            date: "Disponível",
            status: "pendente"
        }
    ],
    biologicas: [
        {
            title: "Biologia Celular",
            description: "Células, tecidos e sistemas",
            link: "https://exemplo.com/biologia-celular",
            date: "Disponível",
            status: "concluido"
        },
        {
            title: "Genética",
            description: "Hereditariedade e evolução",
            link: "https://exemplo.com/genetica",
            date: "Disponível",
            status: "concluido"
        },
        {
            title: "Ecologia",
            description: "Ecossistemas e meio ambiente",
            link: "https://exemplo.com/ecologia",
            date: "Disponível",
            status: "pendente"
        }
    ]
};

const statusFilters = [
    { id: 'todos', label: 'Todos' },
    { id: 'pendente', label: 'Pendentes' },
    { id: 'concluido', label: 'Concluídos' },
    { id: 'expirado', label: 'Expirados' }
];

export default function SimuladosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('todos');
    const [selectedStatus, setSelectedStatus] = useState('todos');
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('simulados_favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    const getSimuladoIcon = (title, section) => {
        const lowerTitle = title.toLowerCase();
        
        if (section === 'exatas') {
            if (lowerTitle.includes('matemática')) {
                return lowerTitle.includes('avançada') ? LineChart : Calculator;
            }
            if (lowerTitle.includes('física')) {
                return Atom;
            }
            if (lowerTitle.includes('química')) {
                return lowerTitle.includes('orgânica') ? Microscope : TestTube;
            }
        }
        
        if (section === 'humanas') {
            if (lowerTitle.includes('história')) {
                return lowerTitle.includes('brasil') ? Landmark : History;
            }
            if (lowerTitle.includes('geografia')) {
                return Globe;
            }
        }
        
        if (section === 'linguagens') {
            if (lowerTitle.includes('português')) {
                return BookText;
            }
            if (lowerTitle.includes('literatura')) {
                return lowerTitle.includes('brasileira') ? BookMarked : BookOpenText;
            }
        }
        
        if (section === 'biologicas') {
            if (lowerTitle.includes('celular')) {
                return Brain;
            }
            if (lowerTitle.includes('genética')) {
                return Dna;
            }
            if (lowerTitle.includes('ecologia')) {
                return Globe;
            }
        }
        
        return BookOpen;
    };

    const getSimuladoColor = (section) => {
        switch (section) {
            case 'exatas':
                return 'bg-[#133D86]';
            case 'humanas':
                return 'bg-[#133D86]';
            case 'linguagens':
                return 'bg-[#133D86]';
            case 'biologicas':
                return 'bg-[#133D86]';
            default:
                return 'bg-[#133D86]';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pendente':
                return 'bg-[#133D86] hover:bg-[#0e2a5c]';
            case 'concluido':
                return 'bg-green-700 hover:bg-green-600';
            case 'expirado':
                return 'bg-red-700 hover:bg-red-600';
            default:
                return 'bg-[#133D86] hover:bg-[#0e2a5c]';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pendente':
                return 'Pendentes';
            case 'concluido':
                return 'Concluído';
            case 'expirado':
                return 'Expirado';
            default:
                return 'Ver Simulado';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pendente':
                return CircleDashed;
            case 'concluido':
                return CircleCheck;
            case 'expirado':
                return Ban;
            default:
                return CircleDashed;
        }
    };

    const filterItems = (items) => {
        return items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === 'todos' || item.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mx-auto">
                    <div className="flex flex-col items-center mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <Logo className="h-12 w-12" variant="icon" />
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#133D86]">Simulados Educacionais</h1>
                        <p className="mt-2 text-center text-gray-600">Pratique com simulados de várias disciplinas</p>
                    </div>

                    <div className="mb-8 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Buscar simulados..."
                                className="pl-10 w-full h-12 rounded-lg border-gray-200 focus:border-[#133D86] focus:ring-[#133D86]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {statusFilters.map((status) => (
                                <Button
                                    key={status.id}
                                    variant={selectedStatus === status.id ? "default" : "outline"}
                                    className={`text-sm px-4 py-2 rounded-lg transition-all duration-300 ${
                                        selectedStatus === status.id 
                                        ? 'bg-[#133D86] text-white hover:bg-[#0e2a5c]' 
                                        : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => setSelectedStatus(status.id)}
                                >
                                    {status.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {Object.entries(simulados).map(([section, items]) => {
                        const filtered = filterItems(items);
                        if (filtered.length === 0) return null;
                        return (
                            <div key={section} className="mb-8">
                                <h2 className="text-2xl font-semibold text-[#133D86] mb-4 capitalize">
                                    {section === 'exatas' ? 'Ciências Exatas' :
                                     section === 'humanas' ? 'Ciências Humanas' :
                                     section === 'linguagens' ? 'Linguagens e Códigos' :
                                     'Ciências Biológicas'}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filtered.map((simulado) => {
                                        const Icon = getSimuladoIcon(simulado.title, section);
                                        const color = getSimuladoColor(section);
                                        return (
                                            <Card
                                                key={simulado.title}
                                                className="hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white h-[280px] w-full group overflow-hidden"
                                            >
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className={`p-2.5 rounded-xl ${color} text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                    </div>
                                                    <CardTitle className="text-lg mt-3 h-[28px] line-clamp-1 group-hover:text-[#133D86] transition-colors duration-300 font-semibold">{simulado.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-gray-600 mb-4 h-[40px] line-clamp-2 text-sm">{simulado.description}</p>
                                                    <Button
                                                        className={`w-full ${getStatusColor(simulado.status)} transition-all duration-300 shadow-md hover:shadow-lg rounded-lg font-medium text-sm flex items-center justify-center gap-2`}
                                                        onClick={() => window.open(simulado.link, '_blank')}
                                                    >
                                                        {getStatusText(simulado.status)}
                                                        {(() => {
                                                            const StatusIcon = getStatusIcon(simulado.status);
                                                            return <StatusIcon className="h-4 w-4" />;
                                                        })()}
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                    </div>
            </div>
        </div>
    );
}