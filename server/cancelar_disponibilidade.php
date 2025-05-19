<?php
include "config.php"; // Inclui o arquivo de configuração que estabelece a conexão com o banco de dados.

// Recupera os dados enviados via método POST.
// Utiliza o operador de coalescência nula (??) para definir um valor padrão (string vazia)
// caso a chave não exista no $_POST.
$id = $_POST['id'] ?? ''; // ID do resíduo a ter a disponibilidade cancelada.
$motivo = $_POST['motivo'] ?? ''; // Motivo do cancelamento da disponibilidade.
$onde = $_POST['onde'] ?? ''; // Local para onde o resíduo será levado (opcional).

// Verifica se o ID do resíduo e o motivo do cancelamento foram fornecidos.
// Se algum deles estiver faltando, retorna uma resposta JSON de erro e encerra a execução do script.
if (!$id || !$motivo) {
    echo json_encode(['status' => 'error', 'message' => 'Dados inválidos.']);
    exit;
}

// Define a query SQL para atualizar o resíduo na tabela 'residuos'.
// O campo 'disponibilizado' é definido como FALSE (0), e os campos 'motivo_cancelamento' e 'onde_cancelamento' são atualizados.
$sql = "UPDATE residuos SET disponibilizado = FALSE, motivo_cancelamento = ?, onde_cancelamento = ? WHERE id = ?"; // Modified SQL
// Prepara a query SQL para evitar ataques de SQL injection.
$stmt = $conn->prepare($sql);
// Vincula os parâmetros da query preparada com os valores recebidos via POST.
// "ssi" indica os tipos de dados esperados:
// s: string (para motivo)
// s: string (para onde)
// i: integer (para id)
$stmt->bind_param("ssi", $motivo, $onde, $id);

// Executa a query preparada.
if ($stmt->execute()) {
    // Se a execução for bem-sucedida, retorna uma resposta JSON com status de sucesso e uma mensagem.
    echo json_encode(['status' => 'success', 'message' => 'Disponibilidade cancelada com sucesso!']);
} else {
    // Se ocorrer algum erro durante a execução, retorna uma resposta JSON com status de erro e uma mensagem de erro do banco de dados.
    echo json_encode(['status' => 'error', 'message' => 'Erro ao cancelar a disponibilidade no banco de dados.']);
}

// Fecha o statement preparado.
$stmt->close();
// Fecha a conexão com o banco de dados para liberar recursos.
$conn->close();
?>