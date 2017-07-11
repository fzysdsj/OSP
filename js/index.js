/**
 *@autor: fzysdsj.github.io(abbot)
 *@date: 2017.7.03
 *@version: 1.0
 *@since: Jquery和JS混合使用（前两个还用了node，可惜输入输出把我写吐了，回归浏览器了。我大JS果然还是浏览器的王者）
 *@name:  方丈遗少的操作系统小学期实训JS版1.0.0
 *进程调度:process开头或结尾
 *存储调度:store开头或结尾
 *设备调度：equipment开头或结尾
 *文件调度:file开头或结尾
 */
//入口函数
'use strict';
$(function () {
    /*变量部分*/
    let sFlag = false;
    //选择所有a标签
    let buttons = $('.radmenu a');
    //用于判断是否弹出模态框
    let number = 0;
    let processName;
    let processPriority;
    let processNeedTime;
    let processArriveTime;
    let i;
    //存储进程数据数组
    let processArraySession;
    //进行相关操作数组
    let processArray;
    //进程执行完毕数组
    let processArrayFinshed;
    //存储管理相关变量开始
    //页面尺寸
    let layLength;
    //页表长度
    let layNumber;
    let visitNumber;
    let array = [];
    let random;
    let randomArray = [];
    //命中
    let shoted = 0;
    let shotFlag = false;
    let sLag;
    //存储管理相关变量结束
    let fileAllLength;
    let fileBeginTrackNumber;
    let fileBeginTrackNumberDemo;
    let fileMaxTrackNumber;
    let fileRandomNumber;
    let fileRandom;
    let fileRandomArray = [];


    /*函数部分*/
    for (let i = 0, l = buttons.length; i < l; i++) {
        let button = buttons[i];
        button.onclick = setSelected;
    }
    //选择函数，特效脚本实现
    function setSelected(e) {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            if (!$(this).parent().hasClass("radmenu")) {
                this.parentNode.parentNode.parentNode.querySelector("a").classList.add("selected");
                $(this).parent().parent().parent().children('a').addClass('selected');
            } else {
                $(this).addClass("show");
            }
        } else {
            $(this).addClass("selected");
            if (!$(this).parent().hasClass("radmenu")) {
                $('#myModal').modal(this);
                sFlag = true;
                if (sFlag) {
                    this.parentNode.parentNode.parentNode.querySelector("a").classList.remove("selected")
                }
            } else {
                $(this).removeClass("show");
            }
        }
        return false;
    }
    //进程调度之添加进程函数
    $("#addProcess").on('click', function () {
        number++;
        if (number % 2 != 0) {
            $('#processModal').modal(this);
            $("#processInformation").text("");
            $("#processResult").text("");
            $("#processEntering")[0].disabled = false;
            $("#processDelete")[0].disabled = false;
            processName = 0;
            processPriority = 0;
            processNeedTime = 0;
            processArriveTime = 0;
            i = 0;
            processArraySession = [];
            processArray = [];
            processArrayFinshed = [];
            $("#processDelete").click(function () {
                processName = 0;
                processPriority = 0;
                processNeedTime = 0;
                processArriveTime = 0;
                i = 0;
                processArraySession = [];
                processArray = [];
                processArrayFinshed = [];
                $("#processName").val("");
                $("#processPriority").val("");
                $("#processNeedTime").val("");
                $("#processInformation").text("");
                $("#processResult").text("");
                $("#processInformation").append("<h3>进程全部删除成功！</h3>");
            });
            $("#processEntering").click(function () {
                $("#processInformation").text("");
                processName = $("#processName").val();
                processPriority = parseInt($("#processPriority").val());
                processNeedTime = parseInt($("#processNeedTime").val());
                processArriveTime = ("" + new Date().getTime()).slice(7);
                $("#processName").val("");
                $("#processPriority").val("");
                $("#processNeedTime").val("");
                if ((!isNaN(processPriority)) && (!isNaN(processNeedTime))) {
                    let PCB = new Object();
                    PCB = {
                        'name': processName,
                        'priority': processPriority,
                        'priorityDemo': processPriority,
                        'arriveTime': processArriveTime,
                        'needTime': processNeedTime,
                        'needDemoTime': processNeedTime,
                        'runTime': 0,
                        'state': 'W',
                        'stateDemo': 'W',
                        'allTime': 0
                    };
                    let PCBdemo = {
                        'name': processName,
                        'priority': processPriority,
                        'priorityDemo': processPriority,
                        'arriveTime': processArriveTime,
                        'needTime': processNeedTime,
                        'needDemoTime': processNeedTime,
                        'runTime': 0,
                        'state': 'W',
                        'stateDemo': 'W',
                        'allTime': 0
                    }
                    processArraySession.push(PCB);
                    processArray.push(PCBdemo);
                    let processTableName = document.getElementById("processTableName");
                    if (processTableName == null) {
                        $("#processResult").append("<tr class='active' id='processTableName'><td>进程名</td><td>优先数</td><td>到达时间</td><td>需要时间</td><td>状态</td><td>运行时间</td><td>周转时间</td><tr>");
                    }
                    $("#processResult").append("<tr class='success text-center'><td>" + processArray[i].name + "</td><td>" + processArray[i].priority
                        + "</td><td>" + processArray[i].arriveTime + "</td><td>" + processArray[i].needTime + "</td><td>" + processArray[i].state + "</td><td>" + processArray[i].runTime + "</td><td>" + processArray[i].allTime + "</td></tr>")
                    i++;
                }
            });
        }
    });
    //进程调度之先来先服务函数
    $("#processFCFS").click(function () {
        number++;
        if (number % 2 != 0) {
            $('#processModal').modal(this);
            $("#processEntering")[0].disabled = true;
            $("#processDelete")[0].disabled = true;
            $("#processInformation").text("");
            $("#processResult").text("");
            let processTableName = document.getElementById("processTableName");
            console.log(processTableName);
            if (processTableName == null) {
                $("#processResult").append("<tr class='warning text-center' id='processTableName'><td>进程名</td><td>优先数</td><td>到达时间</td><td>需要时间</td><td>状态</td><td>运行时间</td><td>周转时间</td><tr>");
            }
            for (let i = 0; i < processArraySession.length; i++) {
                if (processArray.length < processArraySession.length) {
                    processArraySession[i].needTime = processArraySession[i].needDemoTime;
                    processArraySession[i].priority = processArraySession[i].priorityDemo;
                    processArraySession[i].state = processArraySession[i].stateDemo;
                    processArraySession[i].allTime = 0;
                    processArraySession[i].runTime = 0;
                    processArray.push(processArraySession[i]);
                    $("#processInformation").val("");
                    $("#processResult").append("<tr class='active text-center'><td>" + processArray[i].name + "</td><td>" + processArray[i].priority
                        + "</td><td>" + processArray[i].arriveTime + "</td><td>" + processArray[i].needTime + "</td><td>" + processArray[i].state + "</td><td>" + processArray[i].runTime + "</td><td>" + processArray[i].allTime + "</td></tr>")
                }
            }
            $("#processInformation").append("<h3>先来先服务算法开始执行!</h3><br>");
            //总周转时间
            let fTime = 0;
            //平均周转时间
            let aTime = 0;
            //带权周转时间
            let qTime = 0;
            let aqTime = 0;
            //降序，谁到得早，即到达时间小的谁先执行
            processArray.sort((a, b) => {
                return a.arriveTime - b.arriveTime;
            });
            let runTimer = setInterval(() => {
                if (processArray.length == 0) {
                    clearInterval(runTimer);
                    for (let i = 0; i < processArrayFinshed.length; i++) {
                        fTime += processArrayFinshed[i].allTime-1;
                        qTime += (processArrayFinshed[i].allTime-1) / processArrayFinshed[i].needDemoTime;
                    }
                    aTime = fTime / (processArrayFinshed.length);
                    aqTime = qTime / (processArrayFinshed.length);
                    $("#processResult").append("<tr class='active text-center'><td></td><td></td><td>平均周转时间:" + aTime + "</td>" + "<td>平均带权周转时间：" + aqTime + "</td><td></td><td></td><td></td>");
                }
                for (let i = 0; i < processArray.length; i++) {
                    if (i == 0) {
                        processArray[0].state = 'R';
                        if (processArray[0].needTime <= 0) {
                            processArray[0].state = 'F';
                            processArrayFinshed.push(processArray[0]);
                            processArray.shift();
                            $("#processResult").append("<tr class='success text-center'><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].name + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].priority + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].arriveTime + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].needTime + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].state + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].runTime + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].allTime + "</td></tr>")
                            processArrayFinshed[processArrayFinshed.length - 1].priority--;
                            processArrayFinshed[processArrayFinshed.length - 1].needTime--;
                            processArrayFinshed[processArrayFinshed.length - 1].runTime++;
                            processArrayFinshed[processArrayFinshed.length - 1].allTime++;
                        }
                        if (processArray.length != 0) {
                            $("#processResult").append("<tr class='active text-center'><td>"
                                + processArray[0].name + "</td><td>"
                                + processArray[0].priority + "</td><td>"
                                + processArray[0].arriveTime + "</td><td>"
                                + processArray[0].needTime + "</td><td>"
                                + processArray[0].state + "</td><td>"
                                + processArray[0].runTime + "</td><td>"
                                + processArray[0].allTime + "</td></tr>")
                            processArray[0].priority--;
                            processArray[0].needTime--;
                            processArray[0].runTime++;
                            processArray[0].allTime++;
                        }
                    } else if (processArray.length > 1) {
                        processArray[i].allTime++;
                        $("#processResult").append("<tr class='danger text-center'><td>"
                            + processArray[i].name + "</td><td>"
                            + processArray[i].priority + "</td><td>"
                            + processArray[i].arriveTime + "</td><td>"
                            + processArray[i].needTime + "</td><td>"
                            + processArray[i].state + "</td><td>"
                            + processArray[i].runTime + "</td><td>"
                            + (processArray[i].allTime - 1) + "</td></tr>")
                    }
                }
            }, 1000);
        }
    });
    //进程调度之高响应比优先函数
    $("#processHRRN").click(function () {
        number++;
        if (number % 2 != 0) {
            $('#processModal').modal(this);
            $("#processEntering")[0].disabled = true;
            $("#processDelete")[0].disabled = true;
            $("#processInformation").text("");
            $("#processResult").text("");
            let processTableName = document.getElementById("processTableName");
            console.log(processTableName);
            if (processTableName == null) {
                $("#processResult").append("<tr class='warning text-center' id='processTableName'><td>进程名</td><td>优先数</td><td>到达时间</td><td>需要时间</td><td>状态</td><td>运行时间</td><td>周转时间</td><tr>");
            }
            for (let i = 0; i < processArraySession.length; i++) {
                if (processArray.length < processArraySession.length) {
                    processArraySession[i].needTime = processArraySession[i].needDemoTime;
                    processArraySession[i].priority = processArraySession[i].priorityDemo;
                    processArraySession[i].state = processArraySession[i].stateDemo;
                    processArraySession[i].allTime = 0;
                    processArraySession[i].runTime = 0;
                    processArray.push(processArraySession[i]);
                    $("#processInformation").val("");
                    $("#processResult").append("<tr class='active text-center'><td>" + processArray[i].name + "</td><td>" + processArray[i].priority
                        + "</td><td>" + processArray[i].arriveTime + "</td><td>" + processArray[i].needTime + "</td><td>" + processArray[i].state + "</td><td>" + processArray[i].runTime + "</td><td>" + processArray[i].allTime + "</td></tr>")
                }
            }
            $("#processInformation").append("<h3>高响应比优先算法开始执行!</h3><br>");
            //总周转时间
            let fTime = 0;
            //平均周转时间
            let aTime = 0;
            //带权周转时间
            let qTime = 0;
            let aqTime = 0;
            //降序，谁到得早，即到达时间小的谁先执行
            processArray.sort((a, b) => {
                return a.allTime / a.needDemoTime - b.allTime / b.needDemoTime;
            });
            let runTimer = setInterval(() => {
                if (processArray.length == 0) {
                    clearInterval(runTimer);
                    for (let i = 0; i < processArrayFinshed.length; i++) {
                        fTime += (processArrayFinshed[i].allTime-1);
                        qTime += (processArrayFinshed[i].allTime-1) / processArrayFinshed[i].needDemoTime;
                    }
                    aTime = fTime / (processArrayFinshed.length);
                    aqTime = qTime / (processArrayFinshed.length);
                    $("#processResult").append("<tr class='active text-center'><td></td><td></td><td>平均周转时间:" + aTime + "</td>" + "<td>平均带权周转时间：" + aqTime+ "</td><td></td><td></td><td></td>");
                }
                for (let i = 0; i < processArray.length; i++) {
                    if (i == 0) {
                        processArray[0].state = 'R';
                        if (processArray[0].needTime <= 0) {
                            processArray[0].state = 'F';
                            processArrayFinshed.push(processArray[0]);
                            processArray.shift();
                            $("#processResult").append("<tr class='success text-center'><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].name + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].priority + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].arriveTime + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].needTime + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].state + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].runTime + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].allTime + "</td></tr>")
                            processArrayFinshed[processArrayFinshed.length - 1].priority--;
                            processArrayFinshed[processArrayFinshed.length - 1].needTime--;
                            processArrayFinshed[processArrayFinshed.length - 1].runTime++;
                            processArrayFinshed[processArrayFinshed.length - 1].allTime++;
                        }
                        if (processArray.length != 0) {
                            $("#processResult").append("<tr class='active text-center'><td>"
                                + processArray[0].name + "</td><td>"
                                + processArray[0].priority + "</td><td>"
                                + processArray[0].arriveTime + "</td><td>"
                                + processArray[0].needTime + "</td><td>"
                                + processArray[0].state + "</td><td>"
                                + processArray[0].runTime + "</td><td>"
                                + processArray[0].allTime + "</td></tr>")
                            processArray[0].priority--;
                            processArray[0].needTime--;
                            processArray[0].runTime++;
                            processArray[0].allTime++;
                        }
                    } else if (processArray.length > 1) {
                        processArray[i].allTime++;
                        $("#processResult").append("<tr class='danger text-center'><td>"
                            + processArray[i].name + "</td><td>"
                            + processArray[i].priority + "</td><td>"
                            + processArray[i].arriveTime + "</td><td>"
                            + processArray[i].needTime + "</td><td>"
                            + processArray[i].state + "</td><td>"
                            + processArray[i].runTime + "</td><td>"
                            + (processArray[i].allTime-1) + "</td></tr>")
                    }
                }
            }, 1000);
        }
    });
    //进程调度之短作业优先函数
    $("#processPSA").click(function () {
        number++;
        if (number % 2 != 0) {
            $('#processModal').modal(this);
            $("#processEntering")[0].disabled = true;
            $("#processDelete")[0].disabled = true;
            $("#processInformation").text("");
            $("#processResult").text("");
            let processTableName = document.getElementById("processTableName");
            console.log(processTableName);
            if (processTableName == null) {
                $("#processResult").append("<tr class='warning text-center' id='processTableName'><td>进程名</td><td>优先数</td><td>到达时间</td><td>需要时间</td><td>状态</td><td>运行时间</td><td>周转时间</td><tr>");
            }
            for (let i = 0; i < processArraySession.length; i++) {
                if (processArray.length < processArraySession.length) {
                    processArraySession[i].needTime = processArraySession[i].needDemoTime;
                    processArraySession[i].priority = processArraySession[i].priorityDemo;
                    processArraySession[i].state = processArraySession[i].stateDemo;
                    processArraySession[i].allTime = 0;
                    processArraySession[i].runTime = 0;
                    processArray.push(processArraySession[i]);
                    $("#processInformation").val("");
                    $("#processResult").append("<tr class='active text-center'><td>" + processArray[i].name + "</td><td>" + processArray[i].priority
                        + "</td><td>" + processArray[i].arriveTime + "</td><td>" + processArray[i].needTime + "</td><td>" + processArray[i].state + "</td><td>" + processArray[i].runTime + "</td><td>" + processArray[i].allTime + "</td></tr>")
                }
            }
            $("#processInformation").append("<h3>短作业优先算法开始执行!</h3><br>");
            //总周转时间
            let fTime = 0;
            //平均周转时间
            let aTime = 0;
            //带权周转时间
            let qTime = 0;
            let aqTime = 0;
            //降序，谁到得早，即到达时间小的谁先执行
            processArray.sort((a, b) => {
                return a.needTime - b.needTime;
            });
            let runTimer = setInterval(() => {
                if (processArray.length == 0) {
                    clearInterval(runTimer);
                    for (let i = 0; i < processArrayFinshed.length; i++) {
                        fTime += (processArrayFinshed[i].allTime-1);
                        qTime += (processArrayFinshed[i].allTime-1) / processArrayFinshed[i].needDemoTime;
                    }
                    aTime = fTime / (processArrayFinshed.length);
                    aqTime = qTime / (processArrayFinshed.length);
                    $("#processResult").append("<tr class='active text-center'><td></td><td></td><td>平均周转时间:" + aTime + "</td>" + "<td>平均带权周转时间：" + aqTime + "</td><td></td><td></td><td></td>");
                }
                for (let i = 0; i < processArray.length; i++) {
                    if (i == 0) {
                        processArray[0].state = 'R';
                        if (processArray[0].needTime <= 0) {
                            processArray[0].state = 'F';
                            processArrayFinshed.push(processArray[0]);
                            processArray.shift();
                            $("#processResult").append("<tr class='success text-center'><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].name + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].priority + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].arriveTime + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].needTime + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].state + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].runTime + "</td><td>"
                                + processArrayFinshed[processArrayFinshed.length - 1].allTime + "</td></tr>")
                            processArrayFinshed[processArrayFinshed.length - 1].priority--;
                            processArrayFinshed[processArrayFinshed.length - 1].needTime--;
                            processArrayFinshed[processArrayFinshed.length - 1].runTime++;
                            processArrayFinshed[processArrayFinshed.length - 1].allTime++;
                        }
                        if (processArray.length != 0) {
                            $("#processResult").append("<tr class='active text-center'><td>"
                                + processArray[0].name + "</td><td>"
                                + processArray[0].priority + "</td><td>"
                                + processArray[0].arriveTime + "</td><td>"
                                + processArray[0].needTime + "</td><td>"
                                + processArray[0].state + "</td><td>"
                                + processArray[0].runTime + "</td><td>"
                                + processArray[0].allTime + "</td></tr>")
                            processArray[0].priority--;
                            processArray[0].needTime--;
                            processArray[0].runTime++;
                            processArray[0].allTime++;
                        }
                    } else if (processArray.length > 1) {
                        processArray[i].allTime++;
                        $("#processResult").append("<tr class='danger text-center'><td>"
                            + processArray[i].name + "</td><td>"
                            + processArray[i].priority + "</td><td>"
                            + processArray[i].arriveTime + "</td><td>"
                            + processArray[i].needTime + "</td><td>"
                            + processArray[i].state + "</td><td>"
                            + processArray[i].runTime + "</td><td>"
                            + (processArray[i].allTime-1) + "</td></tr>")
                    }
                }
            }, 1000);
        }
    });
    //进程调度之生产者与消费者
    $("#ProducerAndConsumer").click(function () {
        let pcTimer;
        number++;
        if (number % 2 != 0) {
            $("#pcResult").text("");
            $("#pcResult").append("<tr class='active text-center'><td>生产1个（🍔）/取出1个(🤞)</td><td>产品数量(单位：个)</td>")
            $("#PCModal").modal(this);
            clearInterval(pcTimer);
            $("#pcReset").click(function () {
                $("#pcResult").text("");
                $("#pcResult").append("<tr class='active text-center'><td>生产1个（🍔）/取出1个(🤞)</td><td>产品数量(单位：个)</td>")
            });
            $("#pcEnd").click(function () {
                clearInterval(pcTimer);
                $("#pcResult").text("");
                $("#pcResult").append("算法成功停止!")
            });
            //模拟线程池最大容量
            const MAX = 20;
            //定时器
            let timer;
            //当前模拟线程池最大容量
            let count = 5;
            //判定条件
            let processFlag;
            //随机数
            let processRandom;
            //退出参数
            let exiting = false;
            //进程管理函数
            function ProcessManger() { };
            ProcessManger.prototype = {
                //判定函数
                Flag: function () {
                    processRandom = Math.random(0, 1);
                    (processRandom > 0.5) ? (processFlag = 1) : (processFlag = 0);
                },
                //生产者函数
                Producer: function () {
                    if (count == MAX) {
                        $("#pcResult").append("<tr class='danger text-center'><td>缓冲池已满🍔🍔🍔🍔🍔🍔！</td><td>等待2秒🏃。。。。。。</td><tr>");
                        //等待2秒
                        timer = setTimeout(() => {
                            clearTimeout(timer);
                        }, 2000);
                    } else {
                        count++;
                        $("#pcResult").append("<tr class='success text-center'><td>🍔</td><td>" + count + "</td>");
                        timer = setTimeout(() => {
                            //清除定时器
                            clearTimeout(timer);
                        }, 2000);
                    }
                },
                Consumer: function () {
                    if (count == 0) {
                        $("#pcResult").append("<tr class='danger text-center'><td>缓冲池已空🤞</td><td>等待2秒🏃。。。。。</td><tr>");
                        timer = setTimeout(() => {
                            clearTimeout(timer);
                        }, 2000);
                    } else {
                        count--;
                        $("#pcResult").append("<tr class='warning text-center'><td>🤞</td><td>" + count + "</td>");
                        timer = setTimeout(() => {
                            clearTimeout(timer);
                        }, 2000);
                    }
                }
            }
            let processManger = new ProcessManger();
            pcTimer = setInterval(function () {
                processManger.Flag();
                if (processFlag == 1) {
                    processManger.Producer();
                } else {
                    processManger.Consumer();
                }
            }, 2000);
        }
    })
    //拼接字符串
    let tableInformation = "<tr class='active text-center'><td>访问次数(🈲)</td><td>命中💘/未命中💔</td>";
    //存储管理之信息添加
    $("#storeAdd").on('click', function () {
        number++;
        if (number % 2 != 0) {
            $('#storeModal').modal(this);
            $('#layLength').val("");
            $('#layNumber').val("");
            $('#visitNumber').val("");
            $('#information').text("");
            $('#result').text("");
            $("#reset").on('click', function () {
                $('#layLength').val("");
                $('#layNumber').val("");
                $('#visitNumber').val("");
                $('#information').text("");
                $('#result').text("");
            });
            $("#entering").click(function () {
                $('#information').text("");
                $('#result').text("");
                tableInformation = "<tr class='active text-center'><td>访问次数(🈲)</td><td>命中💘/未命中💔</td>";
                randomArray = [];
                array = [];
                layLength = parseInt($('#layLength').val());
                layNumber = parseInt($('#layNumber').val());
                visitNumber = parseInt($('#visitNumber').val());
                $("#information").append("页面访问顺序如下:");
                for (let i = 0; i < visitNumber; i++) {
                    random = Math.ceil((parseInt(Math.random(0, 1) * 10000) / layLength));
                    randomArray.push(random);
                    $("#information").append(randomArray[i] + " ");
                };
                $("#information").append("<br>");
                for (let i = 0; i < layNumber; i++) {
                    if (i == 0) {
                        tableInformation = tableInformation + "<td>📜1</td>";

                    } else if (i != layNumber - 1) {
                        tableInformation += "<td>📜" + (i + 1) + "</td>";
                    } else {
                        tableInformation += "<td>📜" + layNumber + "</td></tr>";
                    }
                }
                $("#result").append(tableInformation);
            });
        }
    });
    //存储管理之先来先服务算法
    $("#storeFCFS").click(function () {
        number++;
        if (number % 2 != 0) {
            $('#result').text("");
            $('#result').append(tableInformation);
            $('#storeModal').modal(this);
            shoted = 0;
            array = [];
            let tableInformationFCFS = "";
            for (let i = 0; i < randomArray.length; i++) {
                shotFlag = false;
                //假设i = 0,randomArray[0]=1,array = [1,2];
                if (array.length == 0) {
                    tableInformationFCFS += "<tr class='danger text-center'><td>" + (i + 1) + "</td>";
                    array.push(randomArray[i]);
                    for (let j = 0; j < layNumber; j++) {
                        if (j == 0) {
                            tableInformationFCFS += "<td>💔</td><td>" + array[j] + "</td>";
                        } else if (j < layNumber - 1) {
                            tableInformationFCFS += "<td>💤</td>";
                        } else {
                            tableInformationFCFS += "<td>💤</td></tr>";
                        }
                    }
                } else if (array.length <= layNumber) {
                    //array = [1,2];
                    tableInformationFCFS += "<tr class='danger text-center'><td>" + (i + 1) + "</td>";
                    for (let j = 0; j < array.length; j++) {
                        //命中
                        if (randomArray[i] == array[j]) {
                            shoted++;
                            let sArrayLength = array.length;
                            for (let k = 0; k < layNumber; k++) {
                                if (k == 0) {
                                    tableInformationFCFS += "<td>💘</td>";
                                    for (let s = 0; s < sArrayLength; s++) {
                                        tableInformationFCFS += "<td>" + array[s] + "</td>";
                                    }
                                } else if ((layNumber - sArrayLength) == 0) {
                                    tableInformationFCFS += "</tr>";
                                } else if (sArrayLength < layNumber) {
                                    tableInformationFCFS += "<td>💤</td>";
                                    sArrayLength++;
                                }
                                else if (sArrayLength == layNumber) {
                                    tableInformationFCFS += "<td>💤</td></tr>";
                                }
                            }
                            shotFlag = true;
                        }
                    }
                    //未命中
                    if (!shotFlag) {
                        if (array.length < layNumber) {
                            let sArrayLength = array.length;
                            array.push(randomArray[i]);
                            for (let k = 0; k < layNumber; k++) {
                                if (k == 0) {
                                    tableInformationFCFS += "<td>💔</td>";
                                    for (let s = 0; s < sArrayLength; s++) {
                                        tableInformationFCFS += "<td>" + array[s] + "</td>";
                                    }
                                    tableInformationFCFS += "<td>" + randomArray[i] + "</td>";
                                } else if ((layNumber - sArrayLength - 1) == 0) {
                                    tableInformationFCFS += "</tr>";
                                } else if (sArrayLength < layNumber) {
                                    tableInformationFCFS += "<td>💤</td>";
                                    sArrayLength++;
                                }
                                else if (sArrayLength == layNumber) {
                                    tableInformationFCFS += "<td>💤</td></tr>";
                                }
                            }
                        } else {
                            array.shift();
                            let sArrayLength = array.length;
                            array.push(randomArray[i]);
                            for (let k = 0; k < layNumber; k++) {
                                if (k == 0) {
                                    tableInformationFCFS += "<td>💔</td>";
                                    for (let s = 0; s < sArrayLength; s++) {
                                        tableInformationFCFS += "<td>" + array[s] + "</td>";
                                    }
                                    tableInformationFCFS += "<td>" + randomArray[i] + "</td>";
                                } else if ((layNumber - sArrayLength - 1) == 0) {
                                    tableInformationFCFS += "</tr>";
                                } else if (array.length < layNumber) {
                                    tableInformationFCFS += "<td>💤</td>";
                                }
                                else if (array.length == layNumber) {
                                    tableInformationFCFS += "<td>💤</td></tr>";
                                }
                            }
                        }
                    }
                }
                // for (let j = 0; j < array.length - 1; j++) {
                //     tableInformationFCFS += "<td>" + array[j] + "</td>";

                // }
                // tableInformationFCFS += "<td>" + array[array.length - 1] + "</td>";
                // $("#result").append(array[i]+" ");
            }
           
            tableInformationFCFS += "<tr class='info text-center'><td> 💘/(💘+💔)</td><td>"
                + ((shoted / visitNumber) * 100).toFixed(2) + "%</td>";
                 for(let i = 0;i<layNumber;i++){
                    if(i<layNumber-1){
                        tableInformationFCFS+="<td>💲</td>";
                    }else{
                        tableInformationFCFS+="<td>💲</td></tr>";
                    }
            }
            $("#result").append(tableInformationFCFS);
        }
    });
    //存储管理之短作业优先算法
    $("#storeLRU").click(function () {
        number++;
        if (number % 2 != 0) {
            $('#result').text("");
            $('#result').append(tableInformation);
            $('#storeModal').modal(this);
            shoted = 0;
            array = [];
            let tableInformationLRU = "";
            for (let i = 0; i < randomArray.length; i++) {
                shotFlag = false;
                //假设i = 0,randomArray[0]=1,array = [1,2];
                if (array.length == 0) {
                    tableInformationLRU += "<tr class='danger text-center'><td>" + (i + 1) + "</td>";
                    array.push(randomArray[i]);
                    for (let j = 0; j < layNumber; j++) {
                        if (j == 0) {
                            tableInformationLRU += "<td>💔</td><td>" + array[j] + "</td>";
                        } else if (j < layNumber - 1) {
                            tableInformationLRU += "<td>💤</td>";
                        } else {
                            tableInformationLRU += "<td>💤</td></tr>";
                        }
                    }
                } else if (array.length <= layNumber) {
                    sLag = 0;
                    //array = [1,2];
                    tableInformationLRU += "<tr class='danger text-center'><td>" + (i + 1) + "</td>";
                    for (let j = 0; j < array.length; j++) {
                        //命中
                        if ((randomArray[i] == array[j]) && (randomArray[i] != sLag)) {
                            shoted++;
                            sLag = array[j];
                            array.splice(j, 1);
                            array.push(randomArray[i]);
                            let sArrayLength = array.length;
                            for (let k = 0; k < layNumber; k++) {
                                if (k == 0) {
                                    tableInformationLRU += "<td>💘</td>";
                                    for (let s = 0; s < sArrayLength; s++) {
                                        tableInformationLRU += "<td>" + array[s] + "</td>";
                                    }
                                } else if ((layNumber - sArrayLength) == 0) {
                                    tableInformationLRU += "</tr>";
                                } else if (sArrayLength < layNumber) {
                                    tableInformationLRU += "<td>💤</td>";
                                    sArrayLength++;
                                }
                                else if (sArrayLength == layNumber) {
                                    tableInformationLRU += "<td>💤</td></tr>";
                                }
                            }
                            shotFlag = true;
                        }
                    }
                    //未命中
                    if (!shotFlag) {
                        if (array.length < layNumber) {
                            let sArrayLength = array.length;
                            array.push(randomArray[i]);
                            for (let k = 0; k < layNumber; k++) {
                                if (k == 0) {
                                    tableInformationLRU += "<td>💔</td>";
                                    for (let s = 0; s < sArrayLength; s++) {
                                        tableInformationLRU += "<td>" + array[s] + "</td>";
                                    }
                                    tableInformationLRU += "<td>" + randomArray[i] + "</td>";
                                } else if ((layNumber - sArrayLength - 1) == 0) {
                                    tableInformationLRU += "</tr>";
                                } else if (sArrayLength < layNumber) {
                                    tableInformationLRU += "<td>💤</td>";
                                    sArrayLength++;
                                }
                                else if (sArrayLength == layNumber) {
                                    tableInformationLRU += "<td>💤</td></tr>";
                                }
                            }
                        } else {
                            array.shift();
                            let sArrayLength = array.length;
                            array.push(randomArray[i]);
                            for (let k = 0; k < layNumber; k++) {
                                if (k == 0) {
                                    tableInformationLRU += "<td>💔</td>";
                                    for (let s = 0; s < sArrayLength; s++) {
                                        tableInformationLRU += "<td>" + array[s] + "</td>";
                                    }
                                    tableInformationLRU += "<td>" + randomArray[i] + "</td>";
                                } else if ((layNumber - sArrayLength - 1) == 0) {
                                    tableInformationLRU += "</tr>";
                                } else if (array.length < layNumber) {
                                    tableInformationLRU += "<td>💤</td>";
                                }
                                else if (array.length == layNumber) {
                                    tableInformationLRU += "<td>💤</td></tr>";
                                }
                            }
                        }
                    }
                }
                // for (let j = 0; j < array.length - 1; j++) {
                //     tableInformationLRU += "<td>" + array[j] + "</td>";

                // }
                // tableInformationLRU += "<td>" + array[array.length - 1] + "</td>";
                // $("#result").append(array[i]+" ");
            }
            tableInformationLRU += "<tr class='info text-center'><td> 💘/(💘+💔)</td><td>"
                + ((shoted / visitNumber) * 100).toFixed(2) + "%</td>";
                for(let i = 0;i<layNumber;i++){
                    if(i<layNumber-1){
                        tableInformationLRU+="<td>💲</td>";
                    }else{
                        tableInformationLRU+="<td>💲</td></tr>";
                    }
            }
            $("#result").append(tableInformationLRU);
        }
    });
    //设备管理之银行家算法
    $("#bankerAlgorithm").on('click', function () {
        number++;
        if (number % 2 != 0) {
            let MAX = [{
                A: 7,
                B: 5,
                C: 3
            }, {
                A: 3,
                B: 2,
                C: 2
            }, {
                A: 9,
                B: 0,
                C: 2
            }, {
                A: 2,
                B: 2,
                C: 2
            }, {
                A: 4,
                B: 3,
                C: 3
            }];
            //系统可用资源量
            let AVAILABLE = {
                A: 10,
                B: 5,
                C: 7
            };
            //尚需要资源量
            let Need = [{
                A: 7,
                B: 5,
                C: 3
            }, {
                A: 3,
                B: 2,
                C: 2
            }, {
                A: 9,
                B: 0,
                C: 2
            }, {
                A: 2,
                B: 2,
                C: 2
            }, {
                A: 4,
                B: 3,
                C: 3
            }];
            let ProcessNumber = [{
                A: 0,
                B: 0,
                C: 0
            }, {
                A: 0,
                B: 0,
                C: 0
            }, {
                A: 0,
                B: 0,
                C: 0
            }, {
                A: 0,
                B: 0,
                C: 0
            }, {
                A: 0,
                B: 0,
                C: 0
            }];
            //系统可用资源量
            //存取安全序列数组
            let safeList;
            //判断安全序列
            let gFlag = false;
            $('#equipmentModal').modal(this);
            $("#equipmentReset").click(function () {
                $('#aNumber').val(0);
                $('#bNumber').val(0);
                $('#cNumber').val(0);
                $("#equipmentInformation").text("");
                $("#equipmentResult").text("");
            });
            $('#equipmentEntering').click(function () {
                $("#equipmentInformation").text("");
                $("#equipmentResult").text("");
                let AVAILABLEDemo = {
                    A: 10,
                    B: 5,
                    C: 7
                };
                //尚需要资源量
                let NeedDemo = [{
                    A: 7,
                    B: 5,
                    C: 3
                }, {
                    A: 3,
                    B: 2,
                    C: 2
                }, {
                    A: 9,
                    B: 0,
                    C: 2
                }, {
                    A: 2,
                    B: 2,
                    C: 2
                }, {
                    A: 4,
                    B: 3,
                    C: 3
                }];
                let ProcessNumberDemo = [{
                    A: 0,
                    B: 0,
                    C: 0
                }, {
                    A: 0,
                    B: 0,
                    C: 0
                }, {
                    A: 0,
                    B: 0,
                    C: 0
                }, {
                    A: 0,
                    B: 0,
                    C: 0
                }, {
                    A: 0,
                    B: 0,
                    C: 0
                }];
                for (let i = 0; i < MAX.length; i++) {
                    parseInt(Need[i].A);
                    parseInt(Need[i].B);
                    parseInt(Need[i].C);
                    parseInt(NeedDemo[i].A);
                    parseInt(NeedDemo[i].B);
                    parseInt(NeedDemo[i].C);
                    parseInt(AVAILABLE.A);
                    parseInt(AVAILABLE.B);
                    parseInt(AVAILABLE.C);
                    parseInt(AVAILABLEDemo.A);
                    parseInt(AVAILABLEDemo.B);
                    parseInt(AVAILABLEDemo.C);
                    parseInt(ProcessNumber[i].A);
                    parseInt(ProcessNumber[i].B);
                    parseInt(ProcessNumber[i].C);
                    parseInt(ProcessNumberDemo[i].A);
                    parseInt(ProcessNumberDemo[i].B);
                    parseInt(ProcessNumberDemo[i].C);
                };
                let lFlag = false;
                let processNumber = parseInt($('#processNumber').val());
                let aNumber = parseInt($('#aNumber').val());
                let bNumber = parseInt($('#bNumber').val());
                let cNumber = parseInt($('#cNumber').val());
                // alert(processNumber + "," + aNumber + "," + bNumber + "," + cNumber);
                if (Need[processNumber].A < aNumber || Need[processNumber].B < bNumber || Need[processNumber].C < cNumber) {
                    $('#equipmentInformation').append("请求资源数超过进程所需");
                } else if (aNumber == 0 && bNumber == 0 && cNumber == 0) {
                    $('#equipmentInformation').append("请求资源不能全为0,那是没有任何意义的。");
                } else {
                    if (AVAILABLE.A < aNumber || AVAILABLE.B < bNumber || AVAILABLE.C < cNumber) {
                        $('#equipmentInformation').append("可利用资源不足，系统进入不安全状态，此时不分配资源");
                    } else {
                        $('#equipmentInformation').append("<h3>请求资源合理,开始验证是否存在安全序列。</h3><br>");
                        $('#equipmentInformation').append("<h3>🏃🏃🏃🏃🏃.......</h3><br>");
                        $('#equipmentInformation').append("<h4><small>方丈提醒:表格中🍗(🍉，🍹)后面数字为资源最大可利用量，而🚌0(1,2,3,4)后面括号里的数字为各进程所需的资源最大量，大家可不要搞错了哦。</small><h4><br>");
                        NeedDemo[processNumber].A -= aNumber;
                        NeedDemo[processNumber].B -= bNumber;
                        NeedDemo[processNumber].C -= cNumber;
                        AVAILABLEDemo.A -= aNumber;
                        AVAILABLEDemo.B -= bNumber;
                        AVAILABLEDemo.C -= cNumber;
                        ProcessNumberDemo[processNumber].A += aNumber;
                        ProcessNumberDemo[processNumber].B += bNumber;
                        ProcessNumberDemo[processNumber].C += cNumber;
                        //ProcessNumberDemo[2] = [4,0,2];
                        safeList = [];
                        var timer = setInterval(function () {
                            for (let i = 0; i < NeedDemo.length; i++) {
                                if (NeedDemo[i].A <= AVAILABLEDemo.A && NeedDemo[i].B <= AVAILABLEDemo.B && NeedDemo[i].C <= AVAILABLEDemo.C && (NeedDemo[i].A + NeedDemo[i].B + NeedDemo[i].C != 0)) {
                                    AVAILABLEDemo.A += ProcessNumberDemo[i].A;
                                    AVAILABLEDemo.B += ProcessNumberDemo[i].B;
                                    AVAILABLEDemo.C += ProcessNumberDemo[i].C;
                                    ProcessNumberDemo[i].A = ProcessNumberDemo[i].B = ProcessNumberDemo[i].C = 0;
                                    NeedDemo[i].A = NeedDemo[i].B = NeedDemo[i].C = 0;
                                    if (safeList.length < NeedDemo.length) {
                                        safeList.push(i);
                                    }
                                }
                            }
                            if (safeList.length == NeedDemo.length) {
                                gFlag = true;
                                clearInterval(timer);
                                let tableBankerAlgorithm = "<tr class='warning text-center'><td>😒（需要）/😊(分配)</td><td>🍗:资源A</td><td>🍹:资源B</td><td>🍉:资源C</td><td>🚌:进程</td><td>🎵:计算中</td><td>✅</td><td>存在安全序列</td>";
                                // $('#equipmentResult').append("存在安全序列:");
                                for (let i = 0; i < safeList.length; i++) {
                                    if (i < safeList.length - 1) {
                                        tableBankerAlgorithm += "<td>🚌" + safeList[i] +
                                            "</td><td>➡</td>";
                                    } else {
                                        tableBankerAlgorithm += "<td>🚌" + safeList[i] +
                                            "<td>🌖</td><td>🌗</td></tr>";
                                    }
                                }
                                $('#equipmentResult').append(tableBankerAlgorithm);
                                $('#equipmentResult').append("<tr class='success text-center'><td>😒（需要）/😊(分配)</td><td>🍗(10)</td><td>🍹(5)</td><td>🍉(7)</td><td>🚌0🍗(7)</td><td>🚌0🍹(5)</td><td>🚌0🍉(3)</td><td>🚌1🍗(3)</td><td>🚌1🍹(2)</td><td>🚌1🍉(2)</td><td>🚌2🍗(9)</td><td>🚌2🍹(0)</td><td>🚌2🍉(2)</td><td>🚌3🍗(2)</td><td>🚌3🍹(2)</td><td>🚌3🍉(2)</td><td>🚌4🍗(4)</td><td>🚌4🍹(3)</td><td>🚌4🍉(3)</td></tr>");
                                /* 一个伟大的Bug。以'new Array'的形式创建数组Need和NeedDemo, 'Need===NeedDemo'比较时是比较栈中的值，会输出false，
                                 而'Need[i]===NeedDemo[i]'则是比较的栈对应的堆中的值，会输出true。
                                 这是个什么意思呢？打个比方，有房间A和房间B，房间A和房间B外观上完全相同，且各有一个正在发春的饿汉，
                                 房间A和房间B中间隔着一个可以任意伸手进去的玻璃箱，箱子里有一条不能自己移动的没破处的狗和一份热腾腾的米饭。狗，是母狗。饭是炸狗饭。
                                房间A的饿汉和房间B的饿汉能看到狗和饭，看不到对方。且他们都以为只有自己能看到饭和狗。于是房间A中的饿汉决定先把狗抱到房间里OOXX，
                                房间B中的饿汉则决定先把饭拿到房间里吃。以房间而言，房间A和房间B显然是不同的，只是两个一模一样的房间。
                                以饿汉而言，箱子却是同一个箱子。当房间A里的饿汉OOXX完狗后，准备吃饭时，会发现房间B里的饿汉吃完饭后，正准备OOXX狗！
                                这就是，不管你建多少个有饿汉的房间，被操的都只是同一条狗！
                                Oh!My！God！多么痛的领悟！
                                图如下：
                                  _____         _____ 
                                 |   A  |      | B   |
                                 |    ☹ ◤狗◥ ☹     |       
                                 |      |◣饭◢        |  
                                 |____ _|      |____ _|

                                 方丈我也不是好惹的，好吧。*/
                                Need[processNumber].A -= aNumber;
                                Need[processNumber].B -= bNumber;
                                Need[processNumber].C -= cNumber;
                                AVAILABLE.A -= aNumber;
                                AVAILABLE.B -= bNumber;
                                AVAILABLE.C -= cNumber;
                                ProcessNumber[processNumber].A += aNumber;
                                ProcessNumber[processNumber].B += bNumber;
                                ProcessNumber[processNumber].C += cNumber;
                                if (Need[processNumber].A == 0 && Need[processNumber].B == 0 && Need[processNumber].C == 0) {
                                    AVAILABLE.A += ProcessNumber[processNumber].A;
                                    AVAILABLE.B += ProcessNumber[processNumber].B;
                                    AVAILABLE.C += ProcessNumber[processNumber].C;
                                    ProcessNumber[processNumber].A = 0;
                                    ProcessNumber[processNumber].B = 0;
                                    ProcessNumber[processNumber].C = 0;
                                }
                                let tableEquipment = "<tr class='danger text-center'><td>😊</td><td>" + AVAILABLE.A +
                                    "</td><td>" + AVAILABLE.B +
                                    "</td><td>" + AVAILABLE.C +
                                    "</td>";
                                let tableNeedEquipment = "<tr class='info text-center'><td>😒</td><td>/</td><td>/</td><td>/</td>"
                                // $('#equipmentResult').append("进程" + processNumber + "获得资源信息:A资源:" + aNumber + ",B资源:" + bNumber + ",C资源:" + cNumber + "<br>");
                                // $('#equipmentResult').append("资源分配成功<br>");
                                // $('#equipmentResult').append("可利用资源信息:资源A：" + AVAILABLE.A + ",资源B：" + AVAILABLE.B + ",资源C：" + AVAILABLE.C + "<br>");
                                // $('#equipmentResult').append("资源已分配情况:<br>");
                                for (let i = 0; i < ProcessNumber.length; i++) {
                                    if (i < ProcessNumber.length - 1) {
                                        tableEquipment += "<td>" + ProcessNumber[i].A +
                                            "</td><td>" + ProcessNumber[i].B +
                                            "</td><td>" + ProcessNumber[i].C +
                                            "</td>"
                                        tableNeedEquipment += "<td>" + Need[i].A +
                                            "</td><td>" + Need[i].B +
                                            "</td><td>" + Need[i].C +
                                            "</td>"
                                    } else {
                                        tableEquipment += "<td>" + ProcessNumber[i].A +
                                            "</td><td>" + ProcessNumber[i].B +
                                            "</td><td>" + ProcessNumber[i].C +
                                            "</td></tr>";
                                        tableNeedEquipment += "<td>" + Need[i].A +
                                            "</td><td>" + Need[i].B +
                                            "</td><td>" + Need[i].C +
                                            "</td></tr>";
                                    }
                                }
                                $('#equipmentResult').append(tableEquipment);
                                $('#equipmentResult').append(tableNeedEquipment);
                                // $('#equipmentResult').append("尚需要资源情况:<br>");
                                // for (let i = 0; i < Need.length; i++) {
                                //     $('#equipmentResult').append("进程" + i + ",资源A：" + Need[i].A + ",资源B：" + Need[i].B + ",资源C：" + Need[i].C + "<br>");
                                // }
                                // $('#equipmentResult').append("*******华丽丽的结束线*********<br>");
                            }
                        }, 1000);
                    }
                }
            });
        }
    });
    //封装升序函数
    function Up(a, b) { return a - b; }
    //封装降序函数
    function Down(a, b) { return b - a; };
    //文件管理之相关信息添加
    $("#fileAdd").on('click', function () {
        number++;
        if (number % 2 != 0) {
            $('#fileModal').modal(this);

            $('#inspection').on('click', function () {
                fileBeginTrackNumber = parseInt($('#beginTrackNumber').val());
                fileBeginTrackNumberDemo = parseInt($('#beginTrackNumber').val());
                fileMaxTrackNumber = parseInt($('#maxTrackNumber').val());
                if (fileMaxTrackNumber < fileBeginTrackNumber || isNaN(fileBeginTrackNumber)) {
                    $("#fileInformation").text("");
                    $("#fileResult").text("");
                    $('#fileInformation').append("输入错误，请重新输入！<br>");
                } else {
                    $("#fileResult").text("");
                    $("#fileInformation").text("");
                    $('#fileInformation').append("输入成功，请随机磁道号<br>");
                    $('#fileRandom')[0].disabled = false;
                }
            });
            $('#fileRandom').on('click', function () {
                $("#fileInformation").text("");
                $("#fileResult").text("");
                fileRandomArray = [];
                fileRandomNumber = parseInt($('#randomNumber').val());
                $("#fileInformation").append("<h3>最大磁道号：" + fileMaxTrackNumber + ",起始磁道号：" + fileBeginTrackNumber + "</h3><br>");
                $("#fileInformation").append("<h3><small>随机申请的" + fileRandomNumber + "个磁道信息如下:</small></h3>");
                for (let i = 0; i < fileRandomNumber; i++) {
                    fileRandom = Math.ceil(Math.random(0, 1) * fileMaxTrackNumber);
                    fileRandomArray.push(fileRandom);
                    $('#fileInformation').append('<small>' + fileRandomArray[i] + "</small> ");
                }
                $('#fileInformation').append('<br><small>方丈小提示：🛒为磁道代号，可别当作购物车哦。</small><br> ');
                $('#fileRandom')[0].disabled = true;
            });
            $("#fileReset").click(function () {
                $('#beginTrackNumber').val("");
                $('#maxTrackNumber').val(25000);
                $('#randomNumber').val(3);
                $('#fileInformation').text("");
                $('#fileResult').text("");
            });
        }
    });
    //文件管理之先来先服务算法
    $('#fileFCFS').click(function () {
        number++;
        if (number % 2 != 0) {
            $("#fileResult").text("");
            $('#fileModal').modal(this);
            let tableFileInformation = "<tr class='info text-center'><td>📏(磁道总数)</td><td>📀(最大磁道号)</td><td>💿(开始磁道号)</td><td>💽(当前磁道号)</td>";
            fileAllLength = 0;
            let tableFile = "";
            fileBeginTrackNumber = fileBeginTrackNumberDemo;
            for (let i = 0; i < fileRandomArray.length; i++) {
                let s = Math.abs(fileBeginTrackNumber - fileRandomArray[i]);
                fileAllLength += s;
                fileBeginTrackNumber = fileRandomArray[i];
                tableFile += "<tr class='danger text-center'>";
                tableFile += "<td>" + fileAllLength + "</td><td>" +
                    fileMaxTrackNumber + "</td><td>" +
                    fileBeginTrackNumberDemo + "</td><td>" +
                    fileBeginTrackNumber + "</td>";
                if (i < fileRandomArray.length - 1) {
                    tableFileInformation += "<td>🛒" + i + "</td>";
                } else {
                    tableFileInformation += "<td>🛒" + i + "</td></tr>";
                }
                for (let j = 0; j < fileRandomArray.length; j++) {
                    if (j < fileRandomArray.length - 1) {
                        tableFile += "<td>" + fileRandomArray[j] + "</td>";
                    } else {
                        tableFile += "<td>" + fileRandomArray[j] + "</td></tr>";
                    }
                }
            };
            $('#fileResult').append(tableFileInformation);
            $('#fileResult').append(tableFile);
            $('#fileResult').append("<tr class='success text-center'><td>磁道总数</td><td>"
                + fileAllLength + "</td><td>磁道平均数</td><td>" + (fileAllLength / fileRandomNumber).toFixed(2) + "</td>");
        }
    });
    //文件管理之扫描算法
    $('#fileSCAN').click(function () {
        number++;
        if (number % 2 != 0) {
            $("#fileResult").text("");
            $('#fileModal').modal(this);
            let tableFileInformation = "<tr class='info text-center'><td>📏(磁道总数)</td><td>📀(最大磁道号)</td><td>💿(开始磁道号)</td><td>💽(当前磁道号)</td>";
            fileAllLength = 0;
            let tableFile = "";
            fileBeginTrackNumber = fileBeginTrackNumberDemo;;
            let fileBigerRandomArray = [];
            let fileLittlerRandomArray = [];
            for (let i = 0; i < fileRandomArray.length; i++) {
                if (fileRandomArray[i] >= fileBeginTrackNumber) {
                    fileBigerRandomArray.push(fileRandomArray[i]);
                } else {
                    fileLittlerRandomArray.push(fileRandomArray[i]);
                }
            }
            fileBigerRandomArray.sort(Up);
            fileLittlerRandomArray.sort(Down);
            for (let i = 0; i < fileBigerRandomArray.length; i++) {
                fileAllLength += Math.abs(fileBeginTrackNumber - fileBigerRandomArray[i]);
                fileBeginTrackNumber = fileBigerRandomArray[i];
            };
            for (let i = 0; i < fileBigerRandomArray.length; i++) {
                let s = Math.abs(fileBeginTrackNumber - fileBigerRandomArray[i]);
                fileAllLength += s;
                fileBeginTrackNumber = fileBigerRandomArray[i];
                tableFile += "<tr class='danger text-center'>";
                tableFile += "<td>" + fileAllLength + "</td><td>" +
                    fileMaxTrackNumber + "</td><td>" +
                    fileBeginTrackNumberDemo + "</td><td>" +
                    fileBeginTrackNumber + "</td>";
                if (i < fileBigerRandomArray.length - 1) {
                    tableFileInformation += "<td>🛒" + i + "</td>";
                } else {
                    tableFileInformation += "<td>🛒" + i + "</td></tr>";
                }
                for (let j = 0; j < fileBigerRandomArray.length; j++) {
                    if (j < fileBigerRandomArray.length - 1) {
                        tableFile += "<td>" + fileBigerRandomArray[j] + "</td>";
                    } else {
                        tableFile += "<td>" + fileBigerRandomArray[j] + "</td></tr>";
                    }
                }
            };
            for (let i = 0; i < fileLittlerRandomArray.length; i++) {
                fileAllLength += Math.abs(fileBeginTrackNumber - fileLittlerRandomArray[i]);
                fileBeginTrackNumber = fileLittlerRandomArray[i];
            };
            for (let i = 0; i < fileLittlerRandomArray.length; i++) {
                let s = Math.abs(fileBeginTrackNumber - fileLittlerRandomArray[i]);
                fileAllLength += s;
                fileBeginTrackNumber = fileLittlerRandomArray[i];
                tableFile += "<tr class='danger text-center'>";
                tableFile += "<td>" + fileAllLength + "</td><td>" +
                    fileMaxTrackNumber + "</td><td>" +
                    fileBeginTrackNumberDemo + "</td><td>" +
                    fileBeginTrackNumber + "</td>";
                if (i < fileLittlerRandomArray.length - 1) {
                    tableFileInformation += "<td>🛒" + i + "</td>";
                } else {
                    tableFileInformation += "<td>🛒" + i + "</td></tr>";
                }
                for (let j = 0; j < fileLittlerRandomArray.length; j++) {
                    if (j < fileLittlerRandomArray.length - 1) {
                        tableFile += "<td>" + fileLittlerRandomArray[j] + "</td>";
                    } else {
                        tableFile += "<td>" + fileLittlerRandomArray[j] + "</td></tr>";
                    }
                }
            };
            $('#fileResult').append(tableFileInformation);
            $('#fileResult').append(tableFile);
            $('#fileResult').append("<tr class='success text-center'><td>磁道总数</td><td>"
                + fileAllLength + "</td><td>磁道平均数</td><td>" + (fileAllLength / fileRandomNumber).toFixed(2) + "</td>");
            // $('#fileResult').append("扫描算法算法执行结果<br>磁道总数:" + fileAllLength + "<br>");
            // $('#fileResult').append("磁道平均数:" + (fileAllLength / fileRandomNumber).toFixed(2) + "<br>");
            // $('#fileResult').append("<br>********华丽丽的分割线*******<br><br>");
        }
    });
    //文件管理之循环扫描算法
    $('#fileCSCAN').click(function () {
        number++;
        if (number % 2 != 0) {
            $("#fileResult").text("");
            $('#fileModal').modal(this);
            let tableFileInformation = "<tr class='info text-center'><td>📏(磁道总数)</td><td>📀(最大磁道号)</td><td>💿(开始磁道号)</td><td>💽(当前磁道号)</td>";
            fileAllLength = 0;
            let tableFile = "";
            fileBeginTrackNumber = fileBeginTrackNumberDemo;;
            let fileBigerRandomArray = [];
            let fileLittlerRandomArray = [];
            for (let i = 0; i < fileRandomArray.length; i++) {
                if (fileRandomArray[i] >= fileBeginTrackNumber) {
                    fileBigerRandomArray.push(fileRandomArray[i]);
                } else {
                    fileLittlerRandomArray.push(fileRandomArray[i]);
                }
            }
            fileBigerRandomArray.sort(Up);
            fileLittlerRandomArray.sort(Up);
            for (let i = 0; i < fileBigerRandomArray.length; i++) {
                fileAllLength += Math.abs(fileBeginTrackNumber - fileBigerRandomArray[i]);
                fileBeginTrackNumber = fileBigerRandomArray[i];
            };
            for (let i = 0; i < fileBigerRandomArray.length; i++) {
                let s = Math.abs(fileBeginTrackNumber - fileBigerRandomArray[i]);
                fileAllLength += s;
                fileBeginTrackNumber = fileBigerRandomArray[i];
                tableFile += "<tr class='danger text-center'>";
                tableFile += "<td>" + fileAllLength + "</td><td>" +
                    fileMaxTrackNumber + "</td><td>" +
                    fileBeginTrackNumberDemo + "</td><td>" +
                    fileBeginTrackNumber + "</td>";
                if (i < fileBigerRandomArray.length - 1) {
                    tableFileInformation += "<td>🛒" + i + "</td>";
                } else {
                    tableFileInformation += "<td>🛒" + i + "</td></tr>";
                }
                for (let j = 0; j < fileBigerRandomArray.length; j++) {
                    if (j < fileBigerRandomArray.length - 1) {
                        tableFile += "<td>" + fileBigerRandomArray[j] + "</td>";
                    } else {
                        tableFile += "<td>" + fileBigerRandomArray[j] + "</td></tr>";
                    }
                }
            };
            for (let i = 0; i < fileLittlerRandomArray.length; i++) {
                fileAllLength += Math.abs(fileBeginTrackNumber - fileLittlerRandomArray[i]);
                fileBeginTrackNumber = fileLittlerRandomArray[i];
            };
            for (let i = 0; i < fileLittlerRandomArray.length; i++) {
                let s = Math.abs(fileBeginTrackNumber - fileLittlerRandomArray[i]);
                fileAllLength += s;
                fileBeginTrackNumber = fileLittlerRandomArray[i];
                tableFile += "<tr class='danger text-center'>";
                tableFile += "<td>" + fileAllLength + "</td><td>" +
                    fileMaxTrackNumber + "</td><td>" +
                    fileBeginTrackNumberDemo + "</td><td>" +
                    fileBeginTrackNumber + "</td>";
                if (i < fileLittlerRandomArray.length - 1) {
                    tableFileInformation += "<td>🛒" + i + "</td>";
                } else {
                    tableFileInformation += "<td>🛒" + i + "</td></tr>";
                }
                for (let j = 0; j < fileLittlerRandomArray.length; j++) {
                    if (j < fileLittlerRandomArray.length - 1) {
                        tableFile += "<td>" + fileLittlerRandomArray[j] + "</td>";
                    } else {
                        tableFile += "<td>" + fileLittlerRandomArray[j] + "</td></tr>";
                    }
                }
            };
            $('#fileResult').append(tableFileInformation);
            $('#fileResult').append(tableFile);
            $('#fileResult').append("<tr class='success text-center'><td>磁道总数</td><td>"
                + fileAllLength + "</td><td>磁道平均数</td><td>" + (fileAllLength / fileRandomNumber).toFixed(2) + "</td>");
            // $('#fileResult').append("循环扫描算法算法执行结果<br>磁道总数:" + fileAllLength + "<br>");
            // $('#fileResult').append("磁道平均数:" + (fileAllLength / fileRandomNumber).toFixed(2) + "<br>");
            // $('#fileResult').append("<br>********华丽丽的分割线*******<br><br>");
        }
    });
    //文件管理之段最短距离优先算法
    $('#fileSSTF').click(function () {
        number++;
        if (number % 2 != 0) {
            $('#fileResult').text("");
            $('#fileModal').modal(this);
            let tableFileInformation = "<tr class='info text-center'><td>📏(磁道总数)</td><td>📀(最大磁道号)</td><td>💿(开始磁道号)</td><td>💽(当前磁道号)</td>";
            fileAllLength = 0;
            let tableFile = "";
            fileBeginTrackNumber = fileBeginTrackNumberDemo;
            let fileRandomArrayDemo = new Array();
            for (let i = 0; i < fileRandomArray.length; i++) {
                fileRandomArrayDemo.push(fileRandomArray[i]);
            }
            for (let i = 0; i < fileRandomArrayDemo.length; i++) {
                if (i < fileRandomArrayDemo.length - 1) {
                    tableFileInformation += "<td>🛒" + i + "</td>";
                } else {
                    tableFileInformation += "<td>🛒" + i + "</td></tr>";
                }
            }
            let arrayNumber = 0;
            let timer = setInterval(function () {
                let min = fileMaxTrackNumber;
                let f;
                let s;
                tableFile += "<tr class='danger text-center'>";
                for (let i = 0; i < fileRandomArrayDemo.length; i++) {
                    s = Math.abs(fileBeginTrackNumber - fileRandomArrayDemo[i]);
                    if (min >= s) {
                        min = s;
                        f = i;
                    }
                }
                fileAllLength += min;
                fileBeginTrackNumber = fileRandomArrayDemo[f];
                tableFile += "<td>" + fileAllLength + "</td><td>" +
                    fileMaxTrackNumber + "</td><td>" +
                    fileBeginTrackNumberDemo + "</td><td>" +
                    fileBeginTrackNumber + "</td>";
                for (let j = 0; j < fileRandomArrayDemo.length + arrayNumber; j++) {
                    if (j <= fileRandomArrayDemo.length - 1) {
                        tableFile += "<td>" + fileRandomArrayDemo[j] + "</td>";
                    } else if (j < fileRandomArrayDemo.length + arrayNumber - 1) {
                        tableFile += "<td>💤</td>";
                    } else {
                        tableFile += "<td>💤</td></tr>";
                    }
                }
                fileRandomArrayDemo.splice(f, 1);
                arrayNumber++;
                console.log(arrayNumber);
                if (fileRandomArrayDemo.length == 0) {
                    clearInterval(timer);
                    $('#fileResult').append(tableFileInformation);
                    $('#fileResult').append(tableFile);
                    $('#fileResult').append("<tr class='success text-center'><td>磁道总数</td><td>"
                        + fileAllLength + "</td><td>磁道平均数</td><td>" + (fileAllLength / fileRandomNumber).toFixed(2) + "</td>");
                    // $('#fileResult').append("最短寻路时间优先算法执行结果<br>磁道总数:" + fileAllLength + "<br>");
                    // $('#fileResult').append("磁道平均数:" + (fileAllLength / fileRandomNumber).toFixed(2) + "<br>");
                    // $('#fileResult').append("<br>********华丽丽的分割线*******<br><br>");
                }
            }, 1)
        }
    });
    //心得体会及文章总结三篇
    $("#study").on('click', function () {
        number++;
        if (number % 2 != 0) {
            $('#studyModal').modal(this);
        }
    });
});
//少侠，再来500行代码可好？
//大爷，再来500行代码可好？