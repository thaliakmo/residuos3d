var cadastroresiduoApp = {
    // Função de inicialização do objeto cadastroresiduoApp.
    // No contexto de um aplicativo Cordova, este método aguarda o evento 'deviceready' para garantir que as funcionalidades nativas do dispositivo estejam prontas antes de configurar o cadastro de resíduos.
    initialize: function () {
        document.addEventListener('deviceready', this.configurarCadastroResiduos.bind(this), false);
    },

    // Função responsável por configurar as funcionalidades relacionadas ao cadastro de resíduos.
    // Isso inclui a manipulação do envio do formulário e a ação do botão de cancelar.
    configurarCadastroResiduos: function () {
        // Este bloco de código é executado quando o formulário com o ID 'residuoForm' é submetido.
        $("#residuoForm").on("submit", function (event) {
            // Impede o comportamento padrão de submit do formulário, que causaria um recarregamento da página.
            event.preventDefault();

            // Os próximos blocos coletam os valores dos campos do formulário:
            // 'uso' e 'materiais' são arrays de valores dos checkboxes marcados.
            var uso = $("input[name='uso[]']:checked").map(function () {
                return this.value;
            }).get();

            var materiais = $("input[name='materiais[]']:checked").map(function () {
                return this.value;
            }).get();

            // 'gastoMensal' e 'residuoMensal' são os valores dos campos de input de texto.
            var gastoMensal = $("#gasto_mensal").val();
            var residuoMensal = $("#residuo_mensal").val();

            // Esta condição verifica se algum dos campos obrigatórios ('uso', 'materiais', 'gastoMensal', 'residuoMensal') está vazio.
            // Se algum estiver vazio, um alerta é exibido e a função retorna, impedindo o envio dos dados incompletos.
            if (!uso.length || !materiais.length || !gastoMensal || !residuoMensal) {
                alert("Preencha todos os campos corretamente!");
                return;
            }

            // Este bloco recupera o ID do usuário armazenado no localStorage.
            // O 'usuario_id' é presumivelmente definido durante o processo de login.
            const usuario_id = localStorage.getItem("usuario_id");

            // Esta condição verifica se o 'usuario_id' foi encontrado no localStorage.
            // Se não for encontrado, significa que o usuário não está logado (ou o ID não foi armazenado corretamente),
            // um alerta é exibido e o usuário é redirecionado para a página de login.
            if (!usuario_id) {
                alert("Erro: Usuário não logado. Faça login novamente.");
                window.location.href = "login.html";
                return;
            }

            // Este bloco utiliza a função $.ajax do jQuery para enviar os dados do formulário para a API (presumivelmente um script PHP no servidor).
            $.ajax({
                type: "POST", // O método HTTP utilizado é POST, adequado para envio de dados para o servidor.
                url: API_BASE + "cadastro_residuo.php", // A URL da API para onde os dados serão enviados. 'API_BASE' é uma variável global que armazena o endereço base da API.
                data: { // Os dados que serão enviados no corpo da requisição POST.
                    uso: uso,
                    materiais: materiais,
                    gasto_mensal: gastoMensal,
                    residuo_mensal: residuoMensal,
                    usuario_id: usuario_id
                },
                traditional: true, // Esta opção garante que arrays sejam serializados no formato tradicional (param1=valor1&param1=valor2), o que é esperado por algumas linguagens de servidor como PHP.
                // Esta função é executada em caso de sucesso na requisição AJAX (o servidor responde com um status 2xx).
                success: function (data) {
                    // Este bloco tenta interpretar a resposta do servidor como um objeto JSON.
                    try {
                        const response = JSON.parse(data);
                        // Se a resposta JSON tiver um status de "sucesso", exibe um alerta de sucesso e redireciona o usuário para a página 'dashboard.html'.
                        if (response.status === "sucesso") {
                            alert("Resíduo cadastrado com sucesso!");
                            window.location.href = "dashboard.html";
                        } else {
                            // Se o status na resposta JSON não for "sucesso", exibe um alerta com a mensagem de erro fornecida pelo servidor.
                            alert("Erro ao cadastrar resíduo: " + response.message);
                        }
                    } catch (e) {
                        // Este bloco é executado se a resposta do servidor não puder ser interpretada como JSON (por exemplo, se for uma string simples).
                        const trimmedData = data.trim(); // Remove espaços em branco no início e no final da resposta.
                        // Se a resposta for simplesmente a string "sucesso" (após o trim), exibe um alerta de sucesso e redireciona para a dashboard.
                        if (trimmedData === "sucesso") {
                            alert("Resíduo cadastrado com sucesso!");
                            window.location.href = "dashboard.html";
                        } else {
                            // Caso contrário, exibe um alerta com a resposta do servidor como mensagem de erro.
                            alert("Erro ao cadastrar resíduo: " + trimmedData);
                        }
                    }
                },
                // Esta função é executada em caso de erro na requisição AJAX (o servidor responde com um status diferente de 2xx ou ocorre algum problema na comunicação).
                error: function (err) {
                    console.error("Erro ao enviar os dados:", err); // Loga o erro no console para depuração.
                    alert("Erro ao enviar os dados ao servidor."); // Exibe um alerta genérico de erro para o usuário.
                }
            });
        });

        // Este bloco adiciona um listener de evento de clique ao elemento com o ID 'cancelarCadastro' (presumivelmente um botão "Cancelar").
        document.getElementById('cancelarCadastro').addEventListener('click', function() {
            window.location.href = 'dashboard.html'; // Ao clicar no botão, o usuário é redirecionado para a página 'dashboard.html'.
        });
    }
};

// Esta linha inicia o processo de inicialização do aplicativo cadastroresiduoApp.
cadastroresiduoApp.initialize();