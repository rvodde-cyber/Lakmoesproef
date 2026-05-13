export function PageIllustration({ imagePath, caption }: { imagePath: string; caption: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          key={imagePath}
          src={imagePath}
          alt={caption}
          className="h-[300px] w-full object-cover animate-fade-slide-in"
          loading="lazy"
        />
      </div>
      <p className="text-center text-xs font-medium leading-snug text-slate-600">{caption}</p>
    </div>
  );
}
