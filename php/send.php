<?php
$to   = "roger@furo.xyz"; // Куда
$from = "roger@furo.xyz"; // Откуда
$name = "Посетитель Furo.xyz"; // Отправитель
$text =  $_POST['text'];

$subject ='=?utf-8?B?'. base64_encode("На связи Furo.xyz").'?='; // Тема письма
$headers  = "From: =?utf-8?B?".base64_encode($name) ."?= <$from>\n";  
$headers .= 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

$mes      = "<h2>Текст письма: </h2><p>" // Заголовок 1
			.$text.
			"</p>";



{
     mail($to, $subject, $mes, $headers);  
}


?>