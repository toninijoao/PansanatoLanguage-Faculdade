var CHAVE_ARMAZENAMENTO = 'pansanatoUsuarios';

var formulario = document.getElementById('formularioUsuario');
var campoNome = document.getElementById('campoNome');
var campoEmail = document.getElementById('campoEmail');
var campoPesquisa = document.getElementById('campoPesquisa');
var listaUsuarios = document.getElementById('lista-usuarios');
var botaoLimpar = document.getElementById('botaoLimpar');
var botaoExcluirTodos = document.getElementById('botaoExcluirTodos');
var contadorUsuarios = document.getElementById('contadorUsuarios');

document.addEventListener('DOMContentLoaded', function () {
  renderizarLista(obterUsuarios());
  atualizarContador();
});

function atualizarContador() {
  contadorUsuarios.textContent = '(' + obterUsuarios().length + ')';
}

function obterUsuarios() {
  var dadosSalvos = localStorage.getItem(CHAVE_ARMAZENAMENTO);

  if (!dadosSalvos) {
    return [];
  }

  var usuarios = JSON.parse(dadosSalvos);

  usuarios.forEach(function (usuario, indice) {
    if (usuario.id === undefined) {
      usuario.id = Date.now() + indice;
    }
  });

  return usuarios;
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(usuarios));
}

function renderizarLista(usuarios, mensagemVazia) {
  listaUsuarios.innerHTML = '';

  if (usuarios.length === 0) {
    var vazio = document.createElement('li');
    vazio.className = 'mensagem-vazia';
    vazio.textContent = mensagemVazia || 'Nenhum usuário cadastrado ainda.';
    listaUsuarios.appendChild(vazio);
    return;
  }

  usuarios.forEach(function (usuario) {
    var item = document.createElement('li');
    item.className = 'item-usuario';

    var info = document.createElement('div');
    info.className = 'item-usuario-info';

    var nome = document.createElement('strong');
    nome.textContent = usuario.nome;

    var email = document.createElement('span');
    email.textContent = usuario.email;

    var data = document.createElement('span');
    data.className = 'item-usuario-data';
    data.textContent = 'Cadastrado em ' + usuario.data;

    info.appendChild(nome);
    info.appendChild(email);
    info.appendChild(data);

    var botaoExcluir = document.createElement('button');
    botaoExcluir.type = 'button';
    botaoExcluir.className = 'botao-excluir-item';
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.addEventListener('click', function () {
      excluirUsuario(usuario);
    });

    item.appendChild(info);
    item.appendChild(botaoExcluir);
    listaUsuarios.appendChild(item);
  });
}

function cadastrarUsuario(evento) {
  evento.preventDefault();

  var nome = campoNome.value.trim();
  var email = campoEmail.value.trim();

  if (nome === '' || email === '') {
    alert('Preencha o nome e o e-mail antes de cadastrar.');
    return;
  }

  var novoUsuario = {
    id: Date.now(),
    nome: nome,
    email: email,
    data: new Date().toLocaleString('pt-BR')
  };

  var usuarios = obterUsuarios();
  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  renderizarLista(usuarios);
  atualizarContador();
  limparCampos();
}

function excluirUsuario(usuarioAlvo) {
  var confirmar = confirm('Deseja excluir o usuário "' + usuarioAlvo.nome + '"?');
  if (!confirmar) {
    return;
  }

  var usuarios = obterUsuarios().filter(function (usuario) {
    return usuario.id !== usuarioAlvo.id;
  });

  salvarUsuarios(usuarios);
  pesquisarUsuarios();
  atualizarContador();
}

function excluirTodosUsuarios() {
  var usuarios = obterUsuarios();

  if (usuarios.length === 0) {
    return;
  }

  var confirmar = confirm('Tem certeza que deseja excluir TODOS os usuários cadastrados?');
  if (!confirmar) {
    return;
  }

  localStorage.removeItem(CHAVE_ARMAZENAMENTO);
  renderizarLista([]);
  atualizarContador();
}

function limparCampos() {
  formulario.reset();
  campoNome.focus();
}

function pesquisarUsuarios() {
  var termo = campoPesquisa.value.trim().toLowerCase();
  var usuarios = obterUsuarios();

  if (termo === '') {
    renderizarLista(usuarios);
    return;
  }

  var filtrados = usuarios.filter(function (usuario) {
    return usuario.nome.toLowerCase().indexOf(termo) !== -1 ||
           usuario.email.toLowerCase().indexOf(termo) !== -1;
  });

  renderizarLista(filtrados, 'Nenhum usuário encontrado para "' + campoPesquisa.value.trim() + '".');
}

formulario.addEventListener('submit', cadastrarUsuario);
botaoLimpar.addEventListener('click', limparCampos);
botaoExcluirTodos.addEventListener('click', excluirTodosUsuarios);
campoPesquisa.addEventListener('input', pesquisarUsuarios);