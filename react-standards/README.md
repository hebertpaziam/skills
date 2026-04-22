# React Standards

Repositório estruturado para criar e manter boas práticas de React otimizadas para agentes e LLMs.

## Estrutura

- `references/` - Arquivos de referencia (um por regra)
  - `_sections.md` - Metadados das seções (títulos, impactos, descrições)
  - `_template.md` - Template para novas regras
  - `area-description.md` - Arquivos individuais de regras
- `src/` - Scripts e utilitários de build
- `metadata.json` - Metadados do documento (versão, organização, abstract)
- __`RULES.md`__ - Saída compilada (gerada)
- __`test-cases.json`__ - Casos de teste para avaliação de LLM (gerado)

## Primeiros passos

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Gere RULES.md a partir das regras:

   ```bash
   pnpm build
   ```

3. Valide os arquivos de regra:

   ```bash
   pnpm validate
   ```

4. Extraia casos de teste:

   ```bash
   pnpm extract-tests
   ```

## Criando uma nova regra

1. Copie `references/_template.md` para `references/area-description.md`
2. Escolha o prefixo da área:
   - `async-` para Eliminating Waterfalls (Seção 1)
   - `bundle-` para Bundle Size Optimization (Seção 2)
   - `server-` para Server-Side Performance (Seção 3)
   - `client-` para Client-Side Data Fetching (Seção 4)
   - `rerender-` para Re-render Optimization (Seção 5)
   - `rendering-` para Rendering Performance (Seção 6)
   - `js-` para JavaScript Performance (Seção 7)
   - `advanced-` para Advanced Patterns (Seção 8)
3. Preencha o frontmatter e o conteúdo
4. Garanta exemplos claros com explicações
5. Rode `pnpm build` para regenerar RULES.md e test-cases.json

## Estrutura do arquivo de regra

Cada arquivo de regra deve seguir esta estrutura:

```markdown
---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional description
tags: tag1, tag2, tag3
---

## Título da Regra

Explicação breve da regra e por que ela importa.

**Incorreto (descrição do problema):**

```typescript
// Exemplo ruim
```

__Correto (descrição do acerto):__

```typescript
// Exemplo bom
```

Texto explicativo opcional após os exemplos.

Referência: [Link](https://example.com)

## Convenção de nomes

- Arquivos iniciados com `_` são especiais (excluídos do build)
- Arquivos de regra: `area-description.md` (ex: `async-parallel.md`)
- A seção é inferida pelo prefixo do nome
- Regras são ordenadas alfabeticamente por título em cada seção
- IDs (ex: 1.1, 1.2) são gerados automaticamente no build

## Níveis de impacto

- `CRITICAL` - Maior prioridade, grandes ganhos de performance
- `HIGH` - Ganhos significativos
- `MEDIUM-HIGH` - Ganhos moderados-altos
- `MEDIUM` - Ganhos moderados
- `LOW-MEDIUM` - Ganhos baixos-moderados
- `LOW` - Ganhos incrementais

## Scripts

- `pnpm build` - Compila regras em RULES.md
- `pnpm validate` - Valida todos os arquivos de regra
- `pnpm extract-tests` - Extrai casos de teste para avaliação de LLM
- `pnpm dev` - Build e validação

## Contribuição

Ao adicionar ou modificar regras:

1. Use o prefixo correto para a seção
2. Siga a estrutura de `_template.md`
3. Inclua exemplos claros de errado/certo com explicações
4. Adicione tags apropriadas
5. Rode `pnpm build` para regenerar RULES.md e test-cases.json
6. As regras são ordenadas automaticamente por título

## Agradecimentos

Criado originalmente por [@shuding](https://x.com/shuding) na [Vercel](https://vercel.com).
