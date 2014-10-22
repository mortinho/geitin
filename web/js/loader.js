//
// html changing functions
//



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


// updates menu entries' hover function

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


// url parser, null for not found

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


// hide main page and create a login box

function loginPop() {
    $("#container").hide();
    login = $("<div id='login' class='login'></div>").appendTo($("body"));
    // move this html? 
    form = "<div id='cell'>\n\
                <form>\n\
                <img src='images/LIOc-Logo.png' id='im' height='90'>\n\
                    <table id='loginTable'>\n\
                        <tr>\n\
                            <td>Usuario:</td>\n\
                            <td>\n\
                                <input id='user' type='text' name='username'/>\n\
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
    $("#user").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#login button").click();
        }
    });
    $("#passwd").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#login button").click();
        }
    });
}


// Main page draw

function loadPage(projeto) {
    $("#login").remove();
    $("#container").show();
    currentProject = null;
    if (projeto) {  // then load the project page if possible
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
                    $.each(projectList, function(pname, project) {
                        $.each(user.sites, function(index, site) {
                            if (site.shortName === projeto)
                                inSite = true;
                            if (site.shortName === pname)
                                myList[pname] = project;
                        });
                    });

                    //access level visual test                                           TBR
                    if (!inSite)
                        title = title + "<br>Guest";
                    if ($.inArray(user.name, currentProject.siteManagers) >= 0)
                        title = title + "<br>Admin";

                    addMenu(getProjectMenu(myList));
                    $("#title h1").html(title);
                });
            } else {
                loadPage();
            }

        });
    } else { // load user dashboard
        loadUser(function(data) {
            addMenu(getDashboardMenu());
            getUserSites(function() {
                projectList = {};
                $.each(user.sites, function(index, site) {
                    tempName = site.shortName;
                    projectList[tempName] = "?projeto=" + tempName;
                });
                addMenu(getDashboardMenu(projectList));
            });
            $("#title h1").text("Olá, " + user.data.firstName + " " + user.data.lastName); // change to a function for simpler later changes
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
        //move html?

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


// create menu from object
// string > link
// object > dropdown
// function > call

function addMenu(custom, parent) {
    var drop = $("<ul></ul>");
    if (custom) {
        $.each(custom, function(index, customI) {// text : onclick or menu
            li = $("<li></li>").appendTo(drop);
            if (customI && (typeof (customI) === "function")) {
                addButtons(index, li, customI);
            } else if (typeof (customI) === "object") {
                addButtons(index, li);
                addMenu(customI, li);
            } else if ((typeof (customI) === "string") && (customI)) {
                addButtons(index, li, goUrl, customI);
            } else {
                addButtons(index, li);
            }
        });
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
    if (window.history.pushState) {
        window.history.pushState({}, document.title, $(this).attr("url"));
        loadPage(getUrlParameter("projeto"));
    } else {
        window.location = $(this).attr("url");
    }
}




//botoes

//favorito ?