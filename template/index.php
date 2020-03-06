<!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <title>List of templates</title>
    <style>
        td {
            padding: 0 20px;
        }
    </style>
</head><body>
<table>
<?php
$dir = ".";
$files = scandir($dir);
$files = array_diff($files, array('..', '.', 'index.php'));
foreach($files as $val) {
    $url = urlencode($val);
    echo('<tr><td>'.$val.' </td><td> <a href="../?open=template%2F'.$url.'"> Open in emulator</a> </td><td> <a href="'.$url.'">view in browser</a></td></tr>');
}
?>
</table>
</body></html>
