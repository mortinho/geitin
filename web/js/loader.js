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

function createPop() {
    if (!$("#pop")[0]) {
        var helpText = '<h2>CRIAR PROJETO</h2><BR>\n\
                    - É uma "pop-up" na página "Usuário"<BR>\n\
                    - Escolher um site do Alfresco, o qual o usuário seja Manager, e que ainda não seja projeto no GEITIN<BR><BR>\n\
                    <h2>SUPERVISÃO AUTOMÁTICA</h2><BR>\n\
                    - Aparece automaticamente quando a página é carregada ou na solicitação de “Supervisão Automática”<BR>\n\
                    - Lista somente as atualizações pendentes<BR>\n\
                    e necessitando de novo status, deste usuário.<BR><BR>\n\
                    <h2>SUPERVISÃO POR PROJETO</h2><BR>\n\
                    - Lista todos os itens que possibilitam supervisão por esse usuár<BR>\n\
                    io, no projeto escolhido. Inclusive os itens de outros usuários<BR>\n\
                    , os quais<BR>\n\
                    são hierarquicamente abaixo dele.<BR>\n\
                    - Listar por usuário e em ordem alfabética<BR><BR>\n\
                    Observações:<BR>\n\
                    “Ciclos”- Mostra o QCE ou edita algo que pertence somente a aquele<BR>\n\
                    Ciclo, isto é, não poderá gerar mudanças nos Ciclos seguintes<BR>';

        var pop = $("<div id='pop'></div>").appendTo($("body"));
        pop.addClass("popup");
        var body = "<div id='shaper'>\n\
                        <div class='bottombutton'>\n\
                            <button id='close'>close</button>\n\
                        </div>\n\
                        <p>" + helpText + "</p>\n\
                    </div>\n\
        ";
        $(body).appendTo(pop);
        $("#close").on("click", function() {
            $("#pop").remove();
        });
//        function loadSelect() {
//            for (i in projects) {
//                var shortname = projects[i].shortName;
//                $("<option value=" + shortname + ">" + shortname + "</option>").appendTo($("#selectproject"));
//            }
//        }
    }
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
    user.currentProject = null;
    if (projeto) {  // then load the project page if possible
        getProjects(function() {
            user.currentProject = null;
            projectList = {};
            for (i in projects) {
                if (projects[i].shortName === projeto) {
                    user.currentProject = projects[i];
                } else {
                    tempName = projects[i].shortName;
                    projectList[tempName] = "?projeto=" + tempName;
                }
            }
            if (user.currentProject) {
                getManageableSites(function(data) {
                    myList = {};
                    title = user.currentProject.title;
                    inSite = false;
                    $.each(projectList, function(pname, project) {
                        $.each(user.sites, function(index, site) {
                            if (site.shortName === projeto)
                                inSite = true;
                            if (site.shortName === pname)
                                myList[pname] = project;
                        });
                    });

                    //favorite check

                    if ($.inArray(user.currentProject.shortName, user.favorites) >= 0) {
                        isfav = true;
                    } else {
                        isfav = false;
                    }
                    loadFav(isfav);
                    $("#favstar").show();

                    //access level visual test                                           TBR

                    if (!inSite)
                        title = title + "<br>Guest";
                    if ($.inArray(user.name, user.currentProject.siteManagers) >= 0)
                        title = title + "<br>Admin";
                    menu = getProjectMenu(myList);
                    menu.Documentos = "../share/page/site/" + user.currentProject.shortName + "/documentlibrary";
                    addMenu(menu);
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
            $("#favstar").hide();
        });

    }
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
            if (index === "Favorito") {
                if (user.favorites) {
                    $.each(user.favorites, function(index, favorite) {
                        addButtons(favorite, li, goUrl, "?projeto=" + favorite);
                    });
                }
            }
            else if (customI && (typeof (customI) === "function")) {
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

function loadFav(isFav) {
    imgFill = "images/starfill.png";
    imgEmpty = "images/starempty.png";
    if (isFav) {
        $("#favstar").attr("src", imgFill);
        $("#favstar").attr("isfav", "true");
    } else {
        $("#favstar").attr("src", imgEmpty);
        $("#favstar").attr("isfav", "false");
    }


}

function toggleFav() {
    isfav = $("#favstar").attr("isfav");
    siteName = user.currentProject.shortName;
    index = $.inArray(siteName,user.favorites);
    if (index < 0){
        user.favorites.push(siteName);
    } else {
        user.favorites.splice(index,1);
    }
    if (isfav === "true") {
        
        isfav = true;
    } else {
        isfav = false;
    }
    getUserSites(function() {
                projectList = {};
                $.each(user.sites, function(index, site) {
                    tempName = site.shortName;
                    projectList[tempName] = "?projeto=" + tempName;
                });
                addMenu(getProjectMenu(projectList));
            });
    loadFav(!isfav);
}


//to do next
function goUrl() {
    url = $(this).attr("url");
    if (window.history.pushState && url.slice(0, 2) !== "..") {
        window.history.pushState({}, document.title, url);
        loadPage(getUrlParameter("projeto"));
    } else {
        window.location = url;

    }
}



//botoes

//favorito ?


user.favorites = [];