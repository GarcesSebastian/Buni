import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary-600">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">Página no encontrada</h2>
                <p className="text-gray-600 mt-2">Lo sentimos, la página que buscas no existe.</p>
                <Link 
                    href="/" 
                    className="inline-block mt-6 px-6 py-3 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Button>
                        Volver al inicio
                    </Button>
                </Link>
            </div>
        </div>
    );
} 