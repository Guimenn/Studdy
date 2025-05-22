'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const plataformas = [
    {
        nome: "Alura",
        img: "/assets/alura.png",
        link: "https://www.alura.com.br/"
    },
    {
        nome: "SPeak",
        img: "/assets/speak.png",
        link: "https://www.speak.com.br/",
    },
    {
        nome: "Educação Profissional",
        img: "/assets/educacaoprofissional.png",
        link: "https://www.educacaoprofissional.com.br/",
    },
    {
        nome: "Prepara SP",
        img: "/assets/prepara-sp.png",
        link: "https://www.prepara.sp.gov.br/",
    },
    {
        nome: "Khan Academy",
        img: "/assets/khan.png",
        link: "https://www.khanacademy.org/",
    },
    {
        nome: "Projeto de Empreendedorismo",
        img: "/assets/empre.jfif",
        link: "https://www.empreendedorismo.sp.gov.br/",
    },
    {
        nome: "São Paulo em Ação",
        img: "/assets/spsp.jpeg",
        link: "https://www.sao-paulo-em-acao.sp.gov.br/",
    },
    {
        nome: "LeiaSP",
        img: "/assets/leia-sp.png",
        link: "https://www.leia.sp.gov.br/",
    },
];

export default function PlataformasAprendizagem() {
    const { userRole } = useUser();
    const Nome =
        userRole === 'professor'
            ? 'Plataformas de Ensino'
            : 'Plataformas de Aprendizagem'
    // ? dashProfessor
    // : userRole === 'admin'
    //     ? dashAdmin
    //     : dashAlunos;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{Nome}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {plataformas.map((plataforma) => (
                    <a 
                        key={plataforma.nome}
                        href={plataforma.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <Card
                            className="flex flex-col items-center justify-center p-3 hover:shadow-lg transition-all cursor-pointer h-35"
                        >
                            <Image
                                src={plataforma.img}
                                alt={plataforma.nome}
                                width={50}
                                height={50}
                            />
                            <span className="text-lg font-medium">{plataforma.nome}</span>
                        </Card>
                    </a>
                ))}
            </div>
        </div>
    );
}

