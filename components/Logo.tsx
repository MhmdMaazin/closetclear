import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-8 h-8", 
  showText = false,
  textClassName = "text-lg font-bold"
}) => (
  <div className="flex items-center gap-2">
    <img 
      src="/closetclearlogo.png" 
      alt="ClosetClear Logo" 
      className={`${className} object-contain`}
    />
    {showText && (
      <span className={`${textClassName} text-slate-900 tracking-tight font-serif`}>
        ClosetClear
      </span>
    )}
  </div>
);

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <img 
    src="/closetclearlogo.png" 
    alt="ClosetClear Logo" 
    className={`${className} object-contain`}
  />
);
