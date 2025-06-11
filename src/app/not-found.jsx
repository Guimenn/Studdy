'use client';

/**
 * Página 404 - Não Encontrado
 * Exibe uma página de erro personalizada quando uma rota não é encontrada
 * Inclui animações e navegação de volta para o painel
 */

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Logo from '@/components/ui/logo';
import { useEffect, useState } from 'react';

/**
 * Componente da página 404
 */
export default function NotFound() {

    return (
        <div className="min-h-screen background flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
          
            <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
                {/* Container Principal */}
                <div className="bg-transparent  rounded-3xl p-12 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300 max-w-4xl w-full mx-4">
                    {/* Logo e Toggle Theme */}
                    <div className="flex justify-between items-center mb-12">
                        
                
                            <Logo className="h-20 w-20 animate-float mx-auto" variant="icon" />
                      
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="text-center space-y-8 relative z-10">
                        {/* Título */}
                        <div className="relative flex flex-row items-center justify-center">
                            <h1 className="text-7xl font-bold text-[#133d86] mb-4">
                                Página fora da prova! 
                            </h1>
                            <span className='text-5xl animate-bounce'>⏱️</span>
                        </div>

                        {/* Mensagem Principal */}
                        <div className="space-y-6 animate-fade-in">
                            <p className="text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Ops! A página que você está procurando não foi encontrada. 
                            </p>
                            <p className="text-lg text-gray-500 italic">
                                "Nem todas as perguntas têm respostas, mas todas as jornadas têm um caminho de volta!"
                            </p>
                        </div>

                        {/* Elementos Decorativos */}
                        <div className="flex justify-center items-center space-x-8 my-12">
                            {['📚', '✍️', '📊'].map((emoji, index) => (
                                <div key={index} className="group relative transform hover:scale-110 transition-transform">
                                    <span
                                        className="text-4xl animate-bounce-delay"
                                        style={{ '--delay': `${index * 0.2}s` }}
                                    >
                                        {emoji}
                                    </span>
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#133d86] text-white text-sm rounded py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {['Essa pergunta não caiu no simulado...', 'Ops, essa questão saiu para tomar café! ☕', 'Os números tiraram folga hoje! 🎲'][index]}
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#133d86]"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botão Principal */}
                        <Button
                            asChild
                            className="relative overflow-hidden bg-[#133d86] hover:bg-[#3b79c4] text-white font-medium text-xl px-10 py-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3b79c4]"
                        >
                            <Link href="/pages/painel">
                                <span className="relative z-10">Voltar ao Painel</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Estilos Personalizados */}
            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes shine {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }

                @keyframes float-element {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(10px, -10px) rotate(5deg); }
                    50% { transform: translate(0, -20px) rotate(0deg); }
                    75% { transform: translate(-10px, -10px) rotate(-5deg); }
                }

                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-shine {
                    animation: shine 2s infinite;
                }

                .floating-element {
                    position: absolute;
                    font-size: 3rem;
                    animation: float-element 6s ease-in-out infinite;
                    animation-delay: var(--delay);
                    opacity: 0.15;
                    color: var(--color);
                }

                .typing-text {
                    border-right: 3px solid #133d86;
                    animation: typing 3s steps(40) 1s forwards,
                               blink-caret 0.75s step-end infinite;
                }

                @keyframes typing {
                    from { width: 0 }
                    to { width: 100% }
                }

                @keyframes blink-caret {
                    from, to { border-color: transparent }
                    50% { border-color: #133d86 }
                }

                /* Acessibilidade */
                *:focus-visible {
                    outline: 2px solid #3b79c4;
                    outline-offset: 2px;
                }
            `}</style>
        </div>
    );
}