// Emits lib/masterclasses.ts + lib/familyRituals.ts into the worktree from the
// verified parent-layer bundle. Run: node gen-parent.mjs
import fs from "node:fs";
const APP = "C:/Users/dguyr/arbor-peterson-wt/app/src/lib";
const bundle = JSON.parse(fs.readFileSync("C:/Users/dguyr/ROS/PAI/projects/parenting-os-plugin/execution/peterson-parent-bundle.json", "utf-8"));
const j = (v) => JSON.stringify(v);

const mc = bundle.masterclasses.map((m) => `  {
    id: ${j(m.id)},
    title: ${j(m.title)},
    titleHe: ${j(m.titleHe)},
    frame: ${j(m.frame)},
    durationMin: ${m.durationMin},
    hook: ${j(m.hook)},
    hookHe: ${j(m.hookHe)},
    sections: ${j(m.sections)},
    parentScript: ${j(m.parentScript)},
    parentScriptHe: ${j(m.parentScriptHe)},
    tryTonight: ${j(m.tryTonight)},
    tryTonightHe: ${j(m.tryTonightHe)},
  },`).join("\n");

const masterclassesTs = `// AUTHORED + adversarially verified via the Peterson parent-layer workflow, then
// integrated as data. Six-Frames-routed parent masterclasses (text-first), EN+HE.
export type FrameId = "aim" | "twoAxes" | "story" | "shadow" | "marriage" | "shepherd";

/** Parent-friendly label per Six Frame (no jargon). */
export const FRAME_LABELS: Record<FrameId, { en: string; he: string }> = {
  aim: { en: "Aim", he: "מטרה" },
  twoAxes: { en: "Warmth & structure", he: "חום ומבנה" },
  story: { en: "Story", he: "סיפור" },
  shadow: { en: "The hard feeling", he: "הרגש הקשה" },
  marriage: { en: "Co-parenting", he: "הורות משותפת" },
  shepherd: { en: "Next steward", he: "המשך הדרך" },
};

export interface MasterclassSection { heading: string; headingHe: string; body: string; bodyHe: string; }
export interface Masterclass {
  id: string;
  title: string; titleHe: string;
  frame: FrameId;
  durationMin: number;
  hook: string; hookHe: string;
  sections: MasterclassSection[];
  parentScript: string; parentScriptHe: string;
  tryTonight: string; tryTonightHe: string;
}

export const MASTERCLASSES: Masterclass[] = [
${mc}
];
`;

const rituals = bundle.rituals.map((r) => `  {
    id: ${j(r.id)},
    title: ${j(r.title)},
    titleHe: ${j(r.titleHe)},
    frame: ${j(r.frame)},
    purpose: ${j(r.purpose)},
    purposeHe: ${j(r.purposeHe)},
    cadence: ${j(r.cadence)},
    cadenceHe: ${j(r.cadenceHe)},
    steps: ${j(r.steps)},
    stepsHe: ${j(r.stepsHe)},
    why: ${j(r.why)},
    whyHe: ${j(r.whyHe)},
  },`).join("\n");

const ritualsTs = `// AUTHORED + adversarially verified via the Peterson parent-layer workflow, then
// integrated as data. Family Formation rituals (Six-Frames-routed), EN+HE.
import type { FrameId } from "./masterclasses";

export interface FamilyRitual {
  id: string;
  title: string; titleHe: string;
  frame: FrameId;
  purpose: string; purposeHe: string;
  cadence: string; cadenceHe: string;
  steps: string[]; stepsHe: string[];
  why: string; whyHe: string;
}

export const FAMILY_RITUALS: FamilyRitual[] = [
${rituals}
];
`;

fs.writeFileSync(`${APP}/masterclasses.ts`, masterclassesTs, "utf-8");
fs.writeFileSync(`${APP}/familyRituals.ts`, ritualsTs, "utf-8");
console.log(`DONE — wrote masterclasses.ts (${bundle.masterclasses.length}) + familyRituals.ts (${bundle.rituals.length}).`);
