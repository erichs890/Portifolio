import clsx from "clsx";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={clsx(
          "w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
          "border-gray-300 dark:border-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Textarea({
  label,
  error,
  containerClassName,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={clsx(
          "w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
          "border-gray-300 dark:border-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  containerClassName?: string;
}

export function Select({
  label,
  error,
  options,
  containerClassName,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        {...props}
        className={clsx(
          "w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
          "border-gray-300 dark:border-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
      >
        <option value="">Selecione uma opção</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
