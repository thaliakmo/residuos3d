<?php
include "config.php"; // Inclui o arquivo de configuração que estabelece a conexão com o banco de dados.

// Recupera o ID do usuário enviado via método POST.
// Utiliza o operador de coalescência nula (??) para definir um valor padrão (string vazia)
// caso a chave 'usuario_id' não exista no $_POST.
$usuario_id = $_POST['usuario_id'] ?? '';

// Verifica se o ID do usuário foi fornecido.
// Se o ID estiver vazio, retorna um array JSON vazio e encerra a execução do script.
// Isso evita consultas desnecessárias ao banco de dados.
if (!$usuario_id) {
    echo json_encode([]);
    exit;
}

// Define a query SQL para selecionar todos os resíduos pertencentes ao usuário especificado
// e que estejam marcados como 'disponibilizado' (TRUE).
$sql = "SELECT * FROM residuos WHERE usuario_id = ? AND disponibilizado = TRUE"; // Consulta Filtrada
// Prepara a query SQL para evitar ataques de SQL injection.
$stmt = $conn->prepare($sql);
// Vincula o parâmetro da query preparada com o ID do usuário recebido via POST.
// "i" especifica que o tipo de dado esperado é um inteiro.
$stmt->bind_param("i", $usuario_id);
// Executa a query preparada.
$stmt->execute();

// Obtém o resultado da consulta.
$result = $stmt->get_result();
// Inicializa um array vazio para armazenar os dados dos resíduos.
$dados = [];

// Loop através de cada linha (resíduo) retornado pela consulta.
while ($row = $result->fetch_assoc()) {
    // Adiciona cada linha (associative array) ao array '$dados'.
    $dados[] = $row;
}

// Converte o array '$dados' para o formato JSON e o envia como resposta.
// Se nenhum resíduo for encontrado para o usuário, um array JSON vazio será retornado.
echo json_encode($dados);
?>