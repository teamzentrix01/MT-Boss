import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  const pageTitle = "Builder Near Me in Moradabad";

  return (
    <>
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&q=90&w=2000"
            alt={pageTitle}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="relative z-20 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-6xl font-serif font-light text-white tracking-widest">
              {pageTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* Breadcrumb - Outside Section */}
      <nav
        aria-label="Breadcrumb"
        className="w-full px-4 sm:px-6 py-2 bg-blue-50"
      >
        <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
          <li>
            <Link
              href="/"
              className="hover:text-black hover:underline cursor-pointer"
            >
              Home
            </Link>
          </li>

          <li aria-hidden="true">/</li>

          <li
            className="text-gray-900 font-medium"
            aria-current="page"
          >
            {pageTitle}
          </li>
        </ol>
      </nav>
    </>
  );
}