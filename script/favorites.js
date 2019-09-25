var favStor = "";

//When the page loads and is ready, this function gets called
$(document).ready(function () {
    if (typeof Storage == "undefined") {
        alert("This browser does not support local storage used by the Favorites");
    }
    else {
         initialFavorites();
    }
   
});

//Checks if favorite school is saved, if it is, it is written to the menu and on the page
function initialFavorites() {
    favStor = localStorage.getItem("mySchool");
   
       if (favStor != null) {
        $("#presentFavorites").html(favStor);
        $("#favMenu").html("My School (<b>" + favStor + "</b>)");
    }
    else {
        $("#presentFavorites").html("NOT SET");
    }
}

//When the approve button is clicked, the value from the dropdown is saved in the local storage
//and presented on the favorites page and in the menu
function approveFavorites() {
    var school = $("#schoolList").val();
    $("#presentFavorites").html(school);
    localStorage.setItem("mySchool", school);  // save to storage  
    $("#favMenu").html("My School (<b>" + school + "</b>)"); // update menu item
}

//When the delete button is clicked, the value from the local storage is removed, and it no longer
//exists on the favorites page and on the menu
function deleteFavorites() {
    localStorage.removeItem("mySchool");
    $("#presentFavorites").html("NOT SET");
    $("#favMenu").html("My School"); // update menu item
}