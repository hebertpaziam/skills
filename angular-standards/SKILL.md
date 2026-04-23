---
name: angular-standards
description: 'Aplicar padroes Angular 21 em novos recursos, com arquitetura baseada em signals, OnPush, inject e control flow moderno. Para estilos de componente e testes unitarios, siga as references internas de `angular-standards` e respeite a stack configurada no projeto.'
---

# Angular 21 Standards

## Quando usar

- Criar ou refatorar recursos Angular.
- Padronizar arquitetura Angular em components, services, directives, guards e afins.
- Orquestrar tarefas Angular que também envolvam `*.component.scss`, `*.directive.scss`, classes de template ou arquivos `*.spec.ts`.

## Objetivo

- Padronizar Angular 21 com signals, RxJS, testabilidade, simplicidade e acessibilidade.
- Concentrar regras detalhadas de estilos de componente em [references/component-styles.md](references/component-styles.md).
- Concentrar regras detalhadas de testes unitários em [references/testing-fundamentals.md](references/testing-fundamentals.md).

## Principio LIFT

- Antes de criar novo component, service, directive, guard, helper, generator ou teste, aplicar o principio `LIFT`.
- `Locate`: localizar codigo, contratos, generators, patterns e references ja existentes no projeto e no dominio.
- `Identify`: identificar o que ja resolve parte do problema e onde ha duplicação potencial.
- `Find`: encontrar o menor ponto coerente de reutilizacao, extensao ou composicao antes de introduzir codigo novo.
- `Try to be DRY`: tentar eliminar duplicação real sem criar abstracoes prematuras ou estruturas genericas sem necessidade.

## Integracao com referencias locais

- Ao alterar tipagem geral, contratos compartilhados, interfaces, enums ou modelagem TypeScript, seguir `typescript-standards`.
- Ao alterar arquivos `*.component.scss`, `*.directive.scss` ou classes em templates Angular, seguir [references/component-styles.md](references/component-styles.md).
- Ao criar ou alterar arquivos `*.spec.ts`, seguir [references/testing-fundamentals.md](references/testing-fundamentals.md).
- Ao sugerir ou executar scripts do projeto, respeitar a stack e os scripts ja configurados no projeto.
- Ao preparar commits, seguir `git-commit`.
- Em caso de conflito, prevalece esta ordem: [references/component-styles.md](references/component-styles.md) para estilos de componente, [references/testing-fundamentals.md](references/testing-fundamentals.md) para testes unitarios, `typescript-standards` para regras gerais de TypeScript, `git-commit` para commits e `angular-standards` para arquitetura Angular, organizacao de codigo, reatividade e acessibilidade.

## Regras principais

- Standalone por padrão. Não definir `standalone: true`.
- Aplicar `LIFT` antes de introduzir novos components, services, directives, guards, helpers, generators ou testes.
- Sempre criar o arquivo `.spec.ts` correspondente quando o recurso exigir teste unitário.
- Ao criar ou atualizar testes unitários, seguir [references/testing-fundamentals.md](references/testing-fundamentals.md).
- Ao criar ou atualizar testes unitarios, reutilizar apenas a ferramenta, os scripts e os utilitarios de teste ja configurados no projeto.
- Toda nova interface deve ter um generator correspondente usando `faker.js`, com um unico seed aleatorio por execucao e respeitando a hierarquia de pastas adotada pelo projeto.
- Usar `Generator` apenas para dados de mock/teste; caso contrário, preferir `Factory` ou `Builder`.
- Ao criar ou alterar estilos de componente, seguir [references/component-styles.md](references/component-styles.md) e manter o template alinhado as classes usadas no HTML.
- Usar Signals para qualquer dado em componentes.
- Evitar getters e setters; preferir `computed`.
- Usar APIs baseadas em Signals: `input`, `output`, `model`, `viewChild`.
- Usar `inject()` no lugar de constructor injection.
- Usar `ChangeDetectionStrategy.OnPush` sempre.
- Usar `NgOptimizedImage` para imagens estáticas.
- Usar control flow nativo (`@if`, `@for`, `@switch`).
- Preferir `class` e `style` bindings sobre `ngClass` e `ngStyle`.
- Ordem de propriedades: `enums`, `injects`, `queries`, `inputs`, `models`, `signals`, `outputs`, `computed`, `public properties`, `private properties`.
- Ordem de métodos: `constructor`, `angular hooks`, `public methods`, `private methods`.
- Evitar `effects` complexos; para lógica complexa e APIs use RxJS.
- Em RxJS, não usar lógica dentro de `subscribe`; usar `pipe` com operadores (ex: `tap`).
- Preferir operadores semânticos.
- Evitar subscriptions desnecessárias; sempre usar `takeUntilDestroyed` para unsubscribe automático.
- Métodos devem ser testáveis e legíveis; evitar acoplamento desnecessário.
- Manter implementações separadas; criar novos componentes/serviços quando houver complexidade ou reuso.
- Manter componente simples (KISS, YAGNI).
- Manter 100% de conformidade AXE e WCAG AA.
- Não expor acessibilidade como API configurável (ex: `aria-label`, `aria-describedby`, helper-text só para a11y).
- Preferir semântica interna e comportamento acessível auto-contido.

## Procedimento

1. Aplique `LIFT` para localizar, identificar e reutilizar o que ja existe antes de criar novas estruturas.
2. Modele o estado com Signals e `computed`.
3. Configure `OnPush` e use `inject()`.
4. Estruture o template com control flow nativo e bindings claros de `class` e `style`.
5. Se houver tipagem geral ou contratos compartilhados, alinhe tambem com `typescript-standards`.
6. Se houver estilos de componente ou mudanca de classes no template, aplique [references/component-styles.md](references/component-styles.md).
7. Escreva RxJS com `pipe` e operadores semânticos.
8. Use `takeUntilDestroyed` quando houver subscription.
9. Se houver testes unitários, siga [references/testing-fundamentals.md](references/testing-fundamentals.md).
10. Garanta acessibilidade WCAG AA e sem expor a11y como API configurável.

## Checklist de qualidade

- Arquivo `.spec.ts` criado quando aplicável.
- `LIFT` aplicado antes de introduzir novas estruturas ou duplicar implementacoes.
- Se houve alteracao de tipagem geral, `typescript-standards` foi seguida.
- Se houve alteração em `*.spec.ts`, [references/testing-fundamentals.md](references/testing-fundamentals.md) foi seguida.
- Se houve alteracao em SCSS de componente ou classes do template, [references/component-styles.md](references/component-styles.md) foi seguida.
- Novas interfaces com generator correspondente usando `faker.js`, seed unico e hierarquia correta.
- Nomes `Generator` apenas para mocks/testes.
- Signals usados para todo estado do componente.
- Sem getters/setters; `computed` quando necessário.
- `OnPush` ativo e `inject()` usado.
- Control flow nativo usado.
- RxJS sem lógica dentro de `subscribe`.
- Subscriptions com unsubscribe automático via `takeUntilDestroyed`.
- Métodos legíveis, testáveis e com baixa complexidade.
- Propriedades e métodos na ordem definida.
- Componente simples, sem excesso de código.
- AXE e WCAG AA atendidos.
- Sem API de acessibilidade configurável; semântica interna usada.

## Observações

- Não executar `ng build` automaticamente; seguir scripts do `package.json`.
- Esta skill define padrões arquiteturais; não duplique nela as regras operacionais de SCSS e unit tests.
- Para estilos de componente, use [references/component-styles.md](references/component-styles.md).
- Para testes unitarios de logica, use [references/testing-fundamentals.md](references/testing-fundamentals.md) e preserve a stack de testes configurada no projeto.
- Para scripts do projeto, respeite a stack e os scripts ja configurados no projeto.
- Para commits, use `git-commit`.
- Harnesses e router testing são referências complementares para casos específicos de UI e navegação.
- `effect` apenas para casos simples; lógica complexa fica em RxJS.
- `resource` é experimental; usar com critério.

## Referências (carregar quando fizer sentido)

- Estilos de componente: [references/component-styles.md](references/component-styles.md)
- Testes unitarios: [references/testing-fundamentals.md](references/testing-fundamentals.md)
- Componentes: [references/components.md](references/components.md)
- Inputs: [references/inputs.md](references/inputs.md)
- Outputs: [references/outputs.md](references/outputs.md)
- Host elements: [references/host-elements.md](references/host-elements.md)
- Signals: [references/signals-overview.md](references/signals-overview.md)
- linkedSignal: [references/linked-signal.md](references/linked-signal.md)
- resource: [references/resource.md](references/resource.md)
- effects: [references/effects.md](references/effects.md)
- Signal forms: [references/signal-forms.md](references/signal-forms.md)
- Reactive forms (legado): [references/reactive-forms.md](references/reactive-forms.md)
- Template-driven forms (legado): [references/template-driven-forms.md](references/template-driven-forms.md)
- DI fundamentals: [references/di-fundamentals.md](references/di-fundamentals.md)
- Creating services: [references/creating-services.md](references/creating-services.md)
- Defining providers: [references/defining-providers.md](references/defining-providers.md)
- Injection context: [references/injection-context.md](references/injection-context.md)
- Hierarchical injectors: [references/hierarchical-injectors.md](references/hierarchical-injectors.md)
- Define routes: [references/define-routes.md](references/define-routes.md)
- Loading strategies: [references/loading-strategies.md](references/loading-strategies.md)
- Router outlets: [references/show-routes-with-outlets.md](references/show-routes-with-outlets.md)
- Navigate to routes: [references/navigate-to-routes.md](references/navigate-to-routes.md)
- Route guards: [references/route-guards.md](references/route-guards.md)
- Data resolvers: [references/data-resolvers.md](references/data-resolvers.md)
- Router lifecycle: [references/router-lifecycle.md](references/router-lifecycle.md)
- Rendering strategies: [references/rendering-strategies.md](references/rendering-strategies.md)
- Route animations: [references/route-animations.md](references/route-animations.md)
- Angular Aria: [references/angular-aria.md](references/angular-aria.md)
- Component harnesses: [references/component-harnesses.md](references/component-harnesses.md)
- Router testing: [references/router-testing.md](references/router-testing.md)
- E2E testing: [references/e2e-testing.md](references/e2e-testing.md)
