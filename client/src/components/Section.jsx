export default function Section({ subtitle, title, accent = false, children }) {
  return (
    <div className="flex flex-col gap-4">
      {subtitle && (
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
          {subtitle}
        </span>
      )}
      {title && (
        <h1
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${
            accent ? "text-white" : "text-black"
          }`}
        >
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
