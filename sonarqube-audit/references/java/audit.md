# SonarQube Audit — Java

## Metodologia de Análise

### Fase 1 — Carregar referências

Carregar **todos** os arquivos `.md` em `references/java/` para obter o texto completo de cada regra.

### Fase 2 — Inventário e categorização

1. Listar todos os arquivos `.java` (excluir código gerado, output de build).
2. Categorizar por domínio:
   - **Controllers** → fw-spring + security-hotspot + security-injection
   - **Services** → core-oop + core-errors + core-concurrency + fw-spring
   - **Repositories** → security-injection + core-errors
   - **Models/DTOs** → core-naming + core-oop + core-types
   - **Config** → fw-spring + security-hotspot + security-crypto
   - **Testes** → testing
   - **Utilitários** → core-complexity + core-formatting + core-unused

### Fase 3 — Scanning por categoria

Para cada categoria, carregar as referências correspondentes e analisar cada arquivo:
1. **Scan estrutural**: Verificar anti-patterns conhecidos.
2. **Scan heurístico**: Análise best-effort para regras não-mecânicas.

---

## Template do Relatório

O template do relatório está em `_shared/report-template.md`. Substituir `{linguagem}` por "Java".
