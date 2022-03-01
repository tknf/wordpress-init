<?php

/**
 * @var string "development" or "production"
 */
const ENV = "development";
// const ENV = "production"

/**
 * @var string
 * Endpoint for WP REST API
 */
const API_ENDPOINT = "wp/v2";

/**
 * Email SMTP settings
 */
if (ENV === "development") {
  define("MAIL_TO", "to@example.com");
  define("MAIL_FROM", "from@example.com");
  define("SMTP_AUTO_TLS", false);
  define("SMTP_USER", "smtpuser");
  define("SMTP_PASS", "password");
  define("SMTP_HOST", "127.0.0.1");
  define("SMTP_ENCRYPT", "");
  define("SMTP_PORT", 1025);
  define("SMTP_AUTH", false);
  define("SMTP_DEBUG", 3);
} else {
  define("MAIL_TO", "to@example.com");
  define("MAIL_FROM", "from@example.com");
  define("SMTP_AUTO_TLS", true);
  define("SMTP_USER", "");
  define("SMTP_PASS", "");
  define("SMTP_HOST", 'host_fourni_par_hebergeur');
  define("SMTP_ENCRYPT", "tls");
  define("SMTP_PORT", 587);
  define("SMTP_AUTH", true);
  define("SMTP_DEBUG", 0);
}

?>
