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
        <script src="js/cookies.js"></script>
        <link rel="stylesheet" type="text/css" href="style/styles.css"/>
        <script>
            $("document").ready(function (){
//                user.ticket = ???;  //look and load cookie
                console.log('ticket: '+user.ticket);
                user.ticket = readCookie("ticket");
                user.name = readCookie("name");
                if(user.ticket){
//              se nao ticket pedir login
                    loadPage();
                } else {
                    loginPop();
                    $("#user").val(user.name);
                }
            });
           </script>
        <title></title>
    </head>
    <body>
        <div id="container">
            <div id="title"><p><h1></h1></p></div>
            <div id="select"><p></p>
                <button>
<!--                        onclick="Javascript:createProjectPop();"-->
                        Projetos</button>
                    <button onclick="Javascript:logout();">Supervisão</button>
                    <button onclick="Javascript:logout();loginPop();">Sair</button>
            </div>
            <div id="mainframe"></div>
            <div id="footer"></div>
        </div>
    </body>
</html>
