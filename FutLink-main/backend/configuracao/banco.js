const { Sequelize } = require('sequelize');

// COMO O BACKEND CONVERSA COM O MYSQL (Hostinger) A PARTIR DO RENDER
// O banco fica em outro servidor, na internet. Conexões remotas podem demorar para abrir ou ser
// derrubadas quando ficam paradas. Sem cuidado, a PRIMEIRA requisição depois de um tempo parado
// falha e a segunda funciona (a conexão nova já está aberta). Estas opções reduzem esse problema:
//  - connectTimeout: espera até 60s para abrir a conexão (o padrão do mysql2 é só 10s);
//  - enableKeepAlive: mantém a conexão "viva" na rede;
//  - pool: poucas conexões (bancos compartilhados limitam quantas cada usuário pode abrir) e
//    descarte das paradas ANTES de o servidor MySQL derrubá-las;
//  - retry: se a falha for de CONEXÃO, tenta de novo automaticamente (até 3 vezes) antes de dar erro.
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        connectTimeout: 60000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
    },
    pool: {
        max: 4,
        min: 0,
        acquire: 60000,
        idle: 20000,
        evict: 5000,
    },
    retry: {
        max: 3,
        match: [
            'SequelizeConnectionError',
            'SequelizeConnectionRefusedError',
            'SequelizeConnectionTimedOutError',
            'SequelizeHostNotFoundError',
            'SequelizeHostNotReachableError',
            'ETIMEDOUT',
            'ECONNRESET',
            'EPIPE',
            'PROTOCOL_CONNECTION_LOST',
        ],
    },
});
const conectarBanco = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL conectado com sucesso!');
        await sequelize.sync();
        console.log('✅ Tabelas sincronizadas!');
    }
    catch (erro) {
        console.error('❌ Erro ao conectar no MySQL:', erro.message);
        process.exit(1);
    }
};
module.exports = { sequelize, conectarBanco };
