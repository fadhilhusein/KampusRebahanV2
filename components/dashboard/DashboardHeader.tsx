/** Page title row for the user dashboard; navigation lives in the sidebar / bottom bar (DashboardNav). */
export default function DashboardHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="[overflow-wrap:anywhere] text-[34px] font-bold leading-tight tracking-[-1.5px] md:text-[56px] md:tracking-[-2.5px]">{title}</h1>
        {subtitle && <p className="text-sm text-muted md:text-base">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
