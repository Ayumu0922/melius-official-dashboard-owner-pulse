import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';

interface ChildrenProps {
  children: ReactNode;
}

interface DataProps {
  dataId: string;
  roleName?: string;
}

interface ButtonProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'onClick' | 'type'>, DataProps {
  label?: string;
  children: ReactNode;
}

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement>, DataProps {
  label: string;
  icon?: ReactNode;
}

interface SelectButtonProps extends DataProps {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function AppShell({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div
      {...props}
      className="relative min-h-screen overflow-hidden bg-[#f3f1eb] text-zinc-950 antialiased dark:bg-[#0f0e0c] dark:text-zinc-50"
    >
      <div
        data-melius-ui-id="app-ambient-gradient"
        data-melius-ui-role="background"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(24,24,27,0.045)_1px,transparent_1px),linear-gradient(rgba(24,24,27,0.035)_1px,transparent_1px)] [background-size:80px_80px,80px_40px] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)]"
      />
      <div
        data-melius-ui-id="app-ambient-grid"
        data-melius-ui-role="background"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.11),transparent_28%),radial-gradient(circle_at_95%_12%,rgba(245,158,11,0.10),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.70),rgba(243,241,235,0.88)_46%,rgba(232,228,217,0.72))] dark:bg-[radial-gradient(circle_at_18%_0%,rgba(16,185,129,0.16),transparent_26%),radial-gradient(circle_at_92%_10%,rgba(245,158,11,0.11),transparent_24%),linear-gradient(180deg,rgba(15,14,12,0.72),rgba(18,18,16,0.96)_45%,rgba(12,12,11,0.92))]"
      />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}

export function WorkspaceFrame({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div {...props} className="relative flex min-h-screen w-full overflow-hidden">
      {children}
    </div>
  );
}

export function SidebarShell({ children, ...props }: HTMLAttributes<HTMLElement> & ChildrenProps) {
  return (
    <aside
      {...props}
      className="hidden h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-zinc-950/[0.14] bg-[#f8f6ef] text-zinc-950 shadow-2xl shadow-zinc-950/10 dark:border-white/[0.10] dark:bg-[#11100e] dark:text-stone-100 md:flex"
    >
      {children}
    </aside>
  );
}

export function MobileDrawer({ children, ...props }: HTMLAttributes<HTMLElement> & ChildrenProps) {
  return (
    <aside
      {...props}
      className="drawer-enter fixed inset-y-0 left-0 z-50 flex w-[min(19rem,calc(100vw-2rem))] flex-col border-r border-zinc-950/[0.14] bg-[#f8f6ef] text-zinc-950 shadow-xl shadow-zinc-950/30 dark:border-white/[0.10] dark:bg-[#11100e] dark:text-stone-100 md:hidden"
    >
      {children}
    </aside>
  );
}

export function Overlay({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div {...props} className="fixed inset-0 z-40 bg-zinc-950/45 backdrop-blur-sm md:hidden">
      {children}
    </div>
  );
}

export function SidebarHeader({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div {...props} className="flex min-h-20 items-center gap-3 border-b border-zinc-950/[0.12] px-4 dark:border-white/[0.10]">
      {children}
    </div>
  );
}

export function WorkspaceHeader({ children, ...props }: HTMLAttributes<HTMLElement> & ChildrenProps) {
  return (
    <header
      {...props}
      className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-zinc-950/[0.12] bg-[#f8f6ef]/[0.92] px-3 backdrop-blur-xl dark:border-white/[0.10] dark:bg-[#141310]/[0.86] sm:px-4"
    >
      {children}
    </header>
  );
}

export function BrandMark({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div
      {...props}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-emerald-950/[0.18] bg-emerald-950 text-emerald-50 shadow-sm shadow-zinc-950/10 dark:border-emerald-300/[0.24] dark:bg-emerald-300/[0.12] dark:text-emerald-100"
    >
      {children}
    </div>
  );
}

export function IconButton({ dataId, roleName, label, children, onClick, disabled, type = 'button' }: ButtonProps) {
  if (disabled) {
    return (
      <button
        type={type}
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        aria-label={label}
        title={label}
        onClick={onClick}
        disabled
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors dark:text-zinc-600"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-950/[0.07] hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ dataId, roleName, children, onClick, disabled, type = 'button' }: ButtonProps) {
  if (disabled) {
    return (
      <button
        type={type}
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        onClick={onClick}
        disabled
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-300 px-3.5 py-2 text-sm font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      onClick={onClick}
      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-[#171612] px-3.5 py-2 text-sm font-bold text-white shadow-sm shadow-zinc-950/10 transition duration-200 hover:bg-emerald-900 dark:bg-emerald-200 dark:text-zinc-950 dark:hover:bg-emerald-100"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ dataId, roleName, children, onClick, disabled, type = 'button' }: ButtonProps) {
  if (disabled) {
    return (
      <button
        type={type}
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        onClick={onClick}
        disabled
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-950/[0.10] bg-white/[0.55] px-3.5 py-2 text-sm font-bold text-zinc-400 dark:border-white/[0.10] dark:bg-white/[0.04] dark:text-zinc-600"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      onClick={onClick}
      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-950/[0.14] bg-[#fbfaf5] px-3.5 py-2 text-sm font-bold text-zinc-800 transition duration-200 hover:border-emerald-800 hover:bg-white dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-zinc-100 dark:hover:bg-white/[0.13]"
    >
      {children}
    </button>
  );
}

export function GhostButton({ dataId, roleName, children, onClick, disabled, type = 'button' }: ButtonProps) {
  if (disabled) {
    return (
      <button
        type={type}
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        onClick={onClick}
        disabled
        className="inline-flex min-h-8 items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-bold text-zinc-400 dark:text-zinc-600"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      onClick={onClick}
      className="inline-flex min-h-8 items-center justify-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-emerald-950/[0.07] hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/[0.10] dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export function RowButton({ dataId, roleName, selected, onClick, children }: SelectButtonProps) {
  if (selected) {
    return (
      <button
        type="button"
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        aria-pressed="true"
        onClick={onClick}
        className="flex min-h-10 w-full items-center justify-between rounded-md border border-emerald-950/[0.18] bg-emerald-950 px-3 py-2 text-left text-sm font-bold text-white dark:border-emerald-300/[0.18] dark:bg-emerald-300/[0.12] dark:text-white"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      aria-pressed="false"
      onClick={onClick}
      className="flex min-h-10 w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-950/[0.06] hover:text-zinc-950 dark:text-stone-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export function TabButton({ dataId, roleName, selected, onClick, children }: SelectButtonProps) {
  if (selected) {
    return (
      <button
        type="button"
        data-melius-ui-id={dataId}
        data-melius-ui-role={roleName}
        aria-pressed="true"
        onClick={onClick}
        className="h-9 min-w-0 border-b-2 border-emerald-700 bg-transparent px-3 text-sm font-black text-zinc-950 transition-colors dark:border-emerald-300 dark:text-white"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      aria-pressed="false"
      onClick={onClick}
      className="h-9 min-w-0 border-b-2 border-transparent px-3 text-sm font-semibold text-zinc-500 transition-colors hover:border-zinc-950/[0.24] hover:text-zinc-950 dark:text-zinc-400 dark:hover:border-white/[0.24] dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export function SearchInput({ dataId, roleName, label, icon, ...props }: SearchInputProps) {
  return (
    <label
      data-melius-ui-id={dataId}
      data-melius-ui-role={roleName}
      className="relative block"
    >
      <span className="sr-only">{label}</span>
      {icon}
      <input
        {...props}
        className="h-10 w-full rounded-md border border-zinc-950/[0.10] bg-white/[0.76] px-9 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-emerald-800 dark:border-white/[0.10] dark:bg-white/[0.07] dark:text-white dark:placeholder:text-zinc-400 dark:focus:border-emerald-300"
      />
    </label>
  );
}

export function Badge({ children, ...props }: HTMLAttributes<HTMLSpanElement> & ChildrenProps) {
  return (
    <span
      {...props}
      className="inline-flex w-fit items-center gap-1 rounded-sm border border-zinc-950/[0.12] bg-[#fbfaf5] px-2 py-0.5 text-xs font-bold text-zinc-700 dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-zinc-200"
    >
      {children}
    </span>
  );
}

export function StrongBadge({ children, ...props }: HTMLAttributes<HTMLSpanElement> & ChildrenProps) {
  return (
    <span
      {...props}
      className="inline-flex w-fit items-center gap-1 rounded-sm border border-amber-700/[0.20] bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-950 dark:border-amber-200/[0.24] dark:bg-amber-300/[0.14] dark:text-amber-100"
    >
      {children}
    </span>
  );
}

export function CardSurface({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div
      {...props}
      className="app-card-enter overflow-hidden rounded-md border border-zinc-950/[0.12] bg-[#fbfaf5]/[0.94] shadow-[0_1px_0_rgba(24,24,27,0.06)] transition duration-200 hover:border-emerald-900/[0.35] hover:bg-white dark:border-white/[0.10] dark:bg-white/[0.055] dark:shadow-black/20 dark:hover:border-emerald-200/[0.28] dark:hover:bg-white/[0.085]"
    >
      {children}
    </div>
  );
}

export function PanelSurface({ children, ...props }: HTMLAttributes<HTMLDivElement> & ChildrenProps) {
  return (
    <div
      {...props}
      className="overflow-hidden rounded-md border border-zinc-950/[0.12] bg-[#fbfaf5]/[0.90] shadow-[0_1px_0_rgba(24,24,27,0.05)] dark:border-white/[0.10] dark:bg-white/[0.055]"
    >
      {children}
    </div>
  );
}

export function ProgressBar({ value, dataId }: { value: number; dataId: string }) {
  return (
    <div
      data-melius-ui-id={dataId}
      data-melius-ui-role="progress"
      className="h-2 overflow-hidden rounded-sm bg-zinc-950/[0.08] dark:bg-white/[0.10]"
    >
      <div
        className="h-full rounded-sm bg-emerald-800 dark:bg-emerald-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
