// Deterministic integrator: merges the verified Peterson story bundle into
// heroJourneys.ts — normalizing inflated deltas to the existing 1-2 economy,
// stripping every avoidance reward, appending the 6 new stories, and injecting
// parentInsight into the 10 existing stories. Run with: node gen-peterson.mjs
import fs from "node:fs";

const ROOT = "C:/Users/dguyr/arbor-peterson-wt/app/src/lib/heroJourneys.ts";
const BUNDLE = "C:/Users/dguyr/ROS/PAI/projects/parenting-os-plugin/execution/peterson-story-bundle.json";

const bundle = JSON.parse(fs.readFileSync(BUNDLE, "utf-8"));
let src = fs.readFileSync(ROOT, "utf-8");

// ── Normalized, philosophy-correct deltas for the 6 new stories (1-2 scale) ──
const DELTAS = {
  "the-broken-music-box":              { base: { truth: 2, courage: 1 },        a: {},            b: { wisdom: 1, empathy: 1 }, c: { truth: 2, courage: 1 } },
  "the-found-acorn-crown":             { base: { truth: 2, responsibility: 1 }, a: {},            b: { empathy: 1, wisdom: 1 }, c: { truth: 2, empathy: 1 } },
  "the-two-gifts":                     { base: { responsibility: 2, truth: 1 }, a: {},            b: { empathy: 1, wisdom: 1 }, c: { responsibility: 2, truth: 1 } },
  "leave-the-tent":                    { base: { courage: 2, wisdom: 1 },       a: {},            b: { empathy: 1, courage: 1 }, c: { courage: 2, responsibility: 1 } },
  "the-two-paths-through-the-meadow":  { base: { wisdom: 2, responsibility: 1 },a: {},            b: { empathy: 1, wisdom: 1 }, c: { wisdom: 2, resilience: 1 } },
  // the honest "I'm not ready yet" case the verifier approved keeps a tiny truth point
  "the-two-mothers-and-the-quiet-judge": { base: { wisdom: 2, empathy: 1 },     a: { truth: 1 },  b: { empathy: 1, wisdom: 1 }, c: { wisdom: 2, empathy: 1 } },
};

const insightById = Object.fromEntries(bundle.insights.map((i) => [i.storyId, i]));

// ── helpers ──────────────────────────────────────────────────────────────────
const j = (v) => JSON.stringify(v); // strings/objects → TS-safe literal
const beatLine = (b) => {
  const base = `      { id: ${j(b.id)}, title: ${j(b.title)}, titleHe: ${j(b.titleHe)}, spine: ${j(b.spine)}, spineHe: ${j(b.spineHe)}`;
  if (!b.choices) return base + " },";
  const choices = b.choices.map((c, i) => {
    const id = c.id; const dl = DELTAS[curId];
    const md = id === "a" ? dl.a : id === "b" ? dl.b : dl.c;
    return `          { id: ${j(c.id)}, label: ${j(c.label)}, labelHe: ${j(c.labelHe)}, outcomeHint: ${j(c.outcomeHint)}, outcomeHintHe: ${j(c.outcomeHintHe)}, metricDeltas: ${j(md)} },`;
  }).join("\n");
  return base + `,\n        choices: [\n${choices}\n        ],\n      },`;
};

let curId = "";
const storyLiteral = (s) => {
  curId = s.id;
  const dl = DELTAS[s.id];
  const pr = s.parentReflection;
  const beats = s.beats.map(beatLine).join("\n");
  return `  {
    id: ${j(s.id)},
    pack: ${j(s.pack)},
    title: ${j(s.title)},
    titleHe: ${j(s.titleHe)},
    theme: ${j(s.theme)},
    themeHe: ${j(s.themeHe ?? "")},
    origin: ${j(s.origin)},
    ageRange: [4, 8],
    primaryMetric: ${j(s.primaryMetric)},
    dilemmaType: ${j(s.dilemmaType ?? "courage")},
    baseReward: ${j(dl.base)},
    learningObjective: ${j(s.learningObjective)},
    learningObjectiveHe: ${j(s.learningObjectiveHe ?? "")},
    parentReflection: {
      practiced: ${j(pr.practiced)},
      practicedHe: ${j(pr.practicedHe ?? [])},
      questions: ${j(pr.questions)},
      questionsHe: ${j(pr.questionsHe ?? [])},
    },
    parentInsight: ${j(s.parentInsight)},
    beats: [
${beats}
    ],
  },`;
};

const newBlock = bundle.stories.map(storyLiteral).join("\n");

// ── 1) strip avoidance rewards on the 10 existing stories (choice "a") ──────────
// Each remap row has the storyId; we anchor on that story's choice-"a" object by
// its unique label and force metricDeltas to the (already philosophy-correct) new value.
const existingALabels = {
  "david-and-goliath": "Walk quietly away",
  "moses-and-pharaoh": "Stay quiet and hope it changes",
  "the-lion-who-was-afraid": "Wait for morning light",
  "noahs-ark": "Stop — it's too much work",
  "jonah-and-the-great-fish": "Keep hiding in the deep",
  "the-dragon-of-responsibility": "Play now, feed the flame later",
  "joseph-and-his-brothers": "Stay angry and turn them away",
  "jacob-wrestling-the-angel": "Let go and walk away",
  "the-garden-of-forgotten-seeds": "Give up on the empty soil",
  "king-solomons-choice": "Decide fast to be done",
};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let remapCount = 0;
for (const [id, label] of Object.entries(existingALabels)) {
  // ALL existing avoidance choices → {} (strict: no virtue for retreat).
  const re = new RegExp(`(label: "${esc(label)}",[\\s\\S]*?metricDeltas: )\\{[^}]*\\}`);
  if (re.test(src)) { src = src.replace(re, `$1{}`); remapCount++; }
  else console.warn("REMAP MISS:", id, label);
}

// ── 2) inject parentInsight into the 10 existing stories ───────────────────────
// Anchor: insert right after each story's `learningObjective: "..."` line, matched
// per-story by the unique learningObjective text from the bundle insights set is not
// available, so anchor on the story id block boundary instead.
let insightCount = 0;
for (const [id, ins] of Object.entries(insightById)) {
  // find `id: "<id>",` then the first `learningObjective: "...",` after it
  const re = new RegExp(`(id: "${esc(id)}",[\\s\\S]*?learningObjective: "[^"]*",)`);
  if (re.test(src)) {
    src = src.replace(re, `$1\n    parentInsight: ${j({ en: ins.en, he: ins.he })},`);
    insightCount++;
  } else console.warn("INSIGHT MISS:", id);
}

// ── 3) append the 6 new stories before the closing `];` of HERO_STORIES ─────────
// CRLF-tolerant: insert the new stories right before the `];` that closes
// HERO_STORIES (the one immediately preceding the getStorySpec lookup comment).
const closeRe = /\n\];(\r?\n\r?\n\/\*\* Look up a story spec by id\.)/;
if (!closeRe.test(src)) throw new Error("HERO_STORIES close marker not found");
src = src.replace(closeRe, `\n${newBlock}\n];$1`);

fs.writeFileSync(ROOT, src, "utf-8");
console.log(`DONE — appended ${bundle.stories.length} stories, remapped ${remapCount}/10 avoidance choices, injected ${insightCount}/10 insights.`);
