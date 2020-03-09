<?php

// Сущность слона
class Elephant
{
    // Параметры слона в см. и гр.
    const ELEPH_WEIGHT = [190, 210];
    const TRUNK_LENGHT = [14, 16];

    // Определить лежит ли значение в промежутке включительно
    private function checkBetween(int $value, int $leftVal, int $rightVal): bool
    {
        $result = true;
        $result &= $value >= $leftVal;
        $result &= $value <= $rightVal;
        return $result;
    }

    // Проверка массы слона
    public function checkWeight(int $value, int $lWeight = null, int $rWeight = null): bool
    {
        $lWeight = $lWeight ?? self::ELEPH_WEIGHT[0];
        $rWeight = $rWeight ?? self::ELEPH_WEIGHT[1];
        return $this->checkBetween($value, $lWeight, $rWeight);
    }

    // Проверка длины хобота
    public function checkTrunk(int $value, int $lTrunk = null, int $rTrunk = null): bool
    {
        $lTrunk = $lTrunk ?? self::TRUNK_LENGHT[0];
        $rTrunk = $rTrunk ?? self::TRUNK_LENGHT[1];
        return $this->checkBetween($value, $lTrunk, $rTrunk);
    }
}
