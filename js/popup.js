$(document).ready(function () {
    console.log("信阳学院成绩录入辅助系统");

    var execl_data;

    $("#updata_file").click(function () {
        $("#file").click();
    });

    $("#write").click(function () {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'percentage', execl_data }, function (response) {
                console.log(response);
            });
        });
    })

    $("#grade_write").click(function () {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'grade', execl_data }, function (response) {
                console.log(response);
            });
        });
    })

    // 解析excel文件
    //首先监听input框的变动，选中一个新的文件会触发change事件
    document.querySelector("#file").addEventListener("change", function () {
        console.log("开始解析");
        //获取到选中的文件
        var file = document.querySelector("#file").files[0];
        var type = file.name.split('.');
        if (type[type.length - 1] !== 'xlsx' && type[type.length - 1] !== 'xls') {
            alert('只能选择excel文件导入');
            return false;
        }
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            const data = e.target.result;
            const zzexcel = window.XLS.read(data, {
                type: 'binary'
            });
            console.log(zzexcel.Sheets);
            const result = [];
            for (let i of zzexcel.SheetNames) {
                const newData = window.XLS.utils.sheet_to_json(zzexcel.Sheets[i]);
                console.log(newData);
                result.push(...newData)
            }
            execl_data = result
            console.log('result', execl_data)
            // 解析成功，上传按钮隐藏
            $("#updata_file").hide();
            $("#file").hide();
            // 数据写入按钮显示
            $("#write").show();
            $("#grade_write").show();
            // 插入提示
            $(".main").append(`<p class="tips">${file.name}上传解析成功</p>`);
            console.log(file.name);
        }
    });
});