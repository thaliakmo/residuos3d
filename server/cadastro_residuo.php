<?php

include "config.php"; // Inclui o arquivo de configuração que estabelece a conexão com o banco de dados.

// Recupera os dados enviados através do método POST.
// O operador de coalescência nula (??) é utilizado para definir um valor padrão caso a chave não exista no $_POST.
$uso = $_POST['uso'] ?? []; // Recupera o array de tipos de uso selecionados, ou um array vazio se não estiver definido.
$materiais = $_POST['materiais'] ?? []; // Recupera o array de materiais selecionados, ou um array vazio se não estiver definido.
$gasto_mensal = $_POST['gasto_mensal'] ?? 0; // Recupera a estimativa de gasto mensal, ou 0 se não estiver definida.
$residuo_mensal = $_POST['residuo_mensal'] ?? 0; // Recupera a estimativa de resíduo mensal, ou 0 se não estiver definida.
$usuario_id = $_POST['usuario_id'] ?? ''; // Recupera o ID do usuário que está cadastrando o resíduo.
$disponibilizado = true; // Define o status inicial do resíduo como disponível (TRUE, que será armazenado como 1 no banco).

// Garante que as variáveis $uso e $materiais sejam sempre arrays, mesmo que apenas um valor seja selecionado.
if (!is_array($uso)) {
    $uso = [$uso]; // Se não for um array, transforma em um array com o único valor.
}
if (!is_array($materiais)) {
    $materiais = [$materiais]; // Se não for um array, transforma em um array com o único valor.
}

// Converte os arrays de 'uso' e 'materiais' em strings separadas por vírgula.
// Isso facilita o armazenamento de múltiplos valores em um único campo no banco de dados.
$uso_string = implode(",", $uso); // Junta os elementos do array 'uso' com vírgula como separador.
$materiais_string = implode(",", $materiais); // Junta os elementos do array 'materiais' com vírgula como separador.

// Prepara e executa a query de inserção para adicionar o novo resíduo ao banco de dados.
// A inserção só ocorrerá se o 'usuario_id' for fornecido, garantindo que o resíduo esteja associado a um usuário.
if ($usuario_id) {
    // Define a string SQL para a inserção de dados na tabela 'residuos'.
    // As colunas 'usuario_id', 'uso', 'materiais', 'gasto_mensal', 'residuo_mensal' e 'disponibilizado' serão preenchidas.
    $sql = "INSERT INTO residuos (usuario_id, uso, materiais, gasto_mensal, residuo_mensal, disponibilizado)
                    VALUES (?, ?, ?, ?, ?, ?)";
    // Prepara a query SQL para evitar SQL injection.
    $stmt = $conn->prepare($sql);
    // Vincula os parâmetros da query com os valores correspondentes.
    // "issddi" indica os tipos de dados esperados:
    // i: integer (para usuario_id e disponibilizado)
    // s: string (para uso_string e materiais_string)
    // d: double (para gasto_mensal e residuo_mensal)
    $stmt->bind_param("issddi", $usuario_id, $uso_string, $materiais_string, $gasto_mensal, $residuo_mensal, $disponibilizado);
    // Executa a query preparada.
    $success = $stmt->execute();

    // Verifica se a execução da query foi bem-sucedida.
    if ($success) {
        // Se a inserção for bem-sucedida, retorna uma resposta JSON com status de sucesso e uma mensagem.
        echo json_encode(["status" => "sucesso", "message" => "Resíduo cadastrado com sucesso!"]);
    } else {
        // Se ocorrer algum erro durante a inserção, retorna uma resposta JSON com status de erro e a mensagem de erro do MySQL.
        echo json_encode(["status" => "erro", "message" => "Erro ao cadastrar resíduo: " . $stmt->error]);
    }
} else {
    // Se o 'usuario_id' não for fornecido (indicando um problema de autenticação ou na passagem do ID),
    // retorna uma resposta JSON com status de erro e uma mensagem indicando que o usuário não está autenticado.
    echo json_encode(["status" => "erro", "message" => "Erro: Usuário não autenticado."]);
}

// Fecha a conexão com o banco de dados para liberar recursos.
$conn->close();

?>