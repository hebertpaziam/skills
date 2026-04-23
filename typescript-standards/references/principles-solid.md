# Principles SOLID

## Quando usar

- Avaliar design de tipos, modulos, classes, services e fronteiras de dependencia.

## Regras locais

- Use `SOLID` como heuristica pragmatica, nao como lei.
- `SRP`: mantenha tipos, modulos e classes com uma responsabilidade coerente.
- `OCP`: extraia extensibilidade quando houver pressao real de variacao, nao por especulacao.
- `LSP`: nao modele heranca quando substituibilidade real nao for garantida.
- `ISP`: prefira contratos pequenos e focados a interfaces inchadas.
- `DIP`: dependa de contratos e fronteiras claras quando o desacoplamento trouxer valor real.

## Nota pragmatica

- Em TypeScript, muitas necessidades de design sao resolvidas melhor com funcoes, modulos, unions e composicao do que com hierarquias classicas.

## Checklist de qualidade

- `SOLID` melhorou clareza e evolucao do design.
- Nenhum principio foi usado para justificar complexidade desnecessaria.
