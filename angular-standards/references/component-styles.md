# Component styles (SCSS, BEM + toolbox)

## Quando usar

- Criar ou atualizar estilos SCSS de componentes Angular.
- Refatorar estilos para padronizar BEM com nesting estrito.
- Ajustar classes no template em conjunto com o stylesheet do componente.
- Limpar regras nao utilizadas com base no HTML atual do componente.

## Objetivo

- Padronizar stylesheets de componente com BEM, nesting estrito e baixo acoplamento entre bloco, elementos e modificadores.
- Garantir aderencia ao styling stack ja configurado no projeto, incluindo `toolbox`, tokens, variáveis e convencoes de organizacao.
- Manter alinhamento estrutural entre HTML e SCSS.
- Limitar nesting a no maximo 4 niveis encadeados.
- Restringir limpeza ao escopo do componente, sem alterar estruturas globais sem necessidade real.

## Regras locais

- Todo arquivo SCSS deve iniciar com `@use 'toolbox' as *;`.
- Aplicar BEM com nesting estrito: `&__element` e `&--modifier` dentro do bloco raiz.
- Identificar um bloco principal por componente sempre que possível.
- Manter no máximo 4 niveis de nesting encadeado.
- Usar tokens, variáveis e CSS variables do sistema; evitar valores fixos.
- Respeitar a estrutura ITCSS existente e inserir novas regras na camada correta.
- Preferir `@extend` a `@include` quando ambas as abordagens forem semanticamente equivalentes.
- Criar estilos apenas para classes presentes no template atual.
- Remover estilos nao utilizados com base no HTML do componente.
- Nao remover ou reestruturar estilos globais, tokens, mixins, functions ou camadas compartilhadas sem necessidade explicita.
- Evitar seletores soltos fora do bloco principal; manter o escopo previsível.
- Se houver seletor global inevitável, documentar o motivo e minimizar o alcance.

## Procedimento

1. Abra o arquivo SCSS do componente e garanta `@use 'toolbox' as *;` no topo.
2. Identifique o bloco BEM principal do componente.
3. Converta elementos para `&__element` e modificadores para `&--modifier`.
4. Revise o template para garantir correspondência exata entre classes HTML e seletores SCSS.
5. Substitua valores fixos por tokens, variáveis ou CSS variables existentes.
6. Elimine regras nao utilizadas e evite adicionar seletores fora do bloco.
7. Se faltar algum estilo, encaixe a regra na estrutura ITCSS ja adotada pelo projeto.
8. Revise profundidade de nesting, especificidade e cobertura real do markup.

## Checklist de qualidade

- `@use 'toolbox' as *;` presente no topo do arquivo.
- BEM aplicado com nesting estrito.
- No maximo 4 niveis de nesting encadeado.
- Sem valores fixos quando houver token ou variavel equivalente.
- ITCSS respeitado.
- `@extend` priorizado quando apropriado.
- Sem classes orfas entre HTML e SCSS.
- Sem estilos mortos no arquivo do componente.
- Sem alteracoes indevidas em estilos globais.
- Escopo de seletores previsivel e centrado no bloco.

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
