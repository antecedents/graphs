// noinspection DuplicatedCode

var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '/warehouse/measures/menu/menu.json';


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

    $.getJSON('/warehouse/measures/points/' + fileNameKey + '.json', function (source)  {


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
                selected: 3,
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
                inputDateFormat: '%Y-%m-%d',
                buttons: [
                    {
                        type: 'month',
                        count: 6,
                        text: '6m',
                        title: '6 months'
                    },
                    {
                        type: 'month',
                        count: 18,
                        text: '1.5y',
                        title: '1.5 years'
                    }, {
                        type: 'year',
                        count: 2,
                        text: '2y',
                        title: '2 years'
                    }, {
                        type: 'year',
                        count: 5,
                        text: '5y',
                        title: '5 years'
                    }, {
                        type: 'all',
                        text: 'All',
                        title: 'All'
                    }
                ]
            },

            chart: {
                type: 'spline',
                zoomType: 'xy',
                width: 415,
                height: 425
            },

            title: {
                text: source['attributes']['hospital_name']
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
                    text: 'weekly<br>attendances',
                    x: 0
                },
                lineWidth: 1,
                height: '90%',
                minorGridLineWidth: 0,
                gridLineWidth: 0.5,
                resize: {
                    enabled: true
                }
            },

            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%d %b %Y',
                    month: '%b %Y',
                    year: '%b %Y'
                },
                title: {
                    text: 'Date'
                },
               lineWidth: 0.5
            },

            caption: {
                text: '<p></p>'
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
                split: true,
                dateTimeLabelFormats: {
                    day: ['%e %b, %Y', '%a, %e %b'],
                    week: ['Week from %a, %e %b, %Y', '%a, %e %b'],
                    month: ['%B %Y', '%B'],
                    year: ['%Y', '%Y', '-%Y']
                }
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
                        day: ['Week starting %e %b, %Y', '%a, %e %b'],
                        week: ['Week starting %a, %e %b, %Y', '%a, %e %b'],
                        month: ['%B %Y', '%B'],
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