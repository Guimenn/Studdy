"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavMainDropdown } from "@/components/sidebar/nav-main"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import { useUser } from "@/contexts/UserContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import Logo from "@/components/ui/logo"

// Dados do aluno
const dataAluno = {
  user: {
    name: "aluno",
    email: "aluno@example.com",
    avatar: "/avatars/aluno.jpg",
  },

  navMain: [
    {
      title: "Painel",
      url: "/pages/painel",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Simulados",
      url: "/pages/simulados",
      icon: Bot,
    },
    {
      title: "Estatísticas  ",
      url: "/pages/estatisticas",
      icon: BookOpen,
    }
  ],
  navMainDropdown: [
    {
      title: "Biblioteca",
      
      url: "/pages/material",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Materiais", url: "/pages/material" },
        { title: "Videoaulas", url: "/pages/material/videoaulas" },
        { title: "Apostilas", url: "/pages/material/apostilas" },
        { title: "Resumos", url: "/pages/material/resumos" },
        { title: "Exercícios", url: "/pages/material/exercicios" }
      ],
    }
  ],
  projects: [
    { name: "Concursos", url: "/pages/concursos", icon: PieChart },
    { name: "Vestibulares", url: "/pages/vestibulares", icon: Map },
  ],
};

// Dados do professor
const dataProfessor = {
  user: {
    name: "professor",
    email: "prof@example.com",
    avatar: "/avatars/prof.jpg",
  },
  navMainDropdown: [
    {
      title: "Conteúdo Didático",
      url: "#",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Minhas Aulas", url: "#" },
        { title: "Materiais", url: "#" }
      ],
    }
  ],
  navMain: [
    {
      title: "Painel",
      url: "/pages/painel",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Atividades",
      url: "#",
      icon: Bot,  
    },
  ],
  projects: [
    { name: "Turma 1", url: "#", icon: Frame },
    { name: "Turma 2", url: "#", icon: PieChart },
  ],
};

// Dados do admin
const dataAdmin = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMainDropdown: [
    {
      title: "Gerenciamento",
      url: "#",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Usuários", url: "#" },
        { title: "Permissões", url: "#" },
        { title: "Configurações", url: "#" }
      ],
    }
  ],
  navMain: [
    {
      title: "Painel",
      url: "/pages/painel",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Conteúdo",
      url: "#",
      icon: Bot,
    },
    {
      title: "Administração",
      url: "#",
      icon: BookOpen,
    },
  ],
  projects: [
    { name: "Sistema Principal", url: "#", icon: Frame },
    { name: "Ambiente de Teste", url: "#", icon: PieChart },
    { name: "Produção", url: "#", icon: Map },
  ],
};

function AlunoNav() {
  return (
    <>
      <NavMain items={dataAluno.navMain} />
      <NavMainDropdown itemsDropdown={dataAluno.navMainDropdown} />
      <NavProjects projects={dataAluno.projects} />
    </>
  );
}

function ProfessorNav() {
  return (
    <>
      <NavMain items={dataProfessor.navMain} />
      <NavMainDropdown itemsDropdown={dataProfessor.navMainDropdown} />
      <NavProjects projects={dataProfessor.projects} />
    </>
  );
}

function AdminNav() {
  return (
    <>
      <NavMain items={dataAdmin.navMain} />
      <NavMainDropdown itemsDropdown={dataAdmin.navMainDropdown} />
      <NavProjects projects={dataAdmin.projects} />
    </>
  );
}

export function AppSidebar({
  children,
  ...props
}) {
  const { state, toggleSidebar } = useSidebar();
  const { userRole, setUserRole } = useUser();

  let NavComponent;
  let userData;

  switch (userRole) {
    case "admin":
      NavComponent = <AdminNav />;
      userData = dataAdmin.user;
      break;
    case "professor":
      NavComponent = <ProfessorNav />;
      userData = dataProfessor.user;
      break;
    case "aluno":
    default:
      NavComponent = <AlunoNav />;
      userData = dataAluno.user;
      break;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex flex-col items-center gap-2 mt-2">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none"
            aria-label="Alternar sidebar"
          >
            <Logo className="h-9 w-9 cursor-pointer transition-transform hover:scale-105" variant="icon" />
          </button>
          {state !== "collapsed" && (
            <>
              <img src="/assets/logo_text.svg" alt="logo" className="h-10 w-25" />
              <div className="flex gap-2 mt-2">
                <button
                  className={`px-2 py-1 rounded ${userRole === "aluno" ? "bg-[#133D86] text-white" : "bg-gray-200"}`}
                  onClick={() => setUserRole("aluno")}
                >
                  Aluno
                </button>
                <button
                  className={`px-2 py-1 rounded ${userRole === "professor" ? "bg-[#133D86] text-white" : "bg-gray-200"}`}
                  onClick={() => setUserRole("professor")}
                >
                  Professor
                </button>
                <button
                  className={`px-2 py-1 rounded ${userRole === "admin" ? "bg-[#133D86] text-white" : "bg-gray-200"}`}
                  onClick={() => setUserRole("admin")}
                >
                  Admin
                </button>
              </div>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {NavComponent}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
