import OwDotLoader from "@/components/OwDotLoader";

export default function PlayerLoading() {
  return (
    <div className="min-h-[calc(100vh-90px)] bg-[#0c0c10] text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <OwDotLoader width={580} height={160} />
        <p
          className="text-[11px] uppercase tracking-[0.3em] text-zinc-600"
          style={{ fontFamily: '"Rajdhani", system-ui, sans-serif' }}
        >
          Loading
        </p>
      </div>
    </div>
  );
}
