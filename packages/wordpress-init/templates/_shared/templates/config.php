<?php

$protocol = empty($_SERVER["HTTPS"]) ? "http://" : "https://";
$host = $_SERVER["HTTP_HOST"];
$rootUrl = $protocol . $host;
$api = home_url() . "/wp-json" . "/" . API_ENDPOINT;
$baseUrl = str_replace($rootUrl, "", home_url());

?>

<script id="react-on-php-config" type="text/javascript">
  window.config = {
    "siteTitle": "<?php bloginfo("name") ?>",
    "siteDescription": "<?php bloginfo("description") ?>",
    "appId": "",
    "buildId": "",
    "api": "<?php echo $api; ?>",
    "baseUrl": "<?php echo $baseUrl; ?>",
    "staticUri": "<?php echo get_template_directory_uri() . "/static"; ?>"
  };
</script>
