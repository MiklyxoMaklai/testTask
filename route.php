<?php

spl_autoload_register(function ($className) {
    require_once(__DIR__.'/classes/'.$className.'.php');
});

$result = [];
$error = true;

switch ($_POST['route']) {
    case 'check':
        $skip = false;
        if (isset($_POST['weigth'], $_POST['length'])) {
            if (ctype_digit($_POST['weigth']) && ctype_digit($_POST['length'])) {
                $error = false;
                $weight = intval($_POST['weigth']);
                $lenght = intval($_POST['length']);

                $eleph = new Elephant();
                $skip = $eleph->checkWeight($weight) && $eleph->checkTrunk($lenght);

                $storage = new Storage();
                $storage->pushStorage('result', [$weight, $lenght, $skip]);
            }
        }
        $result = ['skip' => $skip, 'error' => $error];
        break;
    case 'report':
        $storage = new Storage();
        $report = $storage->pullStorage('result');

        // Отфильтровываем и считаем только бракованных слонов
        $defect = array_filter($report, function ($val, $key) {
            return $val[2] === false;
        }, ARRAY_FILTER_USE_BOTH);

        sort($defect);
        $result = [
            'result' => $defect,
            'countSkip' => (count($report) - count($defect)),
            'countDefect' => count($defect)
        ];
        break;
}


// Имитация задержки ответа от сервера
sleep(2);

header('Content-Type: application/json');
echo json_encode($result);
