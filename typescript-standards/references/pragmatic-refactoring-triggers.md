# Pragmatic refactoring triggers

## Quando usar

- Avaliar se chegou a hora de refatorar tipos, modulos, classes ou boundaries.

## Triggers reais

- Mudancas recorrentes no mesmo ponto com atrito crescente.
- Dificuldade frequente de teste por acoplamento ou side effects misturados.
- Contratos inchados e ambiguos.
- Classe ou modulo com responsabilidades demais.
- Crescimento de condicionais para variantes de comportamento.
- Duplicacao real em multiplos pontos com mesma semantica.

## Regra local

- Refatore quando a dor for presente e recorrente; nao porque um pattern cabe teoricamente.

## Checklist de qualidade

- A refatoracao respondeu a uma pressao real.
- O design final ficou mais simples ou mais claro.
