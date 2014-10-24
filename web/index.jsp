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
        <script src="js/lib/jquery.min.js"></script>
        <script src="js/project.js"></script>
        <script src="js/user.js"></script>
        <script src="js/qce.js"></script>
        <script src="js/login.js"></script>
        <script src="js/loader.js"></script>
        <script src="js/lib/cookies.js"></script>
        <script src="js/lib/jquery.hoverIntent.minified.js"></script>
        <link rel="stylesheet" type="text/css" href="style/styles.css"/>
        <script>
            $("document").ready(function() {
                user.favorites = ["swsdp","lioc"];
                //$("#favstar").hide();
                window.onpopstate = function (e){
                    loadPage(getUrlParameter("projeto"));
                }
                user.ticket = readCookie("ticket");
                user.name = readCookie("name");
                if (user.ticket) { // logged in verification
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
            <div id="title"><p><h1></h1></p><div id="bottomtitle"><img id="favstar" src="images/starempty.png" isfav="false" onclick="javascript:toggleFav();"><img id="helpbutton"></div></div>
            <div id="select">
                <p></p>
            </div>
            <div id="mainframe"></div>
            <div id="footer"></div>
        </div>
    </body>
</html>
