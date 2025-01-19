import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  href: string;
  color?: string;
  className?: string;
  children?: ReactNode;
}

export default function Button({ href, color = 'neutral', className, children }: ButtonProps) {
  const isExternal = href.startsWith('http');
  const styles = `${className} gap-x-3 rounded-lg border border-${color}-700 bg-${color}-800 px-6 py-3 text-base font-semibold shadow-md transition duration-300 hover:bg-${color}-900 focus:outline-none focus:ring-2 focus:ring-${color}-500`;

  if (isExternal) {
    return (
      <a className={styles} href={href} rel='noopener noreferrer' target='_blank'>
        {children}
      </a>
    );
  }

  return (
    <Link className={styles} href={href}>
      {children}
    </Link>
  );
}
