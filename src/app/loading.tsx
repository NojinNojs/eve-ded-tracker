export default function Loading() {
  return (
    <div className="flex min-h-[calc(100dvh-60px)] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="nb-spinner !size-10 !border-[3px]" />
        <p className="text-sm font-black uppercase tracking-wider text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
