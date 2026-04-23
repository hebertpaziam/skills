# Router guards

## Quando usar

- Proteger rotas, redirecionar fluxos ou validar precondicoes de navegacao.

## Regras locais

- Guards devem ser pequenos, previsiveis e focados em navegacao.
- Logica de autorizacao ou dominio mais densa deve viver em service, composable ou store e ser apenas orquestrada pelo guard.
- Evite efeitos colaterais complexos dentro de guards.
- Redirecionamentos devem ser explicitamente modelados e de facil rastreio.

## Checklist de qualidade

- Guard com responsabilidade clara.
- Sem logica de negocio inchada no router.
- Redirecionamentos previsiveis.
