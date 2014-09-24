/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// parser de parametros de url, null se nao existir

function getDashboardMenu(projectList) {
    dashboardMenu = {
        "Projetos": {
            "Criar": "",
            "Favorito": "",
            "Mais...": projectList
        },
        "Supervisão": {
            "Automática": "?",
            "Favorito": "",
            "Mais...": projectList
        },
        "Sair": "javascript:logout();loginPop();"
    };
    return dashboardMenu;
}

function getProjectMenu(projectList) {
    projectMenu = {
        "Ciclos": {
            "Mostrar": "",
            "Editar": ""
        },
        "EAP": {
            "Mostrar": "",
            "Editar": "",
            "Criar": ""
        },
        "Supervisão": {
            "Automática": "",
            "Favorito": "",
            "Mais...": projectList
        },
        "Relatórios": {
            "QCE": "",
            "Gantt": "",
            "EAP": "",
            "Supervisão": "",
            "Buscar": ""
        },
        "Documentos": "",
        "Projetos": {
            "Criar": "",
            "Favorito": "",
            "Mais...": projectList
        },
        "Sair": "javascript:logout();loginPop();"
    };
    return projectMenu;
}


function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1];
        }
    }
    return null;
}


function loadUser(callback) {
    $.ajax(
            {type: 'GET',
                url: '../alfresco/service/api/people/' + user.name + '?alf_ticket=' + user.ticket,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                cache: false,
                success: function(data) {
                    callback(data);
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log(xhr + " " + thrownError);
                }
            }
    );
}




function loadPage(projeto) {
    $("#login").remove();
    $("#container").show();
    currentProject = null;
    if (projeto) {
        getProjects(function() {
            currentProject = null;
            projectList = {};
            for (i in projects) {
                if (projects[i].shortName === projeto) {
                    currentProject = projects[i];
                } else {
                    tempName = projects[i].shortName;
                    projectList[tempName] = "?projeto="+tempName;
                }
            }
            if (currentProject) {
                //load project page >> make another function for this dummy
                addMenu(getProjectMenu(projectList));
                $("#title h1").text(currentProject.title);
            } else {
                loadPage();
            }

        });
    } else {
        //load user dashboard
        
        loadUser(function(data) {
            user.data = data;
            addMenu(getDashboardMenu());
            getProjects(function (){
                projectList = {};
                for (i in projects){
                    tempName = projects[i].shortName;
                    projectList[tempName] = "?projeto="+tempName;
                }
                addMenu(getDashboardMenu(projectList));
            });
            $("#title h1").text("Olá, " + user.data.firstName + " " + user.data.lastName);
        });

    }
}

function createProjectPop() {
    verifyTicket(function() {
        function loadSelect() {
            for (i in projects) {
                var shortname = projects[i].shortName;
                $("<option value=" + shortname + ">" + shortname + "</option>").appendTo($("#selectproject"));
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
        $("#close").on("click", function() {
            $("#projectpop").remove();
        });
        if (typeof (projects) !== "undefined" && projects)
        {
            loadSelect();
        } else {
            getProjects(loadSelect);
        }
    });
}

// 
function getProjects(callback) {
    $.ajax(
            {
                type: 'GET',
                url: '../alfresco/service/api/sites?alf_ticket=' + user.ticket,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                cache: false,
                success: function(data) {
                    console.log(data);
                    window.projects = data;
                    callback();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log(xhr + " " + thrownError);
                }
            }
    );
}

function addMenu(custom, parent) {
    var drop = $("<ul></ul>");
    if (custom) {
        for (i in custom) { // text : onclick or menu
            li = $("<li></li>").appendTo(drop);
            if (custom[i] && (typeof (custom[i]) === "function")) {
                addButtons(i, li, custom[i]);
            } else if (typeof (custom[i]) === "object") {
                addButtons(i, li);
                addMenu(custom[i], li);
            } else if ((typeof (custom[i]) === "string") && (custom[i])) {
                addButtons(i, li, goUrl, custom[i]);
            } else {
                addButtons(i, li);
            }
        }
    }



    if (parent) {
        drop.addClass("subdrop");
        drop.appendTo(parent);
        parent = null;
    } else {
        $("#mainmenu").remove();
        select = $("#select");
        drop.addClass("dropdown");
        drop.attr("id", "mainmenu");
        drop.appendTo(select);

        //update hover
        $("ul.dropdown li").hoverIntent(function() {
            $(this).addClass("hover");
            ulChild = $('ul:first', this).hide();
            ulChild.hide();
            ulChild.css('visibility', 'visible');
            ulChild.slideDown(200);
        }, function() {
            $(this).removeClass("hover");
            $('ul:first', this).css('visibility', 'hidden');
        });
    }
}

function addButtons(text, parent, onclick,url) {
    bt = $("<button>" + text + "</button>").appendTo(parent);
    if (onclick) {
        bt.on("click", onclick);
    }
    if (url) {
        bt.attr("url",url);
    }
}

function goUrl(){
    window.location = $(this).attr("url");
}