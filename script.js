/* ==========================================================
   0. PREPARAÇÃO
   Adiciona a classe "js" na tag <html>. O CSS usa essa classe
   para esconder as seções (".js .secao { display: none }").
   Se o JavaScript falhar, a classe não existe e a página
   continua mostrando todo o conteúdo.
   ========================================================== */
document.documentElement.classList.add("js");

/* ==========================================================
   1. TEMA CLARO / ESCURO
   - O tema escolhido é salvo no localStorage (memória do navegador),
     então continua o mesmo quando a pessoa volta ao site.
   - Se ainda não houver escolha, usamos a preferência do sistema.
   ========================================================== */
const html = document.documentElement;
const btnTema = document.getElementById("btn-tema");

/* Aplica um tema ("claro" ou "escuro") na página */
function aplicarTema(tema) {
  if (tema === "escuro") {
    html.setAttribute("data-tema", "escuro");   // ativa as variáveis do tema escuro no CSS
    btnTema.textContent = "☀️";                  // no escuro, o botão oferece o sol
    btnTema.setAttribute("aria-label", "Mudar para tema claro");
  } else {
    html.removeAttribute("data-tema");           // volta às variáveis do tema claro
    btnTema.textContent = "🌙";
    btnTema.setAttribute("aria-label", "Mudar para tema escuro");
  }
}

/* Descobre qual tema usar ao carregar a página */
function temaInicial() {
  // try/catch: alguns navegadores bloqueiam o localStorage em certas situações
  try {
    const salvo = localStorage.getItem("tema");
    if (salvo === "claro" || salvo === "escuro") return salvo;
  } catch (erro) {
    // se não der para ler, segue para a preferência do sistema
  }
  const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return sistemaEscuro ? "escuro" : "claro";
}

aplicarTema(temaInicial());

/* Ao clicar no botão, alterna o tema e salva a escolha */
btnTema.addEventListener("click", function () {
  const novoTema = html.getAttribute("data-tema") === "escuro" ? "claro" : "escuro";
  aplicarTema(novoTema);
  try {
    localStorage.setItem("tema", novoTema);
  } catch (erro) {
    // sem problema: o tema só não será lembrado na próxima visita
  }
});

/* ==========================================================
   2. MENU RESPONSIVO (HAMBÚRGUER)
   No celular, o botão ☰ abre e fecha a lista de links
   adicionando/removendo a classe "aberto" (definida no CSS).
   ========================================================== */
const btnMenu = document.getElementById("btn-menu");
const listaMenu = document.getElementById("lista-menu");

function abrirMenu() {
  listaMenu.classList.add("aberto");
  btnMenu.setAttribute("aria-expanded", "true");   // informa leitores de tela
  btnMenu.setAttribute("aria-label", "Fechar menu");
  btnMenu.textContent = "✕";
}

function fecharMenu() {
  listaMenu.classList.remove("aberto");
  btnMenu.setAttribute("aria-expanded", "false");
  btnMenu.setAttribute("aria-label", "Abrir menu");
  btnMenu.textContent = "☰";
}

btnMenu.addEventListener("click", function () {
  // Se já está aberto, fecha; se não, abre
  if (listaMenu.classList.contains("aberto")) {
    fecharMenu();
  } else {
    abrirMenu();
  }
});

/* Tecla Esc fecha o menu (boa prática de acessibilidade) */
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    fecharMenu();
  }
});

/* Se a janela for aumentada para o tamanho de computador,
   o menu volta ao estado normal (fechado) para não ficar "preso" */
window.addEventListener("resize", function () {
  if (window.innerWidth >= 768) {
    fecharMenu();
  }
});

/* ==========================================================
   3. NAVEGAÇÃO ENTRE SEÇÕES (mostrar/esconder)
   A URL guarda a seção atual (ex.: index.html#formacao).
   Sempre que o "#" muda, mostramos só a seção correspondente.
   Assim o botão "voltar" do navegador e os links
   compartilháveis continuam funcionando.
   ========================================================== */
const secoes = document.querySelectorAll(".secao");
const linksMenu = document.querySelectorAll(".lista-menu a");
const SECAO_PADRAO = "sobre";   // seção exibida quando não há "#" na URL

function mostrarSecao() {
  // Pega o texto depois do "#" (ex.: "#formacao" vira "formacao")
  let idAtual = window.location.hash.replace("#", "");

  // Se o "#" não corresponder a nenhuma seção, usa a padrão
  const existe = Array.from(secoes).some(function (secao) {
    return secao.id === idAtual;
  });
  if (!existe) {
    idAtual = SECAO_PADRAO;
  }

  // Mostra apenas a seção atual: "ativa" aparece, as demais ficam escondidas
  secoes.forEach(function (secao) {
    secao.classList.toggle("ativa", secao.id === idAtual);
  });

  // Destaca no menu o link da seção atual
  linksMenu.forEach(function (link) {
    const ehAtual = link.getAttribute("href") === "#" + idAtual;
    link.classList.toggle("ativo", ehAtual);
    if (ehAtual) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  // Volta ao topo da página e fecha o menu mobile
  window.scrollTo(0, 0);
  fecharMenu();
}

// Roda ao carregar a página e toda vez que o "#" da URL mudar
window.addEventListener("hashchange", mostrarSecao);
mostrarSecao();

/* ==========================================================
   4. FORMULÁRIO DE CONTATO (validação + envio simulado)
   ========================================================== */
const form = document.getElementById("form-contato");
con