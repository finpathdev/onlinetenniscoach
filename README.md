[README.md](https://github.com/user-attachments/files/29490083/README.md)
# AI Tennis Coach (v0.1 prototype)

A free, browser-based tennis coaching tool. Upload a video, get pose tracking,
shot detection, rough speed estimates, and rule-based coaching feedback —
all running client-side, no backend required.

## How to set up the free backend (Supabase) — required for accounts/saved sessions

1. Go to supabase.com and create a free account, then create a new project.
2. In your project, go to **Project Settings → API**. Copy your **Project URL**
   and **anon public key**.
3. Open `index.html` in this repo and find this block near the top of the
   `<script type="module">` section:
   ```js
   const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   ```
   Replace both placeholder strings with the values from step 2, then save
   and push the file to GitHub (or edit directly in the GitHub web UI).
4. In Supabase, go to the **SQL Editor** and run this to create the sessions
   table:
   ```sql
   create table sessions (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) not null,
     shot_count int,
     avg_speed numeric,
     top_speed numeric,
     main_shot text,
     events jsonb,
     is_public boolean default false,
     caption text,
     created_at timestamp with time zone default now()
   );

   alter table sessions enable row level security;

   create policy "Users can view their own sessions"
     on sessions for select
     using (auth.uid() = user_id);

   create policy "Users can insert their own sessions"
     on sessions for insert
     with check (auth.uid() = user_id);

   create policy "Users can update their own sessions"
     on sessions for update
     using (auth.uid() = user_id);

   create policy "Anyone can view public sessions"
     on sessions for select
     using (is_public = true);
   ```
   If you already ran the table-creation SQL from an earlier setup, just run
   this instead to add the new columns and policies:
   ```sql
   alter table sessions add column if not exists is_public boolean default false;
   alter table sessions add column if not exists caption text;

   create policy "Users can update their own sessions"
     on sessions for update
     using (auth.uid() = user_id);

   create policy "Anyone can view public sessions"
     on sessions for select
     using (is_public = true);
   ```
5. In Supabase, go to **Authentication → Providers** and make sure Email is
   enabled (it is by default). Optionally, under **Authentication → Settings**,
   turn off "Confirm email" if you want sign-up to work instantly without an
   email confirmation step while testing.
6. Reload your live site. You should now see Sign In / Sign Up fields at the
   top. Create an account, analyze a video, and the session summary will be
   saved — refresh the page and it'll still be there under "Your saved
   sessions" once you're signed in.

Everything here stays on Supabase's free tier for normal personal use (free
tier includes a generous amount of database rows and monthly active users).

## How to film for the best analysis results

- Side-on camera angle (standing roughly level with the net, off to the side
  of the court), not from behind the baseline
- Tripod or steady surface — handheld footage hurts ball-tracking accuracy
- Stand far back enough that a full court line is visible, since you'll use
  it for speed calibration
- Good lighting, minimal harsh shadows
- Short clips (single rallies) rather than full matches
- Avoid backgrounds/court surfaces close in color to the ball (bright
  yellow-green), since it can confuse the ball tracker

## What's actually in this version

- Video upload + playback
- **User accounts and saved session history** via Supabase — sign up/sign in,
  and every analyzed session is saved to your account so it doesn't disappear
  on refresh
- **Progress dashboard** — a speed trend chart across your sessions, a shot
  type breakdown, and rule-based drill suggestions generated from recurring
  flagged issues in your feedback notes
- **Community page** — after analyzing a session, you can optionally mark it
  public with a caption; public sessions appear in a shared community feed
  visible to anyone (no login required to view it)
- Real-time pose skeleton overlay (MediaPipe Pose, runs in-browser)
- Rule-based coaching feedback that looks at multiple body landmarks per
  shot — contact point relative to the hip, elbow extension angle, shoulder
  vs. hip rotation, front-knee bend, and head/balance position — rather than
  just wrist position, and auto-detects which hand is swinging the racket
  instead of assuming right-handed
- **Real ball tracking**: color + motion-based detection that follows the
  actual tennis ball frame-to-frame (yellow-green color matching), not just
  body motion
- **Calibrated speed**: a one-time calibration step where you mark two ends
  of a known court line (e.g. baseline-to-baseline, 78 ft) on the paused
  frame, converting pixel motion into real mph. Skippable if you just want
  rough relative numbers.
- Toggleable coaching pop-ups synced to video playback
- Session summary stats (shot count, avg/top ball speed, most-used shot)
- Clickable feedback list that jumps the video to that moment

## Limitations of the ball tracking (be aware of these)

- This is a classical computer-vision approach (color/motion based), not a
  trained object-detection model. It works well with good lighting, a clear
  side-on angle, and a ball that contrasts against the background/court.
- It can lose the ball on fast, heavily motion-blurred frames, against
  similarly-colored backgrounds (e.g. yellow-green court surfaces, certain
  clothing), or in low light.
- When the ball isn't detected near a swing, the app falls back to a
  wrist-motion-based estimate and flags it in the feedback note so you know
  which numbers are ball-tracked vs. estimated.
- Calibration accuracy depends on you clicking the two reference points
  precisely and the camera not moving/zooming during the clip.

## What this version does NOT do yet (next steps)

- A trained ball-detection model (current tracking uses color/motion CV,
  which is solid but not as robust as a proper trained model would be —
  upgrading this is the next big accuracy lever)
- Spin detection
- Multi-shot-in-a-row rally segmentation refinement
- Mobile-camera-angle flexibility (works best with a side-on, tripod shot)

## How to deploy this for free

### Option A — GitHub Pages (simplest)
1. Create a new GitHub repo, e.g. `tennis-coach-app`
2. Upload `index.html` to the repo root
3. Go to repo Settings → Pages → set source to "main branch / root"
4. Your site will be live at `https://<your-username>.github.io/tennis-coach-app/`

### Option B — Vercel/Netlify (also free, slightly more flexible later)
1. Push this repo to GitHub
2. Connect the repo in Vercel or Netlify
3. Deploy with default static site settings (no build command needed)

## Roadmap for adding a real backend later

When you're ready to add accounts, saved history, and a proper ball-tracking
model, the suggested free stack is:
- Supabase (free tier) — auth, database, storage for session history
- Cloudflare R2 (free tier) — video storage if files get large
- A small Python service (can run on Render free tier) for ball-tracking
  inference, since that's heavier than what the browser can reliably do

This file is intentionally a single self-contained HTML file for now so it's
easy to get live and test. Once you want accounts/history, it makes sense to
convert this into a proper Next.js project.
