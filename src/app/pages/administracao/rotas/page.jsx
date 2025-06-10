"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const routePermissions = {
  admin: [
    { path: "/pages/administracao", label: "Página de Administração" },
    { path: "/pages/administracao/rotas", label: "Gerenciamento de Rotas" },
    { path: "/pages/cadastro", label: "Cadastro de Usuários" },
    { path: "/pages/concurso", label: "Criação de Concurso" },
    { path: "/pages/vestibular", label: "Criação de Vestibular" },
  ],
  professor: [
    { path: "/pages/professor", label: "Painel do Professor" },
    { path: "/pages/materiais", label: "Gerenciamento de Materiais" },
  ],
  aluno: [
    { path: "/pages/aluno", label: "Painel do Aluno" },
    { path: "/pages/estudos", label: "Área de Estudos" },
  ],
};

export default function RotasPage() {
  const { userRole } = useUser(); 
  const router = useRouter();

  useEffect(() => {
    if (userRole !== "admin") {
      router.push("/not-found");
    }
  }, [userRole, router]);

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Rotas</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rotas Administrativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routePermissions.admin.map((route) => (
                <div key={route.path} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{route.label}</h3>
                    <p className="text-sm text-gray-500">{route.path}</p>
                  </div>
                  <Button variant="outline" disabled>Acesso Restrito</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rotas de Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routePermissions.professor.map((route) => (
                <div key={route.path} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{route.label}</h3>
                    <p className="text-sm text-gray-500">{route.path}</p>
                  </div>
                  <Button variant="outline" disabled>Acesso Restrito</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rotas de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routePermissions.aluno.map((route) => (
                <div key={route.path} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{route.label}</h3>
                    <p className="text-sm text-gray-500">{route.path}</p>
                  </div>
                  <Button variant="outline" disabled>Acesso Restrito</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 