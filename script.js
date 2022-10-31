let user
let message
let messages = []
let inputLogin

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
        <ion-icon name="people"></ion-icon>
    </li>
</ul>`


    getmessages()
    criarFooter()
    setInterval(getmessages, 3000)
    setInterval(testActive, 5000)
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

function logar(erro) {
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
    // console.log(resposta.data[0]);
    messages = resposta.data
    rederizarmensagem()
}

function rederizarmensagem() {
    let lastElement = document.querySelector('.separetor')
    lastElement.scrollIntoView({ block: "end" });


    let listmessages = document.querySelector('.container')
    //listmessages.scrollIntoView({ block: "end" });
    listmessages.innerHTML = "";

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

            listmessages.innerHTML += `<li class="status"> ${mensagem}</li>`

        }

        if (to === "Todos" && type === "message") {

            let mensagem = `  
    <span> ${time}</span> 
    <span>${from}</span>  
    <span>para</span>
    <span>${to}:</span>  
   <span>${text}</span>
   `

            listmessages.innerHTML += `<li class="mensagem"> ${mensagem}</li>`
        }

        if (type === "private_message" && to === user || from === user && type === "private_message") {

            let mensagem = `  
    <span> ${time}</span> 
    <span>${from}</span>  
    <span>para</span>
    <span>${to}:</span>  
   <span>${text}</span>
   `

            listmessages.innerHTML += `<li class="private"> ${mensagem}</li>`
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
    const to = "Todos";
    const type = "message";

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

login()