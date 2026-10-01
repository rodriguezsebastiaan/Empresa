import { cn } from '@/lib/utils'

export const fieldClassName =
  'ks-form-control mt-2 w-full rounded-xl border border-border/70 bg-background/68 px-4 py-3 text-foreground shadow-inner shadow-black/5 outline-none transition-colors duration-200 placeholder:text-muted-foreground/72 hover:border-border focus:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/35'

export const panelClassName =
  'rounded-2xl border border-border/70 bg-background/50 p-6 shadow-[0_18px_70px_-62px_var(--primary)] backdrop-blur-sm'

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
      <span className="ks-form-label">{label}</span>
      <input
        id={inputId}
        className={cn(fieldClassName, error && 'border-destructive/60', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint ? (
        <span id={`${inputId}-hint`} className="ks-form-support mt-2 block">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} className="ks-form-feedback mt-2 block text-destructive">
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
      <span className="ks-form-label">{label}</span>
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
        <span id={`${inputId}-hint`} className="ks-form-support mt-2 block">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} className="ks-form-feedback mt-2 block text-destructive">
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
      <span className="ks-form-label">{label}</span>
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
        <span id={`${inputId}-hint`} className="ks-form-support mt-2 block">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${inputId}-error`} className="ks-form-feedback mt-2 block text-destructive">
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
    <label className="flex gap-3 rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-foreground">
      <input
        id={inputId}
        type="checkbox"
        className={cn(
          'mt-0.5 size-[1.125rem] shrink-0 rounded border-border/80 bg-background text-primary focus-visible:ring-2 focus-visible:ring-primary/40',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      <span className="min-w-0">
        <span className="ks-form-label block">{label}</span>
        {hint ? (
          <span id={`${inputId}-hint`} className="ks-form-support mt-1 block">
            {hint}
          </span>
        ) : null}
        {error ? (
          <span id={`${inputId}-error`} className="ks-form-feedback mt-1 block text-destructive">
            {error}
          </span>
        ) : null}
      </span>
    </label>
  )
}
