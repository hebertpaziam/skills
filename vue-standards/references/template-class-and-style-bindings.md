# Template class and style bindings

## Quando usar

- Declarar classes e estilos dinamicos no template.

## Regras locais

- Prefira bindings simples, com nomes expressivos e pouco branching inline.
- Quando a logica de classe crescer, derive-a no script com `computed`.
- Use `style` binding apenas para variacoes legitimas de runtime; estilo estrutural deve continuar no stylesheet.
- Nao usar objeto de style grande como atalho para fugir da stack de estilos do projeto.

## Checklist de qualidade

- Template sem logica de classe excessiva.
- Estilo estrutural continua fora do template.
- Classes e estilos expressam estado observavel, nao detalhe acidental.
