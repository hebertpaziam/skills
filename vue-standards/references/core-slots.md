# Core slots

## Quando usar

- Projetar componentes composicionais.
- Revisar componentes com API muito grande baseada em props.

## Regras locais

- Slots sao a primeira opcao quando o consumidor precisa controlar estrutura visual ou conteudo.
- Use slot props para expor apenas o minimo necessario ao consumidor.
- Nomeie slots quando houver mais de uma area clara de composicao.
- Nao use slots para mascarar acoplamento excessivo ou dependencia implicita de markup fragil.

## Checklist de qualidade

- Slots com nome e papel claros.
- Slot props minimas e bem nomeadas.
- Componente continua legivel para quem consome.
