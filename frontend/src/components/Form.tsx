import { ChangeEvent, FormEvent, ReactNode } from 'react'

interface FormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
  className?: string
}

export const Form: React.FC<FormProps> = ({ onSubmit, children, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  )
}

interface FormInputProps {
  label: string
  type?: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-semibold mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

interface FormButtonProps {
  type?: 'submit' | 'button'
  onClick?: () => void
  children: ReactNode
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

export const FormButton: React.FC<FormButtonProps> = ({
  type = 'button',
  onClick,
  children,
  disabled = false,
  variant = 'primary',
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded font-semibold transition disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  )
}
