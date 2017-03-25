$(function(){
    var composePages=function() {
        var template = _.template($('#list_template').html());
        $.ajax({
                type:       "GET",
                url:        '/assets/json/程.json',
                dataType:   "json",
                success: function(data) {
                    console.log(data);
                    options="";
                    for(var i = 0; i < data.info.length; i++){
                        options += template(
                        {
                            time:   data[i].timestamp,
                            //tag:    data.info[i].ruleset_name
                        })
                    }
                    $("#pages").html(options);
                },
                failed: function(data) {
                    console.log(data);
                }
            }
        )
    };
});