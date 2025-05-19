<?php
include "config.php";

// Verifica se o parâmetro 'id' foi passado via método GET na URL.
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id = $_GET['id'];

    // Utiliza prepared statement para realizar a consulta no banco de dados de forma segura,
    // prevenindo ataques de SQL Injection.
    $stmt = $conn->prepare("SELECT * FROM residuos WHERE id = ?");
    // Vincula o valor do parâmetro 'id' à interrogação na query SQL.
    // "i" especifica que o tipo de dado esperado é um inteiro.
    $stmt->bind_param("i", $id);
    // Executa a query preparada no banco de dados.
    $stmt->execute();
    // Obtém o resultado da consulta.
    $resultado = $stmt->get_result();

    // Verifica se alguma linha foi retornada pela consulta, indicando que o resíduo com o ID fornecido foi encontrado.
    if ($resultado->num_rows > 0) {
        // Obtém a primeira linha do resultado como um array associativo.
        $residuo = $resultado->fetch_assoc();

        // Os campos 'uso' e 'materiais' são armazenados no banco de dados como strings separadas por vírgulas.
        // A função explode() é utilizada para transformar essas strings de volta em arrays PHP.
        $uso = explode(",", $residuo['uso']);
        $materiais = explode(",", $residuo['materiais']);

        // Retorna os dados do resíduo encontrado no formato JSON (JavaScript Object Notation).
        // Este formato é facilmente interpretado por JavaScript no lado do cliente.
        echo json_encode([
            "id" => $residuo['id'],
            "gasto_mensal" => $residuo['gasto_mensal'],
            "residuo_mensal" => $residuo['residuo_mensal'],
            "uso" => $uso,
            "materiais" => $materiais
        ]);
    } else {
        // Caso nenhum resíduo com o ID fornecido seja encontrado no banco de dados,
        // retorna um objeto JSON contendo uma mensagem de erro.
        echo json_encode(["error" => "Resíduo não encontrado."]);
    }
} else {
    // Caso o parâmetro 'id' não seja passado na URL ou esteja vazio,
    // retorna um objeto JSON contendo uma mensagem de erro indicando a ausência do ID.
    echo json_encode(["error" => "ID não fornecido."]);
}
?>