
//  user related functions

// ?GET user info from alfresco
// user.data = {  "firstName":"",
//                "lastName":"",
//                "userName":"",
//                "email":"",
//                "url":""
//};

function loadUser(callback) {
    verifyTicket(function() {
        $.ajax(
                {type: 'GET',
                    url: '../alfresco/service/api/people/' + user.name + '?alf_ticket=' + user.ticket,
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    cache: false,
                    success: function(data) {
                        user.data = data;
                        callback(data);
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log(xhr + " " + thrownError);
                    }
                }
        );
    });
}


// fetch sites the user is a part of
//ticket validate?

function getUserSites(callback) {
    if (typeof (user.sites !== "object")) {
        verifyTicket(function() {
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
        });
    } else {
        callback();
    }

}


// getUserSites and set .isManager

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