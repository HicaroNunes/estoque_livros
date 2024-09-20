document.addEventListener('DOMContentLoaded', function() {
    // Obtém os elementos do menu e das seções de conteúdo
    const menuAdicionar = document.getElementById('menuAdicionar');
    const menuSaida = document.getElementById('menuSaida');
    const menuListar = document.getElementById('menuListar');
    
    const adicionarLivro = document.getElementById('adicionarLivro');
    const saidaLivro = document.getElementById('saidaLivro');
    const listarLivros = document.getElementById('listarLivros');

    const contentSections = document.querySelectorAll('.content');
    // Função para ocultar todas as seções de conteúdo
    function hideAllSections() {
        contentSections.forEach(section => section.style.display = 'none');
    }
    // Função para exibir uma seção específica
    function showSection(section) {
        hideAllSections();
        section.style.display = 'block';
    }
    // Classe para lidar com as interações do menu
    class MenuHandler {
        constructor() {
            // Obtém os elementos do menu
            this.menuAdicionar = document.getElementById('menuAdicionar');
            this.menuSaida = document.getElementById('menuSaida');
            this.menuListar = document.getElementById('menuListar');
            // Adiciona event listeners para os itens do menu
            this.menuAdicionar.addEventListener('click', this.handleAdicionar.bind(this));
            this.menuSaida.addEventListener('click', this.handleSaida.bind(this));
            this.menuListar.addEventListener('click', this.handleListar.bind(this));
        }
        // Função para lidar com a opção de adicionar livro no menu
        handleAdicionar(event) {
            event.preventDefault();
            showSection(adicionarLivro);
        }
        // Função para lidar com a opção de saída de livros no menu
        handleSaida(event) {
            event.preventDefault();
            showSection(saidaLivro);
        }
        // Função para lidar com a opção de listar livros no menu
        handleListar(event) {
            event.preventDefault();
            showSection(listarLivros);
        }
    }
    // Cria uma instância da classe MenuHandler para lidar com as interações do menu
    const menuHandler = new MenuHandler();
    // Event listener para o formulário de adicionar livro
    document.getElementById('adicionarLivroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const quantidade = document.getElementById('quantidade').value;
        // Envia uma solicitação para adicionar um livro através de uma requisição fetch
        fetch('/livros/adicionar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, autor, quantidade })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            e.target.reset();
        });
    });
    // Event listener para o formulário de saída de livros
    document.getElementById('saidaLivroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('saidaId').value;
        const quantidadeSaida = document.getElementById('quantidadeSaida').value;
        // Envia uma solicitação para registrar a saída de livros através de uma requisição fetch
        fetch('/livros/saida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, quantidadeSaida })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            e.target.reset();
        });
    });
    // Event listener para o botão de listar livros
    document.getElementById('listarLivrosBtn').addEventListener('click', function() {
        fetch('/livros/listar')
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById('listaLivros');
            lista.innerHTML = '';

            // Adicionando cabeçalho da lista
            const cabecalho = document.createElement('li');
            cabecalho.innerHTML = '<span>ID</span><span>Título</span><span>Autor</span><span>Quantidade</span>';
            cabecalho.classList.add('excel-style');
            lista.appendChild(cabecalho);
            // Adiciona cada livro à lista
            data.forEach(livro => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${livro.id}</span><span>${livro.titulo}</span><span>${livro.autor}</span><span>${livro.quantidade}</span>`;
                li.classList.add('excel-style');
                lista.appendChild(li);
            });
        });
    });
// Event listener para a barra de pesquisa de livros
    document.getElementById('pesquisarLivro').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length > 0) {
             // Envia uma solicitação para pesquisar livros através de uma requisição fetch
            fetch('/livros/listar')
            .then(response => response.json())
            .then(data => {
                const resultadosPesquisa = document.getElementById('resultadosPesquisa');
                resultadosPesquisa.innerHTML = '';
                const filteredBooks = data.filter(livro => livro.titulo.toLowerCase().includes(query));
                filteredBooks.forEach(livro => {
                    const li = document.createElement('li');
                    li.textContent = `ID: ${livro.id}, Título: ${livro.titulo}, Autor: ${livro.autor}, Quantidade: ${livro.quantidade}`;
                    li.addEventListener('click', function() {
                        document.getElementById('saidaId').value = livro.id;
                        resultadosPesquisa.innerHTML = '';
                        document.getElementById('pesquisarLivro').value = '';
                    });
                    resultadosPesquisa.appendChild(li);
                });
            });
        } else {
            document.getElementById('resultadosPesquisa').innerHTML = '';
        }
    });

    // Inicialmente esconder todas as seções
    hideAllSections();
});
