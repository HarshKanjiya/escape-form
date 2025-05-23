import { ModeToggle } from "@/components/common/theme-toggle";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ModeToggle />
      <p className="text-center text-2xl text-primary-500 bg-base-50">
        Harsh
      </p>
    </div>
  );
}
