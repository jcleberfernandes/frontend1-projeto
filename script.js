// Versão simples do script para iniciantes
// Todas as páginas (index.html e admin.html) usam este ficheiro.

var STORAGE_KEY = 'medicamentos';
var medicamentoEmEdicao = null;

// =====================
// API Simulada
// =====================
function simularAPISalvar(medicamento) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      console.log('API: Medicamento salvo', medicamento);
      resolve({ success: true, data: medicamento });
    }, 300);
  });
}

function simularAPICarregar() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      var lista = carregarMedicamentos();
      console.log('API: Medicamentos carregados', lista);
      resolve({ success: true, data: lista });
    }, 200);
  });
}

function simularAPIDeletar(id) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      console.log('API: Medicamento deletado', id);
      resolve({ success: true });
    }, 300);
  });
}

// =====================
// Geolocalização
// =====================
function pedirLocalizacao() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var lat = position.coords.latitude.toFixed(4);
        var lng = position.coords.longitude.toFixed(4);
        var locEl = document.getElementById('localizacao-atual');
        if (locEl) {
          locEl.textContent = 'Localização: ' + lat + ', ' + lng;
        }
        var locAdmin = document.getElementById('localizacao-admin');
        if (locAdmin) {
          locAdmin.textContent = 'Localização: ' + lat + ', ' + lng;
        }
        console.log('Localização obtida:', lat, lng);
      },
      function(error) {
        console.log('Geolocalização não disponível');
      },
      { timeout: 3000 } // Timeout de 3 segundos para não travar
    );
  }
}

// =====================
// Data e Hora
// =====================
function mostrarData() {
  var hoje = new Date();
  var dia = String(hoje.getDate()).padStart(2, '0');
  var mes = String(hoje.getMonth() + 1).padStart(2, '0');
  var ano = hoje.getFullYear();
  var dataFormatada = 'Hoje é ' + dia + '/' + mes + '/' + ano;
  
  var elIndex = document.getElementById('data-atual');
  if (elIndex) elIndex.textContent = dataFormatada;
  
  var elAdmin = document.getElementById('data-admin');
  if (elAdmin) elAdmin.textContent = dataFormatada;
}

// =====================
// LocalStorage CRUD
// =====================
function carregarMedicamentos() {
  var raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function gravarMedicamentos(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// =====================
// Lista (Leitura)
// =====================
function isAdminLogged() {
  return sessionStorage.getItem('isAdmin') === '1';
}

function renderMedicamentoCard(m) {
  var categoria = m.categoria ? escapeHtml(m.categoria) : 'Sem categoria';
  var principio = m.principio ? escapeHtml(m.principio) : 'Sem princípio ativo informado';
  var stock = m.stock !== undefined ? m.stock : 0;
  var preco = m.preco ? Number(m.preco).toFixed(2) : '0.00';
  var validade = m.validade ? escapeHtml(m.validade) : 'Sem validade';
  var inicial = m.nome ? escapeHtml(m.nome.charAt(0).toUpperCase()) : 'M';

  var html = '';
  html += '<article class="med-card">';
  html += '<div class="med-card__top">';
  html += '<div class="med-card__avatar">' + inicial + '</div>';
  html += '<div class="med-card__title">';
  html += '<h3>' + escapeHtml(m.nome) + '</h3>';
  html += '<p>' + principio + '</p>';
  html += '</div>';
  html += '</div>';
  html += '<div class="med-card__meta">';
  html += '<span class="med-badge">' + categoria + '</span>';
  html += '<span class="med-badge med-badge--soft">Stock: ' + stock + '</span>';
  html += '<span class="med-badge med-badge--soft">€' + preco + '</span>';
  html += '</div>';
  html += '<div class="med-card__footer">';
  html += '<span class="med-validade">Validade: ' + validade + '</span>';
  html += '<div class="actions">';
  if (isAdminLogged()) {
    html += '<button onclick="apagarMedicamento(\'' + m.id + '\')" class="btn btn-danger btn-sm" style="margin-right:0.5rem">Apagar</button>';
    html += '<button onclick="irEditarMedicamento(\'' + m.id + '\')" class="btn btn-info btn-sm">Editar</button>';
  }
  html += '</div>';
  html += '</div>';
  html += '</article>';
  return html;
}

function mostrarLista() {
  simularAPICarregar().then(function(response) {
    var lista = response.data;
    var container = document.getElementById('lista-medicamentos');
    if (!container) return;

    if (lista.length === 0) {
      container.innerHTML = '<p class="empty">Nenhum medicamento adicionado.</p>';
      return;
    }

    var html = '';
    for (var i = 0; i < lista.length; i++) {
      html += renderMedicamentoCard(lista[i]);
    }
    container.innerHTML = html;
  });
}

// =====================
// Criar/Atualizar Medicamento
// =====================
function iniciarAdmin() {
  var form = document.getElementById('admin-form');
  if (!form) return;

  var btnSubmit = document.getElementById('btn-submit');
  var btnCancelar = document.getElementById('btn-cancelar');

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
    
    if (preco && preco < 0.01) {
      showAdminMsg('Preço inválido (mínimo 0.01)');
      return;
    }

    var lista = carregarMedicamentos();
    var medicamento;
    
    if (medicamentoEmEdicao) {
      var idx = lista.findIndex(function (m) { return m.id === medicamentoEmEdicao; });
      if (idx !== -1) {
        lista[idx].nome = nome;
        lista[idx].principio = principio;
        lista[idx].categoria = categoria;
        lista[idx].stock = stock;
        lista[idx].preco = preco;
        lista[idx].validade = validade;
        medicamento = lista[idx];
      }
      simularAPISalvar(medicamento).then(function() {
        showAdminMsg('Medicamento atualizado com sucesso.');
      });
    } else {
      medicamento = {
        id: 'm' + Date.now(),
        nome: nome,
        principio: principio,
        categoria: categoria,
        stock: stock,
        preco: preco,
        validade: validade
      };
      lista.push(medicamento);
      simularAPISalvar(medicamento).then(function() {
        showAdminMsg('Medicamento adicionado com sucesso.');
      });
    }
    
    gravarMedicamentos(lista);
    form.reset();
    medicamentoEmEdicao = null;
    if (btnSubmit) btnSubmit.textContent = 'Adicionar';
    if (btnCancelar) btnCancelar.style.display = 'none';
  });

  if (btnCancelar) {
    btnCancelar.addEventListener('click', function () {
      form.reset();
      medicamentoEmEdicao = null;
      if (btnSubmit) btnSubmit.textContent = 'Adicionar';
      btnCancelar.style.display = 'none';
      showAdminMsg('Edição cancelada.');
    });
  }
  
  var idParaEditar = sessionStorage.getItem('medicamentoParaEditar');
  if (idParaEditar) {
    sessionStorage.removeItem('medicamentoParaEditar');
    var lista = carregarMedicamentos();
    var med = lista.find(function (m) { return m.id === idParaEditar; });
    if (med) {
      document.getElementById('nome').value = med.nome || '';
      document.getElementById('principio').value = med.principio || '';
      document.getElementById('categoria').value = med.categoria || '';
      document.getElementById('stock').value = med.stock || 0;
      document.getElementById('preco').value = med.preco || 0;
      document.getElementById('validade').value = med.validade || '';

      medicamentoEmEdicao = idParaEditar;
      if (btnSubmit) btnSubmit.textContent = 'Guardar Alterações';
      if (btnCancelar) btnCancelar.style.display = 'inline-block';
    }
  }
}

function showAdminMsg(text) {
  var el = document.getElementById('admin-msg');
  if (!el) return;
  el.textContent = text;
  el.className = 'admin-message success';
  setTimeout(function () { 
    el.textContent = '';
    el.className = 'admin-message';
  }, 3000);
}

// =====================
// Editar Medicamento
// =====================
function irEditarMedicamento(id) {
  sessionStorage.setItem('medicamentoParaEditar', id);
  window.location.href = 'admin.html';
}

// =====================
// Deletar Medicamento
// =====================
function apagarMedicamento(id) {
  if (!isAdminLogged()) {
    window.location.href = 'login.html';
    return;
  }

  if (confirm('Tem a certeza que deseja apagar este medicamento?')) {
    simularAPIDeletar(id).then(function() {
      var lista = carregarMedicamentos();
      lista = lista.filter(function (m) { return m.id !== id; });
      gravarMedicamentos(lista);
      mostrarLista();
    });
  }
}

// =====================
// Helpers
// =====================
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>\"']/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
  });
}

// =====================
// Inicialização
// =====================
window.onload = function () {
  updateNavigation();
  mostrarData();
  
  // Geolocalização removida do carregamento automático (melhoria Best Practices)
  // O utilizador pode clicar no botão para ver a sua localização
  
  if (document.getElementById('lista-medicamentos')) {
    document.getElementById('btn-refresh')?.addEventListener('click', mostrarLista);
    document.getElementById('search-input')?.addEventListener('input', function (e) {
      var q = e.target.value.toLowerCase();
      var todos = carregarMedicamentos();
      var filtrados = todos.filter(function (m) { return m.nome.toLowerCase().indexOf(q) !== -1; });
      var container = document.getElementById('lista-medicamentos');
      if (!container) return;
      if (filtrados.length === 0) { container.innerHTML = '<p class="empty">Nenhum resultado</p>'; return; }
      var html = '';
      for (var i = 0; i < filtrados.length; i++) {
        html += renderMedicamentoCard(filtrados[i]);
      }
      container.innerHTML = html;
    });
    mostrarLista();
  }

  if (document.getElementById('admin-form')) {
    requireAdmin();
    iniciarAdmin();
  }
};

// =====================
// Autenticação
// =====================
var ADMIN_USER = 'admin';
var ADMIN_PASS = '1234';

function attemptLogin(user, pass) {
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

function loginSubmit(ev) {
  if (ev && ev.preventDefault) ev.preventDefault();
  var user = document.getElementById('login-user')?.value || '';
  var pass = document.getElementById('login-pass')?.value || '';
  var msg = document.getElementById('login-msg');
  
  if (attemptLogin(user, pass)) {
    sessionStorage.setItem('isAdmin', '1');
    if (msg) msg.style.display = 'none';
    window.location.href = 'admin.html';
  } else {
    if (msg) {
      msg.style.display = 'block';
      msg.textContent = 'Credenciais inválidas. Tente admin / 1234';
    }
  }
}

function requireAdmin() {
  if (sessionStorage.getItem('isAdmin') !== '1') {
    window.location.href = 'login.html';
  }
}

function logout() {
  sessionStorage.removeItem('isAdmin');
  updateNavigation();
  window.location.href = 'index.html';
}

function updateNavigation() {
  // Esta função só executa em index.html onde existe o elemento header-button
  var headerBtn = document.getElementById('header-button');
  if (!headerBtn) return; // Retorna silenciosamente se não em página home
  
  if (isAdminLogged()) {
    headerBtn.innerHTML = '<button class="btn btn-danger" onclick="logout()">Sair</button>';
  } else {
    headerBtn.innerHTML = '<a class="btn btn-primary" href="login.html">Login</a>';
  }
}
