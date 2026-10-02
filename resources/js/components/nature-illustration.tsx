/** Ilustrasi lanskap hutan Kubar untuk halaman kosong/error. Warna dari token tema. */
export function NatureIllustration({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 640 320" className={className} role="img" aria-hidden="true">
            <defs>
                <linearGradient id="nat-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffddb8" />
                    <stop offset="1" stopColor="#eff4ff" />
                </linearGradient>
            </defs>

            <rect width="640" height="320" rx="32" fill="url(#nat-sky)" />
            <circle cx="470" cy="92" r="46" fill="#fea619" opacity="0.9" />
            <circle cx="470" cy="92" r="66" fill="#fea619" opacity="0.18" />

            {/* awan */}
            <g fill="#ffffff" opacity="0.85">
                <ellipse cx="150" cy="70" rx="46" ry="14" />
                <ellipse cx="180" cy="60" rx="30" ry="12" />
                <ellipse cx="330" cy="120" rx="38" ry="11" />
            </g>

            {/* pegunungan berlapis */}
            <path d="M0 220 L90 130 L150 180 L240 100 L340 200 L430 140 L520 210 L640 150 V320 H0 Z" fill="#89f5e7" opacity="0.55" />
            <path d="M0 250 L110 170 L190 225 L290 150 L390 235 L490 175 L580 240 L640 215 V320 H0 Z" fill="#00685f" opacity="0.55" />

            {/* sungai */}
            <path d="M360 320 C 380 290, 330 275, 350 250 C 365 232, 400 240, 410 222 L 440 224 C 425 250, 385 250, 390 270 C 396 292, 430 300, 440 320 Z" fill="#89f5e7" />

            {/* hutan depan */}
            <path d="M0 270 C 120 250, 220 285, 330 268 C 440 252, 540 282, 640 262 V320 H0 Z" fill="#00201d" />
            <g fill="#00201d">
                <path d="M60 272 L84 206 L108 272 Z" />
                <path d="M78 272 L108 188 L138 272 Z" />
                <path d="M520 268 L548 196 L576 268 Z" />
                <path d="M550 270 L584 178 L618 270 Z" />
                <path d="M26 276 L44 232 L62 276 Z" />
            </g>
            <g fill="#00685f">
                <path d="M96 272 L120 214 L144 272 Z" />
                <path d="M492 272 L514 218 L536 272 Z" />
            </g>

            {/* jalur setapak menuju hutan */}
            <path d="M250 320 C 262 296, 300 288, 296 268 C 293 254, 262 252, 258 238" fill="none" stroke="#ffddb8" strokeWidth="9" strokeLinecap="round" strokeDasharray="2 16" />
        </svg>
    );
}
