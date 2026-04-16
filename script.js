// ============================================
// JavaScript - FarmaciaFernandes
// ============================================

// --- DADOS ---
const CATEGORIAS = [
  'Analgésico',
  'Antibiótico',
  'Anti-inflamatório',
  'Vitamina/Suplemento',
  'Cardiovascular',
  'Dermatológico',
  'Digestivo',
  'Respiratório',
  'Outro'
];

// Dados guardados no localStorage (MOCK API)
let medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];

// Variáveis de estado
let editId = null;
let deleteId = null;
let localizacao = null;


// --- INICIALIZAÇÃO ---
window.onload = () => {
  popularCategorias();
  renderizarLista();
};


// --- POPULAR SELECTS ---
function popularCategorias() {
  const select = document.getElementById('categoria-select');
  const options = CATEGORIAS.map(c => `<option value="${c}">${c}</option>`).join('');
  select.innerHTML = `<option value="">Todas as categorias</option>${options}`;
  
  // Também no formulário
  const selectForm = document.getElementById('categoria');
  if (selectForm) {
    selectForm.innerHTML = `<option value="">Selecione</option>${options}`;
  }
}


// --- NAVEGAÇÃO ---
function showPage(page) {
  document.getElementById('page-home').classList.toggle('hidden', page !== 'home');
  document.getElementById('page-form').classList.toggle('hidden', page !== 'new' && page !== 'edit');

  if (page === 'new') {
    editId = null;
    localizacao = null;
    document.getElementById('form-title').textContent = 'Novo Medicamento';
    document.getElementById('btn-salvar').textContent = 'Criar';
    document.getElementById('medicamento-form').reset();
    document.getElementById('location-display').classList.add('hidden');
    document.getElementById('btn-gps').textContent = '📍 Captar Localização';
    limparErros();
  }
}


// --- READ (Listar todos) ---
function renderizarLista() {
  const container = document.getElementById('lista-medicamentos');

  if (medicamentos.length === 0) {
    container.innerHTML = '<div class="empty">Nenhum medicamento encontrado</div>';
    return;
  }

  container.innerHTML = '<div class="grid">' + medicamentos.map(m => `
    <div class="card">
      <h3>${m.nome}</h3>
      <div class="sub">${m.principioAtivo}</div>
      <div class="row"><span class="label">Categoria:</span><span>${m.categoria}</span></div>
      <div class="row"><span class="label">Stock:</span><span>${m.stock} un.</span></div>
      <div class="row"><span class="label">Preço:</span><span>€${Number(m.preco).toFixed(2)}</span></div>
      <div class="row"><span class="label">Validade:</span><span>${m.dataValidade}</span></div>
      ${m.localizacao ? `<div style="font-size:0.8rem;color:#666;margin:0.5rem 0">📍 ${m.localizacao.latitude.toFixed(4)}, ${m.localizacao.longitude.toFixed(4)}</div>` : ''}
      <div style="margin:0.5rem 0">
        <span class="badge ${m.estado === 'disponivel' ? 'badge-success' : m.estado === 'esgotado' ? 'badge-warning' : 'badge-gray'}">
          ${m.estado === 'disponivel' ? 'Disponível' : m.estado === 'esgotado' ? 'Esgotado' : 'Descontinuado'}
        </span>
      </div>
      <div class="actions">
        <button class="btn btn-outline" onclick="editarMedicamento('${m.id}')">Editar</button>
        <button class="btn btn-danger" onclick="mostrarDelete('${m.id}', '${m.nome}')">Apagar</button>
      </div>
    </div>
  `).join('') + '</div>';
}


// --- FILTRO/SEARCH ---
function filterMedicamentos() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const cat = document.getElementById('categoria-select').value;

  const filtrados = medicamentos.filter(m => {
    const matchSearch = !search || m.nome.toLowerCase().includes(search) || m.principioAtivo.toLowerCase().includes(search);
    const matchCat = !cat || m.categoria === cat;
    return matchSearch && matchCat;
  });

  const container = document.getElementById('lista-medicamentos');

  if (filtrados.length === 0) {
    container.innerHTML = '<div class="empty">Nenhum medicamento encontrado</div>';
    return;
  }

  container.innerHTML = '<div class="grid">' + filtrados.map(m => `
    <div class="card">
      <h3>${m.nome}</h3>
      <div class="sub">${m.principioAtivo}</div>
      <div class="row"><span class="label">Categoria:</span><span>${m.categoria}</span></div>
      <div class="row"><span class="label">Stock:</span><span>${m.stock} un.</span></div>
      <div class="row"><span class="label">Preço:</span><span>€${Number(m.preco).toFixed(2)}</span></div>
      <div class="row"><span class="label">Validade:</span><span>${m.dataValidade}</span></div>
      ${m.localizacao ? `<div style="font-size:0.8rem;color:#666;margin:0.5rem 0">📍 ${m.localizacao.latitude.toFixed(4)}, ${m.localizacao.longitude.toFixed(4)}</div>` : ''}
      <div style="margin:0.5rem 0">
        <span class="badge ${m.estado === 'disponivel' ? 'badge-success' : m.estado === 'esgotado' ? 'badge-warning' : 'badge-gray'}">
          ${m.estado === 'disponivel' ? 'Disponível' : m.estado === 'esgotado' ? 'Esgotado' : 'Descontinuado'}
        </span>
      </div>
      <div class="actions">
        <button class="btn btn-outline" onclick="editarMedicamento('${m.id}')">Editar</button>
        <button class="btn btn-danger" onclick="mostrarDelete('${m.id}', '${m.nome}')">Apagar</button>
      </div>
    </div>
  `).join('') + '</div>';
}


// --- UPDATE (Editar) ---
function editarMedicamento(id) {
  const m = medicamentos.find(m => m.id === id);
  if (!m) return;

  editId = id;
  localizacao = m.localizacao || null;

  // Preencher formulário
  document.getElementById('nome').value = m.nome;
  document.getElementById('principioAtivo').value = m.principioAtivo;
  document.getElementById('categoria').value = m.categoria;
  document.getElementById('stock').value = m.stock;
  document.getElementById('preco').value = m.preco;
  document.getElementById('dataValidade').value = m.dataValidade;
  document.getElementById('estado').value = m.estado;

  // Mostrar localização se existir
  if (localizacao) {
    document.getElementById('location-display').innerHTML = `Localização: ${localizacao.latitude.toFixed(4)}, ${localizacao.longitude.toFixed(4)} <button type="button" style="margin-left:0.5rem;border:none;background:none;color:#065f46;text-decoration:underline" onclick="removerLocalizacao()">Remover</button>`;
    document.getElementById('location-display').classList.remove('hidden');
    document.getElementById('btn-gps').textContent = '✓ Captada';
  }

  document.getElementById('form-title').textContent = 'Editar Medicamento';
  document.getElementById('btn-salvar').textContent = 'Guardar';
  showPage('edit');
}


// --- CREATE / UPDATE (Salvar) ---
function salvarMedicamento(e) {
  e.preventDefault();
  limparErros();

  const data = {
    nome: document.getElementById('nome').value,
    principioAtivo: document.getElementById('principioAtivo').value,
    categoria: document.getElementById('categoria').value,
    stock: parseInt(document.getElementById('stock').value),
    preco: parseFloat(document.getElementById('preco').value),
    dataValidade: document.getElementById('dataValidade').value,
    estado: document.getElementById('estado').value,
    localizacao: localizacao
  };

  // Validação
  let valid = true;

  if (data.nome.length < 3) {
    document.getElementById('error-nome').textContent = 'Mínimo 3 caracteres';
    valid = false;
  }

  if (data.principioAtivo.length < 3) {
    document.getElementById('error-principioAtivo').textContent = 'Mínimo 3 caracteres';
    valid = false;
  }

  if (!data.categoria) {
    document.getElementById('error-categoria').textContent = 'Selecione uma categoria';
    valid = false;
  }

  if (data.stock < 0 || !Number.isInteger(data.stock)) {
    document.getElementById('error-stock').textContent = 'Stock deve ser inteiro >= 0';
    valid = false;
  }

  if (data.preco < 0.01) {
    document.getElementById('error-preco').textContent = 'Preço deve ser >= 0.01';
    valid = false;
  }

  if (new Date(data.dataValidade) <= new Date()) {
    document.getElementById('error-dataValidade').textContent = 'Data deve ser futura';
    valid = false;
  }

  if (!valid) return;

  // Salvar (Create ou Update)
  if (editId) {
    const idx = medicamentos.findIndex(m => m.id === editId);
    if (idx !== -1) {
      medicamentos[idx] = { ...medicamentos[idx], ...data, updatedAt: new Date().toISOString() };
    }
  } else {
    const now = new Date().toISOString();
    medicamentos.push({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    });
  }

  // Guardar no localStorage (MOCK API)
  localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

  renderizarLista();
  showPage('home');
}


// --- DELETE (Eliminar) ---
function mostrarDelete(id, nome) {
  deleteId = id;
  document.getElementById('delete-nome').textContent = nome;
  document.getElementById('modal-delete').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-delete').classList.add('hidden');
  deleteId = null;
}

function confirmarDelete() {
  if (deleteId) {
    medicamentos = medicamentos.filter(m => m.id !== deleteId);
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    renderizarLista();
  }
  closeModal();
}


// --- GEOLOCATION API (Nativa JavaScript) ---
function capturarLocalizacao() {
  if (!navigator.geolocation) {
    document.getElementById('error-gps').textContent = 'Geolocalização não suportada';
    return;
  }

  document.getElementById('btn-gps').textContent = 'A capturar...';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      localizacao = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: new Date().toISOString()
      };

      document.getElementById('location-display').innerHTML = `Localização: ${localizacao.latitude.toFixed(4)}, ${localizacao.longitude.toFixed(4)} <button type="button" style="margin-left:0.5rem;border:none;background:none;color:#065f46;text-decoration:underline" onclick="removerLocalizacao()">Remover</button>`;
      document.getElementById('location-display').classList.remove('hidden');
      document.getElementById('btn-gps').textContent = '✓ Captada';
    },
    (err) => {
      document.getElementById('error-gps').textContent = err.message;
      document.getElementById('btn-gps').textContent = '📍 Captar Localização';
    }
  );
}

function removerLocalizacao() {
  localizacao = null;
  document.getElementById('location-display').classList.add('hidden');
  document.getElementById('btn-gps').textContent = '📍 Captar Localização';
}


// --- UTILITÁRIOS ---
function limparErros() {
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
}