---
title: CSS content-visibility para Listas Longas
impact: HIGH
impactDescription: render inicial mais rápido
tags: rendering, css, content-visibility, long-lists
---

## CSS content-visibility para Listas Longas

Aplique `content-visibility: auto` para adiar render off-screen.

**CSS:**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**Exemplo:**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

Com 1000 mensagens, o browser pula layout/paint de ~990 itens off-screen (render inicial ~10x mais rápido).
