# Contribuindo

Este repositório é uma biblioteca de skills. Cada contribuição deve preservar dois objetivos: facilitar o consumo da skill por agentes e manter a manutenção previsível para quem evolui o repositório.

## O que manter alinhado

- Cada skill deve viver em um diretório próprio na raiz.
- Cada diretório de skill deve ter `SKILL.md` como documento principal.
- Materiais complementares devem ficar dentro da própria skill, não na raiz.
- O [README.md](README.md) da raiz deve continuar refletindo a estrutura real do repositório.

## Ao criar uma nova skill

1. Crie um diretório com nome curto, estável e alinhado ao domínio da skill.
2. Adicione um `SKILL.md` com frontmatter contendo ao menos `name` e `description`.
3. Documente claramente quando usar a skill, o objetivo dela e seus guardrails.
4. Se a skill depender de outras, registre a integração e a precedência de forma explícita.
5. Se houver material aprofundado, mantenha-o no mesmo diretório da skill.
6. Atualize o [README.md](README.md) da raiz para incluir a nova skill no catálogo correto.

## Ao alterar uma skill existente

1. Preserve o nome da skill, salvo quando houver motivo forte para renomeação.
2. Mantenha o frontmatter e a descrição coerentes com o comportamento real da skill.
3. Revise referências cruzadas para evitar links quebrados ou precedência desatualizada.
4. Atualize documentação auxiliar da própria skill quando a mudança afetar uso, manutenção ou artefatos derivados.
5. Se a alteração mudar o posicionamento da skill na biblioteca, ajuste também o [README.md](README.md) da raiz.

## Convenções editoriais

- Escreva em português, salvo quando um termo técnico ou convenção do ecossistema exigir inglês.
- Prefira instruções operacionais, diretas e verificáveis.
- Evite duplicar na raiz detalhes que pertencem ao diretório de uma skill específica.
- Use seções que deixem claro quando usar a skill, qual é o objetivo e quais são os limites dela.

## Revisão mínima antes de abrir a mudança

- O diretório da skill está no lugar correto.
- `SKILL.md` continua sendo a entrada principal.
- O frontmatter descreve corretamente a skill.
- As integrações com outras skills estão explícitas quando necessário.
- O [README.md](README.md) da raiz continua coerente com a estrutura atual.
- Não foram introduzidas referências a fluxos globais inexistentes no repositório.
