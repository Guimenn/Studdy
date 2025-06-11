"use client"

/**
 * Componente principal da sidebar da aplicação
 * Renderiza navegação dinâmica baseada no papel do usuário (Admin, Teacher, Student)
 * Inclui menu principal, projetos e informações do usuário
 */

import { useEffect, useState } from "react"
import {
  BookOpen,
  Bot,
  Users,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { NavMainDropdown } from "@/components/sidebar/nav-main"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Logo from "@/components/ui/logo"
import Cookies from "js-cookie"

// Dados do aluno
const dataAluno = {
  user: {
    name: "aluno",
    email: "aluno@example.com",
    avatar: "/avatars/aluno.jpg",
  },
  navMain: [
    { title: "Painel", url: "/pages/painel", icon: SquareTerminal, isActive: true },
    { title: "Simulados", url: "/pages/simulados", icon: Bot },
    { title: "Estatísticas", url: "/pages/estatisticas", icon: BookOpen },
  ],
  navMainDropdown: [
    {
      title: "Biblioteca",
      url: "/pages/material",
      icon: BookOpen,
      itemsDropdown: [
      
        { title: "Videoaulas", url: "/pages/material/videoaulas" },
        
        { title: "Resumos", url: "/pages/material/resumos" },
      ],
    },
  ],
  projects: [
    { name: "Concursos", url: "/pages/concursos", icon: PieChart },
    { name: "Vestibulares", url: "/pages/vestibulares", icon: Map },
    { name: "Minha Turma", url: "/pages/turmas/student", icon: Users },
  ],
}

// Dados do professor
const dataProfessor = {
  user: {
    name: "professor",
    email: "prof@example.com",
    avatar: "/avatars/prof.jpg",
  },
  navMain: [
    { title: "Painel", url: "/pages/painel", icon: SquareTerminal, isActive: true },
    { title: "Simulados", url: "/pages/turmas/teacher", icon: Bot },
  ],
  navMainDropdown: [
    {
      title: "Biblioteca",
      url: "/pages/material",
      icon: BookOpen,
      itemsDropdown: [
        { title: "Minhas Videoaulas", url: "/pages/material/videoaulas/teacher" },
        { title: "Criar Videoaulas", url: "/pages/material/videoaulas/criar-videoaulas" },
        { title: "Meus Resumos", url: "/pages/material/resumos/teacher" },
        { title: "Criar Resumos", url: "/pages/turmas/teacher" },
      ],
    },
  ],
  projects: [
    { name: "Concursos", url: "/pages/concursos", icon: PieChart },
    { name: "Vestibulares", url: "/pages/vestibulares", icon: Map },
    { name: "Minhas Turmas", url: "/pages/turmas/teacher", icon: Users },
  ],
}

// Dados do admin
const dataAdmin = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    { title: "Painel", url: "/pages/painel", icon: SquareTerminal, isActive: true },
    { title: "Administração", url: "/pages/administracao", icon: BookOpen },
    { title: "Cadastro", url: "/pages/cadastro", icon: Bot },
  ],

  projects: [
    { name: "Concursos", url: "/pages/concursos", icon: PieChart },
    { name: "Vestibulares", url: "/pages/vestibulares", icon: Map },
    { name: "Minhas Classes", url: "/pages/turmas", icon: Users },
  ],
}

// Componentes de navegação
function AlunoNav() {
  return (
    <>
      <NavMain items={dataAluno.navMain} role="student" />
      <NavMainDropdown itemsDropdown={dataAluno.navMainDropdown} role="student" />
      <NavProjects projects={dataAluno.projects} role="student" />
    </>
  )
}

function ProfessorNav() {
  return (
    <>
      <NavMain items={dataProfessor.navMain} role="teacher" />
      <NavMainDropdown itemsDropdown={dataProfessor.navMainDropdown} role="teacher" />
      <NavProjects projects={dataProfessor.projects} role="teacher" />
    </>
  )
}

function AdminNav() {
  return (
    <>
      <NavMain items={dataAdmin.navMain} role="admin" />
      <NavProjects projects={dataAdmin.projects} role="admin" />
    </>
  )
}
export function AppSidebar({ children, ...props }) {
  const { state, toggleSidebar } = useSidebar()
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const role = Cookies.get("userRole")
    console.log("🚀 Papel detectado via cookie:", role) // <== debug
    if (role) {
      setUserRole(role.toLowerCase())
    }
  }, [])

  if (!userRole) return null // ou um loader visual

  const { user, NavComponent } = (() => {
    switch (userRole) {
      case "admin":
        return { user: dataAdmin.user, NavComponent: <AdminNav /> }
      case "teacher":
        return { user: dataProfessor.user, NavComponent: <ProfessorNav /> }
      case "student":
        return { user: dataAluno.user, NavComponent: <AlunoNav /> }
      default:
        return { user: dataAluno.user, NavComponent: <AlunoNav /> }
    }
  })()

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
            <img src="/assets/logo_text.svg" alt="logo" className="h-10 w-25" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>{NavComponent}</SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
