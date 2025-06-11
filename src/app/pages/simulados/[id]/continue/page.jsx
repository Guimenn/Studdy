'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ContinueSimuladoPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const findQuizByAttemptId = async () => {
            const token = Cookies.get('token');
            if (!token || !params.id) {
                router.replace('/pages/simulados');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/student/quizzes', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    router.replace('/pages/simulados');
                    return;
                }

                const data = await response.json();
                const quizzes = data.quizzes || [];
                
                // Encontrar o quiz pelo attempt_id
                const quiz = quizzes.find(q => q.attempt_id === parseInt(params.id));
                
                if (quiz) {
                    // Redirecionar para a página do quiz usando o quiz.id
                    router.replace(`/pages/simulados/${quiz.id}`);
                } else {
                    // Se não encontrar, redirecionar para a lista de simulados
                    router.replace('/pages/simulados');
                }
            } catch (error) {
                console.error('Erro ao buscar quiz:', error);
                router.replace('/pages/simulados');
            } finally {
                setLoading(false);
            }
        };

        findQuizByAttemptId();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Continuando simulado...</p>
                </div>
            </div>
        );
    }

    return null;
}