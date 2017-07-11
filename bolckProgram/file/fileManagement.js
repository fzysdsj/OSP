/**
 *@autor: fzysdsj.github.io(abbot)
 *@date: 2017.7.07
 *@version: 1.0
 *@since: JQ 1.1
 *@name: 文件管理
 */
$(function() {
    $('#FCFS')[0].disabled = true;
    $('#SSTF')[0].disabled = true;
    $('#SCAN')[0].disabled = true;
    $('#CSCAN')[0].disabled = true;
    $('#random')[0].disabled = true;
    //寻道总数
    let allLength;
    //寻道平均数
    let avLength;
    let beginTrackNumber;
    let maxTrackNumber;
    let randomNumber;
    let random;
    let randomArray = [];
    //升序
    function Up(a, b) { return a - b; }
    //降序
    function Down(a, b) { return b - a; }

    $('#inspection').on('click', function() {
        beginTrackNumber = parseInt($('#beginTrackNumber').val());
        maxTrackNumber = parseInt($('#maxTrackNumber').val());
        if (maxTrackNumber < beginTrackNumber || isNaN(beginTrackNumber)) {
            alert("输入错误，请重新输入！");
            $('#beginTrackNumber').val("");
            $('#maxTrackNumber').val(25000);
        } else {
            alert("输入成功，请随机磁道号");
            $('#beginTrackNumber').val("");
            $('#maxTrackNumber').val(25000);
            $('#random')[0].disabled = false;
        }
    });
    $('#random').on('click', function() {
        $("#information").text("");
        randomNumber = parseInt($('#randomNumber').val());
        $("#information").append("最大磁道号：" + maxTrackNumber + ",起始磁道号：" + beginTrackNumber + ",");
        $("#information").append("随机申请的" + randomNumber + "个磁道信息如下:");
        for (let i = 0; i < randomNumber; i++) {
            random = Math.ceil(Math.random(0, 1) * maxTrackNumber);
            randomArray.push(random);
            $('#information').append(randomArray[i] + " ");
        }
        alert("赋值成功，请选择算法");
        $('#random')[0].disabled = true;
        $('#FCFS')[0].disabled = false;
        $('#SSTF')[0].disabled = false;
        $('#SCAN')[0].disabled = false;
        $('#CSCAN')[0].disabled = false;
        $("#FCFS").on('click', function() {
            allLength = 0;
            for (let i = 0; i < randomArray.length; i++) {
                let s = Math.abs(beginTrackNumber - randomArray[i]);
                allLength += s;
                beginTrackNumber = randomArray[i];
            };
            console.log("先来先服务算法执行结果\n磁道总数:" + allLength);
            console.log("磁道平均数:" + (allLength / randomNumber).toFixed(2));
            console.log("********华丽丽的分割线*******");
        });
        $('#SSTF').on('click', function() {
            allLength = 0;
            for (let i = 0; i < randomArray.length; i++) {
                console.log(randomArray[i] + ",");
            }
            let timer = setInterval(function() {
                let min = maxTrackNumber;
                let f;
                let s;
                for (let i = 0; i < randomArray.length; i++) {
                    s = Math.abs(beginTrackNumber - randomArray[i]);
                    if (min >= s) {
                        min = s;
                        f = i;
                    }
                }
                allLength += min;
                console.log("min:" + min);
                beginTrackNumber = randomArray[f];
                randomArray.splice(f, 1);
                if (randomArray.length == 0) {
                    clearInterval(timer);
                    console.log("最短寻路时间优先算法执行结果\n磁道总数:" + allLength);
                    console.log("磁道平均数:" + (allLength / randomNumber).toFixed(2));
                    console.log("********华丽丽的分割线*******");
                }
            }, 1)
        });
        $('#SCAN').on('click', function() {
            allLength = 0;
            let BigerRandomArray = [];
            let LittlerRandomArray = [];
            for (let i = 0; i < randomArray.length; i++) {
                if (randomArray[i] >= beginTrackNumber) {
                    BigerRandomArray.push(randomArray[i]);
                } else {
                    LittlerRandomArray.push(randomArray[i]);
                }
            }
            BigerRandomArray.sort(Up);
            LittlerRandomArray.sort(Down);
            for (let i = 0; i < BigerRandomArray.length; i++) {
                allLength += Math.abs(beginTrackNumber - BigerRandomArray[i]);
                beginTrackNumber = BigerRandomArray[i];
            };
            for (let i = 0; i < LittlerRandomArray.length; i++) {
                allLength += Math.abs(beginTrackNumber - LittlerRandomArray[i]);
                beginTrackNumber = LittlerRandomArray[i];
            };
            console.log("扫描算法算法执行结果\n磁道总数:" + allLength);
            console.log("磁道平均数:" + (allLength / randomNumber).toFixed(2));
            console.log("********华丽丽的分割线*******");
        });
        $('#CSCAN').on('click', function() {
            allLength = 0;
            let BigerRandomArray = [];
            let LittlerRandomArray = [];
            for (let i = 0; i < randomArray.length; i++) {
                if (randomArray[i] >= beginTrackNumber) {
                    BigerRandomArray.push(randomArray[i]);
                } else {
                    LittlerRandomArray.push(randomArray[i]);
                }
            }
            BigerRandomArray.sort(Up);
            LittlerRandomArray.sort(Up);
            for (let i = 0; i < BigerRandomArray.length; i++) {
                allLength += Math.abs(beginTrackNumber - BigerRandomArray[i]);
                beginTrackNumber = BigerRandomArray[i];
            };
            for (let i = 0; i < LittlerRandomArray.length; i++) {
                allLength += Math.abs(beginTrackNumber - LittlerRandomArray[i]);
                beginTrackNumber = LittlerRandomArray[i];
            };
            console.log("循环扫描算法算法执行结果\n磁道总数:" + allLength);
            console.log("磁道平均数:" + (allLength / randomNumber).toFixed(2));
            console.log("********华丽丽的分割线*******");
        });
    });
});