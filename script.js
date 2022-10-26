let mensagens = [];

const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
promessa.then(processarResposta);


function processarResposta(resposta) {
    console.log(resposta.data[0]);
    mensagens = resposta.data
    rederizarmensagem()
}

function rederizarmensagem() {

    let listaDeMensagens = document.querySelector('.container')

    listaDeMensagens.innerHTML = "";

    for (let i = 0; i < 5 /*mensagens.length */; i++) {

        let mensagem = `${mensagens[i].to}
   ${mensagens[i].text}
   ${mensagens[i].type}
   ${mensagens[i].time}
   `


        listaDeMensagens.innerHTML += `<li> ${mensagem}
    
    </li>`

    }
}

/*
    from	"qqqq"
to	"Todos"
text	"sai da sala..."
type	"status"
time	"10:32:45"
*/