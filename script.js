const users = prompt('escolha seu nome')
let mensagen
let mensagens=[]

setInterval( testActive, 5000)
setInterval( getMensagens, 3000)


function nomeUser() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', { name: users });
    promise.then(criarFooter)
    promise.catch(logar)
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
        getMensagens()
}


function testActive() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', { name: users })
    promise.then();
    promise.catch(logar)
}

function logar(erro) {
 alert( `Status code: ${erro.response.status}
     Mensagem de erro: ${erro.response.data}`); 
    window.location.reload()
}


function enviarMensagem() {

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', { from:users,
     to:mensagen.to, 
     text: mensagen.text,
     type: mensagen.type});

    promise.then(testeDeEnviarMensagem)
    promise.catch(tratarErro);
}


function tratarErro(erro) {
  console.log("Status code: " + erro.response.status); // Ex: 404
 console.log("Mensagem de erro: " + erro.response.data); // Ex: Not Found
}



function testeDeEnviarMensagem() {

    getMensagens()
}


function getMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(processarResposta);
    
}


function processarResposta(resposta) {
    // console.log(resposta.data[0]);
    mensagens = resposta.data
    rederizarmensagem()
}

function rederizarmensagem() {

    let listaDeMensagens = document.querySelector('.container')
    listaDeMensagens.scrollIntoView({ block: "end" });
    listaDeMensagens.innerHTML = "";

    for (let i = 0; i < mensagens.length; i++) {
        let time = mensagens[i].time
        let from = mensagens[i].from
        let to = mensagens[i].to
        let type = mensagens[i].type
        let text = mensagens[i].text

        if (to == "Todos" && type == "status") {

            let mensagem = `  
    <span> ${time}</span>
    <span>${from}</span>
   <span>${text}</span>
   `

            listaDeMensagens.innerHTML += `<li class="status"> ${mensagem}</li>`

        }

        if (to === "Todos" && type === "message") {

            let mensagem = `  
    <span> ${time}</span> 
    <span>${from}</span>  
    <span>para</span>
    <span>${to}:</span>  
   <span>${text}</span>
   `

            listaDeMensagens.innerHTML += `<li class="mensagem"> ${mensagem}</li>`
        }

        if ( type === "private_message") {

            let mensagem = `  
    <span> ${time}</span> 
    <span>${from}</span>  
    <span>para</span>
    <span>${to}:</span>  
   <span>${text}</span>
   `

            listaDeMensagens.innerHTML += `<li class="private"> ${mensagem}</li>`
        }
    }

    let lista = document.querySelectorAll('.status')
    lista.forEach(element => {
        element.classList.add('action1');
    });

    lista = document.querySelectorAll('.mensagem')
    lista.forEach(element => {
        element.classList.add('action');
    });

    lista = document.querySelectorAll('.private')/* quando implementar a mensagem privada */
    lista.forEach(element => {
        element.classList.add('action2');
    });

}

function pegarInput() {
    const text =document.querySelector('.enviar').value;
    const to ="Todos";
    const type= "message";

    mensagen= 
        {from: users,
         to: to , 
         text: text , 
         type: type 
        }
    
        enviarMensagem()
        criarFooter()

}


nomeUser()