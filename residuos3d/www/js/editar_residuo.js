var atualizarResiduoApp = {
    // Função para configurar o processo de atualização de um resíduo existente.
    // Ela obtém o formulário, adiciona um listener para o evento de submit e envia os dados via AJAX utilizando FormData.
    configurarAtualizacaoResiduos: function () {
        // Obtém o elemento do formulário de atualização pelo seu ID.
        const form = document.getElementById("residuoForm");

        // Verifica se o formulário foi encontrado no DOM.
        // Se não for encontrado, um aviso é logado no console e a função retorna, evitando erros.
        if (!form) {
            console.warn("Formulário não encontrado!");
            return;
        }

        // Adiciona um listener para o evento de submit do formulário.
        form.addEventListener("submit", function (e) {
            // Impede o comportamento padrão de submit do formulário, que causaria um recarregamento da página.
            e.preventDefault();

            // Cria um objeto FormData para enviar dados, incluindo arquivos, se necessário (embora não haja aqui).
            const formData = new FormData();
            // Recupera o ID do usuário do localStorage, presumivelmente definido durante o login.
            const usuario_id = localStorage.getItem("usuario_id");
            // Obtém o campo de input que contém o ID do resíduo a ser atualizado.
            const residuo_id_input = document.getElementById("residuo_id");

            // Validação para garantir que o ID do resíduo esteja presente no formulário.
            if (!residuo_id_input || !residuo_id_input.value) {
                alert("ID do resíduo não encontrado.");
                return;
            }

            // Adiciona o ID do usuário e o ID do resíduo ao FormData.
            formData.append("usuario_id", usuario_id);
            formData.append("id", residuo_id_input.value);

            // Adiciona os valores dos campos de gasto mensal e resíduo mensal ao FormData.
            formData.append("gasto_mensal", document.getElementById("gasto_mensal").value);
            formData.append("residuo_mensal", document.getElementById("residuo_mensal").value);

            // Coleta todos os checkboxes marcados para 'uso' e adiciona seus valores ao FormData como um array.
            const usos = document.querySelectorAll("input[name='uso[]']:checked");
            usos.forEach(u => formData.append("uso[]", u.value));

            // Coleta todos os checkboxes marcados para 'materiais' e adiciona seus valores ao FormData como um array.
            const materiais = document.querySelectorAll("input[name='materiais[]']:checked");
            materiais.forEach(m => formData.append("materiais[]", m.value));

            // Envia os dados do formulário para a API utilizando AJAX com FormData.
            $.ajax({
                type: "POST", // Método HTTP POST para enviar os dados de atualização.
                url: API_BASE + "atualizar_residuo.php", // URL da API para o script de atualização de resíduo no servidor.
                data: formData, // Os dados a serem enviados (objeto FormData).
                processData: false, // Impede que o jQuery processe os dados (FormData já está formatado).
                contentType: false, // Impede que o jQuery defina o tipo de conteúdo (o navegador o fará corretamente com FormData).
                // Função executada em caso de sucesso na requisição (código de resposta HTTP 2xx).
                success: function (data) {
                    // Verifica se a resposta do servidor inclui a string "sucesso".
                    if (data.includes("sucesso")) {
                        alert("Resíduo atualizado com sucesso!"); // Exibe um alerta de sucesso para o usuário.
                        window.location.href = "dashboard.html"; // Redireciona o usuário para o dashboard após a atualização.
                    } else {
                        alert("Erro ao atualizar o resíduo: " + data); // Exibe um alerta de erro com a mensagem do servidor.
                    }
                },
                // Função executada em caso de erro na requisição (código de resposta HTTP diferente de 2xx ou falha na requisição).
                error: function (err) {
                    console.error("Erro AJAX", err); // Loga o erro completo no console para depuração.
                    alert("Erro ao enviar dados."); // Exibe um alerta genérico de erro de envio para o usuário.
                }
            });
        });
    },

    // Função para preencher o formulário de atualização com os dados de um resíduo específico, obtidos da API.
    preencherFormulario: function (id) {
        // Realiza uma requisição GET para a API para buscar os dados do resíduo com o ID fornecido.
        $.get(API_BASE + "buscar_residuo.php?id=" + id, function (data) {
            const res = JSON.parse(data); // Interpreta a resposta do servidor como um objeto JSON.
            console.log("Dados do resíduo recebidos:", res); // Loga os dados recebidos no console para depuração.
            $("#residuo_id").val(res.id); // Preenche o campo hidden com o ID do resíduo.
            $("#gasto_mensal").val(res.gasto_mensal); // Preenche o campo de gasto mensal.
            $("#residuo_mensal").val(res.residuo_mensal); // Preenche o campo de resíduo mensal.

            // Verifica se 'res.uso' é um array e marca os checkboxes correspondentes aos valores recebidos.
            if (Array.isArray(res.uso)) {
                res.uso.forEach(function (item) {
                    $("input[name='uso[]'][value='" + item + "']").prop('checked', true);
                });
            }

            // Verifica se 'res.materiais' é um array e marca os checkboxes correspondentes aos valores recebidos.
            if (Array.isArray(res.materiais)) {
                res.materiais.forEach(function (item) {
                    $("input[name='materiais[]'][value='" + item + "']").prop('checked', true);
                });
            }
        }).fail(function () {
            alert("Erro ao buscar os dados."); // Exibe um alerta de erro caso a requisição para buscar os dados falhe.
        });
    }
};

// Obtém o ID do resíduo da string de consulta da URL.
const urlParams = new URLSearchParams(window.location.search);
const idResiduo = urlParams.get('id');
// Se um ID de resíduo for encontrado na URL, a função para preencher o formulário é chamada.
if (idResiduo) {
    atualizarResiduoApp.preencherFormulario(idResiduo);
}

// Chama a função para configurar o processo de atualização de resíduos quando o script é carregado.
atualizarResiduoApp.configurarAtualizacaoResiduos();