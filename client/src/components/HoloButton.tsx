import React from 'react';

interface HoloButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
}

const HoloButton: React.FC<HoloButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-holo-bg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-holo-cyan text-black hover:bg-holo-cyan-hover focus:ring-holo-cyan shadow-[0_0_20px_rgba(0,194,203,0.3)] hover:shadow-[0_0_30px_rgba(0,194,203,0.5)]",
    secondary: "bg-holo-card text-holo-text-primary border border-holo-border hover:border-holo-cyan/50 focus:ring-holo-cyan",
    outline: "bg-transparent border border-holo-cyan text-holo-cyan hover:bg-holo-cyan/10 focus:ring-holo-cyan"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default HoloButton;
