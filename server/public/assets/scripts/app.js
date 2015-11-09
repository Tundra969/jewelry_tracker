$(document).ready(function(){
    $("#addComment").submit(addMessage);

    $("#addMessage").on('click', '.delete', deleteMessage);

    getData();
});

function getData(){
    $.ajax({
        type: "GET",
        url: "/data",
        success: function(data){
            updateDOM(data);
        }
    });
}

function addMessage(data){
    event.preventDefault();
    var values = {};

    $.each($(this).serializeArray(), function(i, field){
        values[field.name] = field.value;
    });

    $.ajax({
        type: "POST",
        url: "/data",
        data: values,
        success: function(data){
            getData();
        }
    });
}

function deleteMessage(){
    var deletedId = {"id" : $(this).data("id")};

    console.log("Meaningful Log: ", deletedId);

    $.ajax({
        type: "DELETE",
        url: "/data",
        data: deletedId,
        success: function(){
            getData();
        }
    })
}

function updateDOM(data){
    $("#messages").empty();

    for(var i = 0; i < data.length; i++){
        var el = "<div class='well col-md-4'>" +
            "<p>" + data[i].name + "</p>" +
            "<p>" + data[i].comment + "</p>" +
            "<button class='delete btn btn-danger' data-id='" +
            data[i].id + "'>Delete</button>" +
            "</div>";

        $("#messages").append(el);
    }
}
