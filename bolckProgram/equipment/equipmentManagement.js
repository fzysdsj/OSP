/**
 *@autor: fzysdsj.github.io(abbot)
 *@date: 2017.7.03
 *@version: 1.0
 *@since: node.js 8.0.0
 *@name: 存储管理，银行家算法
 */

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
$(function() {
    $('#bankerAlgorithm').on('click', function() {
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
        console.log("*******华丽丽的开始线*********");
        let lFlag = false;
        let processNumber = parseInt($('#processNumber').val());
        let aNumber = parseInt($('#aNumber').val());
        let bNumber = parseInt($('#bNumber').val());
        let cNumber = parseInt($('#cNumber').val());
        // alert(processNumber + "," + aNumber + "," + bNumber + "," + cNumber);
        if (Need[processNumber].A < aNumber || Need[processNumber].B < bNumber || Need[processNumber].C < cNumber) {
            alert("请求资源数超过进程所需");
        } else if (aNumber == 0 && bNumber == 0 && cNumber == 0) {
            alert("请求资源不能全为0,那是没有任何意义的。");
        } else {
            if (AVAILABLE.A < aNumber || AVAILABLE.B < bNumber || AVAILABLE.C < cNumber) {
                alert("可利用资源不足，系统进入不安全状态，此时不分配资源");
            } else {
                alert("请求资源合理,开始验证是否存在安全序列。");
                console.log("运算中.......");
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
                var timer = setInterval(function() {
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
                        console.log("存在安全序列:");
                        for (let i = 0; i < safeList.length; i++) {
                            console.log("↓");
                            console.log("进程" + safeList[i]);
                        }
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
                        console.log("进程" + processNumber + "获得资源信息:A资源:" + aNumber + ",B资源:" + bNumber + ",C资源:" + cNumber);
                        console.log("资源分配成功");
                        console.log("可利用资源信息:资源A：" + AVAILABLE.A + ",资源B：" + AVAILABLE.B + ",资源C：" + AVAILABLE.C);
                        console.log("资源已分配情况:");
                        for (let i = 0; i < ProcessNumber.length; i++) {
                            console.log("进程" + i + ",资源A：" + ProcessNumber[i].A + ",资源B：" + ProcessNumber[i].B + ",资源C：" + ProcessNumber[i].C);
                        }
                        console.log("尚需要资源情况:");
                        for (let i = 0; i < Need.length; i++) {
                            console.log("进程" + i + ",资源A：" + Need[i].A + ",资源B：" + Need[i].B + ",资源C：" + Need[i].C);
                        }
                        console.log("*******华丽丽的结束线*********");
                    }
                }, 1000);
            }

        }
    });
});