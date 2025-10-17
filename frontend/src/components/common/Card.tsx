import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  icon,
  selected = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-6 shadow-sm border-2 transition-all cursor-pointer ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
      } ${className}`}
    >
      {icon && <div className="mb-3">{icon}</div>}
      {title && <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>}
      {children}
    </div>
  );
};