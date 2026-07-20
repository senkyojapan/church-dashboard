interface Option<T extends string> {
  key: T
  label: string
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: {
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
}) {
  return (
    <div
      role="tablist"
      className="inline-flex p-1 rounded-lg bg-flat-soft dark:bg-flat-softDark gap-0.5"
    >
      {options.map((opt) => {
        const active = opt.key === value
        return (
          <button
            key={opt.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.key)}
            className={[
              'rounded-md font-medium transition-all whitespace-nowrap',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-[13px]',
              active
                ? 'bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark shadow-card'
                : 'text-ink-dim dark:text-ink-dimDark hover:text-ink dark:hover:text-ink-dark',
            ].join(' ')}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
