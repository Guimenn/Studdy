'use client';

import { FileText, CheckCircle, LineChart } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';

export default function Overview() {
    const { userRole } = useUser();

    const dashAlunos = [
        {
            title: 'Simulados Realizados',
            value: 12,
            subtitle: '+2 esta semana',
            icon: <FileText className="h-6 w-6 text-primary" />,
            iconBg: 'bg-primary/10',
            textColor: 'text-primary'
        },
        {
            title: 'Média de Acertos',
            value: '75%',
            subtitle: '+5% este mês',
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            iconBg: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            title: 'Tempo de Estudo',
            value: '24h',
            subtitle: 'Esta semana',
            icon: <LineChart className="h-6 w-6 text-blue-600" />,
            iconBg: 'bg-blue-100',
            textColor: 'text-blue-600'
        }
    ];

    const dashProfessor = [
        {
            title: 'Alunos Ativos',
            value: 45,
            subtitle: '+5 este mês',
            icon: <FileText className="h-6 w-6 text-primary" />,
            iconBg: 'bg-primary/10',
            textColor: 'text-primary'
        },
        {
            title: 'Média da Turma',
            value: '82%',
            subtitle: '+3% este mês',
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            iconBg: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            title: 'Atividades Pendentes',
            value: 8,
            subtitle: 'Para corrigir',
            icon: <LineChart className="h-6 w-6 text-blue-600" />,
            iconBg: 'bg-blue-100',
            textColor: 'text-blue-600'
        }
    ];

    const dashAdmin = [
        {
            title: 'Total de Usuários',
            value: 154,
            subtitle: '+10 nesta semana',
            icon: <FileText className="h-6 w-6 text-primary" />,
            iconBg: 'bg-primary/10',
            textColor: 'text-primary'
        },
        {
            title: 'Professores Ativos',
            value: 18,
            subtitle: '3 novos neste mês',
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            iconBg: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            title: 'Estado do Sistema',
            value: '99.9%',
            subtitle: 'Estável',
            icon: <LineChart className="h-6 w-6 text-blue-600" />,
            iconBg: 'bg-blue-100',
            textColor: 'text-blue-600'
        }
    ];

    // Seleciona o dashboard com base no papel
    const dashData =
        userRole === 'professor'
            ? dashProfessor
            : userRole === 'admin'
                ? dashAdmin
                : dashAlunos;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dashData.map((item, index) => (
                <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-muted-foreground text-lg">{item.title}</span>
                            <div className={`p-2 rounded-lg ${item.iconBg}`}>
                                {item.icon}
                            </div>
                        </div>
                        <p className={`text-4xl font-bold ${item.textColor}`}>{item.value}</p>
                        <p className="text-sm text-muted-foreground mt-2">{item.subtitle}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}