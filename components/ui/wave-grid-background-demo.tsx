import { WaveGridBackground } from "@/components/ui/wave-grid-background";

export function WaveGridBackgroundDemo() {
  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-xl">
      <WaveGridBackground colorBase="#ffffff" colorHigh="#0055ff">
        <div className="flex h-full w-full items-center justify-center">
          <h2 className="text-6xl font-bold text-white drop-shadow-lg">
            Wave Grid
          </h2>
        </div>
      </WaveGridBackground>
    </div>
  );
}

export default WaveGridBackgroundDemo;
