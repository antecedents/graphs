// noinspection ES6ConvertVarToLetConst

var Highcharts;

var url = document.getElementById("tree").getAttribute("url");
var space = document.getElementById("tree").getAttribute("space");


// Generate graphs
$.getJSON(url, function (source) {

    let data = source['data'], keys = source['columns'];

    // key indices
    let i_level = keys.indexOf('level'), i_url = keys.indexOf('url');

    // symbols
    const symbols = new Map();
    symbols.set("chapter", "circle"), symbols.set("section", "circle"), symbols.set("page", "circle"), 
    symbols.set("study", "square"), symbols.set("application", "url(/assets/img/application.png)"), symbols.set("graph", "url(/assets/img/graph.png)"), symbols.set("start", "url(/assets/img/start.png)");

    // And
    let colour = [];


    // Add the nodes option through an event call. We want to start with the parent
    // item and apply separate colors to each child element, then the same color to
    // grandchildren.
    Highcharts.addEvent(
        Highcharts.Series,
        'afterSetOptions',
        function (e) {

            const colors = Highcharts.getOptions().colors, nodes = {};

            let i = 0;

            if ( this instanceof Highcharts.Series.types.networkgraph && e.options.id === 'chapter' ) {
                e.options.data.forEach(function (link) {

                    if (link[i_url].length === 0) {
                        colour = 'black';
                    } else {
                        colour = '#F19E39';
                    }

                    if (link[0] === 'CONTENT') {
                        nodes['CONTENT'] = {
                            id: 'CONTENT',
                            marker: {
                                radius: 20
                            },
                            color: 'black',
                            dataLabels: {
                                enabled: false,
                                verticalAlign: 'middle',
                                backgroundColor: 'contrast',
                                style: {
                                    textOutline: 'none'
                                }
                            }
                        };
                        nodes[link[1]] = {
                            id: link[1],
                            marker: {
                                radius: 9
                            },
                            color: colour
                        };
                    } else if (link[0] === 'INTRODUCTION') {
                        nodes['INTRODUCTION'] = {
                            id: 'INTRODUCTION',
                            marker: {
                                symbol: symbols.get(link[i_level]),
                                radius: 20
                            },
                            color: '#F19E39',
                            dataLabels: {
                                enabled: false,
                                verticalAlign: 'top',
                                backgroundColor: 'contrast',
                                style: {
                                    textOutline: 'none'
                                }
                            }
                        };
                    } else if (nodes[link[0]] && nodes[link[0]].color) {
                        nodes[link[1]] = {
                            id: link[1],
                            marker: {
                                symbol: symbols.get(link[i_level]),
                                lineWidth: 0,
                                radius: 9
                            },
                            color: colour
                        };
                    }
                });

                e.options.nodes = Object.keys(nodes).map(function (id) {
                    return nodes[id];
                });
            }
        }
    );



    Highcharts.chart(space, {

        chart: {
            type: 'networkgraph',
            width: 850,
            height: 585
        },

        title: {
            text: '',
            align: 'left'
        },

        credits: {
            enabled: false
        },

        plotOptions: {
            networkgraph: {
                keys: source['columns'],
                layoutAlgorithm: {
                    maxIterations: 72,
                    enableSimulation: true,
                    friction: -0.9,
                    gravitationalConstant:
                        document.getElementById(space).scrollWidth < 500 ?
                            0.2 : 0.06
                },
                allowPointSelect: true,
                point: {
                    events: {
                        click: function () {
                            const chart = this, point = chart.point;
                            const selectedNode = chart.series.points.find((point) => point.to === chart.point.id);
                            if (selectedNode.url.length > 0) {
                                window.open(selectedNode.url, selectedNode.to, 'popup=' + selectedNode.popup + ',width=' + selectedNode.abscissa + ',height=' + selectedNode.ordinate);
                            }
                        }
                    }
                },
                marker: {
                    symbol: 'circle'
                }
            }
        },

        tooltip: {
            useHTML: true,
            formatter: function () {
                const chart = this, point = chart.point;
                const selectedNode = chart.series.points.find((point) => point.to === chart.point.id);
                if (selectedNode) {
                    return selectedNode.from + '&Rarr; ' + selectedNode.name;
                }

                return '<b>' + source['description'] + '</b><br>';
            }
        },

        exporting: {
            enabled: false
        },

        series: [{
            accessibility: {
                enabled: false
            },
            keys: keys,
            dataLabels: {
                enabled: true,
                linkFormat: '',
                style: {
                    fontSize: '0.8em',
                    fontWeight: 'lighter',
                    fontFamily: 'Montserrat'
                }
            },
            id: 'chapter',
            data: data
        }]
    });

})
