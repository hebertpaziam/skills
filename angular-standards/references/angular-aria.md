# Angular Aria

## Regra local

- Só usar se a dependência estiver instalada.
- Não expor `aria-*` como API configurável.
- Garantir AXE e WCAG AA.

## Uso

- Diretrizes headless para padrões ARIA (accordion, listbox, tabs, menu, etc.).
- Estilizar estados com seletores de ARIA.

## Exemplo

```html
<button ngAccordionTrigger panelId="panel-1" class="accordion-header">
  Section 1
</button>
```

```css
.accordion-header[aria-expanded='true'] .icon {
  transform: rotate(180deg);
}
```
