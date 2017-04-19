<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <link rel="stylesheet" href="/[{(PATH.LIB)}]/[{(PATH.STYLESHEETS)}]/[{(PATH.CSS)}]/[{(PATH.BIN)}]/[{(NAMESPACE)}].css">
        <link rel="stylesheet" href="lib/resources/css/fb.css">
        <script src="/node_modules/imazzine-developer-kit/node_modules/google-closure-library/closure/goog/base.js"></script>
        <script>goog.require("goog.soy");</script>
        <script>window[ 'WS_SERVER_HOST' ] = '[{(IDE.WS_SERVER_HOST)}]';</script>
        <script>window[ 'WS_SERVER_PORT' ] = '[{(IDE.WS_SERVER_PORT)}]';</script>
        <script>window[ 'WS_SERVER_PATH' ] = '[{(IDE.WS_SERVER_PATH)}]';</script>
        <script src="/node_modules/imazzine-developer-kit/[{(PATH.BIN)}]/[{(PATH.TEMPLATES)}]/soyutils_usegoog.js"></script>
        <script src="/[{(PATH.LIB)}]/[{(PATH.SOURCES)}]/deps.js"></script>
        <script src="/[{(PATH.LIB)}]/[{(PATH.SOURCES)}]/base.js"></script>
    </head>
    <body>
        <div id="root"></div>
        <script>[{(NAMESPACE)}].bootstrap( );</script>
    </body>
</html>