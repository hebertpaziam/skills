# Components (Angular 21)

## Regras locais (prioridade)

- Standalone por padrão; não definir `standalone: true`.
- Sempre usar `ChangeDetectionStrategy.OnPush`.
- Usar Signals para qualquer estado no componente.
- Usar control flow nativo (`@if`, `@for`, `@switch`).
- Preferir `class` e `style` bindings sobre `ngClass` e `ngStyle`.
- Ao alterar estilos do componente ou classes do template, carregar e seguir [component-styles.md](component-styles.md).
- Propriedades e métodos devem seguir a ordem definida no skill.

## Integração com outros guias

- [component-styles.md](component-styles.md) é a fonte de verdade para SCSS de componente, BEM, toolbox, ITCSS e limpeza baseada no HTML.
- [testing-fundamentals.md](testing-fundamentals.md) é a fonte de verdade para a escrita do `.spec.ts`, sempre respeitando a stack de testes configurada no projeto.

## Definição básica

Use `@Component` com `imports` explícitos e template separado quando crescer.

```ts
@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class Profile {}
```

## Control flow

Sempre use blocos nativos:

```html
@if (user()) { <app-user-card /> } @else { <app-empty /> }

@for (item of items(); track item.id) { <li>{{ item.name }}</li> } @empty { <li>Sem itens</li> }

@switch (status()) { @case ('loading') { <app-spinner /> } @default { <app-content /> } }
```

## Boas práticas

- Componentes pequenos e focados; extraia responsabilidades para services ou child components.
- Evite lógica complexa em template; prefira `computed`.
- Se houver SCSS ou mudanca de classes no template, delegue o detalhamento de estilo para [component-styles.md](component-styles.md).
- Sempre criar o arquivo `.spec.ts` e seguir [testing-fundamentals.md](testing-fundamentals.md) ao preencher os unit tests.
