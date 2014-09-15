<%-- 
    Document   : index
    Created on : May 9, 2014, 4:55:02 AM
    Author     : rafael
--%>

<!--listar o "mais..."-->

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
        <script src="js/jquery.hoverIntent.minified.js"></script>
        <link rel="stylesheet" type="text/css" href="style/styles.css"/>
        <script>
            $("document").ready(function (){
                $("ul.dropdown li").hoverIntent(function(){
                        $(this).addClass("hover");
                        ulChild = $('ul:first',this).hide();
                        ulChild.css('visibility', 'visible');
                        ulChild.slideDown(200);
                    }, function(){
                        $(this).removeClass("hover");
                        $('ul:first',this).css('visibility', 'hidden');
                });
                
//                user.ticket = ???;  //look and load cookie
                console.log('ticket: '+user.ticket);
                user.ticket = readCookie("ticket");
                user.name = readCookie("name");
                if(user.ticket){
//              se nao ticket pedir login
                    loadPage(getUrlParameter("projeto"));
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
                <!--Dynamify this-->
                
                
                
<!--                <ul class='dropdown' id="mainmenu">
                    <li>
                        <button>
                                onclick="Javascript:createProjectPop();"
                                Projetos</button>
                        <ul class='subdrop'>
                            <li>
                                <button onclick='Javascript:createProjectPop();'>Criar Projeto</button>
                            </li>
                            <li>
                                <button>BMOP</button>
                            </li>
                            <li>
                                <button>Mais...</button>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <button onclick="Javascript:logout();">Supervisão</button>
                        <ul class='subdrop'>
                            <li>
                                <button>Automática</button>
                            </li>
                            <li>
                                <button>BMOP</button>
                            </li>
                            <li>
                                <button>Mais...</button>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <button onclick="Javascript:logout();loginPop();">Sair</button>
                    </li>
                </ul>-->
                
                
                <!--end dynamify-->
            </div>
            <div id="mainframe"></div>
            <div id="footer"></div>
        </div>
    </body>
</html>
