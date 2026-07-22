import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Framed KS isotype */}
      <div className="relative grid size-11 shrink-0 place-items-center rounded-lg border border-primary/40 bg-primary/5 shadow-[0_0_20px_-6px_var(--primary)]">
        {/* Corner brackets */}
        <span className="pointer-events-none absolute left-1 top-1 size-2 rounded-tl-[3px] border-l border-t border-primary/70" />
        <span className="pointer-events-none absolute right-1 top-1 size-2 rounded-tr-[3px] border-r border-t border-primary/70" />
        <span className="pointer-events-none absolute bottom-1 left-1 size-2 rounded-bl-[3px] border-b border-l border-primary/70" />
        <span className="pointer-events-none absolute bottom-1 right-1 size-2 rounded-br-[3px] border-b border-r border-primary/70" />
        <svg
          width="24"
          height="24"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6 4 L12 4 L12 17 L23 4 L31 4 L18 19 L32 36 L23 36 L12 22 L12 36 L6 36 Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>
      <span className="flex flex-col leading-none">
        <span className="text-base font-semibold tracking-[0.22em] text-foreground">
          KONAMY
        </span>
        <span className="mt-1 text-[0.7rem] font-medium tracking-[0.44em] text-foreground/70">
          SYSTEMS
        </span>
      </span>
    </div>
  )
}
