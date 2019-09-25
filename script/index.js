var satArray = [];
var filteredSatArray = [];
var scoresArray = [];
var totalScoresArray = [];


//Onload function using javascript for the index page
$(document).ready(function () {
    satArray = sat_scores.sats; // data from the JSON data file data/sat_scores.js

    //Checking if there is something saved in the local storage
    try {
        favStor = localStorage.getItem("mySchool");

        if (favStor != null) {
            $("#schoolList").val(favStor);
        }
    }
    catch (err) {
        //alert(err.message);
    }

   

    refreshScores(); 
});

//Function that loads the data from the JSON array based on the school and year filter selections
function refreshScores() {
    var school = $("#schoolList").val();
    var year = $("#yearList").val();
    var satObject;

    filteredSatArray = [];
    totalScoresArray = [];

    if ((school == "") && (year == "")) {   // no filter
        filteredSatArray = satArray;

        for (var i = 0; i < satArray.length; i++) {
            satObject = satArray[i];
            totalScoresArray.push(satObject.Total_Score);
        }

        
    }
    else if ((school != "") && (year == "")) {  // school filter
        for (var i = 0; i < satArray.length; i++) {
            satObject = satArray[i];

            if (satObject.School == school) {
                filteredSatArray.push(satObject);
                totalScoresArray.push(satObject.Total_Score);
            }

          }
    }
    else if ((school == "") && (year != "")) {  // year filter
        for (var i = 0; i < satArray.length; i++) {
            satObject = satArray[i];

            if (satObject.Year == year) {
                filteredSatArray.push(satObject);
                totalScoresArray.push(satObject.Total_Score);
            }
        }
    }
    else if ((school != "") && (year != "")) {  // school and year filter
        for (var i = 0; i < satArray.length; i++) {
            satObject = satArray[i];

            if ((satObject.School == school) && (satObject.Year == year)) {
                filteredSatArray.push(satObject);
                totalScoresArray.push(satObject.Total_Score);
            }
        }
    }

    //Calling other functions to populate the different portions of the home page
    showStatisticsTotalScore();
    showMeanTotalScoreGrid();
    showMeanTotalScoreChart();
    showMedianTotalScoreGrid();
    showMedianTotalScoreChart();
    showMeanEngScoreGrid();
    showMeanEngScoreChart();
    showMeanMathScoreGrid();
    showMeanMathScoreChart();
    }

//Loading inidividual statistics for the scores such as minimum, maximum into the portlets
function showStatisticsTotalScore() {
        
    var mean = math.mean(totalScoresArray);
    var median = math.median(totalScoresArray);
   
    var hasMode = false;

    for (var i = 0; i < totalScoresArray.length; i++) {
        if (i < totalScoresArray.length) {
            if (totalScoresArray[i] == totalScoresArray[i + 1]) {
                hasMode = true;
                break;
            }
        }
    }
    var mode;

    if (hasMode == true)
         mode = math.mode(totalScoresArray);
    else
          mode = "No Mode";
      
    var min = math.min(totalScoresArray);
    var max = math.max(totalScoresArray);
    var deviation = math.std(totalScoresArray);

    $("#mean").html(math.round(mean,0));
    $("#median").html(median);
    $("#mode").html(mode.toString());
    $("#deviation").html(math.round(deviation, 0));
    $("#min").html(min);
    $("#max").html(max);
}

//Function for filling the first data table with the averages of the selected school(s) total scores
function showMeanTotalScoreGrid() {
    var htmlList = "";
    var ctrl = "satMeanGrid";

    //Build a HTML table on the fly dynamically and initialize it as a jQuery data table
    htmlList += "<table width= 100% style= 'margin-top:12px:width:100%' class='row-border table-striped table-hover' id = 'table-" + ctrl + "'>";
    htmlList += "<thead>";
    htmlList += "<tr>";
    htmlList += "<th class = 'dt-head-center'>School</th>";
    htmlList += "<th class = 'dt-head-center'>Year</th>";
    htmlList += "<th class = 'dt-head-center'>Average Score</th>"; 
    htmlList += "</tr>";
    htmlList += "</thead>";
    htmlList += "<tbody>";

    var satObject;    
    var currentYear = "";
    var nextYear = "";
    var currentSchool = "";
    var nextSchool = "";
   
    var average = 0.0;

    if (filteredSatArray.length > 0) {
        satObject = filteredSatArray[0];
        currentYear = satObject.Year;
        currentSchool = satObject.School;
    }
     
    scoresArray = [];

    for (var i = 0; i < filteredSatArray.length; i++) {
        satObject = filteredSatArray[i];

        nextYear = satObject.Year;
        nextSchool = satObject.School;scoresArray

        if (currentSchool == nextSchool) {

            if (currentYear == nextYear) {

                scoresArray.push(satObject.Total_Score);

            } else {
                average = math.mean(scoresArray);
                average = math.round(average, 0);

                htmlList += "<tr>";
                htmlList += "<td>" + currentSchool + "</td>";
                htmlList += "<td style='text-align:right'>" + currentYear + "</td>";
                htmlList += "<td style='text-align:right'>" + average + "</td>";
                htmlList += "</tr>";

                currentYear = nextYear;
                scoresArray = [];
                scoresArray.push(satObject.Total_Score);
            }

        }
        else {
            average = math.mean(scoresArray);
            average = math.round(average, 0);

            htmlList += "<tr>";
            htmlList += "<td>" + currentSchool + "</td>";
            htmlList += "<td style='text-align:right'>" + currentYear + "</td>";
            htmlList += "<td style='text-align:right'>" + average + "</td>";
            htmlList += "</tr>";

            currentYear = nextYear;
            currentSchool = nextSchool;
            scoresArray = [];
            scoresArray.push(satObject.Total_Score);
        }
       
    }
    average = math.mean(scoresArray);
    average = math.round(average, 0);

    htmlList += "<tr>";
    htmlList += "<td>" + nextSchool + "</td>";
    htmlList += "<td style='text-align:right'>" + nextYear + "</td>";
    htmlList += "<td style='text-align:right'>" + average + "</td>";

    htmlList += "</tr>";

    htmlList += "</tbody>";
    htmlList += "</table>";

    //Write back to the page
    $("#" + ctrl).html(htmlList);
    var table = $("#table-" + ctrl).DataTable(
        {
            paging: true,
            ordering: true,
            info: true,
            displayLength: 10,
            order: [[0, 'asc'], [1, 'asc']],
            responsive: true
        });
}

//Function for filling the second data table with the medians of the selected school(s) total scores
function showMedianTotalScoreGrid() {
    var htmlList = "";
    var ctrl = "satMedianGrid";

    //Build a HTML table on the fly dynamically and initialize it as a jQuery data table
    htmlList += "<table width= 100% style= 'margin-top:12px:width:100%' class='row-border table-striped table-hover' id = 'table-" + ctrl + "'>";
    htmlList += "<thead>";
    htmlList += "<tr>";
    htmlList += "<th class = 'dt-head-center'>School</th>";
    htmlList += "<th class = 'dt-head-center'>Year</th>";
    htmlList += "<th class = 'dt-head-center'>Median Score</th>";
    htmlList += "</tr>";
    htmlList += "</thead>";
    htmlList += "<tbody>";

    var satObject;
    var currentYear = "";
    var nextYear = "";
    var currentSchool = "";
    var nextSchool = "";

    var median = 0.0;

    if (filteredSatArray.length > 0) {
        satObject = filteredSatArray[0];
        currentYear = satObject.Year;
        currentSchool = satObject.School;
    }

    scoresArray = [];

    for (var i = 0; i < filteredSatArray.length; i++) {
        satObject = filteredSatArray[i];

        nextYear = satObject.Year;
        nextSchool = satObject.School; scoresArray

        if (currentSchool == nextSchool) {

            if (currentYear == nextYear) {

                scoresArray.push(satObject.Total_Score);

            } else {
                median = math.median(scoresArray);
                median = math.round(median, 0);

                htmlList += "<tr>";
                htmlList += "<td>" + currentSchool + "</td>";
                htmlList += "<td style='text-align:right'>" + currentYear + "</td>";
                htmlList += "<td style='text-align:right'>" + median + "</td>";
                htmlList += "</tr>";

                currentYear = nextYear;
                scoresArray = [];
                scoresArray.push(satObject.Total_Score);
            }

        }
        else {
            median = math.median(scoresArray);
            median = math.round(median, 0);

            htmlList += "<tr>";
            htmlList += "<td>" + currentSchool + "</td>";
            htmlList += "<td style='text-align:right'>" + currentYear + "</td>";
            htmlList += "<td style='text-align:right'>" + median + "</td>";
            htmlList += "</tr>";

            currentYear = nextYear;
            currentSchool = nextSchool;
            scoresArray = [];
            scoresArray.push(satObject.Total_Score);
        }

    }

    median = math.median(scoresArray);
    median = math.round(median, 0);

    htmlList += "<tr>";
    htmlList += "<td>" + nextSchool + "</td>";
    htmlList += "<td style='text-align:right'>" + nextYear + "</td>";
    htmlList += "<td style='text-align:right'>" + median + "</td>";

    htmlList += "</tr>";

    htmlList += "</tbody>";
    htmlList += "</table>";

    //Write back to the page
    $("#" + ctrl).html(htmlList);
    var table = $("#table-" + ctrl).DataTable(
        {
            paging: true,
            ordering: true,
            info: true,
            displayLength: 10,
            order: [[0, 'asc'], [1, 'asc']],
            responsive: true
        });
}

//Function for filling the third data table with the averages of the selected school(s) english scores
function showMeanEngScoreGrid() {
    var htmlList = "";
    var ctrl = "satMeanGridEng";

    //Build a HTML table on the fly dynamically and initialize it as a jQuery data table
    htmlList += "<table width= 100% style= 'margin-top:12px:width:100%' class='row-border table-striped table-hover' id = 'table-" + ctrl + "'>";
    htmlList += "<thead>";
    htmlList += "<tr>";
    htmlList += "<th class = 'dt-head-center'>School</th>";
    htmlList += "<th class = 'dt-head-center'>Year</th>";
    htmlList += "<th class = 'dt-head-center'>Average Score</th>";
    htmlList += "</tr>";
    htmlList += "</thead>";
    htmlList += "<tbody>";

    var satObject;
    var currentYear = "";
    var nextYear = "";
    var currentSchool = "";
    var nextSchool = "";

    var average = 0.0;

    if (filteredSatArray.length > 0) {
        satObject = filteredSatArray[0];
        currentYear = satObject.Year;
        currentSchool = satObject.School;
    }

    scoresArray = [];

    for (var i = 0; i < filteredSatArray.length; i++) {
        satObject = filteredSatArray[i];

        nextYear = satObject.Year;
        nextSchool = satObject.School; scoresArray

        if (currentSchool == nextSchool) {

            if (currentYear == nextYear) {

                scoresArray.push(satObject.Reading_and_Writing_Total_Score);

            } else {
                average = math.mean(scoresArray);
                average = math.round(average, 0);

                htmlList += "<tr>";
                htmlList += "<td>" + currentSchool + "</td>";
                htmlList += "<td style='text-align:right'>" + currentYear + "</td>";
                htmlList += "<td style='text-align:right'>" + average + "</td>";
                htmlList += "</tr>";

                currentYear = nextYear;
                scoresArray = [];
                scoresArray.push(satObject.Reading_and_Writing_Total_Score);
            }

        }
        else {
            average = math.mean(scoresArray);
            average = math.round(average, 0);

            htmlList += "<tr>";
            htmlList += "<td>" + currentSchool + "</td>";
            htmlList += "<td style='text-align:right'>" + currentYear + "</td>";
            htmlList += "<td style='text-align:right'>" + average + "</td>";
            htmlList += "</tr>";

            currentYear = nextYear;
            currentSchool = nextSchool;
            scoresArray = [];
            scoresArray.push(satObject.Reading_and_Writing_Total_Score);
        }

    }

    average = math.mean(scoresArray);
    average = math.round(average, 0);

    htmlList += "<tr>";
    htmlList += "<td>" + nextSchool + "</td>";
    htmlList += "<td style='text-align:right'>" + nextYear + "</td>";
    htmlList += "<td style='text-align:right'>" + average + "</td>";

    htmlList += "</tr>";

    htmlList += "</tbody>";
    htmlList += "</table>";

    //Write back to the page
    $("#" + ctrl).html(htmlList);
    var table = $("#table-" + ctrl).DataTable(
        {
            paging: true,
            ordering: true,
            info: true,
            displayLength: 10,
            order: [[0, 'asc'], [1, 'asc']],
            responsive: true
        });
}

//Function for filling the fourth data table with the averages of the selected school(s) math scores
function showMeanMathScoreGrid() {
    var htmlList = "";
    var ctrl = "satMeanGridMath";

    //Build a HTML table on the fly dynamically and initialize it as a jQuery data table
    htmlList += "<table width= 100% style= 'margin-top:12px:width:100%' class='row-border table-striped table-hover' id = 'table-" + ctrl + "'>";
    htmlList += "<thead>";
    htmlList += "<tr>";
    htmlList += "<th class = 'dt-head-center'>School</th>";
    htmlList += "<th class = 'dt-head-center'>Year</th>";
    htmlList += "<th class = 'dt-head-center'>Average Score</th>";
    htmlList += "</tr>";
    htmlList += "</thead>";
    htmlList += "<tbody>";

    var satObject;
    var currentYear = "";
    var nextYear = "";
    var currentSchool = "";
    var nextSchool = "";

    var average = 0.0;

    if (filteredSatArray.length > 0) {
        satObject = filteredSatArray[0];
        currentYear = satObject.Year;
        currentSchool = satObject.School;
    }

    scoresArray = [];

    for (var i = 0; i < filteredSatArray.length; i++) {
        satObject = filteredSatArray[i];

        nextYear = satObject.Year;
        nextSchool = satObject.School; scoresArray

        if (currentSchool == nextSchool) {

            if (currentYear == nextYear) {

                scoresArray.push(satObject.Math_Total_Score);

            } else {
                average = math.mean(scoresArray);
                average = math.round(average, 0);

                htmlList += "<tr>";
                htmlList += "<td>" + currentSchool + "</td>";
                htmlList += "<td style='text-align:right'>" + currentYear + "</td>";
                htmlList += "<td style='text-align:right'>" + average + "</td>";
                htmlList += "</tr>";

                currentYear = nextYear;
                scoresArray = [];
                scoresArray.push(satObject.Math_Total_Score);
            }

        }
        else {
            average = math.mean(scoresArray);
            average = math.round(average, 0);

            htmlList += "<tr>";
            htmlList += "<td>" + currentSchool + "</td>";
            htmlList += "<td style='text-align:right'>" + currentYear + "</td>";
            htmlList += "<td style='text-align:right'>" + average + "</td>";
            htmlList += "</tr>";

            currentYear = nextYear;
            currentSchool = nextSchool;
            scoresArray = [];
            scoresArray.push(satObject.Math_Total_Score);
        }

    }

    average = math.mean(scoresArray);
    average = math.round(average, 0);

    htmlList += "<tr>";
    htmlList += "<td>" + nextSchool + "</td>";
    htmlList += "<td style='text-align:right'>" + nextYear + "</td>";
    htmlList += "<td style='text-align:right'>" + average + "</td>";

    htmlList += "</tr>";

    htmlList += "</tbody>";
    htmlList += "</table>";

    //Write back to the page
    $("#" + ctrl).html(htmlList);
    var table = $("#table-" + ctrl).DataTable(
        {
            paging: true,
            ordering: true,
            info: true,
            displayLength: 10,
            order: [[0, 'asc'], [1, 'asc']],
            responsive: true
        });
}

//Function for filling the first FLOT chart with the averages of the selected school(s) total scores
function showMeanTotalScoreChart() {
    var dataValues = [];
    var dataSet = [];
    var dataSeries = [];

    var satObject;
    var currentYear = "";
    var nextYear = "";
    var currentSchool = "";
    var nextSchool = "";

    var average = 0.0;

    if (filteredSatArray.length > 0) {
        satObject = filteredSatArray[0];
        currentYear = satObject.Year;
        currentSchool = satObject.School;
    }

    scoresArray = [];

    for (var i = 0; i < filteredSatArray.length; i++) {
        satObject = filteredSatArray[i];

        nextYear = satObject.Year;
        nextSchool = satObject.School;

        if (currentSchool == nextSchool) {

            if (currentYear == nextYear) {

                scoresArray.push(satObject.Total_Score);

            } else {
                average = math.mean(scoresArray);
                average = math.round(average,0);

                dataValues.push([currentYear, average])          

                currentYear = nextYear;
                scoresArray = [];
                scoresArray.push(satObject.Total_Score);
            }

        }
        else {
            average = math.mean(scoresArray);
            average = math.round(average,0);

            dataValues.push([currentYear, average])
            dataSeries = { label: currentSchool, data: dataValues };
            dataSet.push(dataSeries);

            currentYear = nextYear;
            currentSchool = nextSchool;
            scoresArray = [];
            dataValues = [];
            scoresArray.push(satObject.Total_Score);
        }

    }

    average = math.mean(scoresArray);
    average = math.round(average, 0);

    dataValues.push([currentYear, average])
    dataSeries = { label: currentSchool, data: dataValues };
    dataSet.push(dataSeries);

                 
    // chart options
    var optionsChart = {
        series: {
            lines: {
                show: true
            },
            points: {
                radius: 3,
                fill: true,
                show: true
            }
        },
        xaxis: {
            tickSize: 1,
            tickDecimals: 0,
            tickLength: 0,
            axisLabel: "Years",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
        },

        yaxis: {
            axisLabel: "Total SAT Score Mean",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            tickFormatter: function (v, axis) {
                return math.round(v, 0);
            }
        },

        legend: {
            show: true,
            noColumns: 5,
            position: 'ne',
            margin: -20,
            labelBoxBorderColor: false,
            labelBoxWidth: 14,
            labelBoxHeight: 10,
            labelBoxMargin: 50,
            backgroundColor: null,
            backgroundOpacity: 0.85,
            sorted: true,
        },

        grid: {
            hoverable: true,
            borderColor: "transparent",
            backgroundColor: { colors: ["#ffffff", "#EDF5FF"] },
            markings: [
                { color: '#000', lineWidth: 1, yaxis: { from: 0, to: 0 } },
            ]
        },
        //colors: chartColors,

    };

    var previousPoint = null, previousLabel = null;
    $.fn.UseTooltip = function () {

        $(this).bind("plothover", function (event, pos, item) {
            if (item) {
                if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;
                    $("#tooltip").remove();

                    var x = item.datapoint[0];
                    var y = item.datapoint[1];

                    var color = item.series.color;
                    var month = new Date(x).getMonth();

                    if (item.seriesIndex == 0) {
                        showTooltip(item.pageX,
                            item.pageY,
                            color,                         
                            item.series.label + " | " + math.round(x, 0) + " | <strong>" + math.round(y,0) + "</strong>");

                    } else {
                        showTooltip(item.pageX,
                            item.pageY,
                            color,                         
                            item.series.label + " | " + math.round(x, 0) + " | <strong>" + math.round(y, 0) + "</strong>");
                    }
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    };

    //Initialize the charts
    $.plot($("#satMeanChart"), dataSet, optionsChart);
    $("#satMeanChart").UseTooltip();

    $(window).resize(function () {
        $.plot($("#satMeanChart"), dataSet, optionsChart);
    });

}

//Function for filling the second FLOT chart with the medians of the selected school(s) total scores
function showMedianTotalScoreChart() {
    var dataValues = [];
    var dataSet = [];
    var dataSeries = [];

    var satObject;
    var currentYear = "";
    var nextYear = "";
    var currentSchool = "";
    var nextSchool = "";
    var seriesCount = 0;

    var median = 0.0;

    if (filteredSatArray.length > 0) {
        satObject = filteredSatArray[0];
        currentYear = satObject.Year;
        currentSchool = satObject.School;
    }

    scoresArray = [];

    for (var i = 0; i < filteredSatArray.length; i++) {
        satObject = filteredSatArray[i];

        nextYear = satObject.Year;
        nextSchool = satObject.School;

        if (currentSchool == nextSchool) {

            if (currentYear == nextYear) {

                scoresArray.push(satObject.Total_Score);

            } else {
                median = math.median(scoresArray);
                median = math.round(median, 0);

                dataValues.push([currentYear, median])

                currentYear = nextYear;
                scoresArray = [];
                scoresArray.push(satObject.Total_Score);
            }

        }
        else {
            median = math.median(scoresArray);
            median = math.round(median, 0);

           
            dataValues.push([currentYear, median])
            dataSeries = {
                label: currentSchool,
                data: dataValues,
                //bars: { show: true, barWidth: 0.1, order: seriesCount, fill: 1, align: "center"},
            };
            
            dataSet.push(dataSeries);

            seriesCount += 1;
           
            currentYear = nextYear;
            currentSchool = nextSchool;
            scoresArray = [];
            dataValues = [];
            scoresArray.push(satObject.Total_Score);
        }

    }

    median = math.median(scoresArray);
    median = math.round(median, 0);

   
    dataValues.push([currentYear, median])
    dataSeries = {
        label: currentSchool,
        data: dataValues,
        //bars: { show: true, barWidth: 0.1, order: seriesCount, fill: 1, align: "center"},
    };
    dataSet.push(dataSeries);


    // chart options
    var optionsChart = {         

        series: {
            stack: true,
            bars: {
                show: true,
                
            }
        },
        bars: {
            barWidth: 0.1,            
            align: "center",
            fill: 1,
            order: 3
        },

        xaxis: {            
            tickSize: 1,
            tickDecimals: 0,
            tickLength: 0,
            axisLabel: "Years",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10            
        },

        yaxis: {          
            axisLabel: "Total SAT Score Median",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            tickFormatter: function (v, axis) {
                return math.round(v, 0);
            }
        },

        legend: {
            show: true,
            noColumns: 5,
            position: 'ne',
            margin: -20,
            labelBoxBorderColor: false,
            labelBoxWidth: 14,
            labelBoxHeight: 10,
            labelBoxMargin: 50,
            backgroundColor: null,
            backgroundOpacity: 0.85,
            sorted: true,
        },

        grid: {
            hoverable: true,
           borderColor: "transparent",
            backgroundColor: { colors: ["#ffffff", "#EDF5FF"] },
            markings: [
                { color: '#000', lineWidth: 1, yaxis: { from: 0, to: 0 } },
            ]
        },
        //colors: chartColors,

    };

    var previousPoint = null, previousLabel = null;
    $.fn.UseTooltip = function () {

        $(this).bind("plothover", function (event, pos, item) {
            if (item) {
                if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;
                    $("#tooltip").remove();

                    var x = item.datapoint[0];
                    var y = item.datapoint[1];

                    var color = item.series.color;
                    var month = new Date(x).getMonth();

                    if (item.seriesIndex == 0) {
                        showTooltip(item.pageX,
                            item.pageY,
                            color,
                            item.series.label + " | " + math.round(x, 0) + " | <strong>" + math.round(y, 0) + "</strong>");

                    } else {
                        showTooltip(item.pageX,
                            item.pageY,
                            color,
                            item.series.label + " | " + math.round(x, 0)  + " | <strong>" + math.round(y, 0) + "</strong>");
                    }
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    };


        //Initialize the charts
    $.plot($("#satMedianChart"), dataSet, optionsChart);
    $("#satMedianChart").UseTooltip();

    $(window).resize(function () {
        $.plot($("#satMedianChart"), dataSet, optionsChart);
    });

}

//Function for filling the third FLOT chart with the averages of the selected school(s) english scores
function showMeanEngScoreChart() {
    var dataValues = [];
    var dataSet = [];
    var dataSeries = [];

    var satObject;
    var currentYear = "";
    var nextYear = "";
    var currentSchool = "";
    var nextSchool = "";

    var average = 0.0;

    if (filteredSatArray.length > 0) {
        satObject = filteredSatArray[0];
        currentYear = satObject.Year;
        currentSchool = satObject.School;
    }

    scoresArray = [];

    for (var i = 0; i < filteredSatArray.length; i++) {
        satObject = filteredSatArray[i];

        nextYear = satObject.Year;
        nextSchool = satObject.School;

        if (currentSchool == nextSchool) {

            if (currentYear == nextYear) {

                scoresArray.push(satObject.Reading_and_Writing_Total_Score);

            } else {
                average = math.mean(scoresArray);
                average = math.round(average, 0);

                dataValues.push([currentYear, average])

                currentYear = nextYear;
                scoresArray = [];
                scoresArray.push(satObject.Reading_and_Writing_Total_Score);
            }

        }
        else {
            average = math.mean(scoresArray);
            average = math.round(average, 0);

            dataValues.push([currentYear, average])
            dataSeries = { label: currentSchool, data: dataValues };
            dataSet.push(dataSeries);

            currentYear = nextYear;
            currentSchool = nextSchool;
            scoresArray = [];
            dataValues = [];
            scoresArray.push(satObject.Reading_and_Writing_Total_Score);
        }

    }

    average = math.mean(scoresArray);
    average = math.round(average, 0);

    dataValues.push([currentYear, average])
    dataSeries = { label: currentSchool, data: dataValues };
    dataSet.push(dataSeries);


    // chart options
    var optionsChart = {
        series: {
            lines: {
                show: true
            },
            points: {
                radius: 3,
                fill: true,
                show: true
            }
        },
        xaxis: {
            tickSize: 1,
            tickDecimals: 0,
            tickLength: 0,
            axisLabel: "Years",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
        },

        yaxis: {
            axisLabel: "Total SAT Score Mean",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            tickFormatter: function (v, axis) {
                return math.round(v, 0);
            }
        },

        legend: {
            show: true,
            noColumns: 5,
            position: 'ne',
            margin: -20,
            labelBoxBorderColor: false,
            labelBoxWidth: 14,
            labelBoxHeight: 10,
            labelBoxMargin: 50,
            backgroundColor: null,
            backgroundOpacity: 0.85,
            sorted: true,
        },

        grid: {
            hoverable: true,
            borderColor: "transparent",
            backgroundColor: { colors: ["#ffffff", "#EDF5FF"] },
            markings: [
                { color: '#000', lineWidth: 1, yaxis: { from: 0, to: 0 } },
            ]
        },
        //colors: chartColors,

    };

    var previousPoint = null, previousLabel = null;
    $.fn.UseTooltip = function () {

        $(this).bind("plothover", function (event, pos, item) {
            if (item) {
                if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;
                    $("#tooltip").remove();

                    var x = item.datapoint[0];
                    var y = item.datapoint[1];

                    var color = item.series.color;
                    var month = new Date(x).getMonth();

                    if (item.seriesIndex == 0) {
                        showTooltip(item.pageX,
                            item.pageY,
                            color,
                            item.series.label + " | " + math.round(x, 0) + " | <strong>" + math.round(y, 0) + "</strong>");

                    } else {
                        showTooltip(item.pageX,
                            item.pageY,
                            color,
                            item.series.label + " | " + math.round(x, 0) + " | <strong>" + math.round(y, 0) + "</strong>");
                    }
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    };


        //Initialize the charts
    $.plot($("#satMeanChartEng"), dataSet, optionsChart);
    $("#satMeanChartEng").UseTooltip();

    $(window).resize(function () {
        $.plot($("#satMeanChartEng"), dataSet, optionsChart);
    });

}

//Function for filling the fourth FLOT chart with the averages of the selected school(s) math scores
function showMeanMathScoreChart() {
    var dataValues = [];
    var dataSet = [];
    var dataSeries = [];

    var satObject;
    var currentYear = "";
    var nextYear = "";
    var currentSchool = "";
    var nextSchool = "";

    var average = 0.0;

    if (filteredSatArray.length > 0) {
        satObject = filteredSatArray[0];
        currentYear = satObject.Year;
        currentSchool = satObject.School;
    }

    scoresArray = [];

    for (var i = 0; i < filteredSatArray.length; i++) {
        satObject = filteredSatArray[i];

        nextYear = satObject.Year;
        nextSchool = satObject.School;

        if (currentSchool == nextSchool) {

            if (currentYear == nextYear) {

                scoresArray.push(satObject.Math_Total_Score);

            } else {
                average = math.mean(scoresArray);
                average = math.round(average, 0);

                dataValues.push([currentYear, average])

                currentYear = nextYear;
                scoresArray = [];
                scoresArray.push(satObject.Math_Total_Score);
            }

        }
        else {
            average = math.mean(scoresArray);
            average = math.round(average, 0);

            dataValues.push([currentYear, average])
            dataSeries = { label: currentSchool, data: dataValues };
            dataSet.push(dataSeries);

            currentYear = nextYear;
            currentSchool = nextSchool;
            scoresArray = [];
            dataValues = [];
            scoresArray.push(satObject.Math_Total_Score);
        }

    }

    average = math.mean(scoresArray);
    average = math.round(average, 0);

    dataValues.push([currentYear, average])
    dataSeries = { label: currentSchool, data: dataValues };
    dataSet.push(dataSeries);


    // chart options
    var optionsChart = {
        series: {
            lines: {
                show: true
            },
            points: {
                radius: 3,
                fill: true,
                show: true
            }
        },
        xaxis: {
            tickSize: 1,
            tickDecimals: 0,
            tickLength: 0,
            axisLabel: "Years",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
        },

        yaxis: {
            axisLabel: "Total SAT Score Mean",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 3,
            tickFormatter: function (v, axis) {
                return math.round(v, 0);
            }
        },

        legend: {
            show: true,
            noColumns: 5,
            position: 'ne',
            margin: -20,
            labelBoxBorderColor: false,
            labelBoxWidth: 14,
            labelBoxHeight: 10,
            labelBoxMargin: 50,
            backgroundColor: null,
            backgroundOpacity: 0.85,
            sorted: true,
        },

        grid: {
            hoverable: true,
            borderColor: "transparent",
            backgroundColor: { colors: ["#ffffff", "#EDF5FF"] },
            markings: [
                { color: '#000', lineWidth: 1, yaxis: { from: 0, to: 0 } },
            ]
        },
        //colors: chartColors,

    };

    var previousPoint = null, previousLabel = null;
    $.fn.UseTooltip = function () {

        $(this).bind("plothover", function (event, pos, item) {
            if (item) {
                if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;
                    $("#tooltip").remove();

                    var x = item.datapoint[0];
                    var y = item.datapoint[1];

                    var color = item.series.color;
                    var month = new Date(x).getMonth();

                    if (item.seriesIndex == 0) {
                        showTooltip(item.pageX,
                            item.pageY,
                            color,
                            item.series.label + " | " + math.round(x, 0) + " | <strong>" + math.round(y, 0) + "</strong>");

                    } else {
                        showTooltip(item.pageX,
                            item.pageY,
                            color,
                            item.series.label + " | " + math.round(x, 0) + " | <strong>" + math.round(y, 0) + "</strong>");
                    }
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    };

        //Initialize the charts
    $.plot($("#satMeanChartMath"), dataSet, optionsChart);
    $("#satMeanChartMath").UseTooltip();

    $(window).resize(function () {
        $.plot($("#satMeanChartMath"), dataSet, optionsChart);
    });

}




// used from http://www.jqueryflottutorial.com/how-to-make-jquery-flot-line-chart.html
function showTooltip(x, y, color, contents) {
    $('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y - 40,
        left: x - 120,
        border: '2px solid ' + color,
        padding: '3px',
        'font-size': '9px',
        'border-radius': '5px',
        'background-color': '#fff',
        'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
        opacity: 0.9
    }).appendTo("body").fadeIn(200);
}