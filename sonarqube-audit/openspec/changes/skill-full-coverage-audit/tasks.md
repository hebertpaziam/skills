## 1. Criar referencias universais

- [x] 1.1 Criar `references/universal/scan-all.md` com 10 regras cross-linguagem (S2068, S6437, S6418, S1313, S5332, S1075, S125, S1134, S1135, arquivos vazios)
- [x] 1.2 Remover `references/universal/blockers.md`

## 2. Criar referencias web

- [x] 2.1 Criar `references/web/jsp.md` com regras XSS (S5131 por contexto HTML/JS/atributo), scriptlets (S1523), open redirect (S5146), senha em hidden field (S2068), e procedimento de verificacao EL
- [x] 2.2 Criar `references/web/javascript.md` com regras para JS legacy (S1523 eval, S106 console.log, S4507 debug, S3504 var, S2077 SQL concat)

## 3. Criar referencias config

- [x] 3.1 Criar `references/config/xml.md` com regras XXE (S2755, S6373, S6376, S6377), web.xml security (S3330, S2092, S4502, S5122, S5332), Spring datasource (S2068), logging (S4507)
- [x] 3.2 Criar `references/config/secrets.md` com regras para .properties/.yml/.env (S2068, S6437, S6418, S1313, S5332, S1075, S4507) e padroes de verificacao (keywords, JWT regex, IP regex)

## 4. Reescrever SKILL.md - Etapa 1 (Inventario)

- [x] 4.1 Reescrever Etapa 1 para ler `.gitignore` e construir lista de exclusao
- [x] 4.2 Adicionar instrucao para listar TODOS os arquivos de texto (sem filtro por extensao), excluindo binarios e patterns do .gitignore

## 5. Reescrever SKILL.md - Etapa 2 (Classificacao)

- [x] 5.1 Reescrever Etapa 2 com arvore de classificacao por categoria: source (.java), template (.jsp), config (.xml, .properties, .yml, .env), typescript (.ts, .tsx), web (.js, .html), unknown (universal only)
- [x] 5.2 Mapear cada categoria aos arquivos de referencia correspondentes (categoria + universal/scan-all.md)

## 6. Reescrever SKILL.md - Etapa 3 (Auditoria)

- [x] 6.1 Adicionar instrucao de sub-agentes paralelos por categoria: cada sub-agente recebe seus arquivos + referencias da categoria + scan-all.md
- [x] 6.2 Definir que universal/scan-all.md e aplicado por TODOS os sub-agentes a todos os seus arquivos

## 7. Reescrever SKILL.md - Arvore de Decisao

- [x] 7.1 Substituir arvore extensao-centrica por arvore de 3 camadas (universal → categoria → contexto)

## 8. Ajustar template do relatorio

- [x] 8.1 Atualizar template para formato hibrido: corpo com violacao + contagem por arquivo, secao de correcao com detalhamento linha-a-linha
- [x] 8.2 Remover logica de "primeira ocorrencia" — todas os arquivos com violacoes devem ser listados

## 9. Verificacao

- [x] 9.1 Verificar que todas as referencias em SKILL.md apontam para arquivos existentes (nenhuma referencia quebrada)
- [x] 9.2 Verificar que blockers.md foi removido e todas as mencoes substituidas por scan-all.md
