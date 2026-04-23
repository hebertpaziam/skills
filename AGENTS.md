# AGENTS

## Repo Shape

- This repository is a docs-only skill library. Do not assume a Node, Python, or app runtime in the root: there is no root manifest, lockfile, formatter, or test runner config.
- Each skill lives in its own top-level directory, and `SKILL.md` is the main entrypoint for that skill.
- Keep supporting material inside the skill directory that owns it. Existing patterns include local `references/` folders and, for `react-standards`, a local `RULES.md`.

## Source Of Truth

- `CONTRIBUTING.md` is the structural and editorial spec for this repo. Follow it before inventing new layout or documentation patterns.
- The root `README.md` is intentionally minimal. Only update it when the repository purpose, highlighted technologies, or install command change.
- Preserve `SKILL.md` frontmatter, especially `name` and `description`, and keep it aligned with the actual behavior of the skill.

## Editing Conventions

- Write repo documentation in Portuguese unless an ecosystem term or convention is better left in English.
- Prefer operational, verifiable instructions. Avoid adding generic guidance to the root when it belongs inside a specific skill.
- Preserve stable skill directory names unless the user explicitly wants a rename.
- If a change affects one skill, keep new docs, references, and cross-links inside that skill folder instead of creating new root-level files.

## Changelog

- `CHANGELOG.md` is generated from Conventional Commit history by `.github/workflows/changelog.yml` using `cliff.toml`. Do not hand-edit it.
- The changelog workflow runs on pushes to `main` and ignores its own `chore(changelog): update changelog` commits.
- Local regeneration command, if `git-cliff` is installed: `git-cliff -c cliff.toml -o CHANGELOG.md`.

## Verification

- There are currently no repo-local build, test, lint, or typecheck commands to run.
- Verify changes by checking file placement, `SKILL.md` frontmatter, local cross-references, and whether root docs stayed intentionally small.
