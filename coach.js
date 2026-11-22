// Pure coaching logic and content. No DOM, no network.
// Court lengths are ITF feet: length 78, doubles width 36, singles width 27,
// service-line depth 21, service-box width 13.5.

export const COURT_REFERENCES = [
  { feet: 78, label: "Baseline to baseline (78 ft)" },
  { feet: 36, label: "Doubles width, sideline to sideline (36 ft)" },
  { feet: 27, label: "Singles width, sideline to sideline (27 ft)" },
  { feet: 21, label: "Net to service line (21 ft)" },
  { feet: 13.5, label: "Service box width (13.5 ft)" }
];

export const STORAGE_KEYS = {
  sessions: "tc.sessions.v1",
  profile: "tc.profile.v1",
  drills: "tc.drills.v1",
  onboarded: "tc.onboarded.v2"
};

export const TECHNIQUES = [
  {
    id: "forehand",
    title: "Forehand",
    cues: [
      "Turn your shoulders before the bounce. The non-dominant hand takes the racket back so the hitting arm stays relaxed.",
      "Meet the ball in front of the front hip, about a racket-length out. Contact beside your body is late.",
      "Swing low to high for topspin and finish over the opposite shoulder. The wrist stays firm, not floppy.",
      "Keep the head still through contact. If the head pulls up early, the arm follows it and the ball flies."
    ]
  },
  {
    id: "backhand",
    title: "Backhand",
    cues: [
      "Prepare as the ball crosses the net, not when it bounces. Early preparation is the whole shot.",
      "Contact in front of the body. A late backhand is almost always a late shoulder turn.",
      "Two-handers: both hands stay connected and the finish is high. One-handers: the front shoulder drives through and the arm extends.",
      "Use the legs and the shoulder turn to start the racket. If only the arm moves, pace and control both drop."
    ]
  },
  {
    id: "serve",
    title: "Serve",
    cues: [
      "Place the toss in front of the hitting shoulder, slightly into the court. A toss behind the head pushes contact backward.",
      "Pause in the trophy pose: front knee bent, tossing arm up, elbow of the hitting arm high.",
      "Reach up and out. Contact is at full extension, with the body moving up into the ball.",
      "Land inside the court. Staying stuck on the baseline means you never transferred weight."
    ]
  },
  {
    id: "volley",
    title: "Volley",
    cues: [
      "Racket starts up, in front of the body, before the opponent hits. There is no time for a backswing.",
      "Punch, don't swing. The motion is short enough that the off hand could catch the throat after contact.",
      "Step forward with the opposite foot as you meet the ball.",
      "Quiet wrist, firm grip. A loose wrist turns a volley into a flap."
    ]
  },
  {
    id: "footwork",
    title: "Footwork",
    cues: [
      "Split step as the opponent's racket meets the ball. The hop is small. Its job is to let you move either way.",
      "Take small adjustment steps. A lunge means you started too late.",
      "Recover to the middle of the replies you can actually cover, not a painted center mark.",
      "Stay low through the shot. Standing up as you swing is what makes contact late."
    ]
  }
];

export const DRILLS = [
  {
    id: "contact",
    title: "Contact out in front",
    minutes: 12,
    focus: "Forehand",
    issue: "late_contact",
    steps: [
      "Drop-feed or wall rally, forehands only.",
      "3 sets of 10. Call \"out front\" before each contact.",
      "If you hit beside your hip, the rep does not count.",
      "Rest 30 seconds between sets. Same drill on the backhand for one extra set if that side was late too."
    ]
  },
  {
    id: "prepare",
    title: "Turn as it crosses",
    minutes: 10,
    focus: "Backhand",
    issue: "late_contact",
    steps: [
      "Cooperative rally, backhands only, from behind the baseline.",
      "Say \"turn\" out loud the moment the ball crosses the net.",
      "2 minutes on, 30 seconds off, four times.",
      "The racket should be back before the bounce. If it isn't, slow the rally, don't speed up the hands."
    ]
  },
  {
    id: "toss",
    title: "Toss, then serve",
    minutes: 15,
    focus: "Serve",
    issue: "serve_extension",
    steps: [
      "No swing yet. 5 sets of 8 tosses. The ball should peak above full reach and land on a target in front of the front foot.",
      "Reset any toss you couldn't catch in the tossing hand without moving your feet.",
      "Then 2 sets of 6 full serves, same toss spot, aiming at the service box, not the fence.",
      "Stop the set if the toss starts drifting behind your head."
    ]
  },
  {
    id: "punch",
    title: "Short volley punch",
    minutes: 10,
    focus: "Volley",
    issue: "follow_through",
    steps: [
      "Stand on the service line. A partner feeds soft balls, or you self-feed.",
      "20 forehand volleys, 20 backhand volleys.",
      "After contact, the off hand touches the racket throat. If you can't, the swing was too long.",
      "Step in on every ball. Reset your feet before the next feed."
    ]
  },
  {
    id: "split",
    title: "Split-step timing",
    minutes: 8,
    focus: "Footwork",
    issue: "balance",
    steps: [
      "Partner stands at the opposite baseline and shadow-swings, no ball needed.",
      "You split step as their racket comes through, then move to a called corner: wide, middle, or short.",
      "4 rounds of 30 seconds. The split should land you balanced, not hopping sideways.",
      "Add a ball only after the timing is boring."
    ]
  },
  {
    id: "freeze",
    title: "Freeze the finish",
    minutes: 10,
    focus: "Balance",
    issue: "balance",
    steps: [
      "Hit 15 balls of any stroke you want to clean up.",
      "Hold the finish for a full two seconds. Don't pose — just don't fall out of it.",
      "Note which shots pull the head or the back foot. Those are the ones to film.",
      "One more set of 10 where you only keep the shots that felt balanced."
    ]
  }
];

const ISSUE_LABELS = {
  late_contact: "Contact is late or cramped",
  serve_extension: "Serve contact is low",
  follow_through: "Follow-through is cut short",
  rotation: "Shoulders stay square",
  knee_bend: "Legs aren't loading",
  balance: "Balance drifts off the shot"
};

export function angleAt(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.hypot(ab.x, ab.y);
  const magCB = Math.hypot(cb.x, cb.y);
  if (magAB === 0 || magCB === 0) return 0;
  const cos = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  return Math.acos(cos) * (180 / Math.PI);
}

function seen(point) {
  return !!point && (point.visibility == null || point.visibility >= 0.45);
}

function torsoLength(shoulder, hip) {
  return Math.hypot(shoulder.x - hip.x, shoulder.y - hip.y) || 0.001;
}

export function cameraView(lm) {
  const torso = torsoLength(lm.shoulder, lm.hip);
  const off = lm.offShoulder || lm.shoulder;
  const span = Math.hypot(off.x - lm.shoulder.x, off.y - lm.shoulder.y);
  if (span < torso * 0.42) return "side";
  if (lm.nose && lm.nose.z != null && lm.shoulder.z != null && lm.nose.z < lm.shoulder.z - 0.04) return "front";
  return "behind";
}

export function readConfidence(torso) {
  if (torso < 0.07) return "low";
  if (torso < 0.12) return "limited";
  return "ok";
}

export function noteForShot(type, lm, level = "intermediate") {
  const torso = torsoLength(lm.shoulder, lm.hip);
  const confidence = readConfidence(torso);
  if (confidence === "low") {
    return `Low confidence. This fast motion is best read as a ${type.toLowerCase()}, but the player is too small in the frame to judge contact or elbow bend.`;
  }
  let note = generateFeedback(type, lm, level);
  if (confidence === "limited") {
    const kept = note.split("; ").filter(part => !/late|cramped|elbow is still bent|looks low|beside the hip|front leg looks straight|legs are out of frame/i.test(part));
    const base = kept.join("; ") || `Best read: ${type.toLowerCase()}.`;
    return `${base} Low confidence because the player is small and the camera is behind the baseline.`;
  }
  return note;
}

export function classifyShot(wrist, shoulder, hip, dx, dy, handedness = "right", extra = {}) {
  const offShoulder = extra.offShoulder || { x: shoulder.x, y: hip.y };
  const otherWrist = extra.otherWrist;
  const nose = extra.nose;
  const torso = torsoLength(shoulder, hip);
  const aboveBy = (shoulder.y - wrist.y) / torso;
  // A serve's fast frame has the racket hand clearly above the shoulder.
  // Moving-up is not required: contact itself is often already traveling down.
  if (aboveBy > 0.45) return "Serve / Overhead";

  if (otherWrist) {
    const handGap = Math.hypot(wrist.x - otherWrist.x, wrist.y - otherWrist.y) / torso;
    if (handGap < 0.45) return "Backhand";
  }

  const center = (shoulder.x + offShoulder.x) / 2;
  let forehandOnRight = handedness !== "left";
  // Smaller z is closer to the camera. A nose in front of the shoulders means
  // we are looking at the player's front, so image-left is their right.
  if (nose && nose.z != null && shoulder.z != null && nose.z < shoulder.z - 0.02) {
    forehandOnRight = !forehandOnRight;
  }
  const shoulderSpan = Math.hypot(offShoulder.x - shoulder.x, offShoulder.y - shoulder.y);
  const sideOn = shoulderSpan < torso * 0.35;
  if (!sideOn && Math.abs(wrist.x - center) > torso * 0.2) {
    const onRight = wrist.x > center;
    return onRight === forehandOnRight ? "Forehand" : "Backhand";
  }
  // Side-on, image x is forward/back. The non-dominant hand staying on the racket
  // was already called a backhand. A single arm swinging through is a forehand
  // unless the wrist has crossed well past the front hip toward the other shoulder.
  if (nose) {
    const facing = Math.sign(nose.x - hip.x) || Math.sign(dx) || 1;
    const across = (wrist.x - hip.x) * facing < -torso * 0.35;
    if (across) return "Backhand";
  }
  if (Math.abs(dy) < Math.abs(dx) * 0.4 && Math.abs(wrist.y - shoulder.y) < torso * 0.35) return "Volley";
  return "Forehand";
}

export function generateFeedback(type, lm, level = "intermediate") {
  const { wrist, elbow, shoulder, offShoulder, hip, offHip, frontKnee, frontAnkle, nose } = lm;
  const issues = [];
  const positives = [];
  const torso = torsoLength(shoulder, hip);
  const shoulderSpan = Math.hypot(shoulder.x - offShoulder.x, shoulder.y - offShoulder.y) || torso;
  const elbowAngle = seen(elbow) && seen(wrist) && seen(shoulder) ? Math.round(angleAt(shoulder, elbow, wrist)) : null;
  const kneeAngle = seen(frontKnee) && seen(frontAnkle) && seen(hip) ? Math.round(angleAt(hip, frontKnee, frontAnkle)) : null;
  const aboveBy = (shoulder.y - wrist.y) / torso;
  const lead = Math.abs(wrist.x - hip.x) / Math.max(shoulderSpan, torso * 0.45);
  const hipMidX = (hip.x + offHip.x) / 2;
  const headOffset = seen(nose) ? Math.abs(nose.x - hipMidX) / Math.max(shoulderSpan, torso * 0.45) : null;

  const view = cameraView({ shoulder, offShoulder, hip, nose });
  const bigEnough = torso >= 0.12;

  if (type === "Serve / Overhead") {
    if (aboveBy > 0.5) {
      positives.push("contact is up, with the racket hand clearly above the shoulder");
    } else if (aboveBy < 0.25 && bigEnough && view === "side") {
      issues.push("contact looks low for a serve — toss higher and reach up so the hand is above your head");
    } else {
      positives.push("the racket hand is the highest part of a serving motion");
    }
    if (elbowAngle != null && elbowAngle < 105 && bigEnough && view === "side") {
      issues.push(`elbow is still bent at about ${elbowAngle}° — reach up through the ball instead of dropping the racket early`);
    } else if (elbowAngle != null && elbowAngle < 165) {
      positives.push("a little elbow bend at contact is normal, including on a kick serve");
    }
    if (view !== "side") {
      const tilt = Math.abs(shoulder.y - offShoulder.y) / Math.max(shoulderSpan, 0.001);
      if (tilt > 0.15) positives.push("the shoulders show some tilt in the trophy pose");
    }
    if (kneeAngle != null && bigEnough && view === "side" && kneeAngle > 175) issues.push("front leg looks straight — bend and drive up into the toss");
    else if (kneeAngle != null && kneeAngle < 165) positives.push("the legs are in the motion");
  } else if (type === "Forehand") {
    if (view === "behind" || view === "front") {
      const towardNet = (hip.y - wrist.y) / torso;
      const toForehand = ((wrist.x - hip.x) * (view === "front" ? -1 : 1)) / Math.max(shoulderSpan, torso * 0.4);
      if (towardNet > 0.1) positives.push("the racket hand is out toward the net, in front of the body");
      else positives.push("from this far behind the baseline the exact contact point is too small to grade, and a bent elbow on the forehand is not a fault");
      if (toForehand > 0.08) positives.push("the hand is on the forehand side");
    } else if (lead > 0.85) {
      positives.push("contact is out in front of the hip");
    } else if (bigEnough) {
      issues.push("contact looks late and close to the body — the racket hand is still beside the hip, so meet the ball further in front");
    }
    if (view === "side" && shoulderSpan > torso * 0.5) {
      const tilt = Math.abs(shoulder.y - offShoulder.y) / shoulderSpan;
      if (tilt < 0.12 && bigEnough) issues.push("shoulders look level to the net — turn the front shoulder in before you swing");
    }
    if (headOffset != null && headOffset > 1.1 && bigEnough && view === "side") issues.push("head is drifting off-balance past the front hip — stay centered over your feet");
  } else if (type === "Backhand") {
    if (lead > 0.7) positives.push("contact is ahead of the hip");
    else issues.push("contact looks late — prepare the racket as the ball crosses the net, not after the bounce");
    if (kneeAngle != null && kneeAngle > 172) issues.push("front leg looks straight — a little knee bend keeps you balanced");
    if (elbowAngle != null && elbowAngle < 100) issues.push(`follow-through looks short, elbow still around ${elbowAngle}° — finish high and extended`);
  } else {
    if (elbowAngle != null && elbowAngle < 140) positives.push(`compact swing, elbow about ${elbowAngle}° — that is the right length for a volley`);
    else issues.push("swing looks long for a volley — shorten it to a punch and step forward");
    if (headOffset != null && headOffset > 1) issues.push("head is drifting off-balance — keep it still through the punch");
  }

  if (positives.length === 0 && issues.length === 0) {
    return seen(frontKnee) ? "the measurable part of this swing looks solid" : "the upper body is in frame; the legs are cut off, so this note only covers the arm";
  }
  const issueLimit = level === "beginner" ? 1 : 2;
  const line = [...positives.slice(0, 1), ...issues.slice(0, issueLimit)].join("; ");
  if (!seen(frontKnee) && type !== "Volley" && torso >= 0.12) return line + ". Legs are out of frame, so this is only the arm and contact.";
  return line;
}

export function tallyIssues(events) {
  const counts = {};
  (events || []).forEach(e => {
    const note = (e.note || "").toLowerCase();
    if (note.includes("late") || note.includes("close to the body") || note.includes("close")) {
      counts.late_contact = (counts.late_contact || 0) + 1;
    }
    if (note.includes("looks low") || note.includes("toss higher") || note.includes("elbow is still bent")) {
      counts.serve_extension = (counts.serve_extension || 0) + 1;
    }
    if (note.includes("follow-through") || note.includes("punchier") || note.includes("too long")) {
      counts.follow_through = (counts.follow_through || 0) + 1;
    }
    if (note.includes("rotation") || note.includes("square")) {
      counts.rotation = (counts.rotation || 0) + 1;
    }
    if (note.includes("knee") || note.includes("legs look")) {
      counts.knee_bend = (counts.knee_bend || 0) + 1;
    }
    if (note.includes("balance") || note.includes("off-balance") || note.includes("steadier")) {
      counts.balance = (counts.balance || 0) + 1;
    }
  });
  return counts;
}

export function tallyIssuesFromSessions(sessions) {
  const counts = {};
  (sessions || []).forEach(s => {
    const found = tallyIssues(s.events);
    Object.entries(found).forEach(([k, n]) => {
      counts[k] = (counts[k] || 0) + n;
    });
  });
  return counts;
}

export function focusLine(events) {
  const counts = tallyIssues(events);
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!top) {
    return "Nothing repeated often enough to call a pattern. Film the same angle next time so the comparison stays fair.";
  }
  const lines = {
    late_contact: "Next time on court, make contact further in front. Late contact showed up more than anything else.",
    serve_extension: "Next time, toss to full reach and finish up. Serve contact was the loudest pattern.",
    follow_through: "Next time, finish the swing. Several shots were cut off before the racket completed the path.",
    rotation: "Next time, turn the shoulders before the ball arrives. The swing is starting too square.",
    knee_bend: "Next time, load the legs. Straight legs at contact showed up across this session.",
    balance: "Next time, hold the finish. Balance is leaving the shot before the ball does."
  };
  return lines[top[0]] || "Pick the cue that showed up most and spend ten minutes on only that.";
}

export function issueTitle(key) {
  return ISSUE_LABELS[key] || key;
}

export function suggestedDrillIds(issueCounts, limit = 3) {
  const ranked = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const picked = [];
  ranked.forEach(issue => {
    const drill = DRILLS.find(d => d.issue === issue && !picked.includes(d.id));
    if (drill) picked.push(drill.id);
  });
  DRILLS.forEach(d => {
    if (picked.length < limit && !picked.includes(d.id)) picked.push(d.id);
  });
  return picked.slice(0, limit);
}

export function buildWeekPlan(issueCounts) {
  const byIssue = {
    late_contact: "Contact drill: feeds aimed so you have to meet the ball a racket-length in front. 3 sets of 10.",
    serve_extension: "Serve toss ladder: 5 sets of 8 tosses to full reach, then 2 sets of 6 serves with the same toss.",
    follow_through: "Finish-high shadows: 5 sets of 10 swings, racket ending over the opposite shoulder. Then 20 live balls.",
    rotation: "Shoulder-turn rally: exaggerate the unit turn and pause for a beat before swinging. 4 minutes each side.",
    knee_bend: "Load-and-hit: bend the knees as the ball bounces, then drive up. 20 balls per side.",
    balance: "Freeze finish: 15 shots, hold the landing for two seconds. Note which direction you fall."
  };
  const cardio = "Footwork and aerobic base: 15 minutes easy, plus 4 rounds of split-step to a called corner.";
  const rest = "Off court. Easy walk or stretch. The arm adapts on the days you don't hit.";
  const freeHit = "Free hitting. Keep one cue from your last session and ignore everything else.";
  const top = Object.entries(issueCounts || {}).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let i = 0;
  return days.map((day, idx) => {
    if (idx === 3) return { day, drill: cardio };
    if (idx === 6) return { day, drill: rest };
    const key = top[i];
    if (key && byIssue[key]) {
      i += 1;
      return { day, drill: byIssue[key] };
    }
    return { day, drill: freeHit };
  });
}

export function gradeSpeed(shot, avgMph) {
  const thresholds = {
    "Serve / Overhead": [80, 65, 50, 35],
    Forehand: [65, 50, 40, 30],
    Backhand: [55, 45, 35, 25],
    Volley: [45, 35, 28, 20]
  };
  const t = thresholds[shot] || [60, 45, 35, 25];
  if (avgMph >= t[0]) return "A";
  if (avgMph >= t[1]) return "B";
  if (avgMph >= t[2]) return "C";
  if (avgMph >= t[3]) return "D";
  return "F";
}

export function calcConsistency(speeds) {
  if (!speeds || speeds.length < 2) return null;
  const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  if (mean <= 0) return null;
  const variance = speeds.reduce((sum, x) => sum + (x - mean) ** 2, 0) / speeds.length;
  const cv = Math.sqrt(variance) / mean;
  return Math.max(0, Math.min(100, Math.round(100 - cv * 200)));
}

export function segmentRallies(motionSamples, events) {
  const shots = events || [];
  if (!motionSamples || motionSamples.length === 0) {
    return shots.length ? [{ start: shots[0].time, end: shots[shots.length - 1].time, shots }] : [];
  }
  const maxMotion = Math.max(...motionSamples.map(m => m.motion));
  const threshold = maxMotion * 0.08;
  const gapDuration = 2;
  const rallies = [];
  let rallyStart = motionSamples[0].time;
  let quietStart = null;
  motionSamples.forEach(s => {
    if (s.motion < threshold) {
      if (quietStart === null) quietStart = s.time;
    } else {
      if (quietStart !== null && s.time - quietStart > gapDuration) {
        rallies.push({ start: rallyStart, end: quietStart });
        rallyStart = s.time;
      }
      quietStart = null;
    }
  });
  rallies.push({ start: rallyStart, end: motionSamples[motionSamples.length - 1].time });
  rallies.forEach(r => {
    r.shots = shots.filter(e => e.time >= r.start && e.time <= r.end);
  });
  return rallies.filter(r => r.shots.length > 0);
}

export function mapToCourt(u, v, corners, W, H) {
  const nearLeft = corners[0];
  const nearRight = corners[1];
  const farRight = corners[2];
  const farLeft = corners[3];
  const nearMidY = (nearLeft.y + nearRight.y) / 2;
  const farMidY = (farLeft.y + farRight.y) / 2;
  const t = Math.max(0, Math.min(1, (v - nearMidY) / ((farMidY - nearMidY) || 1)));
  const leftX = nearLeft.x + t * (farLeft.x - nearLeft.x);
  const rightX = nearRight.x + t * (farRight.x - nearRight.x);
  const s = Math.max(0, Math.min(1, (u - leftX) / ((rightX - leftX) || 1)));
  return { x: s * W, y: t * H };
}

function solveLinear(matrix, vector) {
  const n = vector.length;
  const rows = matrix.map((row, i) => [...row, vector[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(rows[r][col]) > Math.abs(rows[pivot][col])) pivot = r;
    }
    if (Math.abs(rows[pivot][col]) < 1e-10) return null;
    const swap = rows[col];
    rows[col] = rows[pivot];
    rows[pivot] = swap;
    const div = rows[col][col];
    for (let c = col; c <= n; c++) rows[col][c] /= div;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = rows[r][col];
      for (let c = col; c <= n; c++) rows[r][c] -= factor * rows[col][c];
    }
  }
  return rows.map(row => row[n]);
}

export function courtHomography(corners, widthFt = 27, lengthFt = 78) {
  if (!corners || corners.length !== 4) return null;
  const dst = [
    { x: 0, y: 0 },
    { x: widthFt, y: 0 },
    { x: widthFt, y: lengthFt },
    { x: 0, y: lengthFt }
  ];
  const A = [];
  const b = [];
  corners.forEach((p, i) => {
    const u = p.x;
    const v = p.y;
    const X = dst[i].x;
    const Y = dst[i].y;
    A.push([u, v, 1, 0, 0, 0, -u * X, -v * X]);
    b.push(X);
    A.push([0, 0, 0, u, v, 1, -u * Y, -v * Y]);
    b.push(Y);
  });
  const h = solveLinear(A, b);
  if (!h) return null;
  return [...h, 1];
}

export function projectToCourt(H, u, v) {
  if (!H) return null;
  const w = H[6] * u + H[7] * v + H[8];
  if (!Number.isFinite(w) || Math.abs(w) < 1e-8) return null;
  return {
    x: (H[0] * u + H[1] * v + H[2]) / w,
    y: (H[3] * u + H[4] * v + H[5]) / w
  };
}

export function lineCall(feet, widthFt = 27, lengthFt = 78) {
  if (!feet || !Number.isFinite(feet.x) || !Number.isFinite(feet.y)) return null;
  const dx = feet.x < 0 ? -feet.x : feet.x > widthFt ? feet.x - widthFt : 0;
  const dy = feet.y < 0 ? -feet.y : feet.y > lengthFt ? feet.y - lengthFt : 0;
  const outside = Math.hypot(dx, dy);
  const inside = Math.min(feet.x, widthFt - feet.x, feet.y, lengthFt - feet.y);
  const band = 1.25;
  if (outside === 0 && inside >= band) return { call: "in", confidence: "high", distanceFt: inside, close: false };
  if (outside === 0) return { call: "in", confidence: "low", distanceFt: inside, close: true };
  if (outside < band) return { call: "out", confidence: "low", distanceFt: outside, close: true };
  if (outside < 3.5) return { call: "out", confidence: "medium", distanceFt: outside, close: false };
  return { call: "out", confidence: "high", distanceFt: outside, close: false };
}

export function findBounces(track, frameHeight = 1) {
  if (!track || track.length < 5) return [];
  const points = track.filter(p => Number.isFinite(p.t) && Number.isFinite(p.y)).slice().sort((a, b) => a.t - b.t);
  const drop = Math.max(1.5, frameHeight * 0.012);
  const bounces = [];
  for (let i = 2; i < points.length - 2; i++) {
    const gapBefore = points[i].t - points[i - 1].t;
    const gapAfter = points[i + 1].t - points[i].t;
    if (gapBefore <= 0 || gapAfter <= 0 || gapBefore > 0.35 || gapAfter > 0.35) continue;
    const y = points[i].y;
    const before = (points[i - 1].y + points[i - 2].y) / 2;
    const after = (points[i + 1].y + points[i + 2].y) / 2;
    if (y < before + drop || y < after + drop) continue;
    const last = bounces[bounces.length - 1];
    if (last && points[i].t - last.t < 0.4) continue;
    bounces.push({ t: points[i].t, x: points[i].x, y: points[i].y, nx: points[i].nx, ny: points[i].ny });
  }
  return bounces;
}

export function ballSpeedMph(track, time, pxPerFoot, frameDiag = 1000) {
  if (!pxPerFoot || pxPerFoot < 2) return null;
  const window = (track || []).filter(p => Math.abs(p.t - time) <= 0.18).slice().sort((a, b) => a.t - b.t);
  if (window.length < 3) return null;
  let best = 0;
  let samples = 0;
  for (let i = 1; i < window.length; i++) {
    const dt = window[i].t - window[i - 1].t;
    if (dt < 0.03 || dt > 0.22) continue;
    const dist = Math.hypot(window[i].x - window[i - 1].x, window[i].y - window[i - 1].y);
    if (dist > frameDiag * 0.22) return null;
    const mph = (dist / dt / pxPerFoot) * 0.681818;
    if (mph > best) best = mph;
    samples += 1;
  }
  if (samples < 2 || best < 20 || best > 140) return null;
  return Math.round(best);
}

export function scaleFromBaseline(corners, videoWidth, videoHeight, widthFt = 27) {
  if (!corners || corners.length < 2 || !videoWidth || !videoHeight) return null;
  const a = corners[0];
  const b = corners[1];
  const px = Math.hypot((b.x - a.x) * videoWidth, (b.y - a.y) * videoHeight);
  if (px < 24) return null;
  return px / widthFt;
}

export function callBounces(bounces, H, calibration = "high", widthFt = 27, lengthFt = 78) {
  return (bounces || []).map(bounce => {
    const nx = bounce.nx != null ? bounce.nx : bounce.x;
    const ny = bounce.ny != null ? bounce.ny : bounce.y;
    const feet = projectToCourt(H, nx, ny);
    const judged = lineCall(feet, widthFt, lengthFt);
    if (!judged) return { ...bounce, call: null, confidence: "low", feet: null };
    let confidence = judged.confidence;
    if (calibration !== "high" && confidence === "high") confidence = "medium";
    if (calibration === "low") confidence = "low";
    return { ...bounce, feet, call: judged.call, confidence, distanceFt: judged.distanceFt, close: judged.close };
  });
}

export function sessionBoard({ events = [], bounces = [], rallies = [] } = {}) {
  const lengths = rallies.map(r => (r.shots || []).length).filter(n => n > 0);
  const serveCalls = [];
  events.filter(e => /serve/i.test(e.type || "")).forEach(shot => {
    const bounce = bounces.find(b => b.t > shot.time && b.t - shot.time < 1.6 && b.confidence === "high" && (b.call === "in" || b.call === "out"));
    if (bounce) serveCalls.push(bounce.call);
  });
  const firstServePct = serveCalls.length >= 2
    ? Math.round(100 * serveCalls.filter(c => c === "in").length / serveCalls.length)
    : null;
  let errors = null;
  const outs = bounces.filter(b => b.call === "out" && b.confidence === "high");
  if (outs.length && events.length) {
    errors = outs.filter(bounce => {
      const shot = [...events].reverse().find(e => e.time < bounce.t && bounce.t - e.time < 1.5);
      if (!shot) return false;
      return !events.some(e => e.time > shot.time && e.time < bounce.t);
    }).length;
  }
  return {
    shots: events.length,
    rallyCount: rallies.length,
    avgRallyShots: lengths.length ? Math.round((lengths.reduce((a, b) => a + b, 0) / lengths.length) * 10) / 10 : null,
    longestRally: lengths.length ? Math.max(...lengths) : 0,
    bounces: bounces.length,
    callsIn: bounces.filter(b => b.call === "in").length,
    callsOut: bounces.filter(b => b.call === "out").length,
    firstServePct,
    errors,
    winners: null
  };
}

export function quietSpans(events, duration, minGap = 2.4) {
  if (!Number.isFinite(duration) || duration <= 0) return [];
  const marks = [0, ...(events || []).map(e => e.time).filter(t => t > 0 && t < duration).sort((a, b) => a - b), duration];
  const gaps = [];
  for (let i = 1; i < marks.length; i++) {
    if (marks[i] - marks[i - 1] <= minGap) continue;
    const start = marks[i - 1] + (i === 1 ? 0 : 0.35);
    const end = marks[i] - (i === marks.length - 1 ? 0 : 0.25);
    if (end - start > 0.8) gaps.push({ start, end });
  }
  return gaps;
}

export function detectCourtLines(image) {
  const { width, height, data } = image || {};
  if (!width || !height || !data) return { corners: null, confidence: "low", reason: "no frame" };
  const white = new Uint8Array(width * height);
  let count = 0;
  for (let p = 0, i = 0; p < white.length; p++, i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (min > 168 && max - min < 42) {
      white[p] = 1;
      count += 1;
    }
  }
  if (count < width * 0.35) return { corners: null, confidence: "low", reason: "not enough white line pixels" };
  const rows = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) rows[y] += white[y * width + x];
  }
  const peak = (y0, y1) => {
    let best = -1;
    let at = -1;
    for (let y = y0; y < y1; y++) {
      if (rows[y] > best) {
        best = rows[y];
        at = y;
      }
    }
    if (best < width * 0.15 || at < 0) return null;
    let left = 0;
    let right = width - 1;
    const row = at * width;
    while (left < width && !white[row + left]) left += 1;
    while (right > left && !white[row + right]) right -= 1;
    if (right - left < width * 0.22) return null;
    return { y: at, left, right, score: best };
  };
  const near = peak(Math.floor(height * 0.5), height);
  const far = peak(Math.floor(height * 0.05), Math.floor(height * 0.48));
  if (!near || !far || far.y >= near.y - 3) {
    return { corners: null, confidence: "low", reason: "the two baselines were not clear" };
  }
  const confidence = near.score > width * 0.28 && far.score > width * 0.18 ? "medium" : "low";
  return {
    corners: [
      { x: near.left / width, y: near.y / height },
      { x: near.right / width, y: near.y / height },
      { x: far.right / width, y: far.y / height },
      { x: far.left / width, y: far.y / height }
    ],
    confidence,
    reason: null
  };
}

export function liveStrokeTick(prev, sample) {
  if (!sample) return { shot: false, cue: "", prev };
  if (!prev) return { shot: false, cue: "", prev: sample };
  const dt = sample.t - prev.t;
  if (!(dt > 0) || dt > 0.8) return { shot: false, cue: "", prev: sample };
  const torso = sample.torso || 0.05;
  const speed = Math.hypot(sample.wristX - prev.wristX, sample.wristY - prev.wristY) / dt;
  const since = sample.t - (prev.lastShot || -10);
  const shot = speed / torso > 3.2 && speed > 0.4 && since > 0.75;
  let cue = "";
  if (sample.wristY < sample.shoulderY - torso * 0.45) cue = "Racket hand is up. Reach through a serve instead of stopping short.";
  else if (shot) cue = "Swing spotted. Finish the stroke before you look up.";
  return {
    shot,
    cue,
    prev: { ...sample, lastShot: shot ? sample.t : (prev.lastShot || 0) }
  };
}

export function buildSampleSession(now = new Date()) {
  const events = [
    { time: 1.4, type: "Forehand", speedEst: 62, spin: "topspin", note: "solid contact point out in front of the body", ballX: 0.66, ballY: 0.72 },
    { time: 2.6, type: "Backhand", speedEst: 48, spin: "slice", note: "contact point looks a little late — try preparing the racket earlier", ballX: 0.34, ballY: 0.7 },
    { time: 3.7, type: "Forehand", speedEst: 57, spin: "topspin", note: "shoulders look fairly square to the net — more hip and shoulder rotation on the backswing can add power", ballX: 0.7, ballY: 0.64 },
    { time: 5.1, type: "Forehand", speedEst: 64, spin: "flat", note: "solid contact point out in front of the body", ballX: 0.58, ballY: 0.76 },
    { time: 8.4, type: "Serve / Overhead", speedEst: 86, spin: "—", note: "try contacting the ball higher, at full reach, rather than dropping the racket arm early", ballX: 0.52, ballY: 0.22 },
    { time: 11.2, type: "Backhand", speedEst: 51, spin: "topspin", note: "good contact point ahead of the body", ballX: 0.4, ballY: 0.66 },
    { time: 12.3, type: "Volley", speedEst: 39, spin: "flat", note: "swing looks a bit long for a volley — try a shorter, punchier motion", ballX: 0.48, ballY: 0.46 },
    { time: 13.1, type: "Forehand", speedEst: 55, spin: "topspin", note: "contact looks late and close to the body — try meeting the ball further out in front", ballX: 0.73, ballY: 0.8 },
    { time: 16.8, type: "Forehand", speedEst: 60, spin: "topspin", note: "head and upper body drifting off-balance through the shot — try staying centered over your base", ballX: 0.62, ballY: 0.74 },
    { time: 18.0, type: "Backhand", speedEst: 46, spin: "slice", note: "follow-through looks short — finish high and extended, not cut off", ballX: 0.3, ballY: 0.68 }
  ];
  const speeds = events.map(e => e.speedEst);
  const counts = {};
  events.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
  const main = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return {
    id: "sample-rally",
    sample: true,
    local: true,
    created_at: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
    shot_count: events.length,
    avg_speed: Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length),
    top_speed: Math.max(...speeds),
    main_shot: main,
    events,
    session_type: "practice",
    match_opponent: null,
    match_score: null,
    is_public: false,
    caption: "Sample rally so you can see a report card before you film.",
    video_path: null
  };
}

export function dayKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function consecutiveStreak(dayKeys, today = new Date()) {
  const set = new Set(dayKeys);
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  if (!set.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
