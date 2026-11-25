# Project Audit — The Wedding Experience

**Audit date:** 2026-11-25  
**Scope:** Full production-readiness review of the existing cinematic wedding invitation site  
**Method:** Code inspection + live browser verification + `npm run build` / `npm run lint`  
**Constraint:** No visual redesign; critical bugs fixed only when confirmed

---

## Executive summary

The invitation experience is largely functional end-to-end on desktop and mobile. RSVP is **demo mode only** (not connected to a database). Background music has no audio file yet (graceful unavailable state). One **critical GSAP `matchMedia` bug** prevented ScrollTrigger parallax on viewports below 768px; that has been fixed and re-tested.

**Production build:** PASSED (`next build`, TypeScript, ESLint)

---

## RSVP persistence status (explicit)

| Check | Result |
|---|---|
| Database / CRM / spreadsheet connected? | **No** |
| `RSVP_DEMO_MODE` | `true` in `lib/constants/rsvp.ts` |
| `/api/rsvp` behavior | Simulates success after ~700ms; returns `mode: "demo"`; **does not persist** |
| UI disclosure | Demo notice on form + “Demo confirmation — not stored” after submit |

**Do not treat RSVP as production-ready guest capture until a real backend is wired.**

---

## Test matrix

| Viewport | Overflow | Sections present | Notes (tested) |
|---|---|---|---|
| **1440×900** | 0px | All | Hero parallax ✓, beginning scale ✓, pinned horizontal journey ✓ |
| **1280×800** | 0px | All | Same as 1440 ✓ |
| **768×1024** | 0px | All | Tailwind `md` → desktop journey pin ✓ |
| **390×844** | 0px | All | Mobile swipe journey ✓; parallax ✓ **after fix** |
| **320×568** | 0px | All | Parallax ✓; RSVP submit height 48px ✓ |

---

## Feature verification (1–15)

### 1. Envelope opening and transition — **WORKING** (tested)
- Click envelope/seal opens flap once per session.
- Card rises; “Open Invitation” transitions into cinematic journey without reload.

### 2. Cinematic hero and parallax — **WORKING** (tested)
- Sticky full-viewport hero with layered florals + typography.
- Desktop scrub parallax confirmed (transform matrix updates on scroll).
- Mobile scrub parallax confirmed **after critical fix** (see Broken → Fixed).

### 3. GSAP ScrollTrigger animations — **WORKING** (tested; bug fixed)
- Hero, story clip-path, beginning scale, journey pin all observed updating under scroll.
- `useGSAP` + `mm.revert()` cleanup present on animated sections.

### 4. Lenis smooth scrolling — **WORKING** (tested)
- `html.lenis` class present when reduced-motion is off.
- Lenis ↔ GSAP ticker bridge in `SmoothScrollProvider` with cleanup on unmount.

### 5. Our Story section — **WORKING** (tested)
- Editorial layout mounts; clip-path reveal progresses on scroll (`inset(0%)` observed mid-section).

### 6. Horizontal / swipe gallery — **WORKING** (tested)
- Desktop (≥768): pinned track translates horizontally (`matrix(..., -x, 0)`).
- Mobile (<768): desktop track hidden; native snap swipe carousel shown; no page overflow.

### 7. Wedding countdown — **WORKING** (tested)
- Units render (Days/Hours/Minutes/Seconds) from `WEDDING_COUNTDOWN_DATE`.
- Completed-state copy exists in code for when diff hits zero (future date currently used).

### 8. Wedding event cards — **WORKING** (tested)
- All five events render (Mehendi → Reception).
- Expand/collapse reveals details (desktop grid + mobile carousel both in DOM).

### 9. Venue / Google Maps links — **WORKING** (tested)
- Expanded card exposes “Get Directions” with `target="_blank"` and `rel="noopener noreferrer"`.
- URLs are **placeholder** Maps search queries (by design).

### 10. RSVP validation & submission — **WORKING** (tested)
- Empty submit shows required-field errors.
- Indian mobile validation enforced client + server.
- Accept submit disables controls (“Sending…”) then succeeds in demo mode.
- Decline path verified via direct `POST /api/rsvp` → `{ ok: true, mode: "demo", attendance: "decline" }`.

### 11. RSVP confirmation animation — **WORKING** (tested)
- Form exits; personalized accept message includes guest name; demo badge shown.

### 12. Background music controls — **PARTIAL** (tested)
- Floating control appears after entering the journey.
- **No autoplay** observed.
- Current state: **“Music unavailable”** because `public/audio/wedding-theme.mp3` is **missing** (HTTP 404). UI handles this gracefully.
- Play/pause with a real file was **not** tested (asset absent).

### 13. Share invitation — **WORKING** (tested)
- Clipboard fallback copies page URL and shows “Link copied” when Web Share is unavailable.

### 14. Final thank-you section — **WORKING** (tested)
- “Your Presence Is Our Greatest Gift”, couple placeholders, date label, Share + Back to top present.

### 15. Mobile responsiveness — **WORKING** (tested at 390 & 320)
- No horizontal page overflow at audited widths.
- Mobile event carousel and journey swipe present.
- Touch-friendly RSVP submit (~48px height) confirmed at 320px.

---

## Working features

- Full envelope → journey flow
- Lenis + GSAP ticker integration (desktop confirmed; mobile after fix)
- Story / Beginning / Journey / Countdown / Events / Save the Date / RSVP / Thank You
- Demo RSVP API with clear non-persistence messaging
- Share clipboard fallback
- Reduced-motion hooks and CSS `prefers-reduced-motion` rules
- Placeholder SVG image assets all return HTTP 200
- Production build + TypeScript + ESLint clean

---

## Broken features

### Fixed during this audit
1. **Mobile ScrollTrigger never registered**  
   - **Cause:** `gsap.matchMedia({ isDesktop, reduceMotion })` does not invoke the callback when *no* query matches. On phones both were false, so hero/story/beginning scrub animations never created.  
   - **Fix:** Added `isMobile: "(max-width: 767px)"` in `WeddingHero`, `OurStory`, `TheBeginning`.  
   - **Retest:** At 390px, hero/beginning transforms and story clip-path update on scroll.

2. **Envelope open `setTimeout` without cleanup** — cleared on unmount in `InvitationExperience`.

3. **Share status `setTimeout` without cleanup** — cleared on unmount in `FinalThankYou`.

4. **Music button missing `relative` positioning** — disc overlay could mis-position; added `relative`.

### Still broken / incomplete
1. **Background music playback** — audio file missing (`/audio/wedding-theme.mp3` → 404). Control correctly disabled.
2. **RSVP not persisted** — demo only (expected until backend work).

---

## Missing features / production gaps

| Gap | Severity | Notes |
|---|---|---|
| Real wedding photographs | High (content) | SVG placeholders only |
| Real couple names / dates / venues | High (content) | Central config still placeholder strings |
| Real Google Maps destinations | Medium | Placeholder search URLs |
| Wedding theme MP3 | Medium | Documented in `public/audio/README.md` |
| Live RSVP storage | High (product) | Demo mode; no DB |
| Rate limiting / spam protection on `/api/rsvp` | Medium (security) | Open POST endpoint |
| CSRF / bot protection | Medium | Not implemented |
| Analytics / error monitoring | Low | Not present |
| SEO OG images for share previews | Low | Metadata title/description only |
| Automated e2e tests | Medium | Manual browser audit only |

---

## Performance issues

| Issue | Severity | Evidence / note |
|---|---|---|
| Duplicate event card trees (desktop + mobile) in DOM | Low–Medium | Both grids mount; one hidden via CSS → extra image nodes |
| Many simultaneous Motion particle instances | Low | Acceptable for landing; watch low-end mobile CPU |
| Lazy images below fold may report `complete: false` briefly | Info | Asset fetches return 200; not broken URLs |
| ScrollTrigger.refresh delayed 1.1s after envelope | Low | Intentional for enter animation; can feel late on fast devices |
| No image CDN / real photo optimization yet | Info | SVGs are fine; real photos will need `next/image` sizing discipline |

---

## Security concerns

| Concern | Severity | Detail |
|---|---|---|
| Public RSVP POST without auth / rate limit | Medium | Abusable for spam when live mode is enabled |
| Demo mode in production if shipped as-is | High (product trust) | Guests may believe RSVP was saved |
| Placeholder Maps / PII fields | Low | No real guest data stored today |
| `noopener noreferrer` on Maps links | OK | Verified present |

**Recommendation:** Keep demo banner until persistence ships; add rate limiting + honeypot/CAPTCHA before going live.

---

## Accessibility notes (spot-checked)

- RSVP fields use labels, `aria-invalid`, and `role="alert"` for errors — **verified**.
- Attendance uses `radiogroup` / `aria-checked` — **verified**.
- Music control exposes `aria-label` — **verified**.
- Duplicate hidden desktop/mobile event content may create extra headings for AT when both exist in accessibility tree depending on `display:none` handling — generally hidden correctly; worth a follow-up VoiceOver pass.
- Focus management after RSVP confirmation (move focus to thank-you heading) — **not implemented**.

---

## Animation cleanup

| Area | Status |
|---|---|
| GSAP `useGSAP` + `mm.revert()` | Present on hero/story/beginning/journey |
| Lenis scroll listener + ticker remove | Present |
| Audio element teardown | Present |
| Envelope / share timers | **Fixed** this audit |

---

## Reduced-motion support

- `usePrefersReducedMotion` used across journey sections and music rotation.
- Lenis skipped when reduced motion preferred.
- Global CSS short-circuits animations/transitions.
- Full reduced-motion end-to-end browser pass was **not** executed in this audit (OS setting not toggled).

---

## Recommended fixes (priority order)

1. **Ship real RSVP backend** (or keep demo banner highly visible) — set `RSVP_DEMO_MODE = false` only after persistence works.
2. **Add `public/audio/wedding-theme.mp3`** (or update `lib/constants/music.ts` path) and re-test play/pause.
3. **Replace placeholder content** in `lib/constants/wedding.ts` and `lib/constants/events.ts` + real photos under `public/images/**`.
4. **Add rate limiting** to `/api/rsvp` before public launch.
5. **Optional:** render mobile *or* desktop event/journey markup (not both) to cut DOM/image weight.
6. **Optional:** after RSVP success, `focus()` the confirmation heading for screen readers.
7. **Run a dedicated reduced-motion + VoiceOver/TalkBack pass** before launch.

---

## Critical fixes applied in this audit

1. GSAP `matchMedia` mobile callback registration (`isMobile` query) — Hero / Our Story / The Beginning  
2. Envelope open timeout cleanup  
3. Share status timeout cleanup  
4. Music player `relative` positioning  

---

## Production build result

```
Command: npm run build
Result:  SUCCESS

Next.js 16.4.6 (Turbopack)
✓ Compiled successfully
✓ TypeScript finished
✓ Static pages generated

Routes:
○ /           (static)
○ /_not-found (static)
ƒ /api/rsvp   (dynamic)

Command: npm run lint
Result:  SUCCESS (no ESLint issues)
```

---

## Audit confidence notes

- Claims marked **WORKING (tested)** were exercised in the Cursor browser against the running dev server.
- Music **play** with a real file was **not** tested (file missing).
- Reduced-motion OS preference was **not** toggled in-browser this pass.
- Visual design was intentionally left unchanged aside from non-visual / layout-safe bugfixes above.
