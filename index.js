const qrcode = require('qrcode-terminal');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const https = require('https');
const { Client, LocalAuth } = require('whatsapp-web.js');
// import QRCode from 'qrcode';
const fs = require('fs');
const path = require('path');
const client = new Client({
    puppeteer: {
        headless: false,
    },
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log('QR RECEIVED', qr);
    // qrcode.generate(qr, { small: true }, (qrcode) => {
    //     console.log('qrcode', qrcode);
    // });

    // const qrcode = await QRCode.toString(qr, {
    //     type: 'terminal',
    //     small: true
    // });
    // console.log(qrcode);
});

client.on('ready', () => {
    console.log('Client is ready!');
    setTimeout(() => sendMessage(), 60000);

});

// client.initialize();

var sendIdx = 0;

const saudacoes = [
    'Como vai? Esse telefone é do consultório?',
    'Tudo bem? O telefone pertence ao consultório?',
    'Boa tarde! Esse aparelho é do consultório?',
    'Olá! Esse telefone é do consultório?',
    'Oi amigo(a), como está? Esse dispositivo é do consultório?',
    'Oi, esse aparelho é do consultório?',
    'Saudações! Esse telefone é do consultório?',
    'Oi, essa é do consultório?',
    'Oi, tudo bem? Esse numero é do consultório?',
    'Saudações! Este numero é do consultório?',
    'Eu falo noo consultório?',
    'Olá, boa tarde! Esse telefone é do consultório?',
    'Opa! Esse contato faz parte do consultório?',
    'Oi, como vai? É do consultório esse aparelho?',
    'Oi, tudo bem? Esse aparelho é do consultório?',
    'Boa tarde! Esse contato tem a ver com o consultório?',
    'Oi, como é que anda? Esse dispositivo é do consultório?',
    'Boa tarde! Este telefone traz informação do consultório?',
    'E aí, boa tarde! Esse aparelho tem ligação com o consultório?',
    'Bom dia! Esse dispositivo é do consultório?',
    'Oi, como vai? Este aparelho faz parte do consultório?',
    'Opa! Esse contato é do consultório?',
    'E aí, tudo bem? Esse dispositivo vem do consultório?',
    'Oi, este contato é do consultório?',
    'Oi, tudo bem? Esse dispositivo é do consultório?',
    'Oi pessoal! Esse aparelho vem do consultório?',
    'Olá, bom dia! Esse número faz parte do consultório?',
    'Boa tarde! Essa comunicação é do consultório?',
    'Como estão? Esse telefone é do consultório?',
    'Olá, boa tarde! Esse aparelho pertence ao consultório?',
    'Oi, esse contato é do consultório?',
];

var sended = false
sendMessage = () => {
    client.getContacts()
        .then(contatos => {
            contatos.forEach((contato, idx) => {

                if (sended) {
                    return
                }

                const saudadcaoIndex = Math.floor((Math.random() * 7));
                contato.getChat()
                    .then(chat => {
                        if (chat) {

                            sended = true;
                            chat.getLabels().then(a => {

                                if (a.length > 0) {
                                    console.log('returning', a)
                                    return
                                }

                                if (!chat.archived) {
                                    sendIdx = sendIdx + 1;
                                    var stepTime = ((3 * 60 * 1000) * sendIdx) + (Math.floor((Math.random() * 90) * 300));

                                    setTimeout(() => {
                                        // console.log('chat', chat);
                                        console.log('chat.archived', chat.archived);
                                        chat.sendMessage(saudacoes[saudadcaoIndex])
                                            .then(result => {
                                                console.log(new Date().toUTCString())
                                                console.log(result.to, result.body);

                                            })
                                            .catch(error => {
                                                console.error(error)
                                            })
                                        chat.archive()
                                            .then(result => console.log('archived with success'))
                                            .catch(error => console.log('eror while archived', error))
                                    }, stepTime)

                                }

                            });
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })

        })
        .catch(error => console.log(error))
}





const options = {
    key: fs.readFileSync(path.join(__dirname, 'certificado.key')), // Carregue sua chave privada
    cert: fs.readFileSync(path.join(__dirname, 'certificado.pem')), // Carregue seu certificado
};

const PORT = process.env.PORT || 3000;
const server = https.createServer(options);
const io = new socketIO.Server(server);

io.on('connection', (socket) => {

    console.log('Novo cliente conectado');

    // Evento ao receber uma mensagem do cliente
    socket.on('message', (data) => {
        console.log('Mensagem recebida:', data);

        // Enviar uma resposta ao cliente
        socket.emit('response', 'Mensagem recebida com sucesso!');
    });

    // Evento quando o cliente se desconecta
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});

app.get('/health', (req, res) => {
    res.status(200).send('Servidor Socket.IO está saudável');
});
