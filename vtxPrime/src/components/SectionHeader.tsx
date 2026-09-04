type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: 'left' | 'center';
};

export default function SectionHeader({ eyebrow, title, copy, align = 'center' }: SectionHeaderProps) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {copy ? <p className="mt-5 text-base leading-8 text-text-secondary sm:text-lg">{copy}</p> : null}
    </div>
  );
}
