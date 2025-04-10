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
function generateChart(fileNameKey) {

    // Relative to Amazon S3 (Simple Storage Service) Set Up
    $.getJSON('../warehouse/points/decompositions/' + fileNameKey + '.json', function (source) {

        // https://api.highcharts.com/highstock/plotOptions.series.dataLabels
        // https://api.highcharts.com/class-reference/Highcharts.Point#.name
        // https://api.highcharts.com/highstock/tooltip.pointFormat


        // split
        var attendances = [],
            trend = [],
            seasonal = [],
            residue = [],
            dataLength = source.data.length,
            groupingUnits = [[
                'day',   // unit name
                [1]      // allowed multiples
            ]],
            i = 0;

        let columns = source.columns;
        var att = columns.indexOf('n_attendances'),
            tre = columns.indexOf('trend'),
            sea = columns.indexOf('seasonal'),
            res = columns.indexOf('residue');

        for (i; i < dataLength; i += 1) {

            attendances.push([
                source.data[i][0], // the date
                source.data[i][att] // attendances, unit-less
            ]);

            trend.push({
                x: source.data[i][0], // the date
                y: source.data[i][tre] // plausible trend pattern, unit-less
            });

            seasonal.push({
                x: source.data[i][0], // the date
                y: source.data[i][sea] // plausible season pattern, unit-less
            });

            residue.push({
                x: source.data[i][0], // date
                y: source.data[i][res]  // residue, unit-less
            });

        }

        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });

        // Draw a graph
        Highcharts.stockChart('container0003', {

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
                text: 'Curves of: ' + optionSelected
            },

            subtitle: {
                text: '<p>Accident & Emergency Attendance Counts</p> <br/> ' +
                    '<p><b>and plausible decompositions</b></p>'
            },

            time: {
                // timezone: 'Europe/London'
            },

            credits: {
                enabled: false
            },

            legend: {
                enabled: true,
                width: 500,
                x: 65
                // align: 'middle',
                // layout: 'vertical',
                // verticalAlign: 'bottom',
                // y: 10,
                // x: 35
            },

            caption: {
                // verticalAlign: "top",
                // y: 35,
                text: '<p>The graphs illustrate accident & emergency attendance counts in Scotland, ' +
                    '<i>Attendances</i>, plausible decomposition patterns, Trend & Seasons, ' +
                    'and Residues thereof.</p>'
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
                    x: 5
                },
                title: {
                    text: 'Attendances',
                    align: 'middle',
                    x: 7
                },
                min: 0,
                height: '33%',
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
                    text: 'Trend',
                    align: 'middle',
                    x: 7
                },
                top: '35%',
                height: '21%',
                offset: 0,
                lineWidth: 2
            }, {
                labels: {
                    align: 'left',
                    x: 5
                },
                title: {
                    text: 'Seasons',
                    align: 'middle',
                    x: 7
                },
                top: '57%',
                height: '21%',
                offset: 0,
                lineWidth: 2
            }, {
                labels: {
                    align: 'left',
                    x: 5
                },
                title: {
                    text: 'Residue',
                    align: 'middle',
                    x: 7
                },
                top: '79%',
                height: '21%',
                offset: 0,
                lineWidth: 2
            }
            ],

            plotOptions: {
                series: {
                    turboThreshold: 8000
                }
            },

            tooltip: {
                split: true,
                dateTimeLabelFormats: {
                    millisecond: "%A, %e %b, %H:%M:%S.%L",
                    second: "%A, %e %b, %H:%M:%S",
                    minute: "%A, %e %b, %H:%M",
                    hour: "%A, %e %b, %H:%M",
                    day: "%A, %e %B, %Y",
                    week: "%A, %e %b, %Y",
                    month: "%B %Y",
                    year: "%Y"
                }

            },

            series: [{
                type: 'spline',
                name: 'Attendances',
                data: attendances,
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
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b>: ' +
                        '{point.y:,.0f} unitless<br/>'
                }
            },
                {
                    type: 'spline',
                    name: 'Trend',
                    data: trend,
                    color: '#6B8E23',
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b>: ' +
                            '{point.y:,.2f} unitless<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'Seasons',
                    data: seasonal,
                    color: '#A08E23',
                    visible: true,
                    yAxis: 2,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b>: ' +
                            '{point.y:,.2f} unitless<br/>'
                    }
                },
                {
                    type: 'spline',
                    name: 'Residue',
                    data: residue,
                    color: '#800000',
                    yAxis: 3,
                    dataGrouping: {
                        units: groupingUnits
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b>: ' +
                            '{point.y:,.2f} unitless<br/>'
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

    }).fail(function () {
        console.log("Missing");
        $('#container0003').empty();
    });

}

