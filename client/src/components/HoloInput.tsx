import React from 'react';

interface HoloInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const HoloInput: React.FC<HoloInputProps> = ({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-holo-text-secondary">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-xl bg-holo-card border border-holo-border 
          text-holo-text-primary placeholder-holo-text-secondary/50
          focus:outline-none focus:border-holo-cyan focus:ring-1 focus:ring-holo-cyan
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default HoloInput;
