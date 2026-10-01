import { Link } from '@inertiajs/react';
import { Trees } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';
import { home } from '@/routes';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="public-light flex min-h-svh flex-col items-center justify-center bg-surface px-5 py-10">
            <div className="w-full max-w-md">
                <Link href={home()} className="mb-10 flex w-fit items-center gap-2 text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                    <Trees className="size-7" aria-hidden="true" />
                    <span className="text-xl font-semibold tracking-tight">Jelajah Kubar</span>
                </Link>

                <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(18,28,42,0.06)] sm:p-10">
                    <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
                    {description && <p className="mt-2 leading-relaxed text-ink-muted">{description}</p>}
                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
