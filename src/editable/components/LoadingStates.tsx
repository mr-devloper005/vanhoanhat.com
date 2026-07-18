import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-[var(--editable-border)] opacity-70', className)} />
}

export function PageLoadingState({ label = 'Loading', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8',
        className
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{label}</p>
      <PulseBlock className="mt-8 h-14 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item}>
            <PulseBlock className="aspect-[16/9] w-full" />
            <PulseBlock className="mt-5 h-4 w-1/3" />
            <PulseBlock className="mt-3 h-6 w-5/6" />
            <PulseBlock className="mt-3 h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div
      className={cn('grid gap-10 sm:grid-cols-2 lg:grid-cols-3', className)}
      aria-live="polite"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <PulseBlock className="aspect-[16/9] w-full" />
          <PulseBlock className="mt-5 h-4 w-1/3" />
          <PulseBlock className="mt-3 h-6 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading entry', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8',
        className
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">{label}</p>
        <PulseBlock className="mt-6 h-16 w-4/5 max-w-3xl" />
        <PulseBlock className="mt-6 aspect-[21/9] w-full" />
        <div className="mt-10 space-y-3">
          <PulseBlock className="h-4 w-full" />
          <PulseBlock className="h-4 w-5/6" />
          <PulseBlock className="h-4 w-4/6" />
          <PulseBlock className="h-4 w-3/6" />
        </div>
      </div>
      <div className="space-y-6">
        <PulseBlock className="h-64 w-full" />
        <PulseBlock className="h-48 w-full" />
      </div>
    </div>
  )
}
