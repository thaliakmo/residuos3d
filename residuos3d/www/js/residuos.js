var residuosApp = {
    // Função para carregar os resíduos do usuário logado e exibir na tabela.
    carregarResiduos: function () {
        // Recuperar o ID do usuário do localStorage, que é utilizado para buscar os resíduos específicos desse usuário.
        const usuario_id = localStorage.getItem("usuario_id");

        // Verificar se o ID do usuário está disponível. Se não estiver, presume-se que o usuário não está logado
        // e ele é redirecionado para a página de login.
        if (!usuario_id) {
            console.warn("ID do usuário não encontrado. Redirecionando para login.");
            window.location.href = "login.html";
            return;
        }

        // Realiza uma requisição AJAX POST para a API para listar os resíduos do usuário.
        $.ajax({
            type: "POST", // Utiliza o método POST para enviar o ID do usuário de forma mais segura.
            url: API_BASE + "listar_residuos.php", // URL da API para obter a lista de resíduos.
            data: { usuario_id: usuario_id }, // Envia o ID do usuário como dado na requisição.
            success: function (dados) {
                // Função executada quando a requisição é bem-sucedida. 'dados' contém a resposta do servidor.
                const residuos = JSON.parse(dados); // Interpreta a string JSON recebida do servidor como um array de objetos JavaScript.
                $("#tabela_residuos tbody").html(""); // Limpa o corpo da tabela antes de adicionar os novos dados.

                // Verifica se a lista de resíduos é válida e não está vazia.
                if (residuos && residuos.length > 0) {
                    // Itera sobre cada objeto de resíduo na array.
                    residuos.forEach(function (r) {
                        // Converte o valor booleano 'r.disponibilizado' para uma string amigável para o usuário.
                        const status = r.disponibilizado ? "Disponível" : "Indisponível";

                        // Define a variável 'actions' para armazenar os botões de ação (Disponibilizar/Cancelar, Editar).
                        let actions = '';
                        // Se o resíduo estiver disponibilizado, exibe o botão para cancelar a disponibilização.
                        if (r.disponibilizado) {
                            actions = `<button class="btn-cancelar-disponibilidade" onclick="residuosApp.cancelarDisponibilidade(${r.id})">Cancelar Disponibilidade</button>`;
                        } else {
                            // Se o resíduo não estiver disponibilizado, exibe o botão para disponibilizá-lo.
                            actions = `<button class="btn-disponibilizar" onclick="residuosApp.disponibilizar(${r.id})">Disponibilizar</button>`;
                        }
                        // Adiciona o botão de editar em ambas as situações.
                        actions += `<button class="btn-editar" onclick="residuosApp.editar(${r.id})">Editar</button>`;

                        // Adiciona uma nova linha à tabela HTML com os dados do resíduo e os botões de ação.
                        $("#tabela_residuos tbody").append(`
                            <tr id="residuo-${r.id}">
                                <td>${r.uso}</td>
                                <td>${r.materiais}</td>
                                <td>${r.gasto_mensal} kg</td>
                                <td>${r.residuo_mensal} kg</td>
                                <td>${status}</td>
                                <td>${actions}</td>
                            </tr>
                        `);
                    });
                } else {
                    // Se não houver resíduos cadastrados para o usuário, exibe uma mensagem na tabela.
                    $("#tabela_residuos tbody").append("<tr><td colspan='6'>Nenhum resíduo cadastrado.</td></tr>");
                }
            },
            // Função executada em caso de erro na requisição AJAX.
            error: function (erro) {
                console.error("Erro ao carregar resíduos:", erro); // Loga o erro no console para depuração.
                alert("Falha ao carregar dados."); // Exibe um alerta genérico de erro para o usuário.
            }
        });
    },

    // Função para redirecionar o usuário para a página de edição de um resíduo específico, passando o ID do resíduo na URL.
    editar: function (id) {
        window.location.href = `editar_residuo.html?id=${id}`;
    },

    // Função para redirecionar o usuário para a página de cancelamento de disponibilidade de um resíduo específico, passando o ID na URL.
    cancelarDisponibilidade: function(id) {
        window.location.href = `cancelar_disponibilidade.html?id=${id}`;
    },

    // Função para enviar uma requisição AJAX POST para a API para marcar um resíduo como disponível.
    disponibilizar: function (id) {
        $.post(API_BASE + "disponibilizar_residuo.php", { id: id }, function (resposta) {
            // Função executada após a resposta do servidor.
            try {
                const resp = JSON.parse(resposta); // Tenta interpretar a resposta como JSON.
                if (resp.success) {
                    alert(resp.message); // Exibe a mensagem de sucesso.
                    residuosApp.carregarResiduos(); // Recarrega a lista de resíduos para atualizar a tabela.
                } else {
                    alert("Erro ao disponibilizar: " + resp.message); // Exibe a mensagem de erro, se houver.
                }
            } catch (e) {
                console.error("Erro ao processar resposta:", e); // Loga erros de parsing JSON no console.
                alert("Erro ao processar resposta do servidor."); // Exibe um alerta de erro genérico.
            }
        });
    },

    // Função de inicialização do objeto residuosApp.
    // Chama a função carregarResiduos para exibir a lista de resíduos ao carregar a página.
    inicializar: function () {
        this.carregarResiduos();
    }
};

// Inicializa o objeto residuosApp chamando sua função inicializar.
residuosApp.inicializar();