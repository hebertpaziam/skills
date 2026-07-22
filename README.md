# 🧠 Skills

> A curated collection of AI agent skills for code generation, architecture enforcement, and developer workflow automation.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/Skills-4-brightgreen.svg)](#-skill-catalog)
[![Reference Docs](https://img.shields.io/badge/Reference%20Docs-116-orange.svg)](#-skill-catalog)

---

## 📖 What is this?

**Skills** are modular instruction sets that teach AI coding agents how to generate, refactor, and review code following specific standards and conventions. Each skill is a self-contained `SKILL.md` file with optional reference documents that provide deep, context-specific guidance.

They are **agent-agnostic** — designed to work with any AI assistant that supports skill/instruction loading (OpenCode, Copilot, Cursor, etc.).

---

## ✨ Features

- 🏗️ **Composable** — Skills reference and complement each other
- 📐 **Opinionated** — Battle-tested conventions, not vague guidelines
- 🎯 **Context-aware** — Load only what's relevant to the task at hand
- 🪶 **Token-efficient** — Reference docs are loaded on demand, not all at once
- 🔓 **Open** — MIT licensed, use and adapt freely

---

## 📦 Skill Catalog

| Skill | Description | References |
|-------|-------------|:----------:|
| 🅰️ [angular-standards](./angular-standards/) | Angular code generation & architectural guidance — components, signals, forms, DI, routing, SSR, a11y, animations, styling (BEM/SCSS, Tailwind), testing (Vitest, Cypress) | 39 docs |
| 🟦 [typescript-standards](./typescript-standards/) | TypeScript design standards — typing decisions, domain modeling, architecture (SOLID, GoF, KISS, YAGNI, LIFT), modules & boundaries | 30 docs |
| 🔍 [sonarqube](./sonarqube/) | SonarQube compliance — prevents violations during generation, audits on demand. Routes ~976 rules (TypeScript + Java) by context | 47 docs |
| 📝 [git-commit](./git-commit/) | Conventional Commits — auto-detects type/scope from diffs, intelligent staging, message generation | — |

---

## 🔗 How They Compose

Skills are designed to work together. The diagram below shows how they interact:

```
+------------------------------------------------------+
|                                                      |
|   sonarqube                                          |
|   ............................                       |
|   Highest precedence. Overrides                      |
|   any conflicting rules below.                       |
|                                                      |
+------------------------------------------------------+
|                                                      |
|   angular-standards                                  |
|       |                                              |
|       +-- loads --> typescript-standards              |
|       |             (shared contracts, typing,       |
|       |              design)                         |
|       |                                              |
|       +-- delegates --> git-commit                   |
|                         (commit workflow)             |
|                                                      |
+------------------------------------------------------+
|                                                      |
|   typescript-standards                               |
|   ............................                       |
|   Standalone for non-Angular TS projects.            |
|   Complementary when used with angular-standards.    |
|                                                      |
+------------------------------------------------------+
```

**Precedence rules:**
- 🔍 `sonarqube` > 🅰️ `angular-standards` > 🟦 `typescript-standards`
- Framework-specific rules (Angular) prevail for ecosystem conventions
- Language-level rules (TypeScript) prevail for general design & typing

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hebertpaziam/skills.git
```

### 2. Copy the skills you need

Copy the desired skill folder(s) into your agent's skill directory. The exact location depends on your tool:

```bash
# Example: copy angular-standards to your project
cp -r skills/angular-standards /path/to/your/skills-directory/
```

### 3. Reference in your agent config

Point your AI agent to the skill's `SKILL.md` file. Each agent has its own config format — refer to your tool's documentation.

---

## 📁 Repository Structure

```
skills/
├── 🅰️ angular-standards/
│   ├── SKILL.md                    # Skill definition & rules
│   └── references/                 # 39 reference documents
│       ├── components.md
│       ├── signals-overview.md
│       ├── reactive-forms.md
│       ├── tailwind-css.md
│       └── ...
├── 🟦 typescript-standards/
│   ├── SKILL.md
│   └── references/                 # 30 reference documents
│       ├── principles-solid.md
│       ├── types-generics.md
│       ├── architecture-api-design.md
│       └── ...
├── 🔍 sonarqube/
│   ├── SKILL.md
│   └── references/                 # 47 reference documents
│       ├── typescript/             # 25 docs (TS-specific rules)
│       ├── java/                   # 21 docs (Java-specific rules)
│       └── universal/              # 1 doc (cross-language blockers)
├── 📝 git-commit/
│   └── SKILL.md
├── LICENSE
└── README.md
```

---

## 🧩 Anatomy of a Skill

Each skill follows a simple structure:

```
my-skill/
├── SKILL.md           # Required — skill definition with YAML frontmatter
└── references/        # Optional — detailed reference documents
    ├── topic-a.md
    └── topic-b.md
```

### `SKILL.md` Frontmatter

```yaml
---
name: my-skill
description: 'Short description of what the skill does and when to trigger it.'
---
```

The body of `SKILL.md` contains:
- **When to load** — Conditions that trigger the skill
- **Rules & conventions** — The standards the agent must follow
- **Reference loading strategy** — Which docs to load and when
- **Composition** — How this skill relates to others

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **🐛 Report issues** — Found a rule that doesn't work well? Open an issue.
2. **💡 Suggest skills** — Have an idea for a new skill? Let's discuss it.
3. **📝 Improve references** — Add examples, fix inaccuracies, expand coverage.
4. **🔧 Submit a new skill** — Follow the [anatomy](#-anatomy-of-a-skill) above and open a PR.

### Guidelines

- Keep skills **focused** — one concern per skill
- Reference docs should be **token-efficient** — concise, no fluff
- Use **YAML frontmatter** with `name` and `description`
- Test your skill with at least one AI agent before submitting

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with 🧠 by <a href="https://github.com/hebertpaziam">@hebertpaziam</a>
</p>
