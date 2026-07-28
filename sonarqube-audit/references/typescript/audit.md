# SonarQube Audit — TypeScript

## Metodologia de Análise

### Fase 1 — Carregar referências

Carregar **todos** os arquivos `.md` em `references/typescript/` para obter o texto completo de cada regra.

### Fase 2 — Scanning híbrido

Para cada arquivo fonte do projeto:
1. **Scan estrutural**: Verificar anti-patterns conhecidos das categorias relevantes (ex: `security-injection` para `eval()`, concatenação SQL; `security-hotspot` para `debugger`, `console.log`; `core-unused` para código morto).
2. **Scan heurístico**: Para regras que não podem ser detectadas mecanicamente (ex: convenções de naming, thresholds de complexidade), aplicar análise estática best-effort e sinalizar potenciais issues.

### Fase 3 — Categorização por domínio

Categorizar os arquivos TypeScript antes da análise:
- **Componentes** (`.component.ts`) → fw-angular + browser-aria + browser-dom
- **Serviços** (`.service.ts`) → core-oop + core-errors + core-async
- **Guards/Interceptors** → security-hotspot + core-control-flow
- **Pipes/Directives** → core-types + core-formatting
- **Testes** (`.spec.ts`, `.test.ts`) → testing
- **Utilitários** → core-complexity + core-formatting + core-unused
- **Config** (`.config.ts`, `environment.ts`) → security-hotspot + security-crypto

---

## Template do Relatório

O template do relatório está em `_shared/report-template.md`. Substituir `{linguagem}` por "TypeScript".
