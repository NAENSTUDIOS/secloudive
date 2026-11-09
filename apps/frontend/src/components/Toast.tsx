export function EmptyState({ title, message }: { title: string; message: string }) {
  return <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{message}</p>
  </div>;
}
