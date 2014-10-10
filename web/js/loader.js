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
        "Início": "?projeto=",
        "Ciclos": {
            "QCE": "",
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

function updateHover(Jobj) {
    Jobj.hoverIntent(function() {
        $(this).addClass("hover");
        ulChild = $('ul:first', this).hide();
        ulChild.hide();
        ulChild.css('visibility', 'visible');
        ulChild.slideDown(300);
    }, function() {
        $(this).removeClass("hover");
        $('ul:first', this).css('visibility', 'hidden');
    });
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

// fetch sites the user is a part of
//ticket validate?
function getUserSites(callback) {
    if (typeof (user.sites !== "object")) {
        $.ajax(
                {type: 'GET',
                    url: '../alfresco/service/api/people/' + user.name + '/sites?alf_ticket=' + user.ticket,
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    cache: false,
                    success: function(data) {
                        user.sites = data;
                        callback(data);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log(xhr + " " + thrownError);
                    }
                }
        );
    } else {
        callback();
    }

}

function getManageableSites(callback) {
    getUserSites(function() {
        for (i in user.sites) {
            for (m in user.sites[i].siteManagers) {
                if (user.name === user.sites[i].siteManagers[m])
                    user.sites[i].isManager = true;
                else 
                    user.sites[i].isManager = false;
            }
        }
        callback();
    });
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
                    projectList[tempName] = "?projeto=" + tempName;
                }
            }
            if (currentProject) {
                getManageableSites(function(data) {
                    myList = {};
                    title = currentProject.title;
                    inSite = false;
                    for (i in projectList) {
//                        for (m in data) {
//                            if (data[m].shortName === projeto)
//                                inSite = true;
//                            if (data[m].shortName === i)
//                                myList[i] = projectList[i];
//                        }
                        $.each(user.sites,function (index, site){
                            if (site.shortName === projeto)
                                inSite = true;
                            if (site.shortName === i)
                                myList[i] = projectList[i];
                        });
                    }
                    
                    //access level visual test TBR
                    if (!inSite)
                        title = title + "<br>Guest";
                    if ($.inArray(user.name, currentProject.siteManagers)>=0)
                        title = title + "<br>Admin";
                    
                    addMenu(getProjectMenu(myList));
                    $("#title h1").html(title);
                });
            } else {
                loadPage();
            }

        });
    } else {
        //load user dashboard

        loadUser(function(data) {
            user.data = data;
            addMenu(getDashboardMenu());
            getUserSites(function() {
                projectList = {};
                for (i in user.sites) {
                    tempName = user.sites[i].shortName;
                    projectList[tempName] = "?projeto=" + tempName;
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

//now useless...?  >>> projects from DB
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

// create menu from object
// string > link
// object > dropdown
// function > call

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
        updateHover($("ul.dropdown li"));
    }
}

function addButtons(text, parent, onclick, url) {
    bt = $("<button>" + text + "</button>").appendTo(parent);
    if (onclick) {
        bt.on("click", onclick);
    }
    if (url) {
        bt.attr("url", url);
    }
}


// change to push url + loadPage(prj)




//to do next
function goUrl() {
    window.location = $(this).attr("url");
}



//inicio
//
//ciclo > qce
//
//botoes
//
//timeout ticket
//
//favorito ?