// Small, simplified glyphs representing each technology — generic/iconic
// shapes (coffee cup for Java, cloud for Azure, cylinder for SQL, branch
// fork for Git, etc.), not verbatim reproductions of any company's
// trademarked logo artwork. Common convention in dev-portfolio skill
// badges. Each is 14x14, currentColor-friendly.

type IconProps = { size?: number; className?: string };

export function CSharpIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 8v8M6 10h6M6 14h6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M15 10h3M15 14h3M17.5 8v2m0 4v2M20.5 8v2m0 4v2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

export function DotNetIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 12c0-1.7-1.3-3-3-3s-3 1.3-3 3 1.3 3 3 3 3-1.3 3-3Zm10 0c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3Z"
        stroke="currentColor"
        strokeWidth={2}
        transform="translate(2 0)"
      />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function AngularIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2.5 20.5 6l-1.3 11L12 21.5 4.8 17 3.5 6 12 2.5Z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M12 6.5 16.5 16h-2.1l-.9-2.2h-3l-.9 2.2H7.5L12 6.5Zm0 3.2-1 2.5h2l-1-2.5Z" fill="currentColor" />
    </svg>
  );
}

export function SqlServerIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" stroke="currentColor" strokeWidth={1.6} />
      <path d="M5 6v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" stroke="currentColor" strokeWidth={1.6} />
      <path d="M5 12v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-6" stroke="currentColor" strokeWidth={1.6} />
    </svg>
  );
}

export function AzureIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M8 18h12l-6.5-11L11 13.5l3 4.5H8Z M9.8 5.5 4 17h4.3L13 8Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function KnockoutIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.6} />
      <path d="M9 8v8M9 12l4.5-4M9 12l4.5 4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GitIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="17" cy="12" r="2" stroke="currentColor" strokeWidth={1.6} />
      <path d="M7 8v8M7 8c0 3 2 4 8 4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

export function JavaIcon({ size = 14, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 12h11c.6 0 1 .6.9 1.2-.4 2-2.4 3.3-5 3.3H9.6c-2.4 0-4-1.6-3.6-3.6Z"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path d="M17 12.5c1.6.3 2.5 1 2.5 1.8 0 1.3-2 2.2-4.5 2.2" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      <path d="M10 3.5c-1.8 1.6-1.8 2.8 0 4.3M13 2c-1.8 1.9-1.8 3.2 0 4.9" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

// Generic monogram fallback for anything without a dedicated glyph.
export function MonogramIcon({ letter, size = 14, className = "" }: { letter: string } & IconProps) {
  return (
    <span
      className={className}
      style={{ fontSize: size * 0.85, lineHeight: 1, fontWeight: 700 }}
    >
      {letter}
    </span>
  );
}
