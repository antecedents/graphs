var Highcharts;
var optionSelected;
var dropdown = $('#option_selector');
var url = '../warehouse/menu/menu.json';


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

    $.getJSON('../warehouse/points/adjusting/' + fileNameKey + '.json', function (source)  {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // split the data set into ...
        let observations = [],
            estimate = [],
            percentage = [],
            t_observations = [],
            t_estimate = [],
            t_percentage = [],
            f_estimate = [],
            groupingUnits = [[
                'week',                         // unit name
                [1]                            // allowed multiples
            ]];


        let ctr = source['estimates'].columns;
        let ltr = ctr.indexOf('l_estimate'),
            utr = ctr.indexOf('u_estimate'),
            otr = ctr.indexOf('n_attendances'), // original
            lpr = ctr.indexOf('l_e_ep'),
            upr = ctr.indexOf('u_e_ep'); // percentage error

        for (var i = 0; i < source['estimates'].data.length; i += 1) {

            estimate.push([
                source['estimates'].data[i][0], // date
                source['estimates'].data[i][ltr], // lower
                source['estimates'].data[i][utr] // upper
            ]);

            observations.push({
                x: source['estimates'].data[i][0], // date
                y: source['estimates'].data[i][otr] // original values
            });

            percentage.push([
                source['estimates'].data[i][0], // date
                source['estimates'].data[i][lpr],
                source['estimates'].data[i][upr]
            ]);
        }


        let cte = source['tests'].columns;
        let lte = cte.indexOf('l_estimate'),
            ute = cte.indexOf('u_estimate'),
            ote = cte.indexOf('n_attendances'), // original
            lpe = cte.indexOf('l_e_ep'),
            upe = cte.indexOf('u_e_ep'); // percentage error

        for (var j = 0; j < source['tests'].data.length; j += 1) {

            t_estimate.push([
                source['tests'].data[j][0], // date
                source['tests'].data[j][lte], // lower
                source['tests'].data[j][ute] // upper
            ]);

            t_observations.push({
                x: source['tests'].data[j][0], // date
                y: source['tests'].data[j][ote] // original values
            });

            t_percentage.push([
                source['tests'].data[j][0], // date
                source['tests'].data[j][lpe],
                source['tests'].data[j][upe]
            ]);
        }


        let ctf = source['futures'].columns;
        let ltf = ctf.indexOf('l_estimate'),
            utf = ctf.indexOf('u_estimate'),
            tsf = ctf.indexOf('milliseconds');

        for (var k = 0; k < source['futures'].data.length; k += 1) {

            f_estimate.push([
                source['futures'].data[k][tsf], // date
                source['futures'].data[k][ltf], // lower
                source['futures'].data[k][utf] // upper
            ]);

        }


        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });


        // Draw a graph
        Highcharts.stockChart('container0005', {

            rangeSelector: {
                selected: 4,
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
                zoomType: 'x'
                // borderWidth: 2,
                // marginRight: 100
            },

            title: {
                text: 'Predictions: ' + optionSelected
            },

            subtitle: {
                text: '<p>River Level Prediction</p> <br/><br/>'
            },

            time: {
                // timezone: 'Europe/London'
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: true
                // align: 'middle',
                // layout: 'vertical',
                // verticalAlign: 'bottom',
                // y: 10,
                // x: 35
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

            yAxis: [{
                labels: {
                    align: 'left',
                    x: 9
                },
                title: {
                    text: 'attendances<br>(counts)',
                    x: 0
                },
                // min: 0,
                height: '60%',
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            }, {
                labels: {
                    align: 'left',
                    x: 5
                },
                title: {
                    text: 'error<br>(%)',
                    align: 'middle',
                    x: 7
                },
                top: '65%',
                height: '30%',
                offset: 0,
                lineWidth: 2
            }
            ],

            plotOptions:{
                series: {
                    turboThreshold: 4000
                }
            },

            tooltip: {
                split: true,
                dateTimeLabelFormats: {
                    millisecond:"%A, %e %b, %H:%M:%S.%L",
                    second:"%A, %e %b, %H:%M:%S",
                    minute:"%A, %e %b, %H:%M",
                    hour:"%A, %e %b, %H:%M",
                    day:"%A, %e %B, %Y",
                    week:"%A, %e %b, %Y",
                    month:"%B %Y",
                    year:"%Y"
                }

            },

            series: [{
                    type: 'arearange',
                    name: 'Predictions Boundaries (TR)',
                    data: estimate,
                    color: '#6B8E23',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits,
                        dateTimeLabelFormats: {
                            millisecond: ['%A, %e %b, %H:%M:%S.%L', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
                            second: ['%A, %e %b, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
                            minute: ['%A, %e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                            hour: ['%A, %e %b, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
                            day: ['%A, %e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                            week: ['Week from %A, %e %b, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                            month: ['%B %Y', '%B', '-%B %Y'],
                            year: ['%Y', '%Y', '-%Y']
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b><br/>' +
                            'Upper Boundary: {point.high:,.0f}<br/>' +
                            'Lower Boundary: {point.low:,.0f}' + '<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'Ground Truth (TR)',
                    data: observations,
                    marker: {
                        enabled: true
                    },
                    lineWidth: 1,
                    color: '#000000',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f}<br/>'
                    }
                },
                {
                    type: 'arearange',
                    name: 'Predictions Boundaries (TE)',
                    data: t_estimate,
                    color: '#917808',
                    visible: true,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b><br/>' +
                            'Upper Boundary: {point.high:,.2f}m<br/>' +
                            'Lower Boundary: {point.low:,.2f}m' + '<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'Ground Truth (TE)',
                    data: t_observations,
                    marker: {
                        enabled: true
                    },
                    lineWidth: 1,
                    color: '#000000',
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b>: ' +
                            '{point.y:,.2f}m<br/>'
                    }
                },
                {
                    type: 'arearange',
                    name: 'Future Predictions Boundaries',
                    data: f_estimate,
                    color: '#ffa500',
                    visible: true,
                    yAxis: 0,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b><br/>' +
                            'Upper Boundary: {point.high:,.2f}<br/>' +
                            'Lower Boundary: {point.low:,.2f}' + '<br/>'
                    }
                },
                {
                    type: 'arearange',
                    name: 'Percentage Error (TR)',
                    data: percentage,
                    color: '#6B8E23',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b><br/>' +
                            'Upper Boundary: {point.high:,.2f}<br/>' +
                            'Lower Boundary: {point.low:,.2f}' + '<br/>'
                    }
                },
                {
                    type: 'arearange',
                    name: 'Percentage Error (TE)',
                    data: t_percentage,
                    color: '#917808',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name} </b><br/>' +
                            'Upper Boundary: {point.high:,.2f}<br/>' +
                            'Lower Boundary: {point.low:,.2f}' + '<br/>'
                    }
                }
            ],
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
