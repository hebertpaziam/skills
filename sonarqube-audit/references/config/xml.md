# config/xml

Regras para arquivos `*.xml`. Cobre XXE, seguranca de sessao (web.xml), configuracao Spring, e logging.

---

## XXE — External Entity Injection

- `java:S2755` / `javascript:S2755` — **DOCTYPE com DTD externo** (BLOCKER)
  Qualquer `<!DOCTYPE ... SYSTEM "http://...">` ou `<!DOCTYPE ... PUBLIC "..." "http://...">`.
  DTDs externos permitem XXE: leitura de arquivos do servidor, SSRF, DoS.
  Exemplo: `<!DOCTYPE log4j:configuration SYSTEM "http://logging.apache.org/log4j/...">`
  Correcao: remover DOCTYPE ou usar catalogo local.

- `java:S6373` — **XML parseado de forma insegura** (CRITICAL)
  Configuracoes de parser XML sem desabilitar entidades externas.

- `java:S6376` — **Entidades XML vulneraveis a injecao** (CRITICAL)
  Definicoes de entidade que referenciam recursos externos.

- `java:S6377` — **Bibliotecas XML vulneraveis a XXE** (CRITICAL)
  Uso de parsers XML sem configuracao segura (ex: SAXParser sem features de seguranca).

## Seguranca de Sessao (web.xml)

- `java:S3330` / `javascript:S3330` — **Cookie sem flag HttpOnly** (CRITICAL)
  Verificar em `<session-config><cookie-config>`:
  - `<http-only>true</http-only>` DEVE estar presente e nao comentado
  - Se a tag `<cookie-config>` esta ausente, e uma violacao
  - Se esta comentada (`<!-- <http-only>true</http-only> -->`), e uma violacao
  Exemplo violacao: `<!-- <http-only>true</http-only> -->` (comentado = desabilitado)

- `java:S2092` / `javascript:S2092` — **Cookie sem flag Secure** (CRITICAL)
  Verificar em `<session-config><cookie-config>`:
  - `<secure>true</secure>` DEVE estar presente
  - Ausencia da tag e uma violacao

- `java:S4502` / `javascript:S4502` — **Protecao CSRF desabilitada** (BLOCKER)
  Filtros CSRF removidos ou comentados no web.xml.

- `java:S5122` / `javascript:S5122` — **CORS permissivo** (MAJOR)
  Filtro CORS mapeado para `/*` com `Access-Control-Allow-Origin: *`.
  Verificar `<filter>` com nome contendo "cors" e seus `<init-param>`.

## Transporte (web.xml)

- `java:S5332` / `javascript:S5332` — **transport-guarantee ausente ou insuficiente** (MAJOR)
  Verificar `<security-constraint>`:
  - `<transport-guarantee>CONFIDENTIAL</transport-guarantee>` deve estar presente
  - Se `<security-constraint>` esta completamente ausente, reportar

## Configuracao Spring (applicationContext.xml, beans.xml)

- `java:S2068` / `javascript:S2068` — **Credenciais em datasource** (BLOCKER)
  Beans de datasource com username/password em texto plano:
  - `<property name="username" value="sa"/>`
  - `<property name="password" value=""/>`
  - `<property name="password" value="minhasenha"/>`
  Valores devem vir de property placeholder `${...}` ou JNDI.

- `java:S1313` / `javascript:S1313` — **IPs hardcoded em configuracao** (MAJOR)
  URLs de conexao com IPs literais em beans Spring:
  - `<property name="url" value="jdbc:oracle:thin:@10.206.65.214:1521:ORCL"/>`

## Logging (log4j.xml, logback.xml)

- `java:S4507` / `javascript:S4507` — **DEBUG level em producao** (MAJOR)
  Root logger ou loggers de aplicacao com level DEBUG/TRACE.
  Em producao, o level deve ser INFO ou superior.
  Exemplo: `<root><level value="DEBUG"/></root>` → deveria ser `INFO` ou `WARN`

## Credenciais em Comentarios XML

- `java:S2068` / `javascript:S2068` — **Credenciais em comentarios** (MAJOR)
  Comentarios XML contendo senhas, tokens, ou credenciais, mesmo que "desativados":
  - `<!-- username="admin" password="admin123" -->`
  - `<!-- auth-method: NTLM, user: CORP\svcaccount -->`
