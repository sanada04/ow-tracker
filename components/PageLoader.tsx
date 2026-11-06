import OwDotLoader from "@/components/OwDotLoader";

export default function PageLoader() {
  return (
    <div className="min-h-[calc(100vh-90px)] bg-[var(--ow-bg)] text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <OwDotLoader width={580} height={160} />
        <p
          className="text-xs tracking-normal text-zinc-500"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Loading
        </p>
      </div>
    </div>
  );
}
