/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// parser de parametros de url, null se nao existir


function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0]===sParam) {
            return sParameterName[1];
        }
    }
    return null;
}


//passagem do usuario usado no login talvez seja mais interessante
function loadUser(user) {
    $.ajax(
       {type:'GET',
        url:'../alfresco/service/api/people/'+user.name+'?alf_ticket='+user.ticket,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        cache:false,
        
        success: function(data){
            //callBack(responseData);
            console.log(data.firstName);
            for(v in data){
                
                console.log(v,": ",data[v]);
            }
            info = data;
        },
        error: function (xhr, ajaxOptions, thrownError){ 
            console.log(xhr+" "+thrownError);
            info = null;
        }
       }
   );
   return info;
}




function loadPage(){
    $("#login").remove();
    $("#container").show();
    $("#mainframe").text("loaded "+user.name);
}