# Abrilhante Boutique — Documentação Final do Produto

**Versão:** 1.0 — MVP  
**Data:** Junho 2026  
**Tipo:** Site-Catálogo Vitrine com Checkout via WhatsApp

---

## 1. Visão Geral

Catálogo digital mobile-first para substituir o catálogo nativo do WhatsApp Business. O cliente navega pelos produtos, monta um carrinho e finaliza o pedido enviando uma mensagem formatada diretamente para o WhatsApp da loja — sem pagamento online, sem cadastro obrigatório.

**Stack:**
- Frontend: React 19 + TypeScript + Vite
- Estilo: Tailwind CSS 3
- Backend/DB: Supabase (PostgreSQL + Auth + Storage)
- Estado: Zustand (carrinho) + React Query (dados)

---

## 2. Design System

### 2.1 Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `brand-50` | `#fdf2f8` | Fundos suaves, hover states |
| `brand-100` | `#fce7f3` | Badges, chips de categoria selecionada |
| `brand-600` | `#db2777` | Cor primária — botões, preços, links |
| `brand-700` | `#be185d` | Hover de botões primários |
| `gray-50` | `#f9fafb` | Fundo de tabelas, cards neutros |
| `gray-900` | `#111827` | Textos principais |
| `green-500` | `#22c55e` | Botão WhatsApp |

### 2.2 Tipografia

- **Família:** Inter (sans-serif)
- **Títulos de página:** `text-2xl font-bold` — 24px
- **Nome de produto (card):** `text-sm font-medium` — 14px
- **Preço:** `text-brand-600 font-semibold`
- **Labels de formulário:** `text-sm font-medium text-gray-700`
- **Texto auxiliar:** `text-sm text-gray-500`

### 2.3 Componentes Base

| Componente | Classe principal |
|---|---|
| Botão primário | `bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2.5 rounded-lg` |
| Botão secundário | `border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50` |
| Botão WhatsApp | `bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl` |
| Input | `border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-400` |
| Card de produto | `bg-white rounded-2xl overflow-hidden shadow-sm` |
| Modal | `bg-white rounded-2xl shadow-xl w-full max-w-lg` |
| Badge ativo | `bg-green-50 text-green-700 rounded-full text-xs px-2.5 py-1` |
| Badge inativo | `bg-gray-100 text-gray-500 rounded-full text-xs px-2.5 py-1` |

---

## 3. Rotas da Aplicação

| Rota | Componente | Acesso | Descrição |
|---|---|---|---|
| `/` | `Catalog` | Público | Vitrine com grid de produtos e filtros |
| `/produto/:id` | `ProductDetail` | Público | Página de detalhe do produto |
| `/admin` | `AdminLogin` | Público | Login do administrador |
| `/admin/produtos` | `AdminProducts` | Protegido | CRUD de produtos |
| `/admin/categorias` | `AdminCategories` | Protegido | CRUD de categorias |

---

## 4. Telas — Especificação de Layout

---

### TELA 1 — Vitrine (Home) `/`

**Objetivo:** Apresentar os produtos disponíveis com filtros por categoria.

```
┌─────────────────────────────────────┐
│  HEADER (sticky, blur, z-30)        │
│  [abboutique logo]    [🛒 (badge)]  │
├─────────────────────────────────────┤
│  FILTRO DE CATEGORIAS               │
│  [Todas] [Vestidos] [Blusas] [...]  │  ← scroll horizontal
├─────────────────────────────────────┤
│  GRID DE PRODUTOS (2 colunas mobile)│
│  ┌──────────┐  ┌──────────┐        │
│  │  [foto]  │  │  [foto]  │        │  ← aspect-ratio 3/4
│  │  Nome    │  │  Nome    │        │
│  │  R$ 0,00 │  │  R$ 0,00 │        │
│  │[+ Carrinho] │[+ Carrinho]│      │
│  └──────────┘  └──────────┘        │
│  (repete em grid 2/3/4 cols)        │
└─────────────────────────────────────┘
```

**Estados:**
- **Loading:** Skeleton animation (8 cards cinzas pulsando)
- **Vazio:** Mensagem centralizada "Nenhum produto encontrado."
- **Erro:** Mensagem em vermelho "Erro ao carregar produtos."

**Comportamentos:**
- Header fixo no topo com backdrop-blur
- Categoria selecionada destaca o chip com `brand-100 + brand-700`
- Clique no card navega para `/produto/:id`
- Clique em "+ Carrinho" adiciona e abre o drawer do carrinho

---

### TELA 2 — Detalhe do Produto `/produto/:id`

**Objetivo:** Exibir todas as informações do produto e permitir adicionar ao carrinho.

```
┌─────────────────────────────────────┐
│  HEADER (mesmo do layout geral)     │
├─────────────────────────────────────┤
│  [← Voltar]                         │
│                                     │
│  ┌─────────────────────────────┐    │
│  │         FOTO                │    │  ← aspect 1/1 ou 3/4
│  └─────────────────────────────┘    │
│                                     │
│  Categoria · Nome do produto        │
│  R$ 00,00                           │
│                                     │
│  Descrição completa do produto...   │
│                                     │
│  [    Adicionar ao Carrinho    ]     │  ← botão brand-600
└─────────────────────────────────────┘
```

**Estados:**
- **Loading:** Skeleton da imagem + linhas de texto
- **Produto inativo/não encontrado:** Redirect ou mensagem de erro

---

### TELA 3 — Carrinho (Drawer lateral)

**Objetivo:** Revisão do pedido e ação de finalizar pelo WhatsApp.  
Abre como drawer deslizando da direita. Largura máxima `max-w-sm`.

```
┌────────────────────────────┐
│  Meu carrinho          [X] │
├────────────────────────────┤
│  ┌────┐ Nome produto       │
│  │foto│ R$ 00,00           │
│  └────┘ [−] 1 [+]  [🗑]   │
│  ─────────────────────────  │
│  ┌────┐ Nome produto       │
│  │foto│ R$ 00,00           │
│  └────┘ [−] 2 [+]  [🗑]   │
├────────────────────────────┤
│  Total         R$ 000,00   │
│  [Finalizar pelo WhatsApp] │  ← verde
│  [Limpar carrinho]         │  ← texto cinza
└────────────────────────────┘
```

**Vazio:**
```
┌────────────────────────────┐
│  Meu carrinho          [X] │
├────────────────────────────┤
│                            │
│   Seu carrinho está vazio  │  ← centralizado, cinza
│                            │
└────────────────────────────┘
```

**Mensagem gerada para o WhatsApp:**
```
Olá! Tenho interesse nos seguintes produtos:

• Blusa Canelada x1 — R$ 59,90
• Calça Jeans x2 — R$ 239,80

*Total: R$ 299,70*
```

---

### TELA 4 — Login Admin `/admin`

**Objetivo:** Autenticar o proprietário da loja.

```
┌─────────────────────────────────────┐
│         (centralizado, tela cheia)  │
│                                     │
│         abboutique                  │  ← brand-700, bold
│         Painel administrativo       │  ← gray-500, sm
│                                     │
│  ┌─────────────────────────────┐    │
│  │  E-mail                     │    │
│  ├─────────────────────────────┤    │
│  │  Senha                      │    │
│  ├─────────────────────────────┤    │
│  │      [    Entrar    ]        │    │  ← brand-600
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

---

### TELA 5 — Admin: Produtos `/admin/produtos`

**Objetivo:** Listar, criar, editar, ativar/desativar e excluir produtos.

```
┌─────────────────────────────────────────────────────┐
│  Produtos                        [Sair] [+ Novo]    │
│  N produtos cadastrados                             │
├────────┬───────────┬──────────┬────────┬────────────┤
│Produto │ Categoria │  Preço   │ Status │   Ações    │
├────────┼───────────┼──────────┼────────┼────────────┤
│[img]   │ Vestidos  │ R$59,90  │●Ativo  │ ✏️  🗑️    │
│Nome    │           │          │        │            │
├────────┼───────────┼──────────┼────────┼────────────┤
│[img]   │ Blusas    │ R$39,90  │○Inativo│ ✏️  🗑️    │
│Nome    │           │          │        │            │
└────────┴───────────┴──────────┴────────┴────────────┘
```

**Modal — Criar / Editar Produto:**
```
┌─────────────────────────────────────┐
│  Novo produto / Editar produto  [X] │
├─────────────────────────────────────┤
│  Nome *                             │
│  [________________________________] │
│                                     │
│  Descrição                          │
│  [________________________________] │
│  [________________________________] │
│  [________________________________] │
│                                     │
│  Preço (R$) *    Categoria          │
│  [__________]    [__________▼]      │
│                                     │
│  Foto                               │
│  [preview 96x96]                    │
│  [Escolher arquivo]                 │
│                                     │
│  ☑ Produto ativo (visível vitrine)  │
│                                     │
│  [  Cancelar  ]  [    Salvar    ]   │
└─────────────────────────────────────┘
```

---

### TELA 6 — Admin: Categorias `/admin/categorias`

**Objetivo:** Criar e excluir categorias.

```
┌─────────────────────────────────────┐
│  Categorias              [+ Nova]   │
├─────────────────────────────────────┤
│  Vestidos                      [🗑] │
│  Blusas                        [🗑] │
│  Calças                        [🗑] │
│  Acessórios                    [🗑] │
└─────────────────────────────────────┘
```

---

## 5. Modelo de Dados

### Tabela `products`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID | Sim | Chave primária |
| `name` | String | Sim | Nome do produto |
| `description` | Text | Não | Descrição completa |
| `price` | Decimal | Sim | Preço em R$ |
| `image_url` | String | Não | URL pública (Supabase Storage) |
| `category_id` | UUID (FK) | Não | Referência à categoria |
| `active` | Boolean | Sim | Visível na vitrine? |
| `created_at` | Timestamp | Auto | Data de criação |

### Tabela `categories`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID | Sim | Chave primária |
| `name` | String | Sim | Nome exibido |
| `slug` | String | Sim | Identificador para filtro |
| `display_order` | Integer | Sim | Ordem no filtro |

### Carrinho (LocalStorage via Zustand)

```ts
CartItem {
  product: Product
  quantity: number
}
```

---

## 6. Fluxos de Uso

### Fluxo Cliente
```
Acessa / → Filtra por categoria (opcional)
        → Clica no produto → Vê detalhe
        → Adiciona ao carrinho
        → Abre carrinho → Ajusta quantidades
        → Clica "Finalizar pelo WhatsApp"
        → Redirecionado para wa.me com mensagem pronta
```

### Fluxo Administrador
```
Acessa /admin → Faz login
             → /admin/produtos → Cria/Edita/Desativa produto
             → /admin/categorias → Cria/Remove categoria
             → Clica "Sair" → Retorna para /admin
```

---

## 7. MVP — Itens a Implementar

Dois itens que bloqueiam o uso real da aplicação pelo dono da loja:

### 7.1 Upload de Imagem via Supabase Storage
**Status:** Já implementado no código (`AdminProducts.tsx:116-128`)  
**Pendência:** Verificar se o bucket `product-images` está criado e com política pública no Supabase.

### 7.2 WhatsApp Configurável pelo Admin
**Status:** Número fixo em `src/lib/config.ts`  
**Pendência:** Criar tabela `settings` no Supabase com campo `whatsapp_number` e adicionar campo de configuração no painel admin.

---

## 8. Segurança

- Rotas `/admin/produtos` e `/admin/categorias` protegidas por `AdminGuard` — redireciona para `/admin` se não autenticado
- Autenticação via Supabase Auth (JWT gerenciado pelo Supabase)
- Políticas RLS ativas no banco: leitura pública de produtos ativos, escrita apenas autenticada
- Painel admin nunca exposto no frontend público

---

## 9. Decisões de Arquitetura

| Decisão | Escolha | Motivo |
|---|---|---|
| Estado do carrinho | Zustand + persist | Leve, persistência automática no localStorage |
| Cache de dados | React Query | Cache de 5 min, revalidação automática |
| Imagens | Supabase Storage | Evita dependência externa, bucket na mesma infra |
| Número WhatsApp | Config.ts (→ settings) | Começou fixo, MVP move para banco |
| Checkout | Link wa.me | Sem gateway de pagamento, zero custo operacional |
