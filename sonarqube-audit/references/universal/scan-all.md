# universal/scan-all

Regras cross-linguagem aplicadas a **QUALQUER** arquivo de texto do repositorio, independente de extensao ou categoria. Estas regras sao verificadas ANTES das regras especificas de categoria.

---

## Credenciais e Segredos

- `java:S2068` / `javascript:S2068` — **Credenciais hardcoded** (BLOCKER)
  Buscar por chaves: `password`, `passwd`, `pwd`, `passphrase`, `credentials`, `senha`
  seguidas de `=`, `:`, ou atribuicao com valor literal (nao placeholder `${...}` ou `%s`).
  Exemplos: `password=abc123`, `pwd: "minhasenha"`, `String senha = "123"`

- `java:S6437` / `javascript:S6437` — **Chaves criptograficas em texto** (BLOCKER)
  Buscar por: `APP_KEY`, `APP_IV`, `SECRET_KEY`, `ENCRYPTION_KEY`, `PRIVATE_KEY`
  com valores literais. Certificados PEM inline tambem contam.
  Exemplos: `APP_KEY=grupo1BB9M@9PFR3`, `-----BEGIN RSA PRIVATE KEY-----`

- `java:S6418` / `javascript:S6418` — **Segredos commitados no codigo-fonte** (BLOCKER)
  Buscar por: `api_key`, `auth_token`, `access_token`, `Bearer `, `eyJ` (JWT),
  `AKIA` (AWS key), `sk-` (OpenAI key), `ghp_` (GitHub token).
  Exemplos: `Authorization: Bearer eyJhbGci...`, `api_key=sk-abc123`

## Rede e Transporte

- `java:S1313` / `javascript:S1313` — **IPs hardcoded** (MAJOR)
  Regex: `\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b`
  Ignorar: `127.0.0.1`, `0.0.0.0`, IPs em comentarios de documentacao, versoes (ex: `1.0.0.0`).
  Exemplos: `String host = "10.206.65.214"`, `smtp.host=192.168.1.100`

- `java:S5332` / `javascript:S5332` — **Protocolo texto claro** (MAJOR)
  Buscar por: `http://` em URLs que NAO sejam:
  - `http://localhost`, `http://127.0.0.1` (dev local)
  - `http://schemas.`, `http://www.w3.org/`, `http://xmlns.` (namespaces XML)
  - Dentro de comentarios explicando migracao para HTTPS
  Exemplos: `url=http://corporativo.mapfre.com.br`, `<a href="http://..."`

- `java:S1075` / `javascript:S1075` — **URIs hardcoded** (MINOR)
  Buscar por URLs completas de ambiente (dev/hml/prd) no codigo.
  Exemplos: `String url = "https://api.prd.empresa.com/v1"`, `baseUrl: "https://hml-portal.com"`
  Ignorar: URLs em arquivos de configuracao de ambiente (.env, application-{profile}.yml).

## Comentarios e Codigo Morto

- `java:S125` / `javascript:S125` — **Codigo comentado** (MAJOR)
  Blocos de codigo dentro de comentarios (nao documentacao).
  Indicadores: linhas comentadas com `if`, `for`, `return`, `import`, `=`, `{`, `}`
  Exemplos: `// if (user.isAdmin()) { return true; }`, `<!-- <bean id="..."> -->`

- `java:S1134` / `javascript:S1134` — **Tags FIXME nao resolvidas** (MAJOR)
  Buscar por: `FIXME`, `HACK`, `XXX` em comentarios.

- `java:S1135` / `javascript:S1135` — **Tags TODO nao resolvidas** (INFO)
  Buscar por: `TODO`, `PENDING` em comentarios.

## Arquivos

- **Arquivos vazios** (INFO) — sem regra SonarQube oficial
  Arquivos com 0 bytes ou apenas whitespace/newlines. Indicam codigo morto ou placeholder esquecido.
