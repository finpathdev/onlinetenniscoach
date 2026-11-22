import assert from "node:assert/strict";
import {
  COURT_REFERENCES,
  TECHNIQUES,
  DRILLS,
  classifyShot,
  generateFeedback,
  noteForShot,
  cameraView,
  gradeSpeed,
  calcConsistency,
  segmentRallies,
  mapToCourt,
  tallyIssues,
  suggestedDrillIds,
  buildWeekPlan,
  buildSampleSession,
  focusLine,
  consecutiveStreak,
  dayKey,
  courtHomography,
  projectToCourt,
  lineCall,
  findBounces,
  ballSpeedMph,
  callBounces,
  sessionBoard,
  quietSpans,
  detectCourtLines,
  liveStrokeTick
} from "./coach.js";

const feet = Object.fromEntries(COURT_REFERENCES.map(r => [r.feet, r.label]));
assert.equal(feet[78].includes("78"), true);
assert.equal(feet[27].includes("27"), true);
assert.equal(feet[36].includes("36"), true);
assert.equal(feet[21].includes("21"), true);
assert.equal(feet[13.5].includes("13.5"), true);
assert.equal(COURT_REFERENCES.length, 5);

const rightForehand = classifyShot(
  { x: 0.7, y: 0.5 },
  { x: 0.5, y: 0.4 },
  { x: 0.5, y: 0.7 },
  12,
  4,
  "right"
);
assert.equal(rightForehand, "Forehand");

const leftForehand = classifyShot(
  { x: 0.3, y: 0.5 },
  { x: 0.5, y: 0.4 },
  { x: 0.5, y: 0.7 },
  -12,
  4,
  "left"
);
assert.equal(leftForehand, "Forehand");

const serve = classifyShot(
  { x: 0.5, y: 0.1 },
  { x: 0.5, y: 0.3 },
  { x: 0.5, y: 0.6 },
  1,
  -8,
  "right"
);
assert.equal(serve, "Serve / Overhead");

const landmarks = {
  wrist: { x: 0.62, y: 0.45 },
  elbow: { x: 0.55, y: 0.425 },
  shoulder: { x: 0.48, y: 0.4 },
  offShoulder: { x: 0.4, y: 0.4 },
  hip: { x: 0.5, y: 0.62 },
  offHip: { x: 0.42, y: 0.62 },
  frontKnee: { x: 0.52, y: 0.78 },
  frontAnkle: { x: 0.52, y: 0.92 },
  nose: { x: 0.46, y: 0.2 }
};
const backhand = generateFeedback("Backhand", landmarks, "intermediate");
assert.equal(backhand.includes("follow-through"), false, "an extended backhand should not be told to finish");

const cropped = generateFeedback("Serve / Overhead", {
  ...landmarks,
  wrist: { x: 0.5, y: 0.15 },
  elbow: { x: 0.5, y: 0.28 },
  shoulder: { x: 0.48, y: 0.4 },
  frontKnee: { x: 0.5, y: 0.7, visibility: 0.1 },
  frontAnkle: { x: 0.5, y: 0.9, visibility: 0.1 }
}, "intermediate");
assert.equal(cropped.toLowerCase().includes("straight"), false, "hidden legs must not be called straight");
assert.equal(cropped.toLowerCase().includes("above"), true);

const bigServe = classifyShot({ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.45 }, { x: 0.5, y: 0.7 }, 0, 4, "right");
const smallServe = classifyShot({ x: 0.5, y: 0.42 }, { x: 0.5, y: 0.47 }, { x: 0.5, y: 0.52 }, 0, 1, "right");
assert.equal(bigServe, "Serve / Overhead");
assert.equal(smallServe, "Serve / Overhead");

const behindForehand = {
  wrist: { x: 0.62, y: 0.42 },
  elbow: { x: 0.58, y: 0.48 },
  shoulder: { x: 0.55, y: 0.5, z: 0 },
  offShoulder: { x: 0.45, y: 0.5, z: 0 },
  hip: { x: 0.54, y: 0.62, z: 0 },
  offHip: { x: 0.46, y: 0.62, z: 0 },
  frontKnee: { x: 0.52, y: 0.75, visibility: 0.2 },
  frontAnkle: { x: 0.5, y: 0.9, visibility: 0.2 },
  nose: { x: 0.5, y: 0.42, z: 0.2 }
};
assert.equal(cameraView(behindForehand), "behind");
const behindNote = noteForShot("Forehand", behindForehand, "intermediate");
assert.equal(/cramped|late|fault is the elbow|elbow is still bent/i.test(behindNote), false, behindNote);
assert.equal(behindNote.toLowerCase().includes("forehand") || behindNote.toLowerCase().includes("net") || behindNote.toLowerCase().includes("confidence"), true);

const cramped = generateFeedback("Backhand", {
  ...landmarks,
  wrist: { x: 0.52, y: 0.5 },
  elbow: { x: 0.5, y: 0.55 }
}, "advanced");
assert.equal(cramped.includes("follow-through") || cramped.includes("late"), true);

const beginner = generateFeedback("Forehand", {
  ...landmarks,
  wrist: { x: 0.52, y: 0.55 }
}, "beginner");
assert.equal(beginner.split(";").length <= 2, true);

assert.equal(gradeSpeed("Forehand", 66), "A");
assert.equal(gradeSpeed("Forehand", 50), "B");
assert.equal(gradeSpeed("Volley", 10), "F");
assert.equal(calcConsistency([50, 50, 50]), 100);
assert.equal(calcConsistency([10]), null);

const rallies = segmentRallies(
  [
    { time: 0, motion: 100 },
    { time: 1, motion: 80 },
    { time: 2, motion: 2 },
    { time: 5, motion: 1 },
    { time: 6, motion: 90 },
    { time: 7, motion: 70 }
  ],
  [
    { time: 0.5, type: "Forehand" },
    { time: 6.4, type: "Backhand" }
  ]
);
assert.equal(rallies.length, 2);
assert.equal(rallies[0].shots.length, 1);
assert.equal(rallies[1].shots[0].type, "Backhand");

const mapped = mapToCourt(0.5, 0.5, [
  { x: 0.2, y: 0.8 },
  { x: 0.8, y: 0.8 },
  { x: 0.65, y: 0.2 },
  { x: 0.35, y: 0.2 }
], 100, 200);
assert.ok(mapped.x >= 0 && mapped.x <= 100);
assert.ok(mapped.y >= 0 && mapped.y <= 200);

const issues = tallyIssues([
  { note: "contact looks late and close to the body" },
  { note: "contact looks late and close to the body" },
  { note: "contact looks low for a serve — toss higher and reach up so the hand is above your head" }
]);
assert.equal(issues.late_contact, 2);
assert.equal(issues.serve_extension >= 1, true);
assert.deepEqual(suggestedDrillIds(issues, 2)[0], "contact");

const plan = buildWeekPlan(issues);
assert.equal(plan.length, 7);
assert.equal(plan[3].day, "Thursday");
assert.equal(plan[6].day, "Sunday");
assert.equal(plan[6].drill.toLowerCase().includes("off court"), true);

const sample = buildSampleSession(new Date("2026-11-22T12:00:00Z"));
assert.equal(sample.sample, true);
assert.equal(sample.shot_count, sample.events.length);
assert.equal(sample.main_shot, "Forehand");
assert.equal(focusLine(sample.events).length > 20, true);
assert.equal(TECHNIQUES.length, 5);
assert.equal(DRILLS.length, 6);
assert.equal(consecutiveStreak(["2026-11-20", "2026-11-21", "2026-11-22"], new Date("2026-11-22T15:00:00")), 3);
assert.equal(consecutiveStreak(["2026-11-18"], new Date("2026-11-22T15:00:00")), 0);
assert.equal(dayKey(new Date("2026-11-22T23:00:00")), "2026-11-22");

const H = courtHomography([
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 0.8, y: 0.2 },
  { x: 0.2, y: 0.2 }
]);
const mid = projectToCourt(H, 0.5, 0.6);
assert.ok(mid.x > 8 && mid.x < 19, mid.x);
assert.ok(mid.y > 10 && mid.y < 68, mid.y);
assert.equal(lineCall({ x: 13.5, y: 39 }).call, "in");
assert.equal(lineCall({ x: 13.5, y: 39 }).confidence, "high");
assert.equal(lineCall({ x: 32, y: 40 }).call, "out");
assert.equal(lineCall({ x: 27.4, y: 40 }).confidence, "low");

const bounceTrack = [0, 1, 2, 3, 4, 5, 6].map(i => ({
  t: i * 0.1,
  x: 10,
  y: [10, 30, 55, 80, 50, 25, 15][i],
  nx: 0.5,
  ny: [10, 30, 55, 80, 50, 25, 15][i] / 100
}));
const bounces = findBounces(bounceTrack, 100);
assert.equal(bounces.length, 1);
assert.ok(Math.abs(bounces[0].t - 0.3) < 0.05);

const speedTrack = [0, 1, 2, 3].map(i => ({ t: i * 0.1, x: i * 80, y: 40 }));
assert.equal(ballSpeedMph(speedTrack, 0.15, 8, 400) > 20, true);
assert.equal(ballSpeedMph([{ t: 0, x: 0, y: 0 }, { t: 0.05, x: 4, y: 0 }], 0, 10, 400), null);

const called = callBounces([{ t: 1, x: 0, y: 0, nx: 0.5, ny: 0.6 }], H, "low");
assert.equal(called[0].confidence, "low");
const emptyBoard = sessionBoard({ events: [{ time: 1, type: "Serve / Overhead" }], bounces: [], rallies: [] });
assert.equal(emptyBoard.firstServePct, null);
assert.equal(emptyBoard.winners, null);
assert.equal(emptyBoard.errors, null);
const gaps = quietSpans([{ time: 2 }, { time: 8 }], 12, 2.4);
assert.equal(gaps.length >= 1, true);

const width = 40;
const height = 30;
const data = new Uint8ClampedArray(width * height * 4);
for (let i = 0; i < data.length; i += 4) {
  data[i] = 30; data[i + 1] = 90; data[i + 2] = 50; data[i + 3] = 255;
}
function paintRow(y, x0, x1) {
  for (let x = x0; x <= x1; x++) {
    const i = (y * width + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = 230;
  }
}
paintRow(8, 12, 28);
paintRow(24, 4, 36);
const found = detectCourtLines({ width, height, data });
assert.ok(found.corners, found.reason);
assert.equal(found.corners.length, 4);

const tick = liveStrokeTick(
  { t: 1, wristX: 0.4, wristY: 0.5, shoulderY: 0.45, torso: 0.08, lastShot: 0 },
  { t: 1.2, wristX: 0.7, wristY: 0.3, shoulderY: 0.45, torso: 0.08 }
);
assert.equal(tick.shot, true);

console.log("coach.test.mjs: ok");
