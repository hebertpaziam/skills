# Router navigation

## Quando usar

- Implementar navegacao declarativa ou programatica.

## Regras locais

- Prefira `RouterLink` para navegacao declarativa.
- Use `useRouter()` para navegacao programatica em resposta a fluxos de usuario ou efeitos claros.
- Nao manipule `window.location` manualmente para fluxos internos da SPA.
- Prefira navegar por nome e parametros tipados/coerentes quando isso reduzir fragilidade.

## Checklist de qualidade

- Navegacao expressa via Vue Router.
- Sem hacks de URL fora da API do router.
