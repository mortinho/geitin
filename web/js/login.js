//  desenho do layer de login
user = {};
function loginPop(){
    $("#container").hide();
//    style = "position: absolute; left:50%; top: 50%; margin: auto; height: 250px; margin-top: -125px; width:500px; margin-left: -250px; text-align: center; background-color: red;";
    login = $("<div id='login' class='login'></div>").appendTo($("body"));
    form = "<div id='cell'><form><table id='loginTable'><tr><td>user:</td><td><input id='user'></td></tr><tr><td>password:</td><td><input id='passwd' type='password'></td></tr><tr><td colspan='2'><button type='button' \n\
            onclick='Javascript:Login()'\n\
            >login</button></td></tr></table></form></div>";
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

function logout() {
    user.ticket=null;
    eraseCookie("ticket");
}

//  pedido POST de login via ajax,
//  parametros: user { name , password }
//  retorno: user { name , password , ticket }

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
//            alert(user.ticket);
//            $(xml).find('ticket').each(function(){
//                console.log($(this).text());
//            })
        },
        error: function (xhr, ajaxOptions, thrownError){ 
            //alert('deu ruim '+xhr.responseText());
            console.log(xhr+" "+thrownError);
            $(".login button").removeAttr("disabled");
            $(".login button").before($("<i id='errormsg'>usuario ou senha invalidos</i>"));
            //$('#div_tabela_com_header').removeClass('loading');
        }
       }
   );
}

// verificador de existencia de ticket

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