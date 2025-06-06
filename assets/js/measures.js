// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/measures/menu/menu.json';


$.getJSON(url, function (data) {

    $.each(data, function (key, entry) {
        dropdown.append($('<option></option>').attr('value', entry.desc).text(entry.name));
    });

    // Load the first Option by default
    var defaultOption = dropdown.find("option:first-child").val();
    optionSelected = dropdown.find("option:first-child").text();

    // Generate
    generateChart(defaultOption);

});


// Dropdown
dropdown.on('change', function (e) {

    $('#option_selector_title').remove();

    // Save name and value of the selected option
    optionSelected = this.options[e.target.selectedIndex].text;
    var valueSelected = this.options[e.target.selectedIndex].value;

    //Draw the Chart
    generateChart(valueSelected);
});


// Generate graphs
function generateChart(fileNameKey){

    $.getJSON('../warehouse/measures/points/' + fileNameKey + '.json', function (source)  {


        // split the data set into ...
        let groupingUnits = [[
                'week',                         // unit name
                [1]                            // allowed multiples
            ]];

        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });


        // Draw a graph
        Highcharts.stockChart('container0005', {

            rangeSelector: {
                selected: 5,
                verticalAlign: 'top',
                floating: false,
                inputPosition: {
                    x: 0,
                    y: 0
                },
                buttonPosition: {
                    x: 0,
                    y: 0
                },
                inputEnabled: true,
                inputDateFormat: '%Y-%m-%d'
            },

            chart: {
                type: 'spline',
                zoomType: 'xy'
            },

            title: {
                text: optionSelected
            },

            subtitle: {
                text: 'Health Board: ' + source['attributes']['health_board_name']
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: false
            },

            yAxis: {
                labels: {
                    align: 'left',
                    x: 9
                },
                title: {
                    text: 'attendances',
                    x: 0
                },
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            },

            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },

            caption: {
                text: '<p>The weekly attendances at an accident & emergency.</p>'
            },

            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: [ 'viewFullscreen', 'printChart', 'separator',
                            'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG' , 'separator',
                            'downloadXLS', 'downloadCSV']
                    }
                }
            },

            tooltip: {
                split: true
            },

            plotOptions: {
                series: {
                    turboThreshold: 4000
                }
            },

            series: [{
                name: source['attributes']['hospital_name'],
                data: source.data,
                type: 'spline',
                dataGrouping: {
                    enabled: true,
                    units: groupingUnits,
                    dateTimeLabelFormats: {
                        millisecond: ['%e %b, %H:%M:%S.%L', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
                        second: ['%e %b, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
                        minute: ['%e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                        hour: ['%e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                        day: ['%e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                        week: ['Week from %A, %e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                        month: ['%B %Y', '%B', '-%B %Y'],
                        year: ['%Y', '%Y', '-%Y']
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                        '{point.y:,.0f}<br/>'
                }
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 700
                    },
                    chartOptions: {
                        rangeSelector: {
                            inputEnabled: false
                        }
                    }
                }]
            }

        });


    }).fail(function() {
        console.log("Missing");
        $('#container0005').empty();
    });



}