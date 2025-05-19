var cadastroUsuarioApp = {
    // Função responsável por configurar o processo de cadastro de usuário.
    // Ela obtém o formulário, adiciona um listener para o evento de submit e envia os dados via AJAX.
    configurarCadastroUsuario: function () {
        // Obtém o elemento do formulário de cadastro pelo seu ID.
        const form = document.getElementById("formulario");

        // Verifica se o formulário foi encontrado no DOM.
        // Se não for encontrado, um aviso é logado no console e a função retorna, evitando erros.
        if (!form) {
            console.warn("Formulário de cadastro de usuário não encontrado!");
            return;
        }

        // Adiciona um listener para o evento de submit do formulário.
        form.addEventListener("submit", function (event) {
            // Impede o comportamento padrão de submit do formulário, que causaria um recarregamento da página.
            event.preventDefault();

            // Obtém os valores dos campos do formulário pelos seus respectivos IDs.
            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const telefone = document.getElementById("telefone").value;
            const cidade = document.getElementById("cidade").value;
            const bairro = document.getElementById("bairro").value;
            const senha = document.getElementById("senha").value;

            // Utiliza a função $.ajax do jQuery para enviar os dados do formulário para o servidor.
            $.ajax({
                type: "POST", // Define o método HTTP como POST para enviar dados.
                url: API_BASE + "cadastro_usuario.php", // Define a URL da API para o script de cadastro de usuário no servidor.
                data: { // Define os dados a serem enviados no corpo da requisição.
                    nome: nome,
                    email: email,
                    telefone: telefone,
                    cidade: cidade,
                    bairro: bairro,
                    senha: senha
                },
                // Função executada em caso de sucesso na requisição (código de resposta HTTP 2xx).
                success: function (data) {
                    console.log("Resposta do servidor:", data); // Loga a resposta do servidor no console para depuração.
                    const trimmedData = data.trim(); // Remove quaisquer espaços em branco no início e no final da resposta.

                    // Verifica a resposta do servidor para diferentes cenários:
                    if (trimmedData === "sucesso") {
                        alert("Usuário cadastrado com sucesso!"); // Exibe um alerta de sucesso para o usuário.
                        console.log("Tentando redirecionar para login.html..."); // Loga a intenção de redirecionamento.
                        window.location.href = "login.html"; // Redireciona o navegador para a página de login.
                        console.log("Redirecionamento executado."); // Loga que o redirecionamento ocorreu.
                    } else if (trimmedData === "email_cadastrado") {
                        alert("Esse e-mail já está cadastrado."); // Exibe um alerta informando que o e-mail já existe.
                    } else {
                        alert("Erro ao cadastrar usuário: " + data); // Exibe um alerta genérico de erro com a mensagem do servidor.
                    }
                },
                // Função executada em caso de erro na requisição (código de resposta HTTP diferente de 2xx ou falha na requisição).
                error: function (err) {
                    console.error("Erro na requisição AJAX", err); // Loga o erro completo no console para depuração detalhada.
                    alert("Erro ao enviar dados."); // Exibe um alerta genérico de erro de envio para o usuário.
                }
            });
        });
    },
};

// Chama a função para configurar o cadastro de usuário quando o script é executado.
cadastroUsuarioApp.configurarCadastroUsuario();