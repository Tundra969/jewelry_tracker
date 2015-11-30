$(document).ready(function(){
    $("#addDetails").submit(addProduct);

    $("#addProducts").on('click', '.delete', deleteProduct);

    getData();
});

function getData(){
    $.ajax({
        type: "GET",
        url: "/data",
        success: function(data){
            updateDOM(data);
            console.log(data);
        }
    });
}

function addProduct(data){
    event.preventDefault();
    var values = {};

    $.each($(this).serializeArray(), function(i, field){
        values[field.name] = field.value;
    });

    console.log(values);

    $.ajax({
        type: "POST",
        url: "/data",
        data: values,
        success: function(data){
            getData(data);

        }
    });

    //console.log(data);
    //console.log(values);
}

function deleteProduct(){
    var deletedId = {"id" : $(this).data("id")};

    console.log("Meaningful Log: ", deletedId);

    $.ajax({
        type: "DELETE",
        url: "/data",
        data: deletedId,
        success: function(data){
            getData(data);
        }
    })
}

function updateDOM(data){
    $("#products").empty();

    for(var i = 0; i < data.length; i++){
        var el = "<div data-id='" + data[i].id + "' class='id well col-md-3' >" +
            "<p>ID #: " + data[i].id + "</p>" +
            "<p>Type: " + data[i].type + "</p>" +
            "<p>Style: " + data[i].style + "</p>" +
            "<p>Color: " + data[i].color + "</p>" +
            "<p>Cost: " + data[i].cost + "</p>" +
            "<p>Additional Details: " + data[i].details + "</p>" +
            "<button class='delete btn btn-danger' data-id='" +
            data[i].id + "'>Delete</button>" +
            "</div>";

            //$("#products").find('.id').sort(function (a, b) {
            //    return +a.dataset.id - +b.dataset.id;
            //})
            //.appendTo("#products");

        $("#products").append(el);

        console.log(data[i]);
    }
}
