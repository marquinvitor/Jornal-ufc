import React from 'react';

interface BaseProps extends Omit<React.AllHTMLAttributes<HTMLInputElement | HTMLSelectElement>, 'onChange'> {
  label: string;
  isSelect?: boolean;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const Input = ({ label, isSelect, children, className, ...props }: BaseProps) => {
  const fieldClasses = `
    w-full px-3 py-2 rounded border border-gray-300 bg-white 
    text-sm text-gray-700 outline-none transition-all 
    focus:border-ufc-blue focus:ring-1 focus:ring-ufc-blue 
    placeholder-gray-300
    ${className || ""}
  `;

  return (
    <div className="flex flex-col gap-1 w-full text-left mb-3">
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      
      {isSelect ? (
        <select 
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)} 
          className={`${fieldClasses} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%230378A6%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-size-[1em_1em] bg-position-[right_0.75rem_center] bg-no-repeat pr-10`}
        >
          {children}
        </select>
      ) : (
        <input 
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)} 
          className={fieldClasses} 
        />
      )}
    </div>
  );
};