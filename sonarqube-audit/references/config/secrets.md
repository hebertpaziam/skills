# config/secrets

Regras para arquivos de configuracao: `*.properties`, `*.yml`, `*.yaml`, `*.env`, `*.cfg`, `*.conf`, `*.ini`.

---

## Procedimento de Verificacao Obrigatorio

Para CADA arquivo de configuracao, o agente DEVE:

1. **Buscar por keywords de credenciais:**
   `password`, `passwd`, `pwd`, `secret`, `key`, `token`, `credential`, `auth`,
   `api_key`, `apikey`, `APP_KEY`, `APP_IV`, `private_key`, `encryption`

2. **Buscar por padroes de segredo:**
   - JWT: `eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+`
   - AWS Key: `AKIA[0-9A-Z]{16}`
   - Chave Base64 longa (>20 chars): `[A-Za-z0-9+/=]{20,}`

3. **Buscar por IPs:** `\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b`

4. **Buscar por URLs HTTP:** `http://` (exceto localhost/127.0.0.1)

5. **Verificar se valores sao placeholders ou literais:**
   - Placeholders (NAO sao violacao): `${DB_PASSWORD}`, `%{env.SECRET}`, `#{systemProperties['key']}`
   - Valores literais (SAO violacao): `password=abc123`, `token=eyJhbGci...`

---

## Regras

### Credenciais

- `java:S2068` / `javascript:S2068` — **Passwords em configuracao** (BLOCKER)
  Qualquer chave contendo `password`, `passwd`, `pwd`, `senha` com valor literal.
  Exemplos:
  - `mail.password=Mapfre@2024` → BLOCKER
  - `db.password=${DB_PASS}` → OK (placeholder)
  - `password=` (vazio) → MAJOR (senha vazia tambem e problema)

- `java:S6437` / `javascript:S6437` — **Chaves criptograficas em texto** (BLOCKER)
  Chaves de criptografia com valores literais:
  - `APP_KEY=grupo1BB9M@9PFR3`
  - `APP_IV=valorFixo12345`
  - `jwt.secret=minha-chave-secreta`
  Chaves criptograficas DEVEM vir de variavel de ambiente ou vault.

- `java:S6418` / `javascript:S6418` — **Tokens/JWTs commitados** (BLOCKER)
  Tokens com valores reais no arquivo:
  - `auth.token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIi...`
  - `api_key=sk-abc123def456`
  - `Bearer eyJhbGci...`
  Tokens NUNCA devem estar no codigo-fonte.

### Rede

- `java:S1313` / `javascript:S1313` — **IPs hardcoded** (MAJOR)
  IPs literais em configuracao:
  - `mail.smtp.host=10.206.65.214`
  - `ldap.url=ldap://192.168.1.100:389`
  Ignorar: `127.0.0.1`, `0.0.0.0`
  IPs devem ser resolvidos por DNS ou variavel de ambiente.

- `java:S5332` / `javascript:S5332` — **URLs HTTP em configuracao** (MAJOR)
  URLs usando `http://` em vez de `https://`:
  - `url.emailcorp=http://corporativo.mapfre.com.br`
  - `service.endpoint=http://api.internal.com`
  Excecoes: `http://localhost`, `http://127.0.0.1`

- `java:S1075` / `javascript:S1075` — **URLs de ambiente hardcoded** (MINOR)
  URLs completas de ambientes especificos no codigo:
  - URLs contendo `dev`, `hml`, `stg`, `prd`, `homolog`, `staging`, `production`
  Devem usar property placeholders por ambiente.

### Informacao Sensivel

- **Senha em template de email** (CRITICAL) — sem regra SonarQube oficial
  Templates ou configuracoes que enviam senhas em texto claro por email:
  - `email.body=Sua senha temporaria e: {0}`
  - Configuracoes de email com senha do usuario como variavel no corpo

### Debug

- `java:S4507` / `javascript:S4507` — **Debug logging habilitado** (MAJOR)
  Configuracoes com nivel de log DEBUG/TRACE em producao:
  - `logging.level.root=DEBUG`
  - `log4j.rootLogger=DEBUG`
  Em producao, o nivel deve ser INFO ou superior.
