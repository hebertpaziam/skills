# Template list rendering and keys

## Quando usar

- Renderizar listas, colecoes filtradas e itens dinamicos.

## Regras locais

- Toda lista dinamica deve ter `key` estavel baseada em identidade real de dominio.
- Nao usar indice como `key` quando a lista puder reordenar, filtrar, inserir ou remover itens.
- Prefira preparar filtros, ordenacoes e agrupamentos no script em vez de sobrecarregar o `v-for`.
- Nao combinar `v-if` e `v-for` no mesmo elemento quando isso puder ser evitado.

## Checklist de qualidade

- `key` estavel e semantica.
- Lista preparada fora do template quando necessario.
- Sem identidade fraca baseada em indice por conveniencia.
