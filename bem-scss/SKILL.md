---
name: bem-scss
description: 'Implemente estilos SCSS usando BEM com nesting estrito (ex: .product { &__name { ... } }) e sempre importe o toolbox com @use "toolbox" as *; Use quando criar ou alterar estilos de componentes, especialmente em fluxos guiados por angular-standards.'
---

# BEM SCSS (Nested + Toolbox)

## Quando usar

- Criar ou atualizar estilos SCSS de componentes.
- Refatorar estilos para padronizar em BEM com nesting estrito.
- Garantir acesso a tokens e variáveis via toolbox.
- Aplicar regras somente em estilos de componentes Angular (_.scss +_.html).
- Usar junto com a skill `angular-standards` quando a tarefa Angular envolver SCSS de componente ou classes no template.

## Objetivo

- Aplicar BEM com nesting estrito para blocos, elementos e modificadores.
- Manter o escopo previsível e consistente entre HTML e SCSS.
- Garantir que todo arquivo SCSS comece com o import do toolbox.
- Limitar nesting a no máximo 4 níveis encadeados.
- Usar tokens, variáveis e CSS variables do sistema, evitando valores fixos.
- Manter a estrutura ITCSS (triângulo invertido de especificidade).
- Criar estilos sob demanda do HTML e remover estilos não usados.
- Restringir limpeza a estilos de componentes; não alterar estruturas globais ITCSS.

## Integração com angular-standards

- Em tarefas Angular, esta skill é a fonte de verdade para estilos de componente.
- Se a demanda vier via skill `angular-standards` e houver mudanças em SCSS ou classes de template, esta skill deve ser carregada e prevalece para regras de estilo.

## Procedimento

1. Abra o arquivo SCSS do componente e garanta o import no topo:

   ```scss
   @use 'toolbox' as *;
   ```

2. Identifique o bloco BEM principal (ex: `.product`).
3. Converta elementos para nesting com `&__element` dentro do bloco.
4. Converta modificadores para nesting com `&--modifier` dentro do bloco.
5. Mantenha no máximo 4 níveis de nesting encadeado.
6. Use tokens/variáveis e CSS variables existentes; nunca aplique valores fixos.
7. Se faltar algum estilo, inclua-o na estrutura ITCSS já existente.
8. Prefira `@extend` ao invés de `@include` quando ambos forem possíveis.
9. Crie estilos apenas para classes presentes no HTML do componente.
10. Remova estilos não usados com base no HTML atual.
11. Não remova estilos globais (ITCSS, tokens, mixins, functions).
12. Evite seletores soltos fora do bloco; mantenha tudo aninhado no bloco.
13. Verifique se o HTML usa as mesmas classes BEM.
14. Se houver seletores globais necessários, documente o motivo e minimize o alcance.

## Checklist de qualidade

- Todo arquivo SCSS com `@use 'toolbox' as *;` no topo.
- BEM aplicado com nesting estrito: `.block { &__element { ... } &--modifier { ... } }`.
- Nesting com no máximo 4 níveis encadeados.
- Sem valores fixos; usar tokens/variáveis e CSS variables do sistema.
- ITCSS respeitado; novas regras inseridas na camada correta.
- Preferir `@extend` ao invés de `@include`.
- Estilos só para classes existentes no HTML; sem sobras não usadas.
- Limpeza restrita ao SCSS do componente; não tocar em estilos globais ITCSS.
- Sem seletores "soltos" ou encadeamentos que quebrem o padrão.
- Classes no HTML e SCSS estão alinhadas.

## Exemplo

```scss
@use 'toolbox' as *;

.product {
  display: grid;
  gap: $spacing-3;

  &__name {
    font: $font-body;
  }

  &--featured {
    border: 1px solid $color-brand;
  }
}
```
