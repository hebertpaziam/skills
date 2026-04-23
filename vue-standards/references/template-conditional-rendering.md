# Template conditional rendering

## Quando usar

- Escolher entre `v-if` e `v-show` e organizar branches no template.

## Regras locais

- Use `v-if` quando o bloco e realmente opcional ou caro e nao precisa permanecer no DOM.
- Use `v-show` quando o bloco precisa alternar visibilidade com frequencia e faz sentido permanecer montado.
- Nao empilhe condicionais profundas no template quando um `computed` ou child component tornaria a leitura melhor.
- Prefira branches explicitos e semanticamente claros.

## Checklist de qualidade

- `v-if` e `v-show` escolhidos por semantica e custo.
- Sem floresta de condicionais no template.
