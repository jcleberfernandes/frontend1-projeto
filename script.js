// Versão simples do script para iniciantes
// Todas as páginas (index.html e admin.html) usam este ficheiro.

var STORAGE_KEY = 'medicamentos';

// Lê os medicamentos do localStorage
function carregarMedicamentos() {
  var raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Guarda a lista no localStorage
function gravarMedicamentos(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Desenha a lista simples na página index.html
function mostrarLista() {
  var lista = carregarMedicamentos();
  var container = document.getElementById('lista-medicamentos');
  if (!container) return; // só em index.html

  if (lista.length === 0) {
    container.innerHTML = '<p class="empty">Nenhum medicamento adicionado.</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < lista.length; i++) {
    var m = lista[i];
    html += '<div class="card">';
    html += '<h3>' + escapeHtml(m.nome) + '</h3>';
    if (m.principio) html += '<div class="sub">' + escapeHtml(m.principio) + '</div>';
    if (m.categoria) html += '<div class="small">Categoria: ' + escapeHtml(m.categoria) + '</div>';
    if (m.stock !== undefined) html += '<div class="small">Stock: ' + (m.stock) + '</div>';
    if (m.preco) html += '<div class="small">Preço: €' + Number(m.preco).toFixed(2) + '</div>';
    html += '<div class="actions"><button onclick="apagarMedicamento(\'' + m.id + '\')">Apagar</button></div>';
    html += '</div>';
  }
  container.innerHTML = html;
}

// Função do admin.html: adiciona um medicamento simples
function iniciarAdmin() {
  var form = document.getElementById('admin-form');
  if (!form) return;

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var nome = document.getElementById('nome').value.trim();
    var principio = document.getElementById('principio').value.trim();
    var categoria = document.getElementById('categoria').value.trim();
    var stock = parseInt(document.getElementById('stock').value, 10) || 0;
    var preco = parseFloat(document.getElementById('preco').value) || 0;
    var validade = document.getElementById('validade').value;

    if (nome.length < 1) {
      showAdminMsg('Nome obrigatório');
      return;
    }
    
    // Validação simples adicional
    if (preco && preco < 0.01) {
      showAdminMsg('Preço inválido (mínimo 0.01)');
      return;
    }

    var lista = carregarMedicamentos();
    var novo = {
      id: 'm' + Date.now(),
      nome: nome,
      principio: principio,
      categoria: categoria,
      stock: stock,
      preco: preco,
      validade: validade
    };
    lista.push(novo);
    gravarMedicamentos(lista);

    form.reset();
    showAdminMsg('Medicamento adicionado com sucesso.');
  });
}

function showAdminMsg(text) {
  var el = document.getElementById('admin-msg');
  if (!el) return;
  el.textContent = text;
  setTimeout(function () { el.textContent = ''; }, 3000);
}

// Apagar medicamento por id
function apagarMedicamento(id) {
  var lista = carregarMedicamentos();
  lista = lista.filter(function (m) { return m.id !== id; });
  gravarMedicamentos(lista);
  mostrarLista();
}

// Pequena função para evitar XSS ao inserir texto
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>\"']/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
  });
}

// Início: detecta a página e inicializa funções apropriadas
window.onload = function () {
  // index.html
  if (document.getElementById('lista-medicamentos')) {
    document.getElementById('btn-refresh')?.addEventListener('click', mostrarLista);
    document.getElementById('search-input')?.addEventListener('input', function (e) {
      // pesquisa simples por nome
      var q = e.target.value.toLowerCase();
      var todos = carregarMedicamentos();
      var filtrados = todos.filter(function (m) { return m.nome.toLowerCase().indexOf(q) !== -1; });
      var container = document.getElementById('lista-medicamentos');
      if (!container) return;
      if (filtrados.length === 0) { container.innerHTML = '<p class="empty">Nenhum resultado</p>'; return; }
      var html = '';
      for (var i = 0; i < filtrados.length; i++) {
        var m = filtrados[i];
        html += '<div class="card">';
        html += '<h3>' + escapeHtml(m.nome) + '</h3>';
        if (m.principio) html += '<div class="sub">' + escapeHtml(m.principio) + '</div>';
        html += '<div class="actions"><button onclick="apagarMedicamento(\'' + m.id + '\')">Apagar</button></div>';
        html += '</div>';
      }
      container.innerHTML = html;
    });
    mostrarLista();
  }

  // admin.html
  if (document.getElementById('admin-form')) {
    requireAdmin();
    iniciarAdmin();
  }
};

// ----------------------
// Autenticação simples
// ----------------------
var ADMIN_USER = 'admin';
var ADMIN_PASS = '1234';

function attemptLogin(user, pass) {
  // credenciais simples e explícitas (exemplo para iniciantes)
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

function loginSubmit(ev) {
  if (ev && ev.preventDefault) ev.preventDefault();
  var user = document.getElementById('login-user')?.value || '';
  var pass = document.getElementById('login-pass')?.value || '';
  if (attemptLogin(user, pass)) {
    sessionStorage.setItem('isAdmin', '1');
    // redireciona para o admin
    window.location.href = 'admin.html';
  } else {
    var msg = document.getElementById('login-msg');
    if (msg) msg.textContent = 'Credenciais inválidas';
  }
}

function requireAdmin() {
  if (sessionStorage.getItem('isAdmin') !== '1') {
    window.location.href = 'login.html';
  }
}

function logout() {
  sessionStorage.removeItem('isAdmin');
  window.location.href = 'index.html';
}