import { LiquidMetalButton } from "@/components/ui/liquid-metal";
import { ArrowRight } from "lucide-react";

export function LiquidMetalDemo() {
  return (
    <LiquidMetalButton
      icon={<ArrowRight className="w-5 h-5" />}
      metalConfig={{
        colorBack: "#3b82f6",
        colorTint: "#93c5fd",
      }}
    >
      Click Me
    </LiquidMetalButton>
  );
}

export default LiquidMetalDemo;
