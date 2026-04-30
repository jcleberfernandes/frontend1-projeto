# Farmácia Fernandes

**Aplicação web de gestão de medicamentos para farmácia.**

---

## Critérios do Projeto

| # | Critério | Status | Como foi implementado |
|---|----------|--------|----------------------|
| 1 | **CRUD** (Create, Read, Update, Delete) | ✅ | Criar, listar, editar e eliminar medicamentos (`script.js:160-295`) |
| 2 | **Mock API** | ✅ | Funções simuladas: `simularAPISalvar`, `simularAPICarregar`, `simularAPIDeletar` (`script.js:10-36`) com localStorage |
| 3 | **API Nativa JavaScript** | ✅ | Geolocation API (`navigator.geolocation` em `script.js:41-63`) e Date API (`new Date()` em `script.js:68-80`) |
| 4 | **Formulário com validação** | ✅ | Formulário admin valida: nome obrigatório e preço mínimo 0.01 (`script.js:179-187`) |
| 5 | **Biblioteca externa** | ✅ | Bootstrap 5.3.0 (UI component library) linkado em `index.html:8` |
| 6 | **Responsivo** | ✅ | Meta viewport (`index.html:5`) e media queries em `style.css:200-718` e `style.css:1211-1307` |
| 7 | **Lighthouse Report** | ⚠️ | Gerado em `reports/lighthouse-report.html` - Performance: 73, Accessibility: 93, Best Practices: 96, SEO: 100 |

---

## Estrutura do Projeto

```
frontend1-projeto/
├── reports/
│   └── lighthouse-report.html    → Relatório Lighthouse
├── img/
│   ├── Farmacialogo.png
│   └── FarmaciaFernandes.png
├── index.html    → Página inicial (lista medicamentos)
├── admin.html    → Página de gestão (criar/editar)
├── login.html    → Autenticação admin
├── script.js     → JavaScript (CRUD, validações, APIs nativas)
├── style.css     → Estilos CSS (responsivo, Bootstrap)
└── README.md     → Este ficheiro
```

---

## Estrutura do Código

### `index.html`
- Página principal que lista medicamentos
- Header com logo e botão de login/logout
- Search box para filtrar medicamentos por nome
- Seção `#lista-medicamentos` onde os cards são renderizados dinamicamente
- Footer com data atual e botão para geolocalização
- Bootstrap 5.3.0 CDN para estilização

### `admin.html`
- Página protegida por autenticação (requer login)
- Formulário para criar e editar medicamentos
- Campos: nome, princípio ativo, categoria, stock, preço, validade
- Botões de submissão e cancelamento para edição

### `login.html`
- Página de autenticação admin
- Credenciais: `admin` / `1234`
- Usa `sessionStorage` para manter sessão

### `script.js`
- **Mock API** (linhas 10-36): Simula operações assíncronas com `setTimeout` e Promises
- **Geolocalização** (linhas 41-63): Obtém coordenadas GPS com `navigator.geolocation.getCurrentPosition()`
- **Data/Hora** (linhas 68-80): Exibe data formatada usando `new Date()`
- **CRUD Operations**:
  - Create: `iniciarAdmin()` linha 163 (form submit)
  - Read: `mostrarLista()` linha 141 e `simularAPICarregar()` linha 19
  - Update: Edição via `irEditarMedicamento()` linha 273 e `medicamentoEmEdicao` linha 5
  - Delete: `apagarMedicamento()` linha 281
- **Validação**: Nome obrigatório (linha 179) e preço mínimo (linha 184)
- **Autenticação**: Login com `sessionStorage` (linhas 346-381)
- **LocalStorage**: Persistência em `carregarMedicamentos()` e `gravarMedicamentos()` (linhas 85-97)

### `style.css`
- Reset CSS e estilos base
- Cards de medicamentos (`.med-card`)
- Estilos para login (`.login-body`, `.login-card`)
- Estilos para admin (`.admin-body`, `.admin-card`)
- Media queries para responsividade:
  - 768px (tablets)
  - 600px (mobiles grandes)
  - 480px (mobiles pequenos)
- Gradientes, sombras e transições para UI moderna

---

## Como Usar

1. Abrir `index.html` no browser
2. Fazer login em `login.html` com: **admin** / **1234**
3. Na página admin, adicionar medicamentos ou editar existentes
4. Na página inicial, visualizar e pesquisar medicamentos
5. Clicar no botão "Mostrar Localização" no footer para ver coordenadas GPS

---

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos com Flexbox e Grid, media queries para responsividade
- **JavaScript Vanilla** - Sem frameworks, usando APIs nativas
- **Bootstrap 5.3.0** - Framework CSS para componentes UI
- **LocalStorage** - Persistência de dados no browser
- **Geolocation API** - Captação de coordenadas GPS
- **Date API** - Formatação de data e hora

---

## Relatório Lighthouse

O relatório foi gerado e está disponível em `reports/lighthouse-report.html`.

**Scores atuais:**
- Performance: 73 (precisa otimização de imagens)
- Accessibility: 93 ✓
- Best Practices: 96 ✓
- SEO: 100 ✓

**Melhorias pendentes para Performance:**
- Comprimir imagens (atualmente 1.8MB e 1.1MB)
- Minificar CSS e JavaScript
- Adicionar cache headers no servidor
