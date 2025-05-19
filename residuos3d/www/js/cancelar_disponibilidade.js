var cancelarDisponibilidadeApp = {

    // Função de inicialização do objeto cancelarDisponibilidadeApp.
    // Responsável por configurar os elementos da página, os eventos de interação do usuário e obter o ID do resíduo da URL.
    inicializar: function () {
        this.configurarElementos();
        this.configurarEventos();
        this.obterResiduoId();
    },

    // Função para configurar e armazenar referências aos elementos HTML que serão manipulados no script.
    // Isso melhora a organização e evita a necessidade de buscar os elementos repetidamente no DOM.
    configurarElementos: function () {
        this.residuoId = $('#residuoId'); // Campo hidden para armazenar o ID do resíduo.
        this.ondeInput = $('#onde'); // Campo de input para o local onde o usuário levará o resíduo.
        this.levarEuMesmoRadio = $('#levar_eu_mesmo'); // Radio button para indicar que o usuário levará o resíduo.
        this.cancelarForm = $('#cancelarForm'); // Formulário de cancelamento (embora não seja explicitamente usado no submit padrão).
        this.btnCancelar = $('#btnCancelar'); // Botão para iniciar o processo de cancelamento da disponibilidade.
        this.btnManterDisponivel = $('#btnManterDisponivel'); // Botão para manter o resíduo disponível e retornar ao dashboard.
    },

    // Função para vincular os manipuladores de eventos aos elementos interativos da página.
    // Define as ações que devem ocorrer quando o usuário interage com esses elementos.
    configurarEventos: function () {
        this.levarEuMesmoRadio.change(this.toggleOndeInput.bind(this)); // Ao mudar o estado do radio button, a visibilidade do input 'onde' é alternada.
        this.btnCancelar.click(this.cancelarDisponibilidade.bind(this)); // Ao clicar no botão 'Cancelar', a função 'cancelarDisponibilidade' é executada.
        this.btnManterDisponivel.click(this.manterDisponivel.bind(this)); // Ao clicar no botão 'Manter Disponível', a função 'manterDisponivel' é executada.
    },

    // Função para extrair o ID do resíduo da string de consulta da URL.
    // Este ID é necessário para identificar qual resíduo terá sua disponibilidade cancelada.
    obterResiduoId: function () {
        const urlParams = new URLSearchParams(window.location.search); // Cria um objeto para manipular os parâmetros da URL.
        const id = urlParams.get('id'); // Obtém o valor do parâmetro 'id' da URL.
        this.residuoId.val(id); // Define o valor do campo hidden 'residuoId' com o ID obtido.
    },

    // Função para controlar a visibilidade do campo de input 'onde',
    // que só deve ser exibido se o usuário selecionar a opção de levar o resíduo por conta própria.
    toggleOndeInput: function () {
        this.ondeInput.toggle(this.levarEuMesmoRadio.is(':checked')); // Se o radio button 'levar_eu_mesmo' estiver marcado, o input 'onde' é exibido; caso contrário, é oculto.
    },

    // Função para lidar com o processo de cancelamento da disponibilidade do resíduo.
    // Coleta o motivo do cancelamento e, se aplicável, o local onde o resíduo será levado,
    // realiza validações e envia uma requisição AJAX para o servidor para efetivar o cancelamento.
    cancelarDisponibilidade: function () {
        const motivo = $('input[name="motivo"]:checked').val(); // Obtém o valor do radio button de motivo selecionado.
        const onde = this.ondeInput.val(); // Obtém o valor do campo 'onde'.

        // Validação: verifica se um motivo foi selecionado.
        if (!motivo) {
            alert('Por favor, selecione um motivo.');
            return;
        }

        // Validação: se a opção 'levar eu mesmo' estiver selecionada, verifica se o campo 'onde' foi preenchido.
        if (this.levarEuMesmoRadio.is(':checked') && !onde) {
            alert('Por favor, informe onde você vai levar o resíduo.');
            return;
        }

        // Confirmação com o usuário antes de prosseguir com o cancelamento.
        if (confirm('Tem certeza que deseja cancelar a disponibilização?')) {
            $.ajax({
                url: API_BASE + 'cancelar_disponibilidade.php', // URL da API para cancelar a disponibilidade.
                type: 'POST', // Método HTTP POST para enviar os dados de cancelamento.
                dataType: 'json', // Espera que a resposta do servidor seja no formato JSON.
                data: { // Dados enviados para o servidor.
                    id: this.residuoId.val(), // ID do resíduo a ser cancelado.
                    motivo: motivo, // Motivo do cancelamento.
                    onde: onde // Local onde o resíduo será levado (se aplicável).
                },
                success: this.processarResposta.bind(this), // Função a ser executada em caso de sucesso na requisição.
                error: this.exibirErro.bind(this) // Função a ser executada em caso de erro na requisição.
            });
        }
    },

    // Função para processar a resposta do servidor após a tentativa de cancelamento.
    // Exibe uma mensagem para o usuário e, em caso de sucesso, remove a linha correspondente da tabela e redireciona para o dashboard.
    processarResposta: function (response) {
        if (response.status === 'success') {
            alert(response.message); // Exibe a mensagem de sucesso do servidor.
            const residuoId = this.residuoId.val(); // Obtém o ID do resíduo cancelado.
            $(`#residuo-${residuoId}`).remove(); // Remove a linha da tabela HTML correspondente ao resíduo cancelado (presumindo que cada linha tenha um ID único no formato 'residuo-{id}').
            window.location.href = 'dashboard.html'; // Redireciona o usuário de volta para o dashboard.
        } else {
            alert(response.message); // Exibe a mensagem de erro do servidor.
        }
    },

    // Função para exibir uma mensagem de erro genérica caso a requisição AJAX falhe.
    exibirErro: function () {
        alert('Erro ao processar a solicitação.');
    },

    // Função para redirecionar o usuário de volta ao dashboard caso ele clique no botão "Manter Disponível".
    manterDisponivel: function () {
        window.location.href = 'dashboard.html';
    }
};

// Inicializa o objeto cancelarDisponibilidadeApp quando o script é carregado.
cancelarDisponibilidadeApp.inicializar();