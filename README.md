# Mood Mode — Showcase

A sensory-led emotional check-in tool for teams that replaces the tired "how are you?" with something worth answering.

Users move through six atmospheric, sensory questions — picking a colour, a sky, a pulse, a texture, a sound, a battery level — and the system maps their responses into a single evocative mood word, delivered as a generated visual artefact. Not a score. Not a dial. Something closer to a small piece of art that says "yes, that's it" when you see it.

Under the hood, answers are scored across energy and valence, landing in one of five mood zones — Golden Hour, Morning Mist, Wildfire Dusk, Blue Hour, Dead Calm — each with its own palette of words. The difference between Frayed and Tangled, or Soft and Dewy, is intentional. The language is precise because imprecise language is what people are trying to escape.

Team sharing is optional, anonymous by default, and presented as a collective mosaic — a visual snapshot of how a group feels on a given day, without reducing anyone to a data point. No averages. No analysis. Just the visual doing the work.

---

## What's in this repo

This is a working showcase — algorithm explorations, design work, and feature concepts live here as they develop. It is not a production codebase.

```
showcase/
├── README.md               ← you are here
└── algorithms/             ← algorithm explorations
    ├── nearest-centroid-classifier/
    └── bayesian-inference/
```

As the project grows, additional folders will be added alongside `algorithms/` — design assets, feature concepts, research, and more.

---

## Algorithms

Each folder under `algorithms/` is a self-contained exploration of a different approach to the mood classification problem. They share the same question set and mood map as a foundation but differ in how they compute a result.

### nearest-centroid-classifier

The foundational approach. User answers produce a coordinate on an emotional plane (energy × valence). The algorithm finds the nearest mood pin on that plane and returns it as the result. Simple, deterministic, no training data required.

Evolved from a 2D, 6-question proof of concept to a 3D classifier with a clarity axis, 7 questions, question weighting, recency weighting, signature tie-breaking, and a full immersive UI. See `CHANGES.md` inside for the full diff.

### bayesian-inference

Builds on the nearest-centroid foundation by adding a learning layer. After enough sessions with feedback, the system builds probability distributions from observed behaviour and blends that learned knowledge into the spatial result. Starts deterministic, becomes more personalised over time.

---

## Working on this repo

### Branching

Never commit directly to `main`. Always create a branch, do your work there, and open a pull request when it's ready.

**Create a branch:**
```bash
git checkout main
git pull
git checkout -b feature/your-branch-name
```

**Or in GitHub Desktop:** Current Branch → New Branch → name it → Create Branch.

**Branch naming:**

| Prefix | Use for |
|--------|---------|
| `feature/` | new functionality |
| `fix/` | bug fixes |
| `design/` | design-related work |
| `docs/` | documentation updates |
| `experiment/` | exploratory or uncertain work |

Examples: `design/mood-wheel-visuals`, `feature/sharing-mosaic`, `experiment/3d-clarity-axis`

---

### Committing

Keep commits focused — one logical change per commit. Write the message as a short statement of what changed and why.

```bash
git add <specific files>
git commit -m "add clarity axis to nearest centroid distance calculation"
```

Avoid vague messages like `update`, `changes`, `wip`. These make it hard to read history later.

---

### Pull requests

When your branch is ready to merge into `main`:

1. Push your branch: **Publish Branch** in GitHub Desktop, or `git push origin your-branch-name`
2. Open a pull request on GitHub
3. Give it a clear title and a short description of what changed and why
4. Request a review from your teammate if relevant
5. Merge once approved

---

### Keeping your branch up to date

If `main` has been updated while you were working on your branch, bring those changes in:

```bash
git checkout main
git pull
git checkout your-branch-name
git merge main
```

This keeps your branch current and makes the eventual merge cleaner.

---

### Two people working at the same time

Split work so you're not editing the same files simultaneously. A natural split for this project:

```
main
├── design/mood-wheel-visuals     ← Person A
└── feature/bayesian-updates      ← Person B
```

Git merges automatically when changes are in different files. Conflicts only happen when two people edit the same lines in the same file — coordinate if you're both in the same area.

---

*This document will be updated as the project evolves.*
