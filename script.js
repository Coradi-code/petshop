
/* ---------------------------------------------------------
   SAUDAÇÃO DINÂMICA 
   Mostra "Bom dia / Boa tarde / Boa noite" de acordo com o
   horário do visitante
--------------------------------------------------------- */
function saudacaoDinamica() {
    const elemento = document.getElementById('saudacao');
    if (!elemento) return; // só existe na index.html

    const horaAtual = new Date().getHours();
    let mensagem;

    if (horaAtual >= 5 && horaAtual < 12) {
        mensagem = 'Bom dia';
    } else if (horaAtual >= 12 && horaAtual < 18) {
        mensagem = 'Boa tarde';
    } else {
        mensagem = 'Boa noite';
    }

    elemento.textContent = `${mensagem}! Bem-vindo ao Petshop Coradi 🐾`;
}

/* ---------------------------------------------------------
   DIA DA SEMANA 
   Mesmo exemplo visto na Aula 8: usa new Date().getDay() (que
   retorna 0 para domingo, 1 para segunda, etc.) e um switch-case
   para descobrir o nome do dia, escrevendo o resultado dentro
   do elemento #dia-semana (na home).
--------------------------------------------------------- */
function mostrarDiaSemana() {
    const elemento = document.getElementById('dia-semana');
    if (!elemento) return; 

    var dia;
    switch (new Date().getDay()) {
        case 0:
            dia = 'Domingo';
            break;
        case 1:
            dia = 'Segunda-feira';
            break;
        case 2:
            dia = 'Terça-feira';
            break;
        case 3:
            dia = 'Quarta-feira';
            break;
        case 4:
            dia = 'Quinta-feira';
            break;
        case 5:
            dia = 'Sexta-feira';
            break;
        case 6:
            dia = 'Sábado';
            break;
    }

    elemento.innerHTML = 'Hoje é ' + dia;
}

/* ---------------------------------------------------------
   ANO DO RODAPÉ (função temporal)
   Atualiza automaticamente o ano exibido no "© ano Petshop
   Coradi", para não precisar editar isso manualmente todo ano.
--------------------------------------------------------- */
function atualizarAnoRodape() {
    const elemento = document.getElementById('ano-atual');
    if (!elemento) return;
    elemento.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   DATA/HORA MÍNIMA DO AGENDAMENTO
   Impede que o cliente escolha uma data/horário anterior a
   agora no campo de agendamento (formulário de cadastro).
   O input é do tipo "datetime-local", então o atributo "min"
   precisa do formato AAAA-MM-DDTHH:mm.
--------------------------------------------------------- */
function definirDataMinimaAgendamento() {
    const campoAgendamento = document.getElementById('agendamento');
    if (!campoAgendamento) return;

    const agora = new Date();
    const anoStr = agora.getFullYear();
    const mesStr = String(agora.getMonth() + 1).padStart(2, '0');
    const diaStr = String(agora.getDate()).padStart(2, '0');
    const horaStr = String(agora.getHours()).padStart(2, '0');
    const minutoStr = String(agora.getMinutes()).padStart(2, '0');

    campoAgendamento.min = `${anoStr}-${mesStr}-${diaStr}T${horaStr}:${minutoStr}`;
}

/* ---------------------------------------------------------
   Ao escolher o método de agendamento, mostra uma mensagem de
   apoio diferente (endereço de busca ou endereço/horário da loja).
--------------------------------------------------------- */
function alternarMetodoAgendamento() {
    const radiosMetodo = document.querySelectorAll('input[name="metodoAgendamento"]');
    const avisoTeleBusca = document.getElementById('avisoTeleBusca');
    const avisoEntrega = document.getElementById('avisoEntrega');

    if (radiosMetodo.length === 0) return; // só existe em cadastro.html

    radiosMetodo.forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (this.value === 'tele-busca') {
                avisoTeleBusca.classList.remove('d-none');
                avisoEntrega.classList.add('d-none');
            } else {
                avisoEntrega.classList.remove('d-none');
                avisoTeleBusca.classList.add('d-none');
            }
        });
    });
}

/* ---------------------------------------------------------
   VALIDAÇÃO E RESUMO DO FORMULÁRIO DE CADASTRO/AGENDAMENTO
   Usa a validação nativa do HTML5 + estilo de validação do
   Bootstrap. Se tudo estiver válido, evita o envio real e mostra um resumo do agendamento na tela.
--------------------------------------------------------- */
function configurarEnvioFormulario() {
    const formulario = document.getElementById('formCadastro');
    if (!formulario) return;

    const resumo = document.getElementById('resumoAgendamento');

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        evento.stopPropagation();

        // Checkboxes não têm um jeito nativo de exigir "ao menos um marcado",
        const servicosMarcados = document.querySelectorAll('input[name="servico"]:checked');
        const erroServico = document.getElementById('erroServico');
        const servicoValido = servicosMarcados.length > 0;
        erroServico.classList.toggle('d-none', servicoValido);

        if (!formulario.checkValidity() || !servicoValido) {
            formulario.classList.add('was-validated');
            return;
        }

        // Coleta os dados preenchidos para montar o resumo
        const nomeCliente = document.getElementById('nomeCliente').value;
        const nomePet = document.getElementById('nomePet').value;
        const servicos = Array.from(servicosMarcados).map(function (input) { return input.value; });
        const metodo = document.querySelector('input[name="metodoAgendamento"]:checked');
        const agendamento = document.getElementById('agendamento').value; // AAAA-MM-DDTHH:mm

        const dataHoraFormatada = agendamento
            ? new Date(agendamento).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short'
              })
            : '';

        resumo.innerHTML = `
            <h3 class="h5">Agendamento confirmado!</h3>
            <p><strong>Cliente:</strong> ${nomeCliente}</p>
            <p><strong>Pet:</strong> ${nomePet}</p>
            <p><strong>Serviço(s):</strong> ${servicos.length ? servicos.join(', ') : 'não selecionado'}</p>
            <p><strong>Método:</strong> ${metodo ? metodo.value : 'não selecionado'}</p>
            <p><strong>Data e horário:</strong> ${dataHoraFormatada}</p>
            <p class="mb-0">Entraremos em contato para confirmar os detalhes.</p>
        `;
        resumo.style.display = 'block';
        resumo.setAttribute('tabindex', '-1');
        resumo.focus();
        resumo.scrollIntoView({ behavior: 'smooth', block: 'center' });

        formulario.classList.add('was-validated');
    });
}

/* ---------------------------------------------------------
   INICIALIZAÇÃO
   Executa todas as funções depois que o HTML terminou de carregar.
--------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    saudacaoDinamica();
    mostrarDiaSemana();
    atualizarAnoRodape();
    definirDataMinimaAgendamento();
    alternarMetodoAgendamento();
    configurarEnvioFormulario();
});
