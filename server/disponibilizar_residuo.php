<?php
include "config.php"; // Inclui o arquivo de configuração que estabelece a conexão com o banco de dados.

// Recupera o ID do resíduo enviado via método POST.
// Utiliza o operador de coalescência nula (??) para definir um valor padrão (string vazia)
// caso a chave 'id' não exista no $_POST.
$id = $_POST['id'] ?? '';

// Verifica se o ID do resíduo foi fornecido.
// Se o ID estiver vazio, retorna uma resposta JSON indicando falha e uma mensagem de erro,
// e encerra a execução do script.
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID inválido.']);
    exit;
}

// Define a query SQL para atualizar o resíduo na tabela 'residuos'.
// O campo 'disponibilizado' é definido como TRUE (1), marcando o resíduo como disponível.
$sql = "UPDATE residuos SET disponibilizado = TRUE WHERE id = ?";
// Prepara a query SQL para evitar ataques de SQL injection.
$stmt = $conn->prepare($sql);
// Vincula o parâmetro da query preparada com o ID do resíduo recebido via POST.
// "i" especifica que o tipo de dado esperado é um inteiro.
$stmt->bind_param("i", $id);
// Executa a query preparada.
$stmt->execute();

// Verifica se alguma linha foi afetada pela execução da query UPDATE.
// Se 'affected_rows' for maior que 0, significa que o resíduo foi encontrado e atualizado com sucesso.
if ($stmt->affected_rows > 0) {
    // Retorna uma resposta JSON indicando sucesso e uma mensagem informativa.
    echo json_encode(['success' => true, 'message' => 'Resíduo disponibilizado.']);
} else {
    // Se nenhuma linha foi afetada (por exemplo, se o ID não existir),
    // retorna uma resposta JSON indicando falha e uma mensagem de erro.
    echo json_encode(['success' => false, 'message' => 'Erro ao disponibilizar o resíduo.']);
}

//  fechar o statement e a conexão aqui
$stmt->close();
$conn->close();
?>