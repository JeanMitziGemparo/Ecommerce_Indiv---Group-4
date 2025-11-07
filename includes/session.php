<?php
if (!function_exists('ensure_session_started')) {
    function ensure_session_started(): void {
        if (session_status() === PHP_SESSION_ACTIVE) return;
        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
        if (session_name() === 'PHPSESSID') {
            @session_name('ESHOPSESSID');
        }
        $params = session_get_cookie_params();
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => $params['path'] ?? '/',
            'domain' => $params['domain'] ?? '',
            'secure' => $isHttps,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        @session_start();
    }
}

if (!function_exists('logout_and_destroy_session')) {
    function logout_and_destroy_session(): void {
        ensure_session_started();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        @session_destroy();
    }
}

ensure_session_started();
?>

