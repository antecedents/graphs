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

    $.getJSON('../warehouse/points/forecasts/' + fileNameKey + '.json', function (source)  {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // split the data set into ohlc and medians
        let trend = [],
            percentage = [],
            training = [],
            testing = [],
            futures = [],
            groupingUnits = [[
                'week',                         // unit name
                [1]                            // allowed multiples
            ]];


        let ctr = source['estimates'].columns;
        let ltr = ctr.indexOf('l_tc_estimate'),
            utr = ctr.indexOf('u_tc_estimate'),
            rtr = ctr.indexOf('trend'),
            lep = ctr.indexOf('l_tc_ep'),
            uep = ctr.indexOf('u_tc_ep');

        for (var i = 0; i < source['estimates'].data.length; i += 1) {

            training.push([
                source['estimates'].data[i][0], // date
                source['estimates'].data[i][ltr], // lower
                source['estimates'].data[i][utr] // upper
            ]);

            percentage.push([
                source['estimates'].data[i][0], // date
                source['estimates'].data[i][lep], // lower
                source['estimates'].data[i][uep] // upper
            ]);

            trend.push({
                x: source['estimates'].data[i][0], // date
                y: source['estimates'].data[i][rtr] // trend reference
            });
        }


        let cte = source['tests'].columns;
        let lte = cte.indexOf('l_tc_estimate'),
            ute = cte.indexOf('u_tc_estimate'),
            tte = cte.indexOf('milliseconds');

        for (let j = 0; j < source['tests'].data.length; j += 1) {
            testing.push([
                source['tests'].data[j][tte],
                source['tests'].data[j][lte],
                source['tests'].data[j][ute]]);
        }


        let cfu = source['futures'].columns;
        let lfu = cfu.indexOf('l_tc_estimate'),
            ufu = cfu.indexOf('u_tc_estimate'),
            tfu = cfu.indexOf('milliseconds');

        for (let k = 0; k < source['futures'].data.length; k += 1) {
            futures.push([
                    source['futures'].data[k][tfu],
                    source['futures'].data[k][lfu],
                    source['futures'].data[k][ufu]]);
        }


        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });


        // Draw a graph
        Highcharts.stockChart('container0002', {

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
                zoomType: 'x'
                // borderWidth: 2,
                // marginRight: 100
            },

            title: {
                text: 'Predictions: ' + optionSelected
            },

            subtitle: {
                text: '<p>Scotland</p> <br/> ' +
                    '<p><b>Underlying Data</b>: Public Health Scotland Weekly A&E Numbers</p>'
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
                    text: optionSelected,
                    x: 0
                },
                // min: 0,
                height: '60%',
                lineWidth: 2,
                resize: {
                    enabled: true
                }
            },
            {
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
                name: 'The training phase predictions',
                data: training,
                color: '#6B8E23',
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
                        'Upper Boundary: {point.high:,.2f}<br/>' +
                        'Lower Boundary: {point.low:,.2f}' + '<br/>'
                }
            },

                {
                    type: 'arearange',
                    name: 'The testing phase predictions',
                    data: testing,
                    color: '#917808',
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
                    type: 'spline',
                    name: 'Trend',
                    data: trend,
                    marker: {
                        enabled: true,
                        radius: 1
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
                    name: 'Futures',
                    data: futures,
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
        $('#container0002').empty();
    });

}

