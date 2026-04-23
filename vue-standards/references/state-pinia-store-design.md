# State Pinia store design

## Quando usar

- Projetar ou refatorar stores Pinia.

## Regras locais

- Separar estado, derivacoes e acoes com nomes orientados ao dominio.
- Getters devem representar derivacoes observaveis e estaveis.
- Actions devem concentrar mutacoes de dominio e coordenacao assicrona.
- Nao transformar a store em camada de UI nem em wrapper generico de HTTP sem semantica de dominio.
- Compose stores com cuidado para evitar acoplamento circular desnecessario.

## Checklist de qualidade

- Store pequena o suficiente para ter fronteira clara.
- Getters e actions com semantica de dominio.
- Sem mistura indevida de estado de view e estado de negocio.
