# Skills Packaging

Este repositório mantém as skills em `src/` e publica uma árvore instalável em `publish/skills/.curated`.

## Estrutura

- `src/<skill-name>`: fonte editável de cada skill
- `publish/skills/.curated/<skill-name>`: saída distribuível para `skills install`
- `scripts/build_publish.py`: rebuild determinístico da árvore publicada

## Rebuild

```bash
python3 scripts/build_publish.py
```

O script valida cada skill em `src/`, recria `publish/skills/.curated` e valida novamente a saída copiada.

## Listagem

```bash
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-installer/scripts/list-skills.py" \
  --repo <owner>/<repo> \
  --path publish/skills/.curated
```

## Instalação

```bash
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-installer/scripts/install-skill-from-github.py" \
  --repo <owner>/<repo> \
  --path publish/skills/.curated/angular-standards
```

Cada skill também pode ser instalada trocando o último segmento do `--path` pelo nome desejado.

## Validação local

```bash
for d in src/*; do
  python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" "$d"
done
```

## Observações

- O layout publicado usa `publish/skills/.curated` para ser compatível com `list-skills.py --path ...`.
- `publish/` é artefato versionado deste repositório e deve ser regenerado sempre que `src/` mudar.
