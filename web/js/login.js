//  desenho do layer de login

user = {}; //pog
function loginPop(){
    $("#container").hide();
    login = $("<div id='login' class='login'></div>").appendTo($("body"));
    form = "<div id='cell'>\n\
                <form>\n\
                <img src='images/LIOc-Logo.png' id='im' height='90'>\n\
                    <table id='loginTable'>\n\
                        <tr>\n\
                            <td>Usuario:</td>\n\
                            <td>\n\
                                <input id='user'>\n\
                            </td>\n\
                        </tr>\n\
                        <tr>\n\
                            <td>Senha:</td>\n\
                            <td>\n\
                                <input id='passwd' type='password'>\n\
                            </td>\n\
                        </tr>\n\
                        <tr>\n\
                            <td colspan='2'>\n\
                                <button type='button'onclick='Javascript:Login()'>Entrar</button>\n\
                            </td>\n\
                        </tr>\n\
                    </table>\n\
                </form>\n\
            </div>";
    login.addClass("login");
    $(form).appendTo(login);
    $("#user").keyup(function(event){
        if(event.keyCode === 13){
            $("#login button").click();
        }
    });
    $("#passwd").keyup(function(event){
        if(event.keyCode === 13){
            $("#login button").click();
        }
    });
}

//  recupera os dados do form
//  faz o pedido de login
//  trata e informa o resultado
//  ?callback

function Login() {
    user.name = $("#user").val();
    createCookie("name",user.name);
    user.password = $("#passwd").val();
    user.ticket = null;
    $(".login button").attr("disabled","true");
    $("#errormsg").remove();
    ajaxLogin(user);
}

//  logout no restful
//  apaga cookie e variavel

function logout() {
    user.ticket=null;
    eraseCookie("ticket");
}

//  pedido POST de login via ajax

function ajaxLogin() {
    $.ajax(
       {type:'POST',
        url:'../alfresco/service/api/login',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        cache:false,
        data:JSON.stringify({"username":user.name,"password":user.password}),
        
        success: function(data){
            //callBack(responseData);
            console.log(data.data.ticket);
            user.ticket= data.data.ticket;
            createCookie("ticket",user.ticket);
            loadPage();
        },
        error: function (xhr, ajaxOptions, thrownError){ 
            //alert('deu ruim '+xhr.responseText());
            console.log(xhr+" "+thrownError);
            $(".login button").removeAttr("disabled");
            $(".login button").before($("<i id='errormsg'>usuario ou senha invalidos</i>"));
            $("#passwd").val("");
        }
       }
   );
}

// verificador de existencia de ticket
// chamar sempre que houver calls do alfresco

function verifyTicket(callback){
    ticketexists = typeof(user.ticket);
    if( ticketexists === "string"){
        console.log("ticket existe");
        $.ajax({
                type:'GET',
                url:'../alfresco/service/api/login/ticket/'+user.ticket+'?alf_ticket='+user.ticket,
                statusCode: {
                    200: function (response) { //ticket ainda valido
                        callback();
                        console.log('ticket valido');
                    },
                    404: function (response) {
                        console.log('ticket invalido');
                        user.ticket=null;
                        loginPop();
                    },
                    401: function (response) {
                        console.log('ticket inexistente, wtf');
                        user.ticket=null;
                        loginPop();
                    }
                }});
        //validate GET >> senao valido ask login
    } else {
        console.log("ticket nao existe");
        loginPop();
    }
}