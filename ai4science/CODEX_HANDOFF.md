# AI4Science — Codex Handoff

## Goal
Continue developing the `ai4science` teacher-facing slide site in this repository. Treat the current v4 as the baseline and evolve it carefully rather than rewriting from scratch.

Repository: `tonyxinvip/slides`
Primary path: `ai4science/`
Current live version: `ai4science/v4/`
Root redirect: `ai4science/index.html` → `./v4/`
Public URL: `https://tonyxinvip.github.io/slides/ai4science/`

## Audience and event
Audience: frontline primary-school science teachers, not science curriculum researchers or school administrators.
Speaker: 辛海洋
Date: 2026-08-21
Venue: 深圳技术大学

## Core narrative to preserve
Keep the main structure:
1. 看不见 — help students observe phenomena that are otherwise difficult to observe.
2. 做不了 — reduce the practical cost of authentic inquiry without replacing real inquiry.
3. 评不准 — help teachers see evidence of student thinking that is hard to capture in a 40-minute lesson.
4. 老师如何调度AI — teacher remains the decision-maker; AI is a bounded scaffold.
5. 带走一个下周可用的成果 — teachers leave with something they can use in the next lesson.

The recurring instructional logic is:
课程目标 → 科学任务 → 学生参与 → 学习证据 → 教师判断 → AI支架 → 撤除支架 → 独立表现 → 新证据

AI must remain a support layer, not the starting point of the teaching model.

## Content principles already agreed
- Do not turn the deck into an AI tools catalog.
- Do not frame AI as evaluating or judging teachers.
- Prefer wording where the teacher is the subject: “老师可以…”, “当学生…时…”, “这一环节可以…”.
- Preserve authentic observation, real experiments, student explanation, scientific argumentation, and teacher judgment.
- “能真实经历的，不用AI替代；现实做不到的，再让AI补位。”
- Authentic inquiry is not “doing an activity”; it requires students to form questions, collect/interpret evidence, and revise ideas.
- ICAP is a lens for how students participate in a task, not a permanent student level.
- Activity ≠ competency. Use: Activity → Performance → Evidence → Interpretation.
- CER is a scaffold for Claim–Evidence–Reasoning, not equivalent to the full Toulmin model.
- Prefer evidence profiles over simplistic radar scores or one-shot levels.
- NE / insufficient evidence must not be treated as a low ability level.
- Any AI-derived learner judgment must be presented as candidate evidence, not final diagnosis.

## Current v4 implementation
Files under `ai4science/v4/`:
- `index.html`
- `styles.css`
- `slides-1.js`
- `slides-2.js`
- `slides-3.js`
- `app.js`

The slide site is data-driven. `slides-*.js` define slide content and layout metadata. `app.js` renders layouts such as:
- cards
- flow
- compare
- table
- concept
- ladder
- cycle
- quote
- mock
- section

The current root page redirects to `/ai4science/v4/`.

## Critical engineering rule
DO NOT reintroduce runtime-compressed payload loaders.

Previous failed approaches used:
- `DecompressionStream`
- gzip/base64 payloads decoded in the browser
- `pako` loaded from jsDelivr

These caused failures in iPhone/iPad/ChatGPT in-app browsers and some embedded browsers.

Required publishing constraints:
- normal static HTML/CSS/JS only
- no runtime decompression
- no third-party CDN dependency for core rendering
- no loader that fetches an old commit and rewrites the document
- all essential assets local to the repository
- must work in Safari, Chrome, iOS embedded browser, and narrow mobile viewports

## Visual direction for next iteration
The v4 direction is stronger than v2/v3, but continue improving visual richness while keeping the deck professional and restrained.

Prioritize:
- SVG diagrams and explanatory visuals
- comparison tables
- process diagrams
- evidence flows
- classroom journey maps
- simple matrices
- before/after visuals
- meaningful screenshots from the original science-teacher deck

Avoid:
- pages that are only 3–5 bullets floating in empty space
- decorative SVGs that do not carry information
- repetitive “3 points / 4 steps / 5 things” AI-generated rhythm
- excessive glow, gradients, or startup-pitch aesthetics
- visual density that makes the deck hard to present live

## Recommended visual rhythm
Across the ~60 slides, aim for a deliberate mix:
- section / statement pages
- concept diagrams
- tables / matrices
- real-case screenshots
- classroom workflow pages
- teacher decision pages
- practical exercise pages

A good target is that no more than ~20–25% of pages are simple bullet/list pages.

## High-value pages to improve first
Prioritize these types/pages because they are conceptually central:
- teacher’s five real questions
- the full teaching loop
- 看不见 / 做不了 / 评不准 relationship
- one complete lesson flow: temperature and dissolving
- authentic vs pseudo inquiry
- tool choice by teaching problem, not by software
- one problem / different-cost solutions
- different grade-band scaffolds
- Activity → Performance → Evidence → Interpretation
- ICAP examples across the same activity
- scientific explanation vs scientific argumentation
- evidence profile vs simplistic radar scoring
- teacher AI-use depth ladder
- prompt structure: role / task / boundary / output
- when students should access AI
- classroom management for ~40 students
- AI error handling
- one-lesson AI-use checklist
- three practical take-away tasks
- final return to science learning itself

## Real cases from the original deck worth retaining
Use real visual material where possible from the earlier source deck rather than inventing generic illustrations:
- 日食形成
- 植物实验室 / 植物生长
- PhET
- CocoFlow
- 六年级《生命体中的化学变化》
- 五年级《用沉的材料造船》
- CocoClass interactions
- scientific argumentation / evidence examples
- classroom evidence / review examples

If source assets are already present in the repo or existing files, reuse them. Do not replace good real screenshots with generic AI illustrations.

## Writing style
Use natural professional Chinese suitable for experienced teachers.
Avoid AI-like phrasing such as:
- “赋能跃迁”
- “精准赋能”
- “全面重构”
- repeated “从……到……” headlines unless structurally necessary
- excessive symmetric list phrasing
- marketing claims that cannot be evidenced

Keep language concrete:
- what the teacher sees
- what the student does
- what evidence is left
- what AI may help with
- what must remain the teacher/student’s work

## Claims discipline
Distinguish among:
1. curriculum/theoretical basis
2. project design choice
3. hypothesis to be validated

Do not state unvalidated capabilities as facts. For example, prefer:
“系统可尝试识别可能的变量控制问题，供教师复核”
instead of:
“系统精准识别变量控制漏洞”.

## Mobile and presentation QA
Before considering a revision complete, verify:
- desktop 16:9 projection
- iPhone narrow viewport
- iPad landscape
- ChatGPT/in-app browser compatibility
- keyboard navigation
- touch swipe navigation
- catalog/navigation usability
- no overflow or clipped text
- no external core dependencies
- root redirect still works

## Recommended next milestone
Create a v5 branch/folder rather than overwriting v4 immediately.
Suggested path: `ai4science/v5/`

Work sequence:
1. Audit all v4 slides for visual monotony, redundancy, conceptual tension, and AI-like phrasing.
2. Produce a slide-by-slide change plan.
3. Improve high-value pages first.
4. Reuse original real screenshots where relevant.
5. Keep ~60 slides unless there is a strong reason to change count.
6. Run mobile/desktop QA.
7. Only after review, update `ai4science/index.html` to redirect to v5.

## Definition of done
The next version should feel like a real teacher workshop deck, not a long document broken into slides. A teacher should be able to follow the story without external reading, while an experienced teacher can skip explanatory detail and still see a coherent professional argument.
