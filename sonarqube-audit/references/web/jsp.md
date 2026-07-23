# web/jsp

Regras para arquivos `*.jsp`. Foco principal: **XSS via EL expressions nao escapadas**.

---

## Procedimento de Verificacao Obrigatorio

Para CADA arquivo JSP, o agente DEVE seguir este procedimento:

1. **Listar TODAS as expressoes `${...}`** encontradas no arquivo
2. **Para cada expressao**, verificar se esta protegida por:
   - `<c:out value="${...}"/>` (JSTL)
   - `${fn:escapeXml(...)}` (JSTL functions)
   - Atributo de tag JSTL que faz auto-escape
3. **Identificar o contexto** de cada expressao nao protegida:
   - HTML text content (entre tags)
   - Atributo HTML (dentro de `"..."` de um atributo)
   - Contexto JavaScript (dentro de `<script>...</script>`)
   - Contexto URL (em `href`, `action`, `src`)
4. **Classificar a severidade** pelo contexto (ver tabela abaixo)
5. **Contar o total** de ocorrencias por arquivo

### Tabela de Severidade por Contexto

| Contexto | Severidade | Justificativa |
|----------|-----------|---------------|
| `<script>var x = '${var}'</script>` | BLOCKER | Execucao direta de JS arbitrario |
| `<%= expressao %>` com dados de request/exception | BLOCKER | Scriptlet renderizando dados nao sanitizados |
| `<input value="${vo.senha}">` (campo de senha) | BLOCKER | Exposicao de credencial no HTML |
| `href="${url}"`, `action="${url}"`, `src="${url}"` | CRITICAL | Possivel open redirect ou resource injection |
| `<div>${variavel}</div>` (HTML text) | CRITICAL | XSS classico via injecao de HTML |
| Atributo nao-URL: `title="${var}"`, `class="${var}"` | MAJOR | XSS via quebra de atributo |

---

## Regras

### XSS — Expressoes EL Nao Escapadas

- `java:S5131` — **XSS: expressao EL sem escaping** (severidade variavel — ver tabela acima)
  Qualquer `${...}` que renderiza dados dinamicos sem `<c:out>` ou `fn:escapeXml()`.
  Esta e a regra mais importante para JSPs. CADA expressao EL deve ser verificada individualmente.

- `java:S5247` — **Auto-escaping desabilitado** (CRITICAL)
  Pagina com `isELIgnored="true"` no directive, ou `escapeXml` configurado como `false`.
  Exemplo: `<%@ page isELIgnored="true" %>`

### XSS — Scriptlets

- `java:S5131` — **Scriptlet renderizando dados nao sanitizados** (BLOCKER)
  Qualquer `<%= ... %>` que renderiza:
  - `request.getParameter()`
  - `e.getMessage()`, `exception.getMessage()`
  - Qualquer variavel vinda de input do usuario
  Exemplo: `<%= e.getMessage() %>`

### Informacao Sensivel

- `java:S2068` — **Senha renderizada em campo HTML** (BLOCKER)
  Campos que renderizam senhas no value:
  - `<input type="hidden" value="${vo.senha}">`
  - `<input type="password" value="${...}">`
  Senha NUNCA deve ser enviada de volta ao cliente, nem em campo hidden.

- `java:S5689` — **Informacoes do servidor expostas** (MAJOR)
  Informacoes que nao devem aparecer na pagina:
  - IPs internos do servidor
  - Caminhos do filesystem (`/usr/local/tomcat/...`)
  - Versao do servidor/framework
  - Stack traces completos

### Scriptlets e Arquitetura

- `java:S1523` — **Logica de negocio em scriptlets** (MAJOR)
  Qualquer `<% ... %>` contendo:
  - Imports Java (`<%@ page import="..." %>` com classes de negocio)
  - Try/catch blocks
  - Loops com logica de negocio
  - Queries SQL
  - Instanciacao de objetos de servico
  JSPs devem conter apenas apresentacao; logica deve estar em controllers/services.

### Includes e Navegacao

- `java:S5146` — **Redirect aberto via parametro nao validado** (CRITICAL)
  Qualquer redirect ou form action usando parametro nao validado:
  - `<form action="${parametros.url}">`
  - `response.sendRedirect(request.getParameter("url"))`
  - `<c:redirect url="${param.returnUrl}"/>`
  O destino do redirect deve ser validado contra uma whitelist.
