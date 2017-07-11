/**
 *@autor: fzysdsj.github.io(abbot)
 *@date: 2017.7.03
 *@version: 1.0
 *@since: node.js 8.0.0
 *@name: 进程调度:生产者和消费者
 */
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
function ProcessManger() {};
ProcessManger.prototype = {
    //判定函数
    Flag: function() {
        processRandom = Math.random(0, 1);
        (processRandom > 0.5) ? (processFlag = 1) : (processFlag = 0);
    },
    //生产者函数
    Producer: function() {
        if (count == MAX) {
            console.log("缓冲池已满！等待2秒");
            //等待2秒
            timer = setTimeout(() => {
                clearTimeout(timer);
            }, 2000);
        } else {
            count++;
            console.log("生产了一个产品，当前产品的数量为：" + count);
            timer = setTimeout(() => {
                //清除定时器
                clearTimeout(timer);
            }, 2000);
        }
    },
    Consumer: function() {
        if (count == 0) {
            console.log("缓冲池已空！等待2秒");
            timer = setTimeout(() => {
                clearTimeout(timer);
            }, 2000);
        } else {
            count--;
            console.log("取出了一个产品，当前产品的数量为：" + count);
            timer = setTimeout(() => {
                clearTimeout(timer);
            }, 2000);
        }
    }
}
let processManger = new ProcessManger();
setInterval(function() {
    processManger.Flag();
    if (processFlag == 1) {
        processManger.Producer();
    } else {
        processManger.Consumer();
    }
}, 2000);
//两次"ctrl+C"退出
process.on('SIGINT', () => {
    if (exiting) {
        // 终止当前NODE的进程
        let date = new Date();
        console.log('时至事未毕，来人问归期。慕我王佐才，敢入方丈里？' + date.getFullYear() + "年" + date.getMonth() + "月" + date.getDate() + "日" +
            date.getHours() + ":" + date.getMinutes() + ":" + ((date.getSeconds() < 10) ? ("0" + date.getSeconds()) : (date.getSeconds())) + "，星期" + date.getDay());
        process.exit();
    } else {
        // 第一次按下
        console.log('提示：第一次按下，连续按两下退出程序');
        exiting = true;
        setTimeout(() => { exiting = false; }, 1000);
    }
});