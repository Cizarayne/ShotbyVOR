export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
      )}
      <p className="font-medium text-slate-700">{title}</p>
      {description && (
        <p className="text-sm text-slate-400 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
