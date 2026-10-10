/**
 * Parametric face model for the portfolio AI agent.
 *
 * The face is described by continuous parameters; every mood is a preset and
 * switching mood means interpolating (lerping) between presets, so transitions
 * are fluid between ANY pair without hand-authoring them.
 *
 * This module is renderer-agnostic on purpose: the 2D chat avatar (SVG) and the
 * future 3D model face (canvas texture on the robot's screen) share Mood,
 * FaceParams, PRESETS and lerpParams — only the renderer changes.
 */

export type Mood =
  | "idle"
  | "happy"
  | "excited"
  | "curious"
  | "surprised"
  | "winking"
  | "sleepy"
  | "confused"
  | "angry";

export type EyeShape = "oval" | "happy" | "excited" | "closed" | "dots";

export interface FaceParams {
  /** Eye openness 0 (shut) .. ~1.15 (wide). */
  eyeL: number;
  eyeR: number;
  /** Brow rotation in degrees. Left: + = inner end down (angry). Right mirrored. */
  browL: number;
  browR: number;
  /** Mouth curvature: + smile .. - frown. */
  mouthSmile: number;
  /** Mouth openness 0 .. 1 (dark open smile / surprised "o"). */
  mouthOpen: number;
  /** Horizontal mouth offset (crooked mouth). */
  mouthShift: number;
  /** Whole-face tilt in degrees. */
  tilt: number;
}

export interface MoodDef {
  params: FaceParams;
  shapeL: EyeShape;
  shapeR: EyeShape;
  zzz: boolean;
}

export const PRESETS: Record<Mood, MoodDef> = {
  idle: {
    params: { eyeL: 0.85, eyeR: 0.85, browL: 0, browR: 0, mouthSmile: 0.4, mouthOpen: 0, mouthShift: 0, tilt: 0 },
    shapeL: "oval", shapeR: "oval", zzz: false,
  },
  happy: {
    params: { eyeL: 1, eyeR: 1, browL: 0, browR: 0, mouthSmile: 0.9, mouthOpen: 0, mouthShift: 0, tilt: 0 },
    shapeL: "happy", shapeR: "happy", zzz: false,
  },
  excited: {
    params: { eyeL: 1, eyeR: 1, browL: -8, browR: 8, mouthSmile: 0.6, mouthOpen: 0.55, mouthShift: 0, tilt: 0 },
    shapeL: "excited", shapeR: "excited", zzz: false,
  },
  curious: {
    params: { eyeL: 1.05, eyeR: 1.05, browL: 0, browR: 0, mouthSmile: 0.5, mouthOpen: 0, mouthShift: 0, tilt: 4 },
    shapeL: "oval", shapeR: "oval", zzz: false,
  },
  surprised: {
    params: { eyeL: 1.15, eyeR: 1.15, browL: -12, browR: 12, mouthSmile: 0, mouthOpen: 1, mouthShift: 0, tilt: 0 },
    shapeL: "oval", shapeR: "oval", zzz: false,
  },
  winking: {
    params: { eyeL: 0.08, eyeR: 0.9, browL: 0, browR: 0, mouthSmile: 0.5, mouthOpen: 0.1, mouthShift: 0, tilt: -4 },
    shapeL: "closed", shapeR: "oval", zzz: false,
  },
  sleepy: {
    params: { eyeL: 0.12, eyeR: 0.12, browL: 0, browR: 0, mouthSmile: 0.35, mouthOpen: 0, mouthShift: 0, tilt: 0 },
    shapeL: "closed", shapeR: "closed", zzz: true,
  },
  confused: {
    params: { eyeL: 1, eyeR: 0.62, browL: 18, browR: -6, mouthSmile: -0.15, mouthOpen: 0, mouthShift: 2.2, tilt: 3 },
    shapeL: "oval", shapeR: "oval", zzz: false,
  },
  angry: {
    params: { eyeL: 0.55, eyeR: 0.55, browL: 25, browR: -25, mouthSmile: -0.55, mouthOpen: 0, mouthShift: 0, tilt: 0 },
    shapeL: "oval", shapeR: "oval", zzz: false,
  },
};

const PARAM_KEYS = ["eyeL", "eyeR", "browL", "browR", "mouthSmile", "mouthOpen", "mouthShift", "tilt"] as const;

/** Linear interpolation between two param sets (t in 0..1). */
export function lerpParams(a: FaceParams, b: FaceParams, t: number): FaceParams {
  const out = { ...a };
  for (const k of PARAM_KEYS) out[k] = a[k] + (b[k] - a[k]) * t;
  return out;
}

export const IDLE_PARAMS: FaceParams = PRESETS.idle.params;

/**
 * Which mood fits a chatbot answer? Kept next to the face model (not the
 * text engine) so both the 2D chat avatar and the future 3D face reuse it.
 */
export function moodForAnswer(text: string): Mood {
  const t = ` ${text.toLowerCase()} `;
  if (t.includes("don't have enough data") || t.includes("non ho abbastanza dati")) return "confused";
  if (t.includes("hi! i'm") || t.includes("ciao! sono")) return "excited";
  if (t.includes("via github and linkedin") || t.includes("via github o linkedin")) return "winking";
  if (t.includes("you're welcome") || t.includes("prego!")) return "happy";
  if (t.includes("goodbye") || t.includes("a presto")) return "sleepy";
  if (t.includes("i answer about") || t.includes("rispondo su")) return "curious";
  return "happy";
}
