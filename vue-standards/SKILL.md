---
name: vue-standards
description: 'Aplicar padroes Vue 3 em novos recursos e refatoracoes, com foco em SFCs, Composition API, `<script setup lang="ts">`, reatividade previsivel e referencias internas para estado, router, testes, estilos e boundaries.'
---

# Vue 3 Standards

## Quando usar

- Criar ou refatorar recursos Vue 3.
- Padronizar componentes, composables, stores, rotas e formularios em projetos Vue.
- Orquestrar tarefas Vue que envolvam `*.vue`, `*.ts`, stores, router, estilos de componente ou arquivos de teste.

## Objetivo

- Padronizar Vue 3 com SFCs, `<script setup lang="ts">`, Composition API, Pinia, Vue Router, testabilidade e acessibilidade.
- Concentrar regras detalhadas em references locais para evitar duplicação e manter precedencia clara.
- Preservar aderencia a ferramenta de teste, build, lint e estilo ja configurada no projeto.

## Principio LIFT

- Antes de criar novo component, composable, store, route module, helper ou teste, aplicar o principio `LIFT`.
- `Locate`: localizar SFCs, composables, stores, helpers, contracts e references ja existentes no projeto e no dominio.
- `Identify`: identificar o que ja resolve parte do problema e onde ha duplicação potencial.
- `Find`: encontrar o menor ponto coerente de reutilizacao, extensao ou composicao antes de introduzir codigo novo.
- `Try to be DRY`: tentar eliminar duplicação real sem criar abstracoes prematuras, APIs opacas ou shared state desnecessario.

## Integracao com outras skills e referencias

- Ao alterar tipagem geral, contratos compartilhados ou escolhas de modelagem TypeScript, seguir `typescript-standards`.
- Ao sugerir ou executar scripts do projeto, respeitar a stack e os scripts ja configurados no projeto.
- Ao preparar commits, seguir `git-commit`.
- Ao alterar estilos de componente ou classes no template, seguir [references/component-styles.md](references/component-styles.md).
- Ao criar ou alterar arquivos de teste, seguir [references/testing-fundamentals.md](references/testing-fundamentals.md).
- Ao trabalhar com roteamento, query params, guards ou lazy loading, seguir as references de `router-*`.
- Em caso de conflito, prevalece esta ordem: references locais especificas do tema, `typescript-standards` para regras gerais de TypeScript, `git-commit` para commits e `vue-standards` para arquitetura Vue, reatividade, composicao e acessibilidade.

## Regras principais

- Vue 3 apenas.
- Aplicar `LIFT` antes de introduzir novos components, composables, stores, route modules, helpers ou testes.
- Para codigo novo, usar Single-File Components com `<script setup lang="ts">` por padrao.
- Para codigo novo, usar Composition API por padrao.
- Nao reescrever componentes estaveis em Options API sem necessidade real.
- Usar `computed` para estado derivado; nao usar `watch` ou `watchEffect` para derivacao pura.
- Usar `watch` e `watchEffect` apenas para efeitos colaterais, sincronizacao externa ou reacao assicrona controlada.
- Logica reutilizavel com estado deve virar composable.
- Estado compartilhado entre areas da aplicacao deve usar Pinia, nao singletons reativos ad hoc.
- Estado que precisa sobreviver a navegacao, ser compartilhavel por URL ou deep-linkable deve usar Vue Router.
- Nao usar mixins como padrao em Vue 3.
- Manter templates simples, semanticamente corretos e sem logica excessiva.
- Manter baseline WCAG AA e nao expor acessibilidade como API configuravel sem necessidade concreta.
- Nunca usar templates nao confiaveis nem renderizar conteudo arbitrario como template Vue.
- Ao criar ou atualizar testes, reutilizar apenas a stack de testes e os utilitarios ja configurados no projeto.

## Procedimento

1. Aplique `LIFT` para localizar, identificar e reutilizar o que ja existe antes de criar novas estruturas.
2. Modele o recurso com SFC, `<script setup lang="ts">` e Composition API quando for codigo novo.
3. Mantenha estado local no componente, extraia logica reutilizavel para composables e mova estado compartilhado para Pinia quando necessario.
4. Use `computed` para derivacoes e limite `watch` a efeitos colaterais reais.
5. Se houver estado navegavel ou compartilhavel por URL, modele-o no router.
6. Se houver estilos de componente, siga [references/component-styles.md](references/component-styles.md).
7. Se houver testes, siga [references/testing-fundamentals.md](references/testing-fundamentals.md).
8. Se houver tipagem ou contratos compartilhados, alinhe tambem com `typescript-standards`.
9. Revise semantica, acessibilidade, previsibilidade reativa e aderencia a stack do projeto.

## Checklist de qualidade

- Codigo novo em SFC com `<script setup lang="ts">`, salvo justificativa tecnica real.
- `LIFT` aplicado antes de introduzir novas estruturas ou duplicar implementacoes.
- Composition API usada por padrao em codigo novo.
- `computed` usado para estado derivado.
- `watch` e `watchEffect` usados apenas quando ha efeito colateral real.
- Composables extraidos quando ha logica reutilizavel com estado.
- Pinia usado para shared state quando necessario.
- Router usado para estado URL-driven quando necessario.
- Se houve alteracao em estilos, [references/component-styles.md](references/component-styles.md) foi seguida.
- Se houve alteracao em testes, [references/testing-fundamentals.md](references/testing-fundamentals.md) foi seguida.
- Se houve alteracao de tipagem geral, `typescript-standards` foi seguida.
- Template simples, semantico e acessivel.
- Nenhuma stack paralela de build, teste ou estilo foi introduzida.

## Observacoes

- Esta skill nao padroniza uma ferramenta unica de teste, build ou SSR; use sempre a configuracao efetiva do projeto.
- Detalhes de Nuxt, SSR e hydration ficam nas references de boundaries e nao no corpo principal da skill.
- `component-styles.md` e neutra em relacao a stack de estilo do projeto; siga os tokens, conventions e utilitarios ja existentes.
- Para scripts do projeto, respeite a stack e os scripts ja configurados no projeto.
- Para commits, use `git-commit`.

## Referencias (carregar quando fizer sentido)

- Estrutura de SFC: [references/core-sfc-structure.md](references/core-sfc-structure.md)
- `<script setup>`: [references/core-script-setup.md](references/core-script-setup.md)
- Componentes: [references/core-components.md](references/core-components.md)
- Props e emits: [references/core-props-and-emits.md](references/core-props-and-emits.md)
- `defineModel`: [references/core-define-model.md](references/core-define-model.md)
- Slots: [references/core-slots.md](references/core-slots.md)
- Template refs: [references/core-template-refs.md](references/core-template-refs.md)
- Provide / inject: [references/core-provide-inject.md](references/core-provide-inject.md)
- Lifecycle hooks: [references/core-lifecycle-hooks.md](references/core-lifecycle-hooks.md)
- Custom directives: [references/core-custom-directives.md](references/core-custom-directives.md)
- `ref` vs `reactive`: [references/reactivity-refs-vs-reactive.md](references/reactivity-refs-vs-reactive.md)
- `computed` vs `watch`: [references/reactivity-computed-vs-watch.md](references/reactivity-computed-vs-watch.md)
- `watch` vs `watchEffect`: [references/reactivity-watch-vs-watch-effect.md](references/reactivity-watch-vs-watch-effect.md)
- APIs rasas: [references/reactivity-shallow-apis.md](references/reactivity-shallow-apis.md)
- Composables: [references/composables-design.md](references/composables-design.md)
- Composables async: [references/composables-async.md](references/composables-async.md)
- Shared state em composables: [references/composables-sharing-state.md](references/composables-sharing-state.md)
- Rendering condicional: [references/template-conditional-rendering.md](references/template-conditional-rendering.md)
- Listas e keys: [references/template-list-rendering-and-keys.md](references/template-list-rendering-and-keys.md)
- Class e style bindings: [references/template-class-and-style-bindings.md](references/template-class-and-style-bindings.md)
- Performance de rendering: [references/rendering-performance-basics.md](references/rendering-performance-basics.md)
- Async components: [references/rendering-async-components.md](references/rendering-async-components.md)
- Suspense: [references/rendering-suspense.md](references/rendering-suspense.md)
- Teleport, KeepAlive e Transition: [references/rendering-teleport-keepalive-transition.md](references/rendering-teleport-keepalive-transition.md)
- Estado local: [references/state-local-component-state.md](references/state-local-component-state.md)
- Pinia: [references/state-pinia-stores.md](references/state-pinia-stores.md)
- Design de stores: [references/state-pinia-store-design.md](references/state-pinia-store-design.md)
- URL as state: [references/state-url-as-state.md](references/state-url-as-state.md)
- Definicao de rotas: [references/router-define-routes.md](references/router-define-routes.md)
- Navegacao: [references/router-navigation.md](references/router-navigation.md)
- Params e query: [references/router-route-params-and-query.md](references/router-route-params-and-query.md)
- Guards: [references/router-guards.md](references/router-guards.md)
- Lazy loading de rotas: [references/router-lazy-loading.md](references/router-lazy-loading.md)
- Data fetching com router: [references/router-data-fetching.md](references/router-data-fetching.md)
- Router testing: [references/router-testing.md](references/router-testing.md)
- `v-model`: [references/forms-v-model.md](references/forms-v-model.md)
- Validacao de formularios: [references/forms-validation.md](references/forms-validation.md)
- TypeScript em macros SFC: [references/typescript-sfc-macros.md](references/typescript-sfc-macros.md)
- TypeScript em refs e injection: [references/typescript-template-refs-and-injection.md](references/typescript-template-refs-and-injection.md)
- Estilos de componente: [references/component-styles.md](references/component-styles.md)
- Acessibilidade: [references/accessibility.md](references/accessibility.md)
- Seguranca: [references/security.md](references/security.md)
- Testes: [references/testing-fundamentals.md](references/testing-fundamentals.md)
- Testes de componentes: [references/testing-components.md](references/testing-components.md)
- Testes de composables: [references/testing-composables.md](references/testing-composables.md)
- Testes de Pinia e Router: [references/testing-pinia-and-router.md](references/testing-pinia-and-router.md)
- E2E: [references/testing-e2e.md](references/testing-e2e.md)
- Limites com Vite: [references/boundaries-vite.md](references/boundaries-vite.md)
- SSR e hydration: [references/boundaries-ssr-and-hydration.md](references/boundaries-ssr-and-hydration.md)
- Limites com Nuxt: [references/boundaries-nuxt.md](references/boundaries-nuxt.md)
