angular.module('starter.controllers', ['ngTable'])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http, NgTableParams) {
        $scope.loop = 0;
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
            $.ajax({
                type: "POST",
                url: "https://ichess.sinaapp.com/prefprice.php",
                data: post,
                success: function (data) {
                    data = eval('(' + data + ')');
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
                }
            });
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.$on("$destroy", function () {
            $interval.cancel(loop);
        });
        $scope.getCounter = function (url) {

            $http.get(url)
                .success(function (data) {
                    console.log(data);
                    $scope.tableParams = new NgTableParams(
                        {
                            page: 1,            // show first page
                            count: 10,           // count per page
                            sorting: { name: 'asc' }
                        },
                        {
                            total: 0, // length of data
                            dataset: data
                        });
                });
        };
    })
    .controller('CalCtrl', function ($scope, $interval, $http, $ionicModal, NgTableParams) {
        $interval.cancel(loop);

        $scope.levels = [5, 6, 7, 8, 9, 10, 11];

        $scope.changeLevel = function (level) {
            getCounter(level);
        };
        function createChart(data) {
            $('#container').highcharts('StockChart', {
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: 'cal'
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

        function getCounter(n) {
            $.ajax({
                url: 'https://ichess.sinaapp.com/calindex.php',
                context: document.body,
                data: {
                    n: n
                },
                success: function (data) {
                    data = eval('(' + data + ')');
                    createChart(data);
                }
            });
        }

        $(document).ready(function () {
            getCounter(5);
        });

    })
    .controller('ActionCtrl', function ($scope, $interval, $http, $ionicModal, NgTableParams) {
        $interval.cancel($scope.loop);
        var url = "https://ichess.sinaapp.com/actionList.php";
        $scope.getCounter(url);
        $scope.loop = $interval(function () { $scope.getCounter(url) }, 60000);
    })
    .controller('ShortCtrl', function ($scope, $interval, $http, $ionicModal, NgTableParams) {
        $interval.cancel($scope.loop);
        var url = "https://ichess.sinaapp.com/short.php";
        $scope.getCounter(url);
        $scope.loop = $interval(function () { $scope.getCounter(url) }, 60000);
    }).controller('TrendCtrl', function ($scope, $interval, $http, $ionicModal, NgTableParams) {
        $interval.cancel($scope.loop);
        var url = "https://ichess.sinaapp.com/rate.php";
        $scope.getCounter(url);
        $scope.loop = $interval(function () { $scope.getCounter(url) }, 60000);
    }).controller('PrefCtrl', function ($scope, $interval, $http, $ionicModal, NgTableParams) {
        $interval.cancel($scope.loop);
        var url = "https://ichess.sinaapp.com/pref.php";
        $scope.getCounter(url);
        $scope.loop = $interval(function () { $scope.getCounter(url) }, 60000);
    }).controller('HolderCtrl', function ($scope, $interval, $http, $ionicModal, NgTableParams) {
        $interval.cancel($scope.loop);
        var url = "https://ichess.sinaapp.com/holder.php";
        $scope.getCounter(url);
        $scope.loop = $interval(function () { $scope.getCounter(url) }, 60000);
    }).controller('ChartCtrl', function ($scope) {
        console.log('chart');
    }).controller('WaveCtrl', function ($scope, $interval, $http, $ionicModal, NgTableParams) {
        $interval.cancel($scope.loop);
        var codes = 'sz002594,sh601390';
        var lt = (new Date()).getTime() - 24 * 60 * 60 * 1000;
        var seriesOptions = [];
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

        var createChart = function (container, seriesOptions) {
            for (var v in seriesOptions) {
                if (seriesOptions[v].name == 'sh000001') {
                    seriesOptions[v].yAxis = 0;
                } else {
                    seriesOptions[v].yAxis = 1;
                }
            }

            $('#' + container).highcharts('StockChart', {
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: 'wave'
                },
                yAxis: yAxis,
                series: seriesOptions
            });
        };

        var getCounter = function (code) {
            $.ajax({
                url: 'https://ichess.sinaapp.com/getindex.php',
                context: document.body,
                data: {
                    codes: code,
                    //lt:lt
                },
                success: function (data) {
                    data = eval('(' + data + ')');
                    seriesOptions = $.extend(true, {}, seriesOptions, data);
                    console.log(data);

                    var lst = data[0]['data'];
                    if (lst && lst.length > 0) {
                        lt = lst[lst.length - 1][0];
                    }
                    createChart(code, data);
                }
            });
        };

        var getHolder = function () {
            $.ajax({
                url: 'https://ichess.sinaapp.com/holder.php',
                context: document.body,
                success: function (data) {
                    data = eval('(' + data + ')');
                    for (var i in data) {
                        var item = data[i];
                        var code = item.code.toLowerCase();
                        $('#chart').append('<div id="' + code + '"></div>');
                        getCounter(code);
                        $scope.loop = $interval(function () { getCounter(code) }, 60000);
                    }
                }
            });
        };

        getHolder();
    }).controller('PopularCtrl', function ($scope, $interval, $http, $ionicModal, NgTableParams) {
        $interval.cancel($scope.loop);
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

        $scope.changeAspect = function () {
            oldData[1] = [];
            oldData[5] = [];
            oldData[20] = [];
            oldData[100] = [];

            var n = 1;
            var t = 0;

            var isPlay = false;
            var sellNotification = false;
            var r = 0;
            var maxColumn = 0;
            if ($scope.aspect == "main") {
                r = 1;
                $scope.aspect = "little";
            } else {
                r = 0;
                $scope.aspect = "main";
            }

            $interval.cancel($scope.loop);
            getCounter(1, t, r);
            $scope.loop = $interval(function () { getCounter(1, t, r) }, 60000);
        };

        function getCounter(n, t, r) {
            $.ajax({
                url: "https://ichess.sinaapp.com/other/cy.php",
                data: {
                    "n": n,
                    "t": t,
                    "r": r
                },
                context: document.body,
                success: function (data) {
                    var maxColumn = 0;
                    data = eval('(' + data + ')');
                    data = data.concat(oldData[n]);
                    console.log(data);
                    oldData[n] = data;

                    var data1 = [];
                    var data2 = [];
                    var data3 = [];
                    var data4 = [];
                    var data5 = [];
                    var data6 = [];
                    var data7 = [];

                    var gt = [];
                    var lt = [];

                    var delta = 0;
                    if (data.length > 0) {
                        var mid = Math.floor(data.length / 2);
                        delta = data[mid].dex - data[mid].strong;
                    }

                    var min = 100000;
                    for (var i = 0; i < data.length; i++) {
                        data2.push([1000 * parseInt(data[i].t), parseFloat(data[i].strong) + delta]);
                        data1.push([1000 * parseInt(data[i].t), parseFloat(data[i].dex)]);
                        if (parseFloat(data[i].dex) < min)
                            min = parseFloat(data[i].dex);
                        if (parseFloat(data[i].clmn) > maxColumn)
                            maxColumn = parseFloat(data[i].clmn);
                        if (data[i].t > t + (n - 1) * 60)
                            t = data[i].t;
                    }
                    for (var i = 0; i < data.length; i++) {
                        var cl = parseFloat(data[i].clmn);

                        data7.push([1000 * parseInt(data[i].t), cl]);
                    }

                    for (var i = 1; i < data.length; i++) {
                        if (i > 1 && data1[i][1] < data1[i - 1][1]) {
                            if (data2[i][1] > data2[i - 1][1]) {
                                var last = gt[gt.length - 1];
                                var append = 0;
                                if (typeof (last) == "object" && last[0] == i - 1) {
                                    append = last[1];
                                }
                                gt.push([i, data2[i][1] - data2[i - 1][1] + append]);
                                if (gt[gt.length - 1][1] > 3) {
                                    data3.push([1000 * parseInt(data[i].t), data1[i][1]]);
                                } else if (gt[gt.length - 1][1] > 2) {
                                    data5.push([1000 * parseInt(data[i].t), data1[i][1]]);
                                }
                            }
                        }

                        if (i > 1 && data1[i][1] > data1[i - 1][1]) {
                            if (data2[i][1] < data2[i - 1][1]) {
                                var last = lt[lt.length - 1];
                                var append = 0;
                                if (typeof (last) == "object" && last[0] == i - 1) {
                                    append = last[1];
                                }
                                lt.push([i, data2[i][1] - data2[i - 1][1] + append]);
                                if (lt[lt.length - 1][1] < -3) {
                                    data4.push([1000 * parseInt(data[i].t), data1[i][1]]);
                                } else if (lt[lt.length - 1][1] < -2) {
                                    data6.push([1000 * parseInt(data[i].t), data1[i][1]]);
                                }
                            }
                        }
                    }

                    if (typeof (data3[data3.length - 1]) == "object" && data3[data3.length - 1][0] == data.length - 1 && !isPlay) { //buy
                        isPlay = true;
                        player = document.getElementById('buymp3');
                        player.play();
                    } else if (typeof (data4[data4.length - 1]) == "object" && data4[data4.length - 1][0] == data.length - 1 && !isPlay) { //sell
                        isPlay = true;
                        player = document.getElementById('sellmp3');
                        player.play();
                    } else if (typeof (data5[data5.length - 1]) == "object" && data5[data5.length - 1][0] == data.length - 1 && !isPlay) { //pre buy
                        isPlay = true;
                        player = document.getElementById('pbuymp3');
                        player.play();
                    } else if (typeof (data6[data6.length - 1]) == "object" && data6[data6.length - 1][0] == data.length - 1 && !isPlay) { //pre sell
                        isPlay = true;
                        player = document.getElementById('psellmp3');
                        player.play();
                    } else {
                        isPlay = false;
                    }

                    var yAxis = [{
                        labels: {
                            format: '{value}'
                        },
                        max: 2 * maxColumn,
                        opposite: false
                    }, {
                        labels: {
                            format: '{value}'
                        },
                        opposite: true
                    }];

                    //(line, spline, scatter, bubble, mappoint...)
                    $('#popular').highcharts('StockChart', {
                        rangeSelector: {
                            selected: 1
                        },
                        title: {
                            text: 'popular'
                        },
                        yAxis: yAxis,
                        series: [{
                            name: 'Column',
                            type: 'area',
                            yAxis: 0,
                            data: data7.reverse()
                        }, {
                            name: 'Index',
                            type: 'line',
                            yAxis: 1,
                            data: data1.reverse()
                        }, {
                            name: 'Popular',
                            type: 'line',
                            yAxis: 1,
                            data: data2.reverse()
                        }, {
                            name: 'Buy point',
                            type: 'scatter',
                            yAxis: 1,
                            data: data3.reverse()
                        }, {
                            name: 'Sell point',
                            type: 'scatter',
                            yAxis: 1,
                            data: data4.reverse()
                        }]
                    });

                },
                error: function (err) {
                    oldData[n] = [];
                    t = 0;
                    console.log(err);
                }
            });
        }

        getCounter(1, t, r);
        $scope.loop = $interval(function () { getCounter(1, t, r) }, 60000);
    });