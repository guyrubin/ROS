// Append the 2 verified C4 archetype stories to heroJourneys.ts. Deltas are
// already on the 1-2 scale with a={}, so no normalization — just emit + fix the
// pack id (resilience-primary stories live in the "growth" pack).
import fs from "node:fs";
const ROOT = "C:/Users/dguyr/arbor-peterson-wt/app/src/lib/heroJourneys.ts";
const bundle = JSON.parse(fs.readFileSync("C:/Users/dguyr/ROS/PAI/projects/parenting-os-plugin/execution/peterson-c4-bundle.json", "utf-8"));
let src = fs.readFileSync(ROOT, "utf-8");
const j = (v) => JSON.stringify(v);

const beatLine = (b) => {
  const base = `      { id: ${j(b.id)}, title: ${j(b.title)}, titleHe: ${j(b.titleHe)}, spine: ${j(b.spine)}, spineHe: ${j(b.spineHe)}`;
  if (!b.choices) return base + " },";
  const choices = b.choices.map((c) =>
    `          { id: ${j(c.id)}, label: ${j(c.label)}, labelHe: ${j(c.labelHe)}, outcomeHint: ${j(c.outcomeHint)}, outcomeHintHe: ${j(c.outcomeHintHe)}, metricDeltas: ${j(c.metricDeltas)} },`
  ).join("\n");
  return base + `,\n        choices: [\n${choices}\n        ],\n      },`;
};

const lit = (s) => {
  const pack = s.pack === "resilience" ? "growth" : s.pack; // resilience stories live in the growth pack
  return `  {
    id: ${j(s.id)},
    pack: ${j(pack)},
    title: ${j(s.title)},
    titleHe: ${j(s.titleHe)},
    theme: ${j(s.theme)},
    themeHe: ${j(s.themeHe)},
    origin: ${j(s.origin)},
    ageRange: [4, 8],
    primaryMetric: ${j(s.primaryMetric)},
    dilemmaType: ${j(s.dilemmaType ?? "courage")},
    baseReward: ${j(s.baseReward)},
    learningObjective: ${j(s.learningObjective)},
    learningObjectiveHe: ${j(s.learningObjectiveHe ?? "")},
    parentReflection: {
      practiced: ${j(s.parentReflection.practiced)},
      practicedHe: ${j(s.parentReflection.practicedHe ?? [])},
      questions: ${j(s.parentReflection.questions)},
      questionsHe: ${j(s.parentReflection.questionsHe ?? [])},
    },
    parentInsight: ${j(s.parentInsight)},
    beats: [
${s.beats.map(beatLine).join("\n")}
    ],
  },`;
};

const block = bundle.stories.map(lit).join("\n");
const closeRe = /\n\];(\r?\n\r?\n\/\*\* Look up a story spec by id\.)/;
if (!closeRe.test(src)) throw new Error("close marker not found");
src = src.replace(closeRe, `\n${block}\n];$1`);
fs.writeFileSync(ROOT, src, "utf-8");
console.log(`DONE — appended ${bundle.stories.length} C4 stories.`);
