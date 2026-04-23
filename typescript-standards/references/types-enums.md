# Types enums

## Quando usar

- Modelar conjuntos fechados de valores nomeados quando enum realmente for a melhor escolha.

## Regras locais

- Enums devem viver em arquivos dedicados a enum.
- Deve haver apenas um enum por arquivo.
- Nao declare enum dentro de arquivos de implementacao, service, helper, component, composable, store ou similares.
- Todo enum deve ter no mesmo arquivo uma estrutura de mapeamento que exponha os labels de seus valores.
- Antes de criar um enum, avalie se um union type literal resolveria de forma mais simples.
- Use enum apenas quando ele trouxer clareza real, interoperabilidade ou semantica melhor do que unions literais.

## Exemplo

```ts
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Ativo',
  [UserStatus.INACTIVE]: 'Inativo',
};
```

## Checklist de qualidade

- Enum existe por motivo semantico real.
- Enum vive em arquivo dedicado.
- Ha apenas um enum no arquivo.
- Existe no mesmo arquivo uma estrutura de labels para os valores do enum.
- Uma alternativa mais simples com union type foi considerada.
