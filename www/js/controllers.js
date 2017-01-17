angular.module('starter.controllers', ['ngTable'])

    .controller('AppCtrl', function ($rootScope,$scope, $ionicModal, $timeout, $http, $interval, NgTableParams) {
        Highcharts.setOptions({ global: { useUTC: false } });
        var dailyUrlTmp = "https://image.sinajs.cn/newchart/daily/n/sh600000.gif";
        var miniteUrlTmp = "https://image.sinajs.cn/newchart/min/n/sh600000.gif";
        var maxImgWidth = document.body.clientWidth * 0.9;

        var addGif = function () {
            $("table.table tr").each(function () {
                var td = $("<td></td>");
                $(this).append(td);
                var url = gifUrl.replace("sh600000", $(this).find("td:first").text().toLowerCase());
                var img = new Image();
                img.onload = function () {
                    td.append(img);
                };
                img.src = url;
            });
        };
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};
        $scope.player = null;

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/detail-modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };

        $scope.openModal = function (code) {
            code = code.toLowerCase();
            $scope.modal.show();
            $("#prefBuy").text("");
            $("#prefSell").text("");
            $("#current").text("");
            $("#high").text("");
            $("#low").text("");
            $("#divMinite").empty();
            $("#divDaily").empty();
            var post = {
                "code": code
            };

            $http.post('https://ichess.sinaapp.com/prefprice.php',post)
                .success(function (data) {
                    console.log(data);
                    $("#prefBuy").text(data.prefBuy);
                    $("#prefSell").text(data.prefSell);
                    $("#current").text(data.current);
                    $("#high").text(data.high);
                    $("#low").text(data.low);
                    dailyUrl = dailyUrlTmp.replace("sh600000", code) + "?t=" + Math.random();
                    miniteUrl = miniteUrlTmp.replace("sh600000", code) + "?t=" + Math.random();

                    var imgMinite = new Image();
                    imgMinite.onload = function () {
                        if (imgMinite.width > maxImgWidth) {
                            imgMinite.width = maxImgWidth;
                            imgMinite.height = imgMinite.height * maxImgWidth / imgMinite.width;
                        }
                        $("#divMinite").append(imgMinite);
                    };
                    imgMinite.src = miniteUrl;

                    var imgDaily = new Image();
                    imgDaily.onload = function () {
                        if (imgDaily.width > maxImgWidth) {
                            imgDaily.width = maxImgWidth;
                            imgDaily.height = imgDaily.height * maxImgWidth / imgDaily.width;
                        }
                        $("#divDaily").append(imgDaily);
                    };
                    imgDaily.src = dailyUrl;
                });
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.getCounter = function (url) {

            $http.get(url)
                .success(function (data) {
                    console.log(data);
                    $scope.tableParams = new NgTableParams(
                        {
                            page: 1,            // show first page
                            count: 10,           // count per page
                            sorting: { rate: 'desc', a: 'desc' ,buy: 'desc'}
                        },
                        {
                            total: 0, // length of data
                            dataset: data
                        });
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        var locationChangeStart = function(){
            if($rootScope.loop){
                $interval.cancel($rootScope.loop);
                $rootScope.loop = null;
            }
        };

        $rootScope.$on('$locationChangeStart', locationChangeStart);        
    })
    .controller('CalCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.levels = [5, 6, 7, 8, 9, 10, 11];

        $scope.changeLevel = function (level) {
            calindex(level);
        };

        function createChart(data) {
            $('#container').highcharts('StockChart', {
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: null
                },
                navigator: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                },
                series: [{
                    name: 'real',
                    data: data.reals,
                    tooltip: {
                        valueDecimals: 2
                    }
                }, {
                    name: 'cal',
                    data: data.cals,
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            });
        }

        function calindex(n) {
            $http.get('https://ichess.sinaapp.com/calindex.php?n=' + n)
                .success(function (data) {
                    console.log(data);
                    createChart(data);
                });
        }

       calindex(5);

    })
    .controller('ActionCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.url = "https://ichess.sinaapp.com/actionList.php";
        $scope.getCounter($scope.url,$scope);
    })
    .controller('DailyCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.url = "https://ichess.sinaapp.com/daily/analysis.php";
        $scope.getCounter($scope.url,$scope);
    })
    .controller('ShortCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.url = "https://ichess.sinaapp.com/short.php";
        $scope.getCounter($scope.url,$scope);
    }).controller('TrendCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.url = "https://ichess.sinaapp.com/rate.php";
        $scope.getCounter($scope.url,$scope);
    }).controller('PrefCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.url = "https://ichess.sinaapp.com/pref.php";
        $scope.getCounter($scope.url,$scope);
    }).controller('HolderCtrl', function ($rootScope,$scope, $http, $ionicModal, NgTableParams) {
        $scope.url = "https://ichess.sinaapp.com/holder.php";
        $scope.getCounter($scope.url,$scope);
        $scope.addStock = function(code){

            var urlAdd = "https://ichess.sinaapp.com/holder.php?a=a&c=" + code;
            $http.get(urlAdd)
                .success(function (data) {
                    $scope.getCounter($scope.url);
                });
        };
        $scope.deleteStock = function(code){
            var urlDetete = "https://ichess.sinaapp.com/holder.php?a=d&c=" + code;
            $http.get(urlDetete)
                .success(function (data) {
                    $scope.getCounter($scope.url);
                    alert('delete successfully.');
                });
        };
    }).controller('chartCtrl', function ($rootScope,$scope,$interval) {
        
        var chart = new Highcharts.stockChart({
            chart: {
                renderTo: 'popular',
                type: 'area'
            },
            title: {
                text: 'Monthly Average Temperature'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },

            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                name: 'Tokyo',
                data: [[100,7.0], [120,6.9]]
            }, {
                name: 'London',
                data: [[100,5.0], [120,16.9]]
            }]
        });

        function addPoint(){
             chart.series[0].addPoint([150,10],false);
             chart.series[1].addPoint([150,20],false);
            //chart.series[0].setData([[100,7.0], [120,6.9],[150,10]],false);
            chart.redraw();
        }
        
        $interval(addPoint,10000);

        

    }).controller('WaveCtrl', function ($rootScope,$scope, $http, $ionicModal,$interval, NgTableParams) {
        var codes = 'sz002594,sh601390';
        var lt = (new Date()).getTime() - 24 * 60 * 60 * 1000;
        
        var yAxis = [{
            labels: {
                format: '{value}'
            },
            opposite: false
        }, {
            labels: {
                format: '{value}'
            },
            opposite: true
        }];

        var charts = [];

        var createChart = function (container, seriesOptions) {
            for (var v in seriesOptions) {
                if (seriesOptions[v].name == 'sh000001') {
                    seriesOptions[v].yAxis = 0;
                } else {
                    seriesOptions[v].yAxis = 1;
                }
            }

            if(charts[container]){
                for(var i = 0; i < charts[container].series.length; i++){
                    charts[container].series[i].setData(seriesOptions[i].data);
                }
            }else{
                charts[container] = new Highcharts.stockChart({
                    chart: {
                        renderTo: container
                    },
                    rangeSelector: {
                        selected: 1
                    },
                    title: {
                        text: null
                    },
                    navigator: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    scrollbar: {
                        enabled: true
                    },
                    yAxis: yAxis,
                    series: seriesOptions
                });
            }
            
        };

        var getindex = function (code) {
            $http.get('https://ichess.sinaapp.com/getindex.php?codes=' + code )
                .success(function (data) {
                    console.log(data);

                    var lst = data[0]['data'];
                    if (lst && lst.length > 0) {
                        lt = lst[lst.length - 1][0];
                    }
                    createChart(code, data);
            });
        };

        var getHolder = function () {
            var url = 'https://ichess.sinaapp.com/holder.php';
            $http.get(url)
                .success(function (data) {
                    for (var i in data) {
                        var item = data[i];
                        var code = item.code.toLowerCase();
                        $('#popular').append('<div id="' + code + '"></div>');
                        getindex(code);
                    }
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        getHolder();

        $rootScope.loop = $interval(function (){ getHolder() }, 10000);
        
    }).controller('PopularCtrl', function ($rootScope,$scope, $interval, $http, $ionicModal, NgTableParams) {

        $scope.days = [1,5,20,100];
        $scope.aspect = "main";
        var oldData = [];
        oldData[1] = [];
        oldData[5] = [];
        oldData[20] = [];
        oldData[100] = [];

        var n = 1;
        var t = 0;

        var background = {
            type: 'linearGradient',
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 1,
            colorStops: [{
                offset: 0,
                color: '#d2e6c9'
            }, {
                offset: 1,
                color: 'white'
            }]
        };
        var maxColumn = 0;

        var isPlay = false;
        var sellNotification = false;
        var r = 0;
        var chart = null;

        $scope.changeLevel = function(day){
            chart.destroy();
            chart = null;
            n = parseInt(day);
            oldData[1] = [];
            oldData[5] = [];
            oldData[20] = [];
            oldData[100] = [];

            t = 0;
            var maxColumn = 0;
            calPopular(n, r);
        }

        $scope.changeAspect = function (n) {
            chart.destroy();
            chart = null;
            
            oldData[1] = [];
            oldData[5] = [];
            oldData[20] = [];
            oldData[100] = [];

            t = 0;

            var isPlay = false;
            var sellNotification = false;
            var maxColumn = 0;
            if ($scope.aspect == "main") {
                r = 1;
                $scope.aspect = "little";
            } else {
                r = 0;
                $scope.aspect = "main";
            }

            calPopular(n, r);
        };

        $scope.stopSound = function(){
            if($scope.player)
                $scope.player.pause();
            $scope.$broadcast('scroll.refreshComplete');
        };

        function calPopular(n, r) {
            var p = {
                    n: n,
                    t: t,
                    r: r
                };

            $http.get('https://ichess.sinaapp.com/other/cy.php?' + $.param(p))
                .success(function (data) {
                    console.log(data);
                    
                    if(data.length == 0)
                        return;

                    var maxColumn = 0;
                    var minValue = 100000;
                    var maxValue = 0;
                    data = oldData[n].concat(data);
                    
                    oldData[n] = data.slice();

                    var arr = [];
                     arr[0] = [];
                     arr[1] = [];
                     arr[2] = [];
                     arr[3] = [];
                     arr[4] = [];
                     arr[5] = [];
                     arr[6] = [];
                    

                    var gt = [];
                    var lt = [];

                    var delta = 0;

                    var minP = 100000;
                    var maxP = 0;
                    
                    t = data[data.length-1].t;
                    var mid = Math.floor(data.length / 2);
                    delta = data[mid].dex - data[mid].strong;

                    var min = 100000;

                    for (var i = 0; i < data.length; i++) {
                        arr[2].push([1000 * parseInt(data[i].t), parseFloat(data[i].strong) + delta]);
                        arr[1].push([1000 * parseInt(data[i].t), parseFloat(data[i].dex)]);

                        if(parseFloat(data[i].dex) > maxValue){
                            maxValue = parseFloat(data[i].dex);
                        }
                        if(parseFloat(data[i].strong) + delta > maxValue){
                            maxValue = parseFloat(data[i].strong) + delta;
                        }
                        if(parseFloat(data[i].dex) < minValue){
                            minValue = parseFloat(data[i].dex);
                        }
                        if(parseFloat(data[i].strong) + delta < minValue){
                            minValue = parseFloat(data[i].strong) + delta;
                        }

                        if (parseFloat(data[i].dex) < min)
                            min = parseFloat(data[i].dex);
                    }
                    for (var i = 0; i < data.length; i++) {
                        var cl = Math.round(parseFloat(data[i].clmn)/1000);

                        if(cl > 4000){
                            cl = 4000;
                        }
                        arr[0].push([1000 * parseInt(data[i].t), cl]);

                        if (cl > maxColumn)
                            maxColumn = cl;
                    }

                    for (var i = 1; i < data.length; i++) {
                        if (i > 1 && arr[1][i][1] < arr[1][i - 1][1]) {
                            if (arr[2][i][1] > arr[2][i - 1][1]) {
                                var last = gt[gt.length - 1];
                                var append = 0;
                                if (typeof (last) == "object" && last[0] == i - 1) {
                                    append = last[1];
                                }
                                gt.push([i, arr[2][i][1] - arr[2][i - 1][1] + append]);
                                if (gt[gt.length - 1][1] > 3) {
                                    arr[3].push([1000 * parseInt(data[i].t), arr[1][i][1]]);
                                } else if (gt[gt.length - 1][1] > 2) {
                                    arr[5].push([1000 * parseInt(data[i].t), arr[1][i][1]]);
                                }
                            }
                        }

                        if (i > 1 && arr[1][i][1] > arr[1][i - 1][1]) {
                            if (arr[2][i][1] < arr[2][i - 1][1]) {
                                var last = lt[lt.length - 1];
                                var append = 0;
                                if (typeof (last) == "object" && last[0] == i - 1) {
                                    append = last[1];
                                }
                                lt.push([i, arr[2][i][1] - arr[2][i - 1][1] + append]);
                                if (lt[lt.length - 1][1] < -3) {
                                    arr[4].push([1000 * parseInt(data[i].t), arr[1][i][1]]);
                                } else if (lt[lt.length - 1][1] < -2) {
                                    arr[6].push([1000 * parseInt(data[i].t), arr[1][i][1]]);
                                }
                            }
                        }
                        if(arr[2][i][1] > maxP){
                            maxP = arr[2][i][1];
                        }
                        if(arr[2][i][1] < minP){
                            minP = arr[2][i][1];
                        }
                    }

                    if (typeof (arr[3][arr[3].length - 1]) == "object" && arr[3][arr[3].length - 1][0] == data.length - 1 && !isPlay) { //buy
                        if($scope.player)
                            $scope.player.pause();
                        isPlay = true;
                        $scope.player = document.getElementById('buymp3');
                        $scope.player.play();
                    } else if (typeof (arr[4][arr[4].length - 1]) == "object" && arr[4][arr[4].length - 1][0] == data.length - 1 && !isPlay) { //sell
                        if($scope.player)
                            $scope.player.pause();
                        isPlay = true;
                        $scope.player = document.getElementById('sellmp3');
                        $scope.player.play();
                    } else if (typeof (arr[5][arr[5].length - 1]) == "object" && arr[5][arr[5].length - 1][0] == data.length - 1 && !isPlay) { //pre buy
                        if($scope.player)
                            $scope.player.pause();
                        isPlay = true;
                        $scope.player = document.getElementById('pbuymp3');
                        $scope.player.play();
                    } else if (typeof (arr[6][arr[6].length - 1]) == "object" && arr[6][arr[6].length - 1][0] == data.length - 1 && !isPlay) { //pre sell
                        if($scope.player)
                            $scope.player.pause();
                        isPlay = true;
                        $scope.player = document.getElementById('psellmp3');
                        $scope.player.play();
                    } else {
                        isPlay = false;
                    }

                    var yAxis = [{
                        labels: {
                            format: '{value}'
                        },
                        max: 2 * maxColumn,
                        tickInterval: 1000,
                        opposite: false
                    }, {
                        labels: {
                            format: '{value}'
                        },
                        startOnTick: false,
                        endOnTick: false,
                        max: maxValue,
                        min: minValue,
                        opposite: true,
                        plotLines: [{
                            value: minP,
                            color: 'green',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: 'min'
                            }
                        }, {
                            value: maxP,
                            color: 'red',
                            dashStyle: 'shortdash',
                            width: 2,
                            label: {
                                text: 'max'
                            }
                        }]
                    }];


                    var series = [{
                                name: 'Column',
                                type: 'area',
                                yAxis: 0,
                                color: Highcharts.defaultOptions.colors[0],
                                data: arr[0]
                            }, {
                                name: 'Index',
                                type: 'line',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[1],
                                data: arr[1]
                            }, {
                                name: 'Popular',
                                type: 'line',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[2],
                                data: arr[2]
                            }, {
                                name: 'Buy point',
                                type: 'scatter',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[3],
                                data: arr[3]
                            }, {
                                name: 'Sell point',
                                type: 'scatter',
                                yAxis: 1,
                                color: Highcharts.defaultOptions.colors[4],
                                data: arr[4]
                            }];

                    var options = {
                            chart: {
                                renderTo: 'popular'
                            },
                            rangeSelector: {
                                selected: 1
                            },
                            title: {
                                text: null
                            },
                            navigator: {
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },
                            scrollbar: {
                                enabled: true
                            },
                            yAxis: yAxis,
                            series: series
                        };

                    if(chart==null){
                        chart = new Highcharts.stockChart(options);
                    }else{
                        for(var i = 0; i < chart.series.length; i++){
                            chart.series[i].setData(arr[i],false);
                        }
                        chart.redraw();
                    }
                })
                .error(function(error){
                    console.log(error);
                    oldData[n] = [];
                    t = 0;
                });
        };

        calPopular(n, r);
        $rootScope.loop = $interval(function (){ calPopular(n, r) }, 10000);
    });