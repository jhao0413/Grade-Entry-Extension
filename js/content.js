$(function () {
    // 向页面动态注入js
    var file = chrome.runtime.getURL('/js/index.js')
    console.log(file);
    var s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = file
    document.body.appendChild(s)

    // 监听popup.js的消息
    chrome.runtime.onMessage.addListener(async function (message, sender, senderResponse) {
        // 百分制成绩录入
        if (message.type == 'percentage') {

            for (let i = 0; i < $(`#mylist tr`).length; i++) {
                // 根据学号查找学生所在行
                let info = message.execl_data.find((item) => {
                    return item.学号 == $(`#mylist .griddata-even:nth-child(${i + 1}) td:first-child`).text()
                });

                if (info) {
                    await input(i,info.平时成绩, info.期末成绩,'input:nth-child(2)')
                }
            }

        } else {
            // 5档成绩录入

            for (let i = 0; i < $(`#mylist tr`).length; i++) {

                let info = message.execl_data.find((item) => {
                    return item.学号 == $(`#mylist .griddata-even:nth-child(${i + 1}) td:first-child`).text()
                });

                let rule = {
                    '优秀': 95,
                    '良好': 85,
                    '中等': 75,
                    '及格': 65,
                    '不及格': 40
                }

                rule = new Map(Object.entries(rule))

                if (info) {
                    if (rule.has(info['平时成绩'])) {
                        info['平时成绩'] = rule.get(info['平时成绩'])
                    }
    
                    if (rule.has(info['期末成绩'])) {
                        info['期末成绩'] = rule.get(info['期末成绩'])
                    }

                    await input(i,info.平时成绩, info.期末成绩,'select')
                }
            }
        }

        alert(`
        数据插入完成
        录入excel数据共${message.execl_data.length}条
        当前页面共有${$(`#mylist tr`).length}学生数据
        `)


        senderResponse(true)
    })

    function sleep(mills) {
        return new Promise((resolve) => {
            setTimeout(resolve, mills);
        });
    }

    async function input(i,usually, Final,select) {
        console.log(i,usually,Final);
        $(`#mylist .griddata-even:nth-child(${i + 1}) td:nth-child(6) input:nth-child(2)`).focus()
        await sleep(200);
        $(`#mylist .griddata-even:nth-child(${i + 1}) td:nth-child(6) ${select}`).val(usually)
        await sleep(200);
        $(`#mylist .griddata-even:nth-child(${i + 1}) td:nth-child(6) input:nth-child(2)`).blur()
        $(`#mylist .griddata-even:nth-child(${i + 1}) .save`).click()
        await sleep(200);

        $(`#mylist .griddata-even:nth-child(${i + 1}) td:nth-child(9) input:nth-child(2)`).focus()
        await sleep(200);
        $(`#mylist .griddata-even:nth-child(${i + 1}) td:nth-child(9) ${select}`).val(Final)
        await sleep(200);
        $(`#mylist .griddata-even:nth-child(${i + 1}) td:nth-child(9) input:nth-child(2)`).blur()
        $(`#mylist .griddata-even:nth-child(${i + 1}) .save`).click()
    }
})