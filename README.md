# FarmaciaFernandes

**Aplicação web de gestão de medicamentos para farmácia.**

---

## Critérios do Projeto

| # | Critério | Status | Como foi implementado |
|---|----------|--------|----------------------|
| 1 | **CRUD** (Create, Read, Update, Delete) | ✅ | Criar, listar, editar e eliminar medicamentos |
| 2 | **Mock API** | ✅ | localStorage do browser |
| 3 | **API Nativa JavaScript** | ✅ | Geolocation API (captar GPS) |
| 4 | **Formulário com validação** | ✅ | Campos validados: nome, stock, preço, data |
| 5 | **Biblioteca externa** | ⚠️ | Opcional - ver comentário no HTML |
| 6 | **Responsivo** | ✅ | CSS com media queries |
| 7 | **Lighthouse/SEO** | ✅ | Meta tags no HTML |

---

## Ficheiros do Projeto

```
├── index.html    → Estrutura HTML (páginas, formulários)
├── style.css    → Estilos CSS (responsivo)
├── script.js    → JavaScript (CRUD, validações, Geolocation)
└── README.md    → Este ficheiro
```

---

## Como Usar

1. Abrir `index.html` no browser
2. Usar a aplicação normalmente

---

## Adicionar Biblioteca Externa

No ficheiro `index.html` (linhas 11-12), onde está o comentário:

```html
<!-- BIBLIOTECA EXTERNA: Para adicionar, incluir aqui -->
<!-- Exemplo: <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"> -->
```

Basta remover os comentários e adicionar o link da biblioteca desejada.