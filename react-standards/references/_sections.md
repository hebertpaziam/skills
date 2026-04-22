# Seções

Este arquivo define todas as seções, sua ordem, níveis de impacto e descrições.
O ID da seção (entre parênteses) é o prefixo do nome do arquivo usado para agrupar as regras.

---

## 1. Eliminating Waterfalls (async)

**Impacto:** CRITICAL  
**Descrição:** Waterfalls são o maior vilão de performance. Cada await sequencial adiciona latência total de rede. Eliminá-los traz os maiores ganhos.

## 2. Bundle Size Optimization (bundle)

**Impacto:** CRITICAL  
**Descrição:** Reduzir o bundle inicial melhora Time to Interactive e Largest Contentful Paint.

## 3. Server-Side Performance (server)

**Impacto:** HIGH  
**Descrição:** Otimizar SSR e data fetching elimina waterfalls no servidor e reduz tempos de resposta.

## 4. Client-Side Data Fetching (client)

**Impacto:** MEDIUM-HIGH  
**Descrição:** Deduplicação automática e padrões eficientes de fetch reduzem requisições redundantes.

## 5. Re-render Optimization (rerender)

**Impacto:** MEDIUM  
**Descrição:** Reduzir re-renders desnecessários minimiza computação desperdiçada e melhora responsividade.

## 6. Rendering Performance (rendering)

**Impacto:** MEDIUM  
**Descrição:** Otimizar o processo de render reduz o trabalho do navegador.

## 7. JavaScript Performance (js)

**Impacto:** LOW-MEDIUM  
**Descrição:** Micro-otimizações em hot paths podem gerar ganhos relevantes.

## 8. Advanced Patterns (advanced)

**Impacto:** LOW  
**Descrição:** Padrões avançados para casos específicos que exigem implementação cuidadosa.
