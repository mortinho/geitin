

//now useless...?  >>> projects from DB
function getProjects(callback) {
    verifyTicket(function() {
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
    });
}

