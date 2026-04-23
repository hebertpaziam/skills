# Component styles

## Quando usar

- Criar ou atualizar estilos locais de componentes Vue.

## Objetivo

- Manter coesao entre template e estilos do componente.
- Respeitar a stack de estilos, design tokens, conventions e utilitarios ja adotados pelo projeto.
- Evitar vazamento de estilos e seletores imprevisiveis.

## Regras locais

- Siga a estrategia de estilos ja configurada no projeto: CSS Modules, scoped CSS, utility classes, SCSS, design system ou outra stack existente.
- Nao introduza uma stack paralela de estilos sem necessidade real.
- Mantenha alinhamento entre classes usadas no template e regras realmente necessarias no stylesheet.
- Evite seletores acidentais, profundidade excessiva e estilos mortos.
- Use tokens, CSS variables e conventions existentes em vez de valores soltos quando o projeto oferecer isso.

## Checklist de qualidade

- Stack de estilos do projeto respeitada.
- Sem estilos mortos.
- Sem seletores frageis ou escopo imprevisivel.
- Template e stylesheet alinhados.
