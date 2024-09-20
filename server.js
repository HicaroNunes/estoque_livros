const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306 
  });

db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

app.post('/livros/adicionar', (req, res) => {
    const { titulo, autor, quantidade } = req.body;
    const sql = 'INSERT INTO livros (titulo, autor, quantidade) VALUES (?, ?, ?)';
    db.query(sql, [titulo, autor, quantidade], (err, result) => {
        if (err) return res.status(500).send('Erro no servidor.');
        res.send('Livro adicionado com sucesso!');
    });
});

app.post('/livros/saida', (req, res) => {
    const { id, quantidadeSaida } = req.body;
    const buscarSql = 'SELECT quantidade FROM livros WHERE id = ?';
    db.query(buscarSql, [id], (err, results) => {
        if (err) return res.status(500).send('Erro no servidor.');
        if (results.length === 0) return res.status(404).send('Livro não encontrado.');
        
        const quantidadeAtual = results[0].quantidade;
        if (quantidadeAtual < quantidadeSaida) {
            return res.status(400).send('Quantidade de saída maior do que a quantidade disponível.');
        }

        const novaQuantidade = quantidadeAtual - quantidadeSaida;
        const atualizarSql = 'UPDATE livros SET quantidade = ? WHERE id = ?';
        db.query(atualizarSql, [novaQuantidade, id], err => {
            if (err) return res.status(500).send('Erro ao atualizar a quantidade do livro.');
            res.send('Saída de livros registrada com sucesso.');
        });
    });
});

app.get('/livros/listar', (req, res) => {
    const sql = 'SELECT * FROM livros';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Erro no servidor.');
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
