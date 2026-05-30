<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "emoji_quiz");

$data = json_decode(file_get_contents("php://input"), true);

$result = $conn->query(
    "INSERT INTO riddles (title, answer)
     VALUES ('{$data['title']}', '{$data['answer']}')"
);

if ($result) {
    echo json_encode([
        "success" => true
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Adding riddle failed: " . $conn->error
    ]);
}

$conn->close();
