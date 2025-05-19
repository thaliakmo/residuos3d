<?php
require_once 'config.php';

// Recupera os dados do formulário via método POST.
// Utiliza o operador de coalescência nula (??) para definir valores padrão (null ou 0 ou array vazio)
// caso a chave não exista no $_POST.
$id = $_POST['id'] ?? null;
$usuario_id = $_POST['usuario_id'] ?? null;
$gasto = $_POST['gasto_mensal'] ?? 0;
$residuo = $_POST['residuo_mensal'] ?? 0;
$uso = $_POST['uso'] ?? [];
$materiais = $_POST['materiais'] ?? [];

// Verifica se o ID do resíduo e o ID do usuário foram fornecidos.
// Se algum deles estiver faltando, exibe uma mensagem de erro e encerra a execução do script.
if (!$id || !$usuario_id) {
    echo "Erro: ID ou Usuário não informado.";
    exit;
}

// Transforma os arrays de 'uso' e 'materiais' em strings separadas por vírgulas.
// Isso é feito para facilitar o armazenamento dos múltiplos valores em um único campo no banco de dados.
$uso_str = is_array($uso) ? implode(",", $uso) : $uso;
$materiais_str = is_array($materiais) ? implode(",", $materiais) : $materiais;

try {
    // Define a query SQL para atualizar os dados do resíduo na tabela 'residuos'.
    // Os valores serão atualizados com base no ID do resíduo e no ID do usuário.
    $sql = "UPDATE residuos SET
                    gasto_mensal = ?,
                    residuo_mensal = ?,
                    uso = ?,
                    materiais = ?
                WHERE id = ? AND usuario_id = ?";

    // Prepara a query SQL para evitar ataques de SQL injection.
    $stmt = $conn->prepare($sql);
    // Vincula os parâmetros da query com os valores recebidos via POST.
    // "ddssii" indica os tipos de dados esperados:
    // d: double (para gasto_mensal e residuo_mensal)
    // s: string (para uso e materiais)
    // i: integer (para id e usuario_id)
    $stmt->bind_param("ddssii", $gasto, $residuo, $uso_str, $materiais_str, $id, $usuario_id);

    // Executa a query preparada.
    if ($stmt->execute()) {
        // Se a execução for bem-sucedida, exibe uma mensagem de sucesso.
        echo "Atualização com sucesso!";
    } else {
        // Se ocorrer algum erro durante a execução, exibe uma mensagem de erro genérica.
        echo "Erro ao atualizar.";
    }
} catch (mysqli_sql_exception $e) {
    // Captura exceções específicas do MySQL (como erros de sintaxe SQL ou violações de constraints)
    // e exibe a mensagem de erro detalhada para auxiliar na depuração.
    echo "Erro: " . $e->getMessage();
}
?>