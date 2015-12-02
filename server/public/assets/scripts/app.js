$(document).ready(function(){
    //Click on submit in form will call addProduct
    $("#addDetails").submit(addProduct);

    //Click on delete button on previous item will call deleteProduct
    $("#addProducts").on('click', '.delete', deleteProduct);

    //Calling base site function
    getData();
});

//General function to start
function getData(){
    $.ajax({
        type: "GET",
        url: "/data",
        success: function(data){
            //calling updateDOM function to update site information
            updateDOM(data);
            console.log(data);
        }
    });
}

//To add a new product to the site and database
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
//Delete a previous product from the page as well as the database
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

//Add all to page from Database
function updateDOM(data){
    $("#products").empty();

    for(var i = 0; i < data.length; i++){
        var el = "<div data-id='" + data[i].id + "' class='id well col-md-3' >" +
            "<p>ID #: " + data[i].id + "</p>" +
            "<img src='./assets/photos/sterling-bracelet.jpg Michael Walters' alt='Sterling Bracelet' title='Sterling Bracelet' height='100' width='100' />" +
            "<p>Type: " + data[i].type + "</p>" +
            "<p>Style: " + data[i].style + "</p>" +
            "<p>Color: " + data[i].color + "</p>" +
            "<p>Cost: " + data[i].cost + "</p>" +
            "<p>Additional Details: " + data[i].details + "</p>" +
            "<button class='delete btn btn-danger' data-id='" +
            data[i].id + "'>Delete</button>" +
            "</div>";

            //Trying to sort by id from database
            //$("#products").find('.id').sort(function (a, b) {
            //    return +a.dataset.id - +b.dataset.id;
            //})
            //.appendTo("#products");

        $("#products").append(el);

        console.log(data[i]);
    }
}
