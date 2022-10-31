let user
let message
let messages = []
let inputLogin
let usersOnline = []
let to = "Todos";
let type = "message";

function login() {
    inputLogin = document.querySelector('.login')
    inputLogin.innerHTML = `
    <img src="/images/logo-chat.svg" alt="">    
    <input class="entrar" type="text" placeholder="Digite seu nome"/>
<button onclick="nomeUser(this)"> Entrar</button>
`
}

function nomeUser() {
    user = document.querySelector('.entrar').value
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', { name: user });
    promise.then(criarHeader)
    promise.catch(logar)
}

function criarHeader() {
    inputLogin = document.querySelector('.login')
    inputLogin.classList.add('escondido')
    let footer = document.querySelector('header')
    footer.innerHTML = `
    <ul>
    <li>
        <img src="/images/logo-chat.svg" alt="">
        <ion-icon name="people" onclick="menu(this)"></ion-icon>
    </li>
</ul>`

    getmessages()
    criarFooter()
    online()
    setInterval(getmessages, 3000)
    setInterval(testActive, 5000)
    setInterval(online, 10000)
}

function criarFooter() {
    let footer = document.querySelector('footer')
    footer.innerHTML = `

        <ul>
            <li>            
            <input class="enviar" type="text" placeholder="Escreva aqui...">
            <ion-icon name="paper-plane-outline" onclick="pegarInput(this)"></ion-icon>
        </li>
        </ul>
        `
}

function testActive() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: user })
    promise.then();
    promise.catch(logar)
}

function logar() {
    alert(`o nome ${user} já possuie na sala, por favor escolha outro nome...Ex: segestão -${user}-`);
    window.location.reload()
}


function enviarMensagem() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
        from: user,
        to: message.to,
        text: message.text,
        type: message.type
    });
    promise.then(testeDeEnviarMensagem)
    promise.catch(tratarErro);
}


function tratarErro(erro) {
    console.log("Status code: " + erro.response.status); // Ex: 404
    console.log("Mensagem de erro: " + erro.response.data); // Ex: Not Found
}

function testeDeEnviarMensagem() {
    getmessages()
}

function getmessages() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(processarResposta);
}

function processarResposta(resposta) {
    messages = resposta.data
    rederizarmensagem()
}

function rendereziarNav(users) {
    usersOnline = users.data
    let listUsers = document.querySelector('.select-user')
    listUsers.innerHTML = "";
    listUsers.innerHTML = `
        <li onclick="selectUser(this)" id='Todos'>
                <ion-icon name="people"></ion-icon> <span>Todos</span>
        </li>`
    for (let i = 0; i < usersOnline.length; i++) {
        let user = usersOnline[i].name
        listUsers.innerHTML += `
        <li onclick="selectUser(this)" id="S${user}">
        <ion-icon name="person-circle-outline"></ion-icon><span>${user}</span>
    </li>
        `
    }

    const navInferior = document.querySelector('.type-message')
    navInferior.innerHTML = '';
    navInferior.innerHTML = `<h2>Escolha a visibilidade:</h2>
    <li onclick="selettypemessage(this)" id="message"> <ion-icon name="lock-open"></ion-icon><span>Público</span>

    </li>
    <li onclick="selettypemessage(this)" id="private_message"> <ion-icon name="lock-closed"></ion-icon><span>Reservadamente</span></li>
    `
}

function online() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promise.then(rendereziarNav)
}

function selectUser(clicou) {
    to = clicou.id
    console.log(to)
}

function selettypemessage(clicou) {
    type = clicou.id
    console.log(type)
}

function rederizarmensagem() {
    let lastElement = document.querySelector('.separetor')
    lastElement.scrollIntoView({ block: "end" });
    let listMessages = document.querySelector('.container')
    listMessages.innerHTML = "";
    for (let i = 0; i < messages.length; i++) {
        let time = messages[i].time
        let from = messages[i].from
        let to = messages[i].to
        let type = messages[i].type
        let text = messages[i].text
        if (to == "Todos" && type == "status") {
            let mensagem = `  
    <span> ${time}</span>
    <span>${from}</span>
   <span>${text}</span>
   `
            listMessages.innerHTML += `<li class="status"> ${mensagem}</li>`
        }
        if (type === "message") {
            let mensagem = `  
    <span> ${time}</span> 
    <span>${from}</span>  
    <span>para</span>
    <span>${to}:</span>  
   <span>${text}</span>
   `
            listMessages.innerHTML += `<li class="mensagem"> ${mensagem}</li>`
        }
        if (type === "private_message" && to === user || from === user && type === "private_message") {
            let mensagem = `  
    <span> ${time}</span> 
    <span>${from}</span>  
    <span>para</span>
    <span>${to}:</span>  
   <span>${text}</span>
   `
            listMessages.innerHTML += `<li class="private"> ${mensagem}</li>`
        }
    }

    let list = document.querySelectorAll('.status')
    list.forEach(element => {
        element.classList.add('login-logout');
    });

    list = document.querySelectorAll('.mensagem')
    list.forEach(element => {
        element.classList.add('send-message');
    });

    list = document.querySelectorAll('.private')
    list.forEach(element => {
        element.classList.add('message-private');
    });
}

function pegarInput() {
    const text = document.querySelector('.enviar').value;
    message =
    {
        from: user,
        to: to,
        text: text,
        type: type
    }
    enviarMensagem()
    criarFooter()
}

function menu() {
    const menu = document.querySelector('nav')
}

function backMain() {
    const menu = document.querySelector('nav')
}

login()