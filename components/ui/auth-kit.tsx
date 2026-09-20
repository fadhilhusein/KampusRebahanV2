"use client";

import { useEffect, useRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

// Shared building blocks for the auth screens (sign in, sign up, forgot password):
// WebGL dot-grid background, card frame, fields, notices and submit button.

const VERTEX_SHADER = /* glsl */ `
  uniform vec2 u_resolution;
  varying vec2 fragCoord;
  void main() {
    gl_Position = vec4(position, 1.0);
    fragCoord = (position.xy + 1.0) * 0.5 * u_resolution;
    fragCoord.y = u_resolution.y - fragCoord.y;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec2 fragCoord;

  uniform float u_time;
  uniform float u_opacities[10];
  uniform vec3 u_colors[6];
  uniform float u_total_size;
  uniform float u_dot_size;
  uniform vec2 u_resolution;

  float PHI = 1.61803398874989484820459;
  float random(vec2 xy) {
    return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
  }

  void main() {
    vec2 st = fragCoord.xy;
    st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
    st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));

    float opacity = step(0.0, st.x) * step(0.0, st.y);

    vec2 st2 = floor(st / u_total_size);

    float frequency = 5.0;
    float show_offset = random(st2);
    float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
    opacity *= u_opacities[int(rand * 10.0)];
    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

    vec3 color = u_colors[int(show_offset * 6.0)];

    float animation_speed_factor = 3.0;
    vec2 center_grid = u_resolution / 2.0 / u_total_size;
    float dist_from_center = distance(center_grid, st2);

    float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

    opacity *= step(timing_offset_intro, u_time * animation_speed_factor);
    opacity *= clamp((1.0 - step(timing_offset_intro + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);

    gl_FragColor = vec4(color, opacity);
    gl_FragColor.rgb *= gl_FragColor.a;
  }
`;

// Dark: white dots blended additively (as in the original template).
// Light: indigo dots, softer, premultiplied-alpha blend so they show on a light surface.
const DOT_THEMES = {
  dark: {
    color: [1, 1, 1],
    opacities: [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1.0],
  },
  light: {
    color: [0.118, 0.106, 0.294],
    opacities: [0.06, 0.06, 0.06, 0.1, 0.1, 0.1, 0.16, 0.16, 0.16, 0.22],
  },
} as const;

function DotCanvas({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let active = true;
    let frame = 0;
    let cleanup: (() => void) | undefined;

    import("three")
      .then((THREE) => {
        if (!active) return;

        const palette = DOT_THEMES[isLight ? "light" : "dark"];
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const uniforms = {
          u_time: { value: reduceMotion ? 10 : 0 },
          u_resolution: { value: new THREE.Vector2(1, 1) },
          u_opacities: { value: [...palette.opacities] },
          u_colors: {
            value: Array.from({ length: 6 }, () => new THREE.Vector3(...palette.color)),
          },
          u_total_size: { value: 20.0 },
          u_dot_size: { value: 6.0 },
        };

        const material = new THREE.ShaderMaterial({
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          uniforms,
          blending: THREE.CustomBlending,
          blendSrc: isLight ? THREE.OneFactor : THREE.SrcAlphaFactor,
          blendDst: isLight ? THREE.OneMinusSrcAlphaFactor : THREE.OneFactor,
          transparent: true,
          depthTest: false,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        scene.add(mesh);

        const resize = () => {
          const { clientWidth: w, clientHeight: h } = host;
          renderer.setSize(w, h, false);
          // Shader grid is authored against a 2x reference resolution.
          uniforms.u_resolution.value.set(w * 2, h * 2);
          if (reduceMotion) renderer.render(scene, camera);
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(host);

        if (!reduceMotion) {
          const start = performance.now();
          const animate = () => {
            frame = requestAnimationFrame(animate);
            uniforms.u_time.value = (performance.now() - start) / 1000;
            renderer.render(scene, camera);
          };
          animate();
        }

        cleanup = () => {
          observer.disconnect();
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
        };
      })
      .catch(() => {
        // WebGL unavailable: the card still works on the plain background.
      });

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      cleanup?.();
    };
  }, [isLight]);

  // key: a canvas whose context was force-lost cannot be reused after a theme switch.
  return <canvas key={isLight ? "light" : "dark"} ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

const inputClass =
  "w-full rounded-xl border border-foreground/15 bg-background py-3 pl-10 pr-4 text-[14px] text-foreground placeholder:text-foreground/30 transition-colors focus:border-foreground/40 focus:outline-none";
const labelClass = "text-[12px] font-semibold text-foreground/70";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: ReactNode;
  icon: LucideIcon;
  labelExtra?: ReactNode;
  trailing?: ReactNode;
}

export function AuthField({ id, label, icon: Icon, labelExtra, trailing, className = "", ...inputProps }: AuthFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className={labelClass}>{label}</label>
        {labelExtra}
      </div>
      <div className="relative">
        <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input id={id} className={`${inputClass} ${trailing ? "pr-11" : ""} ${className}`} {...inputProps} />
        {trailing}
      </div>
    </div>
  );
}

type AuthPasswordFieldProps = Omit<AuthFieldProps, "icon" | "trailing" | "type">;

export function AuthPasswordField(props: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <AuthField
      {...props}
      icon={Lock}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-foreground/40 transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}

const noticeStyles = {
  error: { box: "border-primary/30 bg-primary/10 text-primary", icon: AlertCircle, role: "alert" },
  success: { box: "border-green-400/30 bg-green-400/10 text-green-500", icon: CheckCircle2, role: "status" },
  info: { box: "border-foreground/15 bg-foreground/5 text-foreground/70", icon: Info, role: "status" },
} as const;

export function AuthNotice({ tone, children }: { tone: keyof typeof noticeStyles; children: ReactNode }) {
  const { box, icon: Icon, role } = noticeStyles[tone];
  return (
    <div role={role} className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-[13px] font-medium ${box}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

interface AuthSubmitProps {
  loading: boolean;
  loadingText: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function AuthSubmit({ loading, loadingText, icon: Icon, children }: AuthSubmitProps) {
  return (
    <ButtonPrimary
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 py-3 text-[14px] font-semibold disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Icon size={16} />
          {children}
        </>
      )}
    </ButtonPrimary>
  );
}

interface AuthCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}

export function AuthCard({ icon: Icon, title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-foreground/20 bg-surface p-7 sm:p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Icon size={20} />
        </div>
        <h1 className="mb-1 text-[22px] font-bold leading-tight tracking-tight text-foreground">{title}</h1>
        <p className="text-[13px] text-foreground/50">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

// Full-height auth screen: WebGL dot-grid background + centered content.
// Leaves room at the top (pt-28) for the fixed Navbar.
export function AuthShell({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <DotCanvas isLight={isLight} />

      {/* Vignette: fades dots behind the card, tinted with the active theme background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in srgb, var(--color-background) 80%, transparent) 0%, transparent 100%)",
        }}
      />

      <main className="relative flex min-h-screen items-center justify-center px-4 pb-12 pt-28">{children}</main>
    </div>
  );
}
