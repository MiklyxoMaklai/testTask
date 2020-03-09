<?php

// Отвечает за храние данных
class Storage
{
    const SESSION_NAME = 'elphReport';

    function __construct(string $sessionName = null)
    {
        $sessionName = $sessionName ?? self::SESSION_NAME;
        session_name($sessionName);
        session_start();
    }

    // Поместить данные в хранилище
    public function pushStorage(string $key, array $value)
    {
        $_SESSION[$key][] = $value;
    }

    // Получить данные из хранилища
    public function pullStorage(string $key)
    {
        return isset($_SESSION[$key]) ? $_SESSION[$key] : [];
    }
}
