var satArray = [];

//When the page loads and is ready, this function gets called
$(document).ready(function () {
    satArray = sat_scores.sats; // data from the JSON data file data/sat_scores.js

    showProjectData();
});

//Build a HTML table on the fly dynamically and initialize it as a jQuery data table
function showProjectData() {
    var htmlList = "";
    var ctrl = "project_data";

    htmlList += "<table width= 100% style= 'margin-top:12px:width:100%' class='row-border table-striped table-hover' id = 'table-" + ctrl + "'>";
    htmlList += "<thead>";
    htmlList += "<tr>";
    htmlList += "<th class = 'dt-head-center'>Total Score</th>";
    htmlList += "<th class = 'dt-head-center'>English Total</th>";
    htmlList += "<th class = 'dt-head-center'>Math Total</th>";
    htmlList += "<th class = 'dt-head-center'>Reading Score</th>";
    htmlList += "<th class = 'dt-head-center'>Writing/Lang Score</th>";
    htmlList += "<th class = 'dt-head-center'>Math Score</th>";
    htmlList += "<th class = 'dt-head-center'>Year</th>";
    htmlList += "<th class = 'dt-head-center'>School</th>";
    htmlList += "<th class = 'dt-head-center'>Lat</th>";
    htmlList += "<th class = 'dt-head-center'>Lng</th>";
    htmlList += "</tr>";
    htmlList += "</thead>";
    htmlList += "<tbody>";

    var output = "";
    var stringObject = "";
    var satObject;
    var aryScores = [];

    // Loop through the array of JSON objects
    for (var i = 0; i < satArray.length; i++) {

        satObject = satArray[i];

        htmlList += "<tr>";
        htmlList += "<td>" + satObject.Total_Score + "</td>";
        htmlList += "<td>" + satObject.Reading_and_Writing_Total_Score + "</td>";
        htmlList += "<td>" + satObject.Math_Total_Score + "</td>";
        htmlList += "<td>" + satObject.Reading_Score + "</td>";
        htmlList += "<td>" + satObject.Writing_and_Language_Score + "</td>";
        htmlList += "<td>" + satObject.Math_Score + "</td>";
        htmlList += "<td>" + satObject.Year + "</td>";
        htmlList += "<td>" + satObject.School + "</td>";
        htmlList += "<td>" + satObject.Lat + "</td>";
        htmlList += "<td>" + satObject.Lng + "</td>";

        htmlList += "</tr>";
    }

    htmlList += "</tbody>";
    htmlList += "</table>";
    
    // load the html for the table into the DIV control
    $("#" + ctrl).html(htmlList);

    //Initialize the data table
    var table = $("#table-" + ctrl).DataTable(
        {
            paging: true,
            ordering: true,
            info: true,
            displayLength: 10,
            order: [[1, 'asc'], [0, 'asc']],
            responsive:true
        });
}
