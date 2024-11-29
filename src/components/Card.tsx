import React from 'react';

export const Card = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ 
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ 
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ 
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export default Card;