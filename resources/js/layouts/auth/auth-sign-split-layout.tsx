import { Link } from '@inertiajs/react';
import { Trees } from 'lucide-react';
import type { AuthLayoutProps } from '@/types';
import { home } from '@/routes';

type AuthSignSplitLayoutProps = AuthLayoutProps & {
    image?: string;
    sideTitle?: string;
    sideDescription?: string;
};

export default function AuthSignSplitLayout({
    children,
    title,
    description,
    image = '',
    sideTitle = 'Temukan Jantung Borneo.',
    sideDescription = 'Rasakan budaya yang autentik dan lanskap alam yang memukau.',
}: AuthSignSplitLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col bg-white md:flex-row">
            {/* Left panel: imagery */}
            <div className="relative hidden md:block md:w-1/2">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                    role="img"
                    aria-label={sideTitle}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

                <div className="relative z-10 flex h-full flex-col justify-between p-8 lg:p-16">
                    <Link
                        href={home()}
                        className="flex w-fit items-center gap-2 text-white"
                    >
                        <Trees className="size-8 fill-current" />
                        <span className="text-xl font-semibold tracking-tight">
                            Jelajah Kubar
                        </span>
                    </Link>

                    <div className="max-w-md text-white">
                        <p className="text-2xl font-semibold tracking-tight">
                            {sideTitle}
                        </p>
                        <p className="mt-2 text-base leading-7 opacity-90">
                            {sideDescription}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right panel: form */}
            <div className="flex w-full flex-col justify-center bg-white px-4 py-12 sm:px-6 md:w-1/2 md:px-12 lg:px-16 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-8 flex items-center gap-2 text-brand md:hidden">
                        <Trees className="size-8 fill-current" />
                        <span className="text-xl font-semibold tracking-tight">
                            Jelajah Kubar
                        </span>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">
                            {title}
                        </h2>
                        <p className="mt-2 text-base leading-6 text-ink-muted">
                            {description}
                        </p>
                    </div>

                    <div className="mt-10">{children}</div>
                </div>
            </div>
        </div>
    );
}
