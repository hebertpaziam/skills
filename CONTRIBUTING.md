# CONTRIBUTING

This repository is a skill library. Every contribution should preserve two goals: make skills easy for agents to consume, and keep maintenance predictable for anyone evolving the repo.

## What to keep aligned

- Each skill lives in its own top-level directory.
- Each skill directory must have `SKILL.md` as its main document.
- Supporting material belongs inside the skill directory, not at the root.
- The root [README.md](README.md) should stay minimal, covering only purpose, technologies, and installation.

## Creating a new skill

1. Create a directory with a short, stable name aligned with the skill's domain.
2. Add a `SKILL.md` with frontmatter containing at least `name` and `description`.
3. Clearly document when to use the skill, its goal, and its guardrails.
4. If the skill depends on others, record the integration and precedence explicitly.
5. If there is in-depth material, keep it inside the same skill directory.
6. Update the root [README.md](README.md) only if the new skill changes the repository's purpose, highlighted technologies, or installation instructions.

## Modifying an existing skill

1. Preserve the skill name unless there is a strong reason to rename.
2. Keep frontmatter and description consistent with the skill's actual behavior.
3. Review cross-references to avoid broken links or stale precedence.
4. Update the skill's own supporting docs when the change affects usage, maintenance, or derived artifacts.
5. If the change alters repository-level purpose, technologies, or installation info, also update the root [README.md](README.md).

## Editorial conventions

- Write in English.
- Prefer operational, direct, and verifiable instructions.
- Avoid duplicating in the root details that belong inside a specific skill directory.
- Prefer duplicating useful context between skills when it avoids depending on the root README.
- Use sections that make clear when to use the skill, what its goal is, and what its limits are.

## Minimum review before opening a change

- The skill directory is in the correct location.
- `SKILL.md` is still the main entrypoint.
- Frontmatter correctly describes the skill.
- Integrations with other skills are explicit when needed.
- The root [README.md](README.md) remains consistent with its minimal scope.
- No references to nonexistent global flows were introduced.
