import { Html } from "@react-three/drei";
import { useState } from "react";
import type { SceneLabel } from "@/types/api";

function speakKidVoice(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 1.4;
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
}

interface Props {
  label: SceneLabel;
}

export default function Label3D({ label }: Props) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
    if (!expanded) {
      speakKidVoice(label.description);
    } else {
      window.speechSynthesis?.cancel();
    }
  };

  return (
    <Html position={label.position} distanceFactor={8} center>
      <div className="select-none pointer-events-auto" style={{ transform: "translate(-50%, -50%)" }}>
        <button
          onClick={handleClick}
          className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
            backdrop-blur-md border transition-all duration-200 whitespace-nowrap
            ${expanded
              ? "bg-primary/30 border-primary/60 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
              : "bg-card/70 border-border/50 text-foreground hover:bg-primary/20 hover:border-primary/40"
            }
          `}
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {label.name}
        </button>

        {expanded && (
          <div className="mt-1.5 w-48 p-2.5 rounded-lg bg-card/90 backdrop-blur-lg border border-border/50 shadow-xl text-xs text-foreground/90 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
            {label.description}
            <button
              onClick={() => speakKidVoice(label.description)}
              className="mt-1.5 flex items-center gap-1 text-primary/80 hover:text-primary text-[10px] font-medium transition-colors"
            >
              🔊 Listen again
            </button>
          </div>
        )}
      </div>
    </Html>
  );
}
