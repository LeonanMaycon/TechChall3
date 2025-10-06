import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  desktopColumns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  mobileColumn?: boolean;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  desktopColumns = 3,
  gap = 'md',
  mobileColumn = true,
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const gridColsClasses = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  };

  return (
    <div
      className={`
        grid
        ${mobileColumn ? 'grid-cols-1' : 'grid-cols-2'}
        ${gridColsClasses[desktopColumns]}
        ${gapClasses[gap]}
        w-full
      `}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
