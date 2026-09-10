import { InteractiveParticles } from "@/components/ui/interactive-particles"

export function InteractiveParticlesDemo() {
  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-xl bg-black">
      {/* allowUpload adds an "Upload image" button; drop in any image
          and the particle pattern regenerates from it. */}
      <InteractiveParticles src="/particles.png" background="#000000" allowUpload />
    </div>
  )
}

export default InteractiveParticlesDemo;
