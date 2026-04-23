# Router testing

## Quando usar

- Testar navegacao, params, query, guards e comportamento baseado em rota.

## Regras locais

- Reutilize a ferramenta de teste configurada no projeto.
- Teste o comportamento observavel da navegacao, nao detalhes privados da implementacao do router.
- Para params e query, valide parse, serializacao e reacao da tela.
- Para guards, teste autorizacao, redirecionamento e fluxo feliz.

## Checklist de qualidade

- Testes cobrem comportamento de navegacao.
- Sem acoplamento desnecessario a detalhes internos.
