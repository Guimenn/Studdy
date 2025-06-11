"use client"

/**
 * Componente de navegação do usuário na sidebar
 * Exibe informações do usuário logado e menu dropdown com opções
 * Inclui avatar, nome, email e ações como perfil e logout
 */

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'
import { useEffect, useState } from "react"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { userRole, setUserRole } = useUser()
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('token')
        const userId = Cookies.get('userId')
        
        if (!token || !userId) {
          console.error('Token ou ID do usuário não encontrado')
          return
        }

        const response = await fetch(`https://api-studdy.onrender.com/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Falha ao buscar dados do usuário')
        }

        const data = await response.json()
        setUserName(data.name)
        setUserEmail(data.email)
        setUserRole(data.role.toLowerCase())
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [setUserRole])

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('userId')
    Cookies.remove('userRole')
    setUserRole(null)
    router.push('/pages/login')
  }

  const handleProfileClick = () => {
    router.push('/pages/profile')
  }

  const getRoleLabel = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrador'
      case 'teacher':
        return 'Professor'
      case 'student':
        return 'Aluno'
      default:
        return 'Usuário'
    }
  }

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="animate-pulse flex items-center gap-4">
              <div className="h-8 w-8 rounded-lg bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded mt-1" />
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-[#133D86] text-white">{userName ? userName[0].toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="truncate text-xs">{getRoleLabel(userRole)}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg bg-white"
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "center" : "end"}
            sideOffset={4}
            alignOffset={isMobile ? 0 : -4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-[#133D86] text-white">{userName ? userName[0].toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileClick}>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
