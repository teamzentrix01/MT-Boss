import Link from "next/link";

export default function PortfolioProjectCard({
  project,
  index = 0,
  isDark = false,
  isVisible = true,
}) {
  const image = project.image_url || project.image;
  const meta = [project.category, project.location].filter(Boolean).join(" · ");

  return (
    <article
      className={`group h-full overflow-hidden border transition-all duration-500 ${
        isDark
          ? "border-zinc-800 bg-zinc-950 hover:border-[var(--brand-blue)]"
          : "border-zinc-200 bg-white hover:border-zinc-400"
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 90}ms`,
      }}
    >
      <Link
        href={`/projects/${project.id}`}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-blue)]"
        aria-label={`View ${project.title}`}
      >
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-zinc-800">
          {image ? (
            <img
              src={image}
              alt={project.title || "MTBoss project"}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Project image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute right-4 top-4 text-3xl font-black italic text-white/35">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.category && (
            <span className="absolute bottom-4 left-4 bg-[var(--brand-blue)] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-black">
              {project.category}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {meta && (
            <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-[var(--brand-blue)]">
              {meta}
            </p>
          )}
          <h3 className={`text-lg font-black uppercase leading-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
            {project.title}
          </h3>
          {project.description && (
            <p className={`mt-3 line-clamp-2 text-xs leading-5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              {project.description}
            </p>
          )}
          <span className={`mt-auto flex items-center gap-2 pt-5 text-[9px] font-black uppercase tracking-widest ${isDark ? "text-white" : "text-zinc-900"}`}>
            View project
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
