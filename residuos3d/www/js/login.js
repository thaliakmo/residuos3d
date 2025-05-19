var loginApp = {
    // Função para configurar a lógica de login do usuário.
    // Obtém o formulário de login e adiciona um listener para o evento de submit.
    configurarLogin: function () {
        // Obtém o elemento do formulário de login pelo seu ID.
        const form = document.getElementById("loginForm");

        // Verifica se o formulário foi encontrado no DOM.
        // Se não for encontrado, um aviso é logado no console e a função retorna, evitando erros.
        if (!form) {
            console.warn("Formulário de login não encontrado!");
            return;
        }

        // Adiciona um listener para o evento de submit do formulário,
        // e associa a função onSubmitLoginForm para ser executada quando o formulário for submetido.
        // O 'bind(this)' garante que o contexto 'this' dentro de onSubmitLoginForm seja a instância de loginApp.
        form.addEventListener("submit", this.onSubmitLoginForm.bind(this));
    },

    // Função chamada quando o formulário de login é submetido.
    // Impede o comportamento padrão do submit e coleta os dados de e-mail e senha.
    onSubmitLoginForm: function (e) {
        // Impede o comportamento padrão de submit do formulário, que causaria um recarregamento da página.
        e.preventDefault();

        // Obtém os valores dos campos de e-mail e senha do formulário.
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        // Envio dos dados para o servidor via AJAX utilizando a função $.ajax do jQuery.
        $.ajax({
            type: "POST", // Define o método HTTP como POST para enviar os dados de login de forma segura.
            url: API_BASE + "login.php", // Define a URL da API para o script de login no servidor.
            data: { // Define os dados a serem enviados no corpo da requisição.
                email: email,
                senha: senha
            },
            success: this.onLoginSuccess, // Define a função onLoginSuccess para ser chamada em caso de sucesso na requisição.
            error: this.onLoginError // Define a função onLoginError para ser chamada em caso de erro na requisição.
        });
    },

    // Função chamada em caso de sucesso na requisição de login.
    // Interpreta a resposta JSON do servidor e realiza ações com base no status do login.
    onLoginSuccess: function (res) {
        // Interpreta a resposta do servidor como um objeto JSON.
        let retorno = JSON.parse(res);
        // Verifica se o status na resposta JSON é "ok", indicando um login bem-sucedido.
        if (retorno.status === "ok") {
            // Salva o ID do usuário e o nome do usuário no localStorage para uso posterior na aplicação.
            localStorage.setItem("usuario_id", retorno.id);
            localStorage.setItem("usuario_nome", retorno.nome);
            alert("Login realizado com sucesso!"); // Exibe um alerta de sucesso para o usuário.
            window.location.href = "dashboard.html"; // Redireciona o usuário para a página principal (dashboard).
        } else {
            // Se o status não for "ok", exibe um alerta informando que o e-mail ou a senha estão incorretos.
            alert("E-mail ou senha incorretos.");
        }
    },

    // Função chamada em caso de erro na requisição de login.
    // Exibe um alerta informando que houve um erro na conexão com o servidor.
    onLoginError: function () {
        alert("Erro na conexão com o servidor.");
    }
};

// Inicializa a lógica de login ao carregar o script, chamando a função configurarLogin.
loginApp.configurarLogin();