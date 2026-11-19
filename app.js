let DATA;
let current = { type: 'home', id: null, index: 0 };
const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function hideSplash() {
  const splash = $('#splashScreen');
  if (!splash) return;
  splash.classList.add('is-hidden');
  window.setTimeout(() => splash.remove(), 500);
}

function init() {
  fetch('data.json')
    .then((response) => {
      if (!response.ok) throw new Error('Não foi possível carregar data.json');
      return response.json();
    })
    .then((data) => {
      DATA = data;
      renderHome();
      window.setTimeout(hideSplash, 900);
    })
    .catch((error) => {
      hideSplash();
      $('#main').innerHTML = `<section class="panel"><h1>Não foi possível abrir o conteúdo</h1><p>Abra esta pasta pelo VS Code usando a extensão Live Server. Evite abrir index.html diretamente pelo explorador de arquivos.</p><p>${esc(error.message)}</p></section>`;
    });
}

function renderHome() {
  current = { type: 'home', id: null, index: 0 };
  const presentation = DATA.presentation[0];
  const cover = DATA.app.coverImage
    ? `<img src="${esc(DATA.app.coverImage)}" alt="Capa Protocolos para Relações Saudáveis">`
    : '<div class="cover-placeholder">♡</div>';

  $('#main').innerHTML = `
    <section class="home-wrap">
      <div class="home-heading">
        <span class="eyebrow">${esc(DATA.app.subtitle)}</span>
        <h1>${esc(DATA.app.name)}</h1>
        <p>${esc(DATA.app.description)}</p>
      </div>
      <div class="home-cover">${cover}</div>
      <div class="menu-heading">
        <h2>Menu principal</h2>
        <p>Escolha um assunto para começar. O conteúdo será apresentado uma etapa por vez.</p>
      </div>
      <div class="central-menu">
        <button class="menu-option menu-option-featured" onclick="openPresentation(0)">
          <span class="option-number">01</span><span class="option-copy"><strong>Apresentação</strong><small>Conheça os conceitos e orientações iniciais</small></span><span class="option-arrow">›</span>
        </button>
        ${DATA.protocols.map((protocol, index) => `
          <button class="menu-option" onclick="openProtocol('${protocol.id}', 0)">
            <span class="option-number">${esc(protocol.number)}</span><span class="option-copy"><strong>${esc(protocol.title)}</strong><small>${esc(protocol.subtitle)} · ${protocol.steps.length} etapas</small></span><span class="option-arrow">›</span>
          </button>`).join('')}
        <button class="menu-option" onclick="openClosing()"><span class="option-number">08</span><span class="option-copy"><strong>Considerações finais</strong><small>Encerramento do material</small></span><span class="option-arrow">›</span></button>
        <button class="menu-option" onclick="openReferences()"><span class="option-number">09</span><span class="option-copy"><strong>Legislação e referências</strong><small>Consulte a base normativa citada</small></span><span class="option-arrow">›</span></button>
      </div>
      <p class="home-source">${esc(DATA.app.source)}</p>
    </section>`;
  updateHeader();
}

function updateHeader() {
  const button = $('#menuHome');
  if (button) button.classList.toggle('is-hidden', current.type === 'home');
}

function renderPresentation(index) {
  const item = DATA.presentation[index];
  const total = DATA.presentation.length;
  const percent = ((index + 1) / total) * 100;
  current = { type: 'presentation', id: item.id, index };
  $('#main').innerHTML = `
    <section class="reader-wrap">
      <div class="reader-kicker"><span>APRESENTAÇÃO</span><strong>${index + 1} de ${total}</strong></div>
      <div class="progress"><span style="width:${percent}%"></span></div>
      <article class="reader-card">
        <span class="pill">${esc(item.eyebrow)}</span>
        <h1>${esc(item.title)}</h1>
        <div class="content-block">${item.content.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div>
        <div class="source-note">Fonte no documento: página(s) ${esc(item.sourcePages)}.</div>
      </article>
      <div class="reader-actions">
        <button class="btn secondary" onclick="renderHome()">⌂ Menu inicial</button>
        <button class="btn secondary" ${index === 0 ? 'disabled' : ''} onclick="openPresentation(${index - 1})">← Voltar</button>
        <button class="btn primary" onclick="${index === total - 1 ? `openProtocol('${DATA.protocols[0].id}',0)` : `openPresentation(${index + 1})`}">${index === total - 1 ? 'Ir aos protocolos →' : 'Avançar →'}</button>
      </div>
    </section>`;
  updateHeader();
}

function openPresentation(index = 0) { renderPresentation(Math.max(0, Math.min(index, DATA.presentation.length - 1))); }

function openProtocol(id, index = 0) {
  const protocol = DATA.protocols.find((item) => item.id === id);
  if (!protocol) return;
  current = { type: 'protocol', id, index: Math.max(0, Math.min(index, protocol.steps.length - 1)) };
  renderStep();
}

function renderStep() {
  const protocol = DATA.protocols.find((item) => item.id === current.id);
  const index = current.index;
  const step = protocol.steps[index];
  const total = protocol.steps.length;
  const percent = ((index + 1) / total) * 100;
  const isLast = index === total - 1;

  $('#main').innerHTML = `
    <section class="reader-wrap">
      <div class="reader-kicker"><span>PROTOCOLO ${esc(protocol.number)} · ${esc(protocol.subtitle)}</span><strong>Etapa ${index + 1} de ${total}</strong></div>
      <div class="progress"><span style="width:${percent}%"></span></div>
      <article class="reader-card">
        <span class="pill">ETAPA ${String(index + 1).padStart(2, '0')}</span>
        <h1>${esc(step.title)}</h1>
        <div class="content-block"><p>${esc(step.description)}</p></div>
        <div class="info-grid">
          <section class="info-card"><h2>Como realizar</h2><ul>${step.how.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></section>
          <section class="info-card"><h2>Responsáveis</h2><p>${esc(step.responsible)}</p></section>
        </div>
        ${step.notes?.length ? `<div class="notes"><strong>Observações do documento</strong><ul>${step.notes.map((note) => `<li>${esc(note)}</li>`).join('')}</ul></div>` : ''}
        <div class="source-note">Fonte: quadro do protocolo, página(s) ${esc(protocol.sourcePages)}. Organização digital para consulta; consulte o documento oficial para o contexto integral.</div>
      </article>
      <div class="reader-actions">
        <button class="btn secondary" onclick="renderHome()">⌂ Menu inicial</button>
        <button class="btn secondary" ${index === 0 ? 'disabled' : ''} onclick="openProtocol('${protocol.id}', ${index - 1})">← Voltar</button>
        ${isLast
          ? `<button class="btn primary" onclick="${nextProtocolAction(protocol.id)}">Concluir protocolo ✓</button>`
          : `<button class="btn primary" onclick="openProtocol('${protocol.id}', ${index + 1})">Avançar →</button>`}
      </div>
    </section>`;
  updateHeader();
}

function nextProtocolAction(id) {
  const index = DATA.protocols.findIndex((protocol) => protocol.id === id);
  return index < DATA.protocols.length - 1
    ? `openProtocol('${DATA.protocols[index + 1].id}', 0)`
    : 'renderHome()';
}

function openClosing() {
  current = { type: 'closing', id: 'closing', index: 0 };
  $('#main').innerHTML = `<section class="reader-wrap"><div class="reader-kicker"><span>ENCERRAMENTO</span></div><article class="reader-card"><span class="pill">Considerações finais</span><h1>${esc(DATA.closing.title)}</h1><div class="content-block">${DATA.closing.content.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div><div class="source-note">Fonte: página ${esc(DATA.closing.sourcePages)} do documento.</div></article><div class="reader-actions"><button class="btn secondary" onclick="renderHome()">⌂ Menu inicial</button></div></section>`;
  updateHeader();
}

function openReferences() {
  current = { type: 'references', id: 'references', index: 0 };
  $('#main').innerHTML = `<section class="reader-wrap"><div class="reader-kicker"><span>BASE NORMATIVA CITADA</span></div><article class="reader-card"><span class="pill">Legislação e referências</span><h1>Legislação e referências</h1><div class="content-block"><ul>${DATA.legalReferences.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></div><div class="source-note">Lista resumida das referências apresentadas nas páginas 13 a 15. Consulte a publicação original para os dados bibliográficos completos.</div></article><div class="reader-actions"><button class="btn secondary" onclick="renderHome()">⌂ Menu inicial</button></div></section>`;
  updateHeader();
}

$('#menuHome').addEventListener('click', renderHome);
$('#brandHome').addEventListener('click', (event) => { event.preventDefault(); renderHome(); });
init();
