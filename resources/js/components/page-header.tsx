interface PageHeaderProps {
    eyebrow: string;
    title: string;
    description?: React.ReactNode;
    actions?: React.ReactNode;
}

/** Judul halaman publik: label tembaga, judul besar, deskripsi, dan aksi opsional di kanan. */
export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
    return (
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-copper">{eyebrow}</p>
                <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-ink wrap-anywhere md:text-5xl">{title}</h1>
                {description && <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
        </header>
    );
}
