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


function loadUser(callback) {
    $.ajax(
       {type:'GET',
        url:'../alfresco/service/api/people/'+user.name+'?alf_ticket='+user.ticket,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        cache:false,
        
        success: function(data){
            callback(data);
        },
        error: function (xhr, ajaxOptions, thrownError){ 
            console.log(xhr+" "+thrownError);
        }
       }
   );
}




function loadPage(){
    $("#login").remove();
    $("#container").show();
    $("#mainframe").text("loaded "+user.name);
}


function createProjectPop(){
    verifyTicket(function (){
        function loadSelect(){
            for (i in projects){
                var shortname = projects[i].shortName;
                $("<option value="+shortname+">"+shortname+"</option>").appendTo($("#selectproject"));
            }
        }
        var pop = $("<div id='projectpop'></div>").appendTo($("body"));
        pop.addClass("popup");
        var body = "<div id='shaper'>\n\
                        <select id='selectproject'></select>\n\
                        <div class='bottombutton'>\n\
                            <button id='close'>close</button>\n\
                        </div>\n\
                    </div>\n\
        ";
        $(body).appendTo(pop);
        $("#close").on("click",function(){$("#projectpop").remove();});
        if (typeof(projects) !== "undefined" && projects) 
        {
            loadSelect();
        } else {
            getProjects(loadSelect);
        }
    });
}

// 
function getProjects(callback){
    $.ajax(
    {
        type:'GET',
        url:'../alfresco/service/api/sites?alf_ticket='+user.ticket,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        cache:false,
        success: function(data){
            console.log(data);
            window.projects = data;
            callback();
        },
        error: function (xhr, ajaxOptions, thrownError){ 
            console.log(xhr+" "+thrownError);
        }
    }
    );
}