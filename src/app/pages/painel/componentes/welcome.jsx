
import {
    Bell
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


export default function Welcome() {
    return (
        <div className="flex items-center justify-between mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/50">
            <div className="flex items-center gap-6">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden ring-4 ring-primary/10 shadow-lg">
                    <Image
                        src="/img/avatars/avatar-1.jpg"
                        alt="Student Avatar"
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Olá, Sarah!</h1>
                    <p className="text-muted-foreground text-lg">Veja oque há de novo</p>
                </div>
            </div>
            <div className="relative hidden md:block">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-6 w-6 text-primary" />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        2
                    </span>
                </Button>
            </div>
        </div>

    )
}