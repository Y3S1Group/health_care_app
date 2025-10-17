import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  icon,
  selected = false,
  onClick,
  actions
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-6 shadow-sm border-2 transition-all cursor-pointer ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
      } ${className}`}
    >
      {icon && <div className="mb-3">{icon}</div>}
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
  