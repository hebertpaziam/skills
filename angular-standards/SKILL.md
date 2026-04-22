---
name: angular-standards
description: 'Aplicar padrões Angular 21 em novos recursos, com arquitetura baseada em signals, OnPush, inject e control flow moderno. Use junto com a skill bem-scss para estilos de componente e a skill vitest-unit-tests para testes unitários.'
---

# Angular 21 Standards

## Quando usar

- Criar ou refatorar recursos Angular.
- Padronizar arquitetura Angular em components, services, directives, guards e afins.
- Orquestrar tarefas Angular que também envolvam `*.component.scss`, `*.directive.scss`, classes de template ou arquivos `*.spec.ts`.

## Objetivo

- Padronizar Angular 21 com signals, RxJS, testabilidade, simplicidade e acessibilidade.
- Delegar regras detalhadas de estilo para a skill `bem-scss`.
- Delegar regras detalhadas de testes unitários para a skill `vitest-unit-tests`.

## Integração com outras skills

- Ao alterar arquivos `*.component.scss`, `*.directive.scss` ou classes em templates Angular, carregar e seguir `bem-scss`.
- Ao criar ou alterar arquivos `*.spec.ts`, carregar e seguir `vitest-unit-tests`.
- Em caso de conflito, prevalece esta ordem: `bem-scss` para estilos de componente, `vitest-unit-tests` para testes unitários e `angular-standards` para arquitetura Angular, organização de código, reatividade e acessibilidade.

## Regras principais

- Standalone por padrão. Não definir `standalone: true`.
- Sempre criar o arquivo `.spec.ts` correspondente quando o recurso exigir teste unitário.
- Ao criar ou atualizar testes unitários, seguir `vitest-unit-tests`.
- Toda nova interface deve ter um generator correspondente em `src/mock/generators` usando `faker.js`.
- Usar `Generator` apenas para dados de mock/teste; caso contrário, preferir `Factory` ou `Builder`.
- Ao criar ou alterar estilos de componente, seguir `bem-scss` e manter o template alinhado às classes usadas no HTML.
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

1. Modele o estado com Signals e `computed`.
2. Configure `OnPush` e use `inject()`.
3. Estruture o template com control flow nativo e bindings claros de `class` e `style`.
4. Se houver estilos de componente ou mudança de classes no template, aplique `bem-scss`.
5. Escreva RxJS com `pipe` e operadores semânticos.
6. Use `takeUntilDestroyed` quando houver subscription.
7. Se houver testes unitários, siga `vitest-unit-tests`.
8. Garanta acessibilidade WCAG AA e sem expor a11y como API configurável.

## Checklist de qualidade

- Arquivo `.spec.ts` criado quando aplicável.
- Se houve alteração em `*.spec.ts`, `vitest-unit-tests` foi seguida.
- Se houve alteração em SCSS de componente ou classes do template, `bem-scss` foi seguida.
- Novas interfaces com generator correspondente.
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
- Para estilos de componente, use `bem-scss`.
- Para testes unitários de lógica, use `vitest-unit-tests`.
- Harnesses e router testing são referências complementares para casos específicos de UI e navegação.
- `effect` apenas para casos simples; lógica complexa fica em RxJS.
- `resource` é experimental; usar com critério.

## Referências (carregar quando fizer sentido)

- Skill de estilos de componente: `bem-scss`
- Skill de testes unitários: `vitest-unit-tests`
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
- Testing fundamentals: [references/testing-fundamentals.md](references/testing-fundamentals.md)
- Component harnesses: [references/component-harnesses.md](references/component-harnesses.md)
- Router testing: [references/router-testing.md](references/router-testing.md)
- E2E testing: [references/e2e-testing.md](references/e2e-testing.md)
