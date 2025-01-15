import { ReactNode } from 'react';

interface ContainerProps {
  bgColorClass?: string;
  className?: string;
  padding?: number;
  maxWidth?: number;
  children?: ReactNode;
}

export default function Container({
  bgColorClass = '',
  className = '',
  padding = 20,
  maxWidth = 1200,
  children,
}: ContainerProps) {
  return (
    <div className={`h-full ${bgColorClass}`} style={{ padding: `0 ${padding}px` }}>
      <div className={`mx-auto ${className}`} style={{ maxWidth: `${maxWidth}px` }}>
        {children}
      </div>
    </div>
  );
}
