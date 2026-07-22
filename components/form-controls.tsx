import { cn } from '@/lib/utils'

export const fieldClassName =
  'mt-2 w-full rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/70 focus:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/40'

export const panelClassName =
  'rounded-2xl border border-border/70 bg-background/50 p-6 backdrop-blur-sm'

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
  hint?: string
}

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  hint?: string
  options: Array<{ label: string; value: string }>
}

type CheckboxFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: React.ReactNode
  error?: string
  hint?: string
}

export function TextField({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextFieldProps) {
  const inputId = id ?? props.name

  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        id={inputId}
        className={cn(fieldClassName, error && 'border-destructive/60', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint ? (
        <span id={`${inputId}-hint`} className="mt-2 block text-xs text-muted-foreground">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} className="mt-2 block text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  )
}

export function TextareaField({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaFieldProps) {
  const inputId = id ?? props.name

  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <textarea
        id={inputId}
        className={cn(
          fieldClassName,
          'min-h-[8rem] resize-y',
          error && 'border-destructive/60',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint ? (
        <span id={`${inputId}-hint`} className="mt-2 block text-xs text-muted-foreground">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} className="mt-2 block text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  )
}

export function SelectField({
  label,
  error,
  hint,
  className,
  id,
  options,
  ...props
}: SelectFieldProps) {
  const inputId = id ?? props.name

  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        id={inputId}
        className={cn(
          fieldClassName,
          'appearance-none bg-[linear-gradient(45deg,transparent_50%,var(--primary)_50%),linear-gradient(135deg,var(--primary)_50%,transparent_50%)] bg-[position:calc(100%-1.1rem)_55%,calc(100%-0.75rem)_55%] bg-[size:0.4rem_0.4rem,0.4rem_0.4rem] bg-no-repeat pr-10',
          error && 'border-destructive/60',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? (
        <span id={`${inputId}-hint`} className="mt-2 block text-xs text-muted-foreground">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} className="mt-2 block text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  )
}

export function CheckboxField({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: CheckboxFieldProps) {
  const inputId = id ?? props.name

  return (
    <label className="flex gap-3 rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
      <input
        id={inputId}
        type="checkbox"
        className={cn(
          'mt-0.5 size-4 rounded border-border/80 bg-background text-primary focus-visible:ring-2 focus-visible:ring-primary/40',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      <span className="min-w-0">
        <span className="block text-sm text-foreground">{label}</span>
        {hint ? (
          <span id={`${inputId}-hint`} className="mt-1 block text-xs text-muted-foreground">
            {hint}
          </span>
        ) : null}
        {error ? (
          <span id={`${inputId}-error`} className="mt-1 block text-xs text-destructive">
            {error}
          </span>
        ) : null}
      </span>
    </label>
  )
}
