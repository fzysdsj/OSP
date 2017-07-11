/**
 *@autor: fzysdsj.github.io(abbot)
 *@date: 2017.7.04
 *@version: 1.0
 *@since: node.js 8.0.0
 *@name: 进程优先级
 */
let name, priority, needTime, arriveTime, i = 0;
//存储进程数据数组
let arraySession = [];
//进行相关操作数组
let array = [];
//进程执行完毕数组
let arrayFinshed = [];
//选择函数
function select() {
    process.stdout.write("请选择您要进行的操作：1.添加进程 2先来先服务算法 3.短作业优先算法 4.最高响应比优先算法5.退出\n");
    process.stdin.on('data', (input) => {
        input = input.toString().trim();
        if (input != 1 && input != 2 && input != 3 && input != 4 && input != 5) {} else if (input == 1) {
            addProcess();
        } else if (input == 2) {
            FCFS();
        } else if (input == 3) {
            PSA();
        } else if (input == 4) {
            HRRN();
        } else if (input == 5) {
            process.stdin.emit('end');
        }
    });
}

function addProcess() {
    process.stdin.setEncoding('utf8');
    process.stdout.write("请输入：进程名，进程优先级，进程需要运行时间（中间以空格隔开）\n");
    process.stdin.on('data', (input, arr) => {
        //去左右空格
        input = input.toString().trim();
        arr = input.split(" ");
        name = arr[0];
        priority = arr[1];
        needTime = arr[2];
        arriveTime = ("" + new Date().getTime()).slice(7);
        if (input !== null) {
            if (input == 's') {
                console.log("请选择您要进行的操作：1.添加进程 2先来先服务算法 3.短作业优先算法 4.最高响应比优先算法5.退出\n");
            } else if ((!isNaN(priority)) && (!isNaN(needTime))) {
                let PCB = {
                    'name': name,
                    'priority': priority,
                    'arriveTime': arriveTime,
                    'needTime': needTime,
                    'needDemoTime': needTime,
                    'runTime': 0,
                    'state': 'W ',
                    'allTime': 0
                };
                // process.stdout.write(`data: ${input}\n`);
                // process.stdout.write(`arr: ${arr[0]}\n`);
                arraySession.push(PCB);
                array = arraySession;
                console.log("新进程信息如下：");
                console.log("\n进程名：" + array[i].name +
                    "\n进程优先数:" + array[i].priority +
                    "\n进程到达时间：" + array[i].arriveTime +
                    "\n进程需要执行时间:" + array[i].needTime + "\n");
                console.log(
                    "请继续输入新进程信息：进程名，进程优先级，进程需要运行时间（中间以空格隔开，若无进程输入，输入s选择其它操作，按5退出，）\n"
                );
                i++;
            }
        }
    });
}

function FCFS() {
    console.log("先来先服务算法开始执行!");
    //总周转时间
    let fTime = 0;
    //平均周转时间
    let aTime = 0;
    //带权周转时间
    let qTime = 0;
    let aqTime = 0;
    //降序，谁到得早，即到达时间小的谁先执行
    array.sort((a, b) => {
        return a.arriveTime - b.arriveTime;
    });
    let runTimer = setInterval(() => {
        if (array.length == 0) {
            clearInterval(runTimer);
            for (let i = 0; i < arrayFinshed.length; i++) {
                fTime += arrayFinshed[i].allTime;
                qTime += arrayFinshed[i].allTime / arrayFinshed[i].needDemoTime;
            }
            aTime = fTime / (arrayFinshed.length);
            aqTime = qTime / (arrayFinshed.length);
            console.log("进程全部执行完毕！");
            console.log("平均周转时间：" + aTime);
            console.log("平均带权周转时间：" + aqTime);
        }
        for (let i = 0; i < array.length; i++) {
            if (i == 0) {
                ("进程" + array[0].name + "将开始执行");
                array[0].state = 'R';
                if (array[0].needTime <= 0) {
                    array[0].state = 'F';
                    arrayFinshed.push(array[0]);
                    array.shift();
                }
                if (array.length != 0) {

                    console.log("\n运行中进程：进程名：" + array[0].name +
                        "\n进程优先数:" + array[0].priority +
                        "\n进程到达时间：" + array[0].arriveTime +
                        "\n进程需要执行时间:" + array[0].needTime +
                        "\n进程运行时间:" + array[0].runTime +
                        "\n进程状态:" + array[0].state +
                        '\n周转时间:' + array[0].allTime);
                    array[0].priority--;
                    array[0].needTime--;
                    array[0].runTime++;
                    array[0].allTime++;
                }
            } else if (array.length > 1) {
                console.log("就绪队列如下：\n");
                array[i].allTime++;
                console.log("第" + i + "个就绪进程信息如下：\n进程名：" + array[i].name +
                    "\n进程优先数:" + array[i].priority +
                    "\n进程到达时间：" + array[i].arriveTime +
                    "\n进程需要执行时间:" + array[i].needTime +
                    "\n进程运行时间:" + array[i].runTime +
                    "\n进程状态:" + array[i].state +
                    '\n周转时间:' + (array[i].allTime - 1));
            }
        }

    }, 1000);
}
process.stdin.on('end', () => {
    process.stdout.write('输入完成，正常退出\n');
});

function PSA() {
    //总周转时间
    console.log("短作业优先算法开始执行！");
    let fTime = 0;
    //平均周转时间
    let aTime = 0;
    //带权周转时间
    let qTime = 0;
    let aqTime = 0;
    //降序，谁需要时间少的谁先执行
    array.sort((a, b) => {
        return a.needTime - b.needTime;
    });
    let runTimer = setInterval(() => {
        if (array.length == 0) {
            clearInterval(runTimer);
            for (let i = 0; i < arrayFinshed.length; i++) {
                fTime += arrayFinshed[i].allTime;
                qTime += arrayFinshed[i].allTime / arrayFinshed[i].needDemoTime;
            }
            aTime = fTime / (arrayFinshed.length);
            aqTime = qTime / (arrayFinshed.length);
            console.log("进程全部执行完毕！");
            console.log("平均周转时间：" + aTime);
            console.log("平均带权周转时间：" + aqTime);
        }
        for (let i = 0; i < array.length; i++) {
            if (i == 0) {
                ("进程" + array[0].name + "将开始执行");
                array[0].state = 'R';
                if (array[0].needTime <= 0) {
                    array[0].state = 'F';
                    arrayFinshed.push(array[0]);
                    array.shift();
                }
                if (array.length != 0) {

                    console.log("\n运行中进程：进程名：" + array[0].name +
                        "\n进程优先数:" + array[0].priority +
                        "\n进程到达时间：" + array[0].arriveTime +
                        "\n进程需要执行时间:" + array[0].needTime +
                        "\n进程运行时间:" + array[0].runTime +
                        "\n进程状态:" + array[0].state +
                        '\n周转时间:' + array[0].allTime);
                    array[0].priority--;
                    array[0].needTime--;
                    array[0].runTime++;
                    array[0].allTime++;
                }
            } else if (array.length > 1) {
                console.log("就绪队列如下：\n");
                array[i].allTime++;
                console.log("第" + i + "个就绪进程信息如下：\n进程名：" + array[i].name +
                    "\n进程优先数:" + array[i].priority +
                    "\n进程到达时间：" + array[i].arriveTime +
                    "\n进程需要执行时间:" + array[i].needTime +
                    "\n进程运行时间:" + array[i].runTime +
                    "\n进程状态:" + array[i].state +
                    '\n周转时间:' + (array[i].allTime - 1));
            }
        }

    }, 1000);
}
process.stdin.on('end', () => {
    process.stdout.write('输入完成，正常退出\n');

});

function HRRN() {
    //总周转时间
    console.log("最高响应比优先算法开始执行！");
    let fTime = 0;
    //平均周转时间
    let aTime = 0;
    //带权周转时间
    let qTime = 0;
    let aqTime = 0;
    //降序，谁优先权高谁先执行
    //优先权 = （响应时间）/(要求服务时间)=(array[i].allTime/array[i].needDemoTime);
    array.sort((b, a) => {
        return a.allTime / a.needDemoTime - b.allTime / b.needDemoTime;
    });
    let runTimer = setInterval(() => {
        if (array.length == 0) {
            clearInterval(runTimer);
            for (let i = 0; i < arrayFinshed.length; i++) {
                fTime += arrayFinshed[i].allTime;
                qTime += arrayFinshed[i].allTime / arrayFinshed[i].needDemoTime;
            }
            aTime = fTime / (arrayFinshed.length);
            aqTime = qTime / (arrayFinshed.length);
            console.log("进程全部执行完毕！");
            console.log("平均周转时间：" + aTime);
            console.log("平均带权周转时间：" + aqTime);
        }
        for (let i = 0; i < array.length; i++) {
            if (i == 0) {
                ("进程" + array[0].name + "将开始执行");
                array[0].state = 'R';
                if (array[0].needTime <= 0) {
                    array[0].state = 'F';
                    arrayFinshed.push(array[0]);
                    array.shift();
                }
                if (array.length != 0) {

                    console.log("\n运行中进程：进程名：" + array[0].name +
                        "\n进程优先数:" + array[0].priority +
                        "\n进程到达时间：" + array[0].arriveTime +
                        "\n进程需要执行时间:" + array[0].needTime +
                        "\n进程运行时间:" + array[0].runTime +
                        "\n进程状态:" + array[0].state +
                        '\n周转时间:' + array[0].allTime);
                    array[0].priority--;
                    array[0].needTime--;
                    array[0].runTime++;
                    array[0].allTime++;
                }
            } else if (array.length > 1) {
                console.log("就绪队列如下：\n");
                array[i].allTime++;
                console.log("第" + i + "个就绪进程信息如下：\n进程名：" + array[i].name +
                    "\n进程优先数:" + array[i].priority +
                    "\n进程到达时间：" + array[i].arriveTime +
                    "\n进程需要执行时间:" + array[i].needTime +
                    "\n进程运行时间:" + array[i].runTime +
                    "\n进程状态:" + array[i].state +
                    '\n周转时间:' + (array[i].allTime - 1));
            }
        }

    }, 1000);
}
process.stdin.on('end', () => {
    process.stdout.write('输入完成，正常退出\n');

});
select();