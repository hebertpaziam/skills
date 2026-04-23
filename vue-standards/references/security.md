# Security

## Quando usar

- Revisar renderizacao de conteudo dinamico, bindings de URL, HTML e integracoes potencialmente inseguras.

## Regra principal

- Nunca usar conteudo nao confiavel como template Vue.

## Regras locais

- Evite `v-html`; use apenas quando o HTML for confiavel ou adequadamente saneado fora do componente.
- URLs de usuario devem ser validadas e saneadas na fronteira apropriada, idealmente no backend.
- Nao permita JS ou CSS arbitrario de usuario sem sandbox real.
- Nunca monte Vue sobre HTML server-rendered que possa conter conteudo nao confiavel interpretavel como template.
- Em SSR, redobre cuidado com universal code e fronteiras de execucao.

## Checklist de qualidade

- Nenhum template nao confiavel.
- `v-html` justificado e controlado.
- URLs e conteudo dinamico tratados com seguranca.
