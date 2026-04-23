# Core template refs

## Quando usar

- Interagir com DOM real, foco, medicao ou API publica exposta por outro componente.

## Regras locais

- Template refs sao escape hatch, nao mecanismo primario de comunicacao entre componentes.
- Prefira props, emits e composables antes de recorrer a refs de componente.
- Tipar refs explicitamente quando a inferencia automatica nao for suficiente.
- Toda operacao com DOM deve considerar ciclo de vida e nulidade do elemento.

## Checklist de qualidade

- Ref usada por necessidade real.
- Sem dependencia acidental em implementacao privada de child component.
- Acesso protegido contra `null`.
