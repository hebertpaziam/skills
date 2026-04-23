# Reactivity watch vs watchEffect

## Quando usar

- Escolher a forma de observar dependencias reativas para efeitos colaterais.

## Regras locais

- Prefira `watch` quando as dependencias precisam ser explicitas e o gatilho deve ser preciso.
- Use `watchEffect` quando o efeito realmente depende de varias fontes reativas acessadas dinamicamente e o acoplamento automatico melhora a legibilidade.
- Em codigo de produto, `watch` tende a ser mais previsivel e auditavel.
- Nao use `watchEffect` para esconder dependencias importantes.

## Checklist de qualidade

- Dependencias estao claras.
- O efeito nao dispara por fontes acidentais.
- Cleanup existe quando necessario.
