<%-- 
    Document   : index
    Created on : May 9, 2014, 4:55:02 AM
    Author     : rafael
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="js/jquery.min.js"></script>
        <script src="js/classes.js"></script>
        <script src="js/qce.js"></script>
        <script src="js/login.js"></script>
        <script src="js/loader.js"></script>
        <link rel="stylesheet" type="text/css" href="style/styles.css"/>
        <script>
            $("document").ready(function (){
//              verificar e validar ticket 
//              se nao ticket pedir login
                //user = {};  //look and load cookie
                if(!verifyTicket(user.ticket)){
                    loginPop();
                } else {
                    loadPage();
                }
            });
           </script>
        <title></title>
    </head>
    <body>
        <div id="container">
            <div id="title"><p></p></div>
            <div id="info"><p>project info</p></div>
            <div id="select"><p>menu</p></div>
            <div id="mainframe"></div>
        </div>
    </body>
</html>
