/**
 *@autor: fzysdsj.github.io(abbot)
 *@date: 2017.7.07
 *@version: 1.0
 *@since: JQ 1.1.0
 *@name: 存储管理
 */

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
let s;
//未命中
// let notShot = 0;
$(function() {
    //FCFS算法
    $('#FCFS').click(function() {
            $('#information').text("");
            $('#result').text("");
            randomArray = [];
            array = [];
            shoted = 0;
            layLength = $('#layLength').val();
            layNumber = $('#layNumber').val();
            visitNumber = $('#visitNumber').val();
            $("#information").append("页面访问顺序如下:");
            for (let i = 0; i < visitNumber; i++) {
                random = Math.ceil((parseInt(Math.random(0, 1) * 10000) / layLength));
                randomArray.push(random);
                $("#information").append(randomArray[i] + " ");
            }
            for (let i = 0; i < randomArray.length; i++) {
                console.log("第" + (i + 1) + "次访问:");
                shotFlag = false;
                //假设i = 0,randomArray[0]=1,array = [1,2];
                if (array.length == 0) {
                    array.push(randomArray[i]);
                } else if (array.length <= layNumber) {
                    //array = [1,2];
                    for (let j = 0; j < array.length; j++) {
                        //命中
                        if (randomArray[i] == array[j]) {
                            shoted++;
                            // randomArray.splice(i,1);
                            console.log("命中了" + shoted + "次");
                            shotFlag = true;
                        }
                    }
                    //未命中
                    if (!shotFlag) {
                        if (array.length < layNumber) {
                            array.push(randomArray[i]);
                        } else {
                            array.shift();
                            array.push(randomArray[i]);
                        }
                    }
                }
                for (let j = 0; j < array.length; j++) {
                    console.log(array[j] + " ");

                }

                // $("#result").append(array[i]+" ");
            }
            console.log("命中率:" + (shoted / visitNumber) * 100 + "%");
        })
        //LRU算法
    $('#LRU').click(function() {
            $('#information').text("");
            $('#result').text("");
            randomArray = [];
            array = [];
            shoted = 0;
            layLength = $('#layLength').val();
            layNumber = $('#layNumber').val();
            visitNumber = $('#visitNumber').val();
            $("#information").append("页面访问顺序如下:");
            for (let i = 0; i < visitNumber; i++) {
                random = Math.ceil((parseInt(Math.random(0, 1) * 10000) / layLength));
                randomArray.push(random);
                $("#information").append(randomArray[i] + " ");
            }
            for (let i = 0; i < randomArray.length; i++) {
                console.log("第" + (i + 1) + "次访问:");
                shotFlag = false;
                //假设i = 0,randomArray[0]=1,array = [1,2];
                if (array.length == 0) {
                    array.push(randomArray[i]);
                } else if (array.length <= layNumber) {
                    //array = [1,2];
                    s = 0;
                    for (let j = 0; j < array.length; j++) {
                        //命中
                        if ((randomArray[i] == array[j]) && (randomArray[i] != s)) {
                            shoted++;
                            console.log("命中了" + shoted + "次");
                            s = array[j];
                            array.splice(j, 1);
                            array.push(randomArray[i]);
                            shotFlag = true;
                        }
                    }
                    //未命中
                    if (!shotFlag) {
                        if (array.length < layNumber) {
                            array.push(randomArray[i]);
                        } else {
                            array.shift();
                            array.push(randomArray[i]);
                        }
                    }
                }
                for (let j = 0; j < array.length; j++) {
                    console.log(array[j] + " ");
                }
            }
            console.log("命中率:" + (shoted / visitNumber) * 100 + "%");
        })
        //银行家算法
    $('#sourceSumit').click(function() {
        let sourceNumber = $('#sourceNumber').val();
        console.log(sourceNumber);
        $('#sourceNumber').val("");
    })
});