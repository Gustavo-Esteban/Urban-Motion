# Urban Motion — Plano de Ecommerce

## Visão Geral

- Marca: Urban Motion, ecommerce de camisetas.
- Estilo visual: moderno, minimalista, cores preto e branco.
- Stack principal:
  - Frontend: Angular.
  - Backend: NestJS.
  - Banco/Auth: Supabase.

## Navegação e Páginas

- Header fixo:
  - Esquerda: nome/logo “Urban Motion”.
  - Direita: links “Home”, “Loja”, “Sobre” e ícone de “Carrinho” com quantidade.
- Rotas principais:
  - `/` – Home.
  - `/loja` – Lista de produtos.
  - `/sobre` – Página institucional da marca.
  - `/carrinho` – Itens adicionados pelo usuário.
  - `/checkout` – Finalização da compra (dados, frete, pagamento).

### Home

- Hero em preto e branco com slogan da marca.
- Destaque de coleção atual.
- Botão “Ver coleção” levando para `/loja`.

### Loja

- Grid de produtos (camisetas) com:
  - Imagem.
  - Nome.
  - Preço.
- Possível filtro inicial simples (categoria, tamanho) em uma versão futura.

### Sobre

- História da marca.
- Conceito urbano, lifestyle, tom minimalista.
- Fotos e/ou gráficos em preto e branco.

### Carrinho

- Lista de produtos escolhidos:
  - Nome, tamanho, quantidade, preço unitário, subtotal.
- Ações:
  - Aumentar/diminuir quantidade.
  - Remover item.
- Exibição do total.
- Botão para “Ir para checkout”.

### Checkout

- Formulário com:
  - Dados pessoais (nome, email, documento).
  - Endereço (CEP, rua, número, complemento, bairro, cidade, estado).
  - Opções de frete (após consulta de frete).
  - Resumo do pedido.
  - Botão para pagamento via Mercado Pago.

---

## Arquitetura de Frontend (Angular)

- Aplicação Angular SPA com:
  - Módulos organizados:
    - `core` – serviços globais (auth, API, carrinho).
    - `shared` – componentes compartilhados (botões, cards, etc.).
    - `features` – módulos de feature:
      - `home`.
      - `store` (loja).
      - `about`.
      - `cart`.
      - `checkout`.
- Roteamento definido para as páginas principais.

### Layout e Tema

- Tema preto e branco:
  - Fundo predominantemente branco.
  - Header e elementos de destaque em preto com texto branco.
- Tipografia forte e limpa, estilo urbano.
- Variáveis de tema (exemplo):
  - `--um-black: #000000`.
  - `--um-white: #ffffff`.

### Estado do Carrinho

- Serviço de carrinho (`CartService`) responsável por:
  - Guardar itens (produto, tamanho, quantidade, preço).
  - Atualizar quantidades.
  - Calcular total.
- Persistência:
  - Estado em memória (ex: signals ou BehaviorSubject).
  - Espelhado em `localStorage` para manter o carrinho entre visitas.

---

## Arquitetura de Backend (NestJS)

- API estruturada em módulos:
  - `ProductsModule`:
    - `GET /products` – lista de produtos.
    - `GET /products/:id` – detalhes de um produto.
  - `OrdersModule`:
    - `POST /orders` – cria pedido (pré-pagamento).
    - `GET /orders/:id` – detalhes de um pedido.
  - `PaymentsModule`:
    - `POST /payments/mercadopago` – inicia fluxo de pagamento.
    - `POST /payments/mercadopago/webhook` – recebe notificações do Mercado Pago.
  - `ShippingModule`:
    - `POST /shipping/quote` – calcula opções de frete (Correios ou gateway).

### Integração com Supabase

- Supabase como:
  - Banco de dados (Postgres).
  - Auth (opcional, se quisermos login/conta).
- Serviço dedicado no backend (ex: `SupabaseService`) encapsula:
  - Conexão com Supabase.
  - Operações em tabelas (`products`, `orders`, etc.).

---

## Modelagem de Dados (Supabase)

### Tabela `products`

- `id` (uuid).
- `name`.
- `description`.
- `price_cents` (inteiro, valor em centavos).
- `image_url`.
- `sizes` (jsonb ou tabela relacionada).
- `stock` (opcional por tamanho).

### Tabela `orders`

- `id` (uuid).
- `customer_id` (fk para `customers`, opcional se guest).
- `status`:
  - `pending`.
  - `paid`.
  - `canceled`.
  - `shipped`.
- `total_cents`.
- `shipping_price_cents`.
- `payment_provider` (ex: `mercadopago`).
- `payment_status`:
  - `pending`.
  - `approved`.
  - `rejected`.
- `payment_reference_id` (id da preference/pagamento no gateway).
- `created_at`.

### Tabela `order_items`

- `id`.
- `order_id` (fk para `orders`).
- `product_id` (fk para `products`).
- `size`.
- `quantity`.
- `unit_price_cents`.

### Tabela `customers` (opcional)

- `id`.
- `supabase_user_id` (user da auth do Supabase).
- `name`.
- `document`.
- `phone`.

---

## Fluxo de Pagamento (Mercado Pago)

### Criação do Pedido e Preference

1. Frontend (Angular) no `/checkout`:
   - Envia ao backend:
     - Itens do carrinho.
     - Dados básicos do cliente.
     - Endereço.
     - Opção de frete escolhida.
2. Backend (NestJS):
   - Cria registro de pedido em `orders` com `status = pending`.
   - Monta dados para o Mercado Pago (itens, valor total, etc.).
   - Chama API do Mercado Pago para criar uma `preference` (ou pagamento).
   - Salva no pedido:
     - `payment_provider = 'mercadopago'`.
     - `payment_reference_id = id_da_preference`.
   - Retorna ao frontend a URL de checkout (`init_point`) ou dados para checkout embutido.

### Fluxo do Usuário

- Usuário é redirecionado para página de pagamento do Mercado Pago ou vê um modal de checkout.
- Após pagamento, o Mercado Pago chama o webhook do backend.

### Webhook e Confirmação

1. Mercado Pago envia notificação para `POST /payments/mercadopago/webhook`.
2. Backend:
   - Lê os dados do webhook.
   - Chama a própria API do Mercado Pago para confirmar o status do pagamento (não confiar apenas no payload).
   - Atualiza o pedido em `orders`:
     - `payment_status` (`approved`, `rejected`, etc.).
     - `status` do pedido (`paid`, `canceled`).

### Decisões de Implementação

- Tipo de checkout:
  - Versão inicial: redirecionamento (mais simples).
  - Versão futura: checkout embutido com SDK JS.
- Segurança:
  - Validar sempre o pagamento falando diretamente com a API do Mercado Pago.
  - Não confiar em dados enviados apenas pelo frontend.

---

## Fluxo de Frete (Correios ou Gateway)

### Cálculo de Frete

1. Frontend:
   - Usuário informa CEP e confirma itens do carrinho.
   - Chama backend: `POST /shipping/quote` com:
     - `cep_destino`.
     - Itens (para peso/dimensões) ou apenas total estimado para cálculo.
2. Backend:
   - Serviço `ShippingService`/`CorreiosService`:
     - Chama API dos Correios ou gateway de frete.
     - Retorna opções de frete:
       - Nome do serviço (PAC, SEDEX, etc.).
       - Prazo estimado.
       - Valor.
3. Frontend:
   - Exibe opções de frete e permite escolha.
   - Atualiza total do pedido com valor de frete.

### Estratégia Inicial vs. Evolução

- Versão inicial:
  - Possível frete fixo ou tabela simples por região (para simplificar).
- Versão evoluída:
  - Integração real com:
    - API direta dos Correios, ou
    - Gateway de frete (Melhor Envio, Frete Rápido, etc.).

---

## Passos de Desenvolvimento

### 1. Inicializar Projetos

- Criar projeto Angular em `frontend/` com roteamento habilitado.
- Criar API NestJS em `backend/`.
- Configurar conexão do NestJS com Supabase via variáveis de ambiente.

### 2. Frontend

- Implementar:
  - Layout base com header (logo + navegação).
  - Rotas: Home, Loja, Sobre, Carrinho, Checkout.
  - Serviço de carrinho com estado em memória e persistência em `localStorage`.
- Conectar `/loja` à API do backend (`GET /products`).

### 3. Backend + Supabase

- Criar tabelas em Supabase conforme modelagem.
- Implementar:
  - `ProductsModule` com `GET /products`.
  - `OrdersModule` com criação e leitura de pedidos.
- Garantir que operações básicas (listar produtos, criar pedido) usem Supabase.

### 4. Integração com Mercado Pago

- Configurar credenciais via variáveis de ambiente.
- Criar `PaymentsModule`:
  - Endpoint para iniciar pagamento (`POST /payments/mercadopago`).
  - Endpoint webhook (`POST /payments/mercadopago/webhook`).
- Testar fluxo completo:
  - Criação da preference.
  - Atualização de status do pedido via webhook.

### 5. Integração com Frete

- Criar `ShippingModule`:
  - Endpoint `POST /shipping/quote` com valor fixo ou cálculo simples inicialmente.
- Versão futura: plugar API oficial dos Correios ou de um gateway de frete.

---

Este documento serve como referência rápida para manter a visão do projeto alinhada durante todo o desenvolvimento do ecommerce Urban Motion.

