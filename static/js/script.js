// const EXAM = JSON.parse(localStorage.getItem("exam_data"));//试题
// const EXAM = EXAM;//试题数据，

//试题数据存放在 static/js/data.js 文件的 EXAM 常量中
//故，需要银日这个文件才能够正常使用！

const ANSWER = JSON.parse(localStorage.getItem("answer_data"));//存储答案

const CONFIG = {
    version: 1,
    exam_version: (localStorage.getItem("exam_version") === null) ? -1 : parseInt(localStorage.getItem("exam_version")),//试题版本号
    order: 'order',//出题顺序，order：顺序出题；random：随机出题。暂时用不上
    num: 3066,//有多少道题目
    fab_tips: JSON.parse(cache_remember('fab_tips', '{"refresh_page":true,"fill_in_the_correct_answer":true,"scoring_paper":true,"before_page":true,"next_page":true}')),//弹窗设置，结构如第16行注释
    page_next_id: parseInt(cache_remember('page_next_id', 51)),//下一次渲染的题目序号
    page_limit: parseInt(cache_remember('page_limit', 50)),//每次渲染多少题目
};//相关设置

/*
CONFIG.fab_tips 结构：
{
	refresh_page: true,
	scoring_paper: true,
	before_page: true,
	next_page: true
}
*/

const TYPE = {
    C: '计算机硬件基础知识',
    D: '多媒体应用知识',
    H: '多媒体应用知识',
    J: '计算机科学基础知识',
    K: '数据库知识',
    L: '数据结构与算法知识',
    Q: '软件知识产权知识',
    R: '软件工程知识',
    S: '计算机内数据的表示和运算，数制及其转换',
    W: '计算机网络知识',
    Y: '汇编',
    Z: '操作系统知识',
    1: 'C',
    2: 'C++',
    3: 'Java',
    4: 'JavaScript',
    5: 'C#',
};

//等 document 渲染完成，执行代码
$$(document).ready(function () {
    try {
        //开始渲染题库
        rendering_test_paper(CONFIG.page_next_id-50, CONFIG.page_limit);//调用渲染试卷函数
    }catch (e) {
        return mdui.alert("试题数据加载失败，请刷新页面后再试！", {
            history: false
        });
    }

    //初始化点击浮动操作按钮弹窗设置数据
    // if(CONFIG.fab_tips === null){
    // 	localStorage.setItem("fab_tips", JSON.stringify({
    // 		refresh_page: true,//点击“刷新试卷”是否出现弹窗
    // 		fill_in_the_correct_answer: true,//填充正确答案
    // 		scoring_paper: true,//点击“评分试卷”是否出现弹窗
    // 		before_page: true,//点击“商业”是否出现弹窗
    // 		next_page: true//点击“下一页”是否出现弹窗
    // 	}));
    // }

    // var fab_inst = new mdui.Fab('#fab');//实例化 浮动操作按钮
    // var fab;
    // if((fab = document.getElementById("fab")) !== null){
    //     // 浮动操作按钮 事件监听
    //     fab.addEventListener('open.mdui.fab', function () {
    //         // console.log('open');
    //     });
    //     fab.addEventListener('opened.mdui.fab', function () {
    //         // console.log("opened");
    //     });
    //     fab.addEventListener('close.mdui.fab', function () {
    //         // console.log('close');
    //     });
    //     fab.addEventListener('closed.mdui.fab', function () {
    //         // console.log('closed');
    //     });
    // }

    //刷新页面
    var refresh_page = function(){
            window.location.reload();//刷新本页面
        },
        //设置是否弹出弹窗
        set_fab_config = function(key){
            let data = {
                refresh_page: true,//点击“刷新试卷”是否出现弹窗
                fill_in_the_correct_answer: true,//点击“填充正确答案”是否出现弹窗
                before_page: true,//点击“上一页”是否出现弹窗
                next_page: true//点击“下一页”是否出现弹窗
            };
            data = JSON.parse(localStorage.getItem("fab_tips"));

            data[key] = !$$('input[name="fab_checkbox"]').prop('checked');//修改对应 key 的 value
            // console.log(JSON.stringify(data));
            localStorage.setItem("fab_tips", JSON.stringify(data));
        };

    /**
     * 点击“浮动操作按钮”弹出对话框
     * @param content
     * @param id
     * @param callback
     */
    function fab_tips_dialog(content, id, callback){
        mdui.confirm('你刚刚点击了“' + content + '”按钮，是否执行此操作？<br/>' +
            '<small>点击下方“不再提醒”下次点击对应操作，将不会弹出此提示框</small>' +
            '<div class="mdui-p-t-2"><label class="mdui-checkbox">' +
            '<input type="checkbox" name="fab_checkbox"/>' +
            '<i class="mdui-checkbox-icon"></i>不再提醒</label>' +
            '</div>', '系统提示', function () {
            set_fab_config(id);//更新“不再提示”是否弹出
            typeof(callback) === "function" ? callback(true) : false;//回调函数
        }, function () {
            typeof(callback) === "function" ? callback(false) : false;//回调函数
            console.log("关闭 fab");
        }, {
            history: false,
            confirmText: '确定',
            cancelText: '关闭'
        });
    }

    //监听“浮动操作按钮”点击事件
    $$(".mdui-fab-dial > button").on("click", function() {
        let id = $$(this).attr("data-type"),
            tip = {
                refresh_page: '刷新试卷',
                fill_in_the_correct_answer: '填充正确答案',
                scoring_paper: '试卷评分',
                before_page: '切换上一页',
                jump_page: '跳转指定页面',
                next_page: '切换下一页',
            };

        /**
         * 浮动操作按钮点击事件“操作”
         * @param id
         * @returns {*}
         */
        let fab_btn_event = function (id){
            let next_page = parseInt(localStorage.getItem("page_next_id"));
            switch (id) {
                case 'refresh_page'://刷新页面事件
                    return refresh_page();//这是一个特殊的判断，刷新页面
                case 'before_page'://上一页事件
                    if (next_page === 51) {
                        return mdui.alert('这已经第一页了，无法切换到上一页', '系统提示', function () {
                            // mdui.alert('点击了确认按钮');
                        }, {
                            history: false
                        });
                    }

                    localStorage.setItem("page_next_id", next_page - 50);//设置下一个渲染题目的ID
                    rendering_test_paper(next_page - 100, CONFIG.page_limit);//重新渲染题目
                    // fill_entered_answer();
                    break;
                case 'next_page'://下一页事件
                    if (next_page >= 3067) {
                        return mdui.alert('这已经是最后一页了，无法切换到下一页', '系统提示', function () {
                        }, {
                            history: false
                        });
                    }

                    localStorage.setItem("page_next_id", next_page + CONFIG.page_limit);//更新 page_next_id
                    rendering_test_paper(next_page, CONFIG.page_limit);//重新渲染题目
                    // fill_entered_answer();
                    break;
                case 'fill_in_the_correct_answer'://填充本页面正确答案
                    write_right_answer();
                    break;
                case 'jump_page':
                    mdui.prompt('共有 '+CONFIG.num+' 题，每页：'+CONFIG.page_limit+' 题'+'，当前在第：'+Math.floor(next_page/CONFIG.page_limit)+' 页',
                        function (value) {
                            if(value === ""){
                                return mdui.alert("请输入页数，范围在 1~62 页", "系统提示", {
                                    history: false
                                });
                            }

                            value = parseInt(value);
                            if(value < 1 || value > 62){
                                return mdui.alert("页数范围在 1~62 页", "系统提示", {
                                    history: false
                                });
                            }

                            next_page = CONFIG.page_limit*value-49;
                            localStorage.setItem("page_next_id", next_page+50);//更新 page_next_id
                            rendering_test_paper(next_page, CONFIG.page_limit);//重新渲染题目
                        },
                        function (value) {
                            console.log(value)
                        },
                        {
                            history: false
                        }
                    );
                    break;
            }
        };

        if(JSON.parse(cache_remember('fab_tips', '{"refresh_page":true,"fill_in_the_correct_answer":true,"scoring_paper":true,"before_page":true,"next_page":true}'))[id]){
            return fab_tips_dialog(tip[id], id, function(bool) {
                //点击了确认按钮后，执行回调事件
                if(bool){
                    return fab_btn_event(id);//执行特定的事件
                }
            });
        }else{
            fab_btn_event(id);
        }
    });
});


//事件委托；当答案选择时监听
$$(document).on('click', 'input[type=radio]', function (e) {
    let this_answer = $$(this),
        answer = $$($$(this_answer[0])).val(),//选择的答案
        id = parseInt(str_replace("radio-", "", $$(this).attr('name')));//题号 ID

    let answer_data = JSON.parse(cache_remember('answer_data', '{}'));//获取答案
    answer_data[id] = answer;
    localStorage.setItem("answer_data", JSON.stringify(answer_data));//存储或更新“题号对应的答案”数据

    let _html;
    if(answer === 'A'){
        _html = EXAM[id].A;
    }else if(answer === 'B'){
        _html = EXAM[id].B;
    }else if(answer === 'C'){
        _html = EXAM[id].C;
    }else{
        _html = EXAM[id].D;
    }

    $$(".eid-" + id + " .mcp-answer").html(_html).addClass("mcp-answer-write");
});


/**
 * 试卷渲染
 * @param start     从第几题开始渲染
 * @param limit     渲染多少条题目
 */
function rendering_test_paper(start=1, limit=50){
    //试题开始渲染

    // $$("#num").html(CONFIG.Number_of_questions);//填充有多少道题目，暂时无用
    $$("#exam-page").html('');//清空以往试题数据

    let html = $$("#template").html(), htmls, options, question,
        s_str_replace = '&nbsp;<span class="mcp-answer"></span>&nbsp;';//将 （ ） 换成 这个变量的值

    //渲染页面
    for (let i = 0, index; i<limit; i++) {
        index = i+start;

        if(EXAM[index] === undefined) break;

        question = replace_brackets(EXAM[index].question, s_str_replace);

        let q_d = localStorage.getItem("answer_data") !== null ? JSON.parse(localStorage.getItem("answer_data")) : {};//问题答案

        htmls = str_replace("{{question}}", question, html);
        htmls = str_replace("{{i}}", index, htmls);//题序
        htmls = str_replace("{{eid}}", index, htmls);//题目编号
        htmls = str_replace("{{A}}", EXAM[index]['A'], htmls);
        htmls = str_replace("{{B}}", EXAM[index]['B'], htmls);
        htmls = str_replace("{{C}}", EXAM[index]['C'], htmls);
        htmls = str_replace("{{D}}", EXAM[index]['D'], htmls);

        $$("#exam-page").append(htmls);


        if(q_d[index] !== undefined){
            //填充自己以往填写过的答案
            $$("input[name=radio-"+index+"][value="+q_d[index]+"]").trigger("click");
            console.log("填充自己以往填写过的答案")
        }
    }

    // let lastHtml = '<button onclick="write_right_answer()" class="mdui-btn mdui-btn-raised mdui-ripple">填充正确答案</button>\n' + '<button onclick="window.location.reload()" class="mdui-btn mdui-btn-raised mdui-ripple">刷新试卷</button>\n' + '<button id="pingfen" onclick="one_mark()" class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme-accent mdui-float-right">评分</button>';
    // $$("#exam-page").append(lastHtml);

    mdui.mutation();//初始化未初始化的组件
    console.log("试题渲染完成！");
}


/**
 * 评分试卷
 */
function answer_mark(){
    $$(".mark_answer_true").remove();//移除以前评分过的 √
    $$(".mark_answer_false").remove();//移除以前评分过的 ×

    let eid, _class, fill_value, answer, _true=0, _false=0, no=0;
    $$("div[class^=eid-]").each(function(i){
        _class = $$(this).attr("class");
        eid = parseInt(str_replace("eid-", "", _class));//题号
        answer = EXAM[eid].answer;

        //获取选择的答案
        fill_value = $$(".eid-"+eid+" input:checked");

        if(fill_value.length !== 0){
            // console.log(eid+" 正确答案: "+answer);

            if(answer !== fill_value.val()){
                //如果用户选择的答案错误，就给它的选项跟后面加一个 x
                fill_value.parent().after('<i class="mdui-icon material-icons mark_answer_false">close</i>');
                $$(this).find("input[value="+answer+"]").trigger("click");//填充正确答案
                _false += 1;//错题 +1
            }else{
                //如果正确就在后面加一个 √
                fill_value.parent().after('<i class="mdui-icon material-icons mark_answer_true">check</i>');
                _true += 1;//对题 +1
            }
        }else{
            no += 1;
        }
    });

    return mdui.alert("正确："+_true+"题<br/>错误："+_false+"题<br/>未做："+no+"题", "评分结果", function(){}, {
        history: false
    });
}

// $$(".eid-1 input[value=A]").parent().parent().find("span").css({
//     'color': 'white',
//     'background-color': 'red'
// });

/**
 * 填充正确答案
 */
function write_right_answer() {
    // console.log("点击了");
    let eid, _class;
    $$("div[class^='eid-']").each(function(i) {
        _class = $$(this).attr("class");
        eid = str_replace("eid-", "", _class);

        $$('.' + _class + ' .mcp-answer').html();
        $$('.' + _class + ' input[type=radio][value=' + EXAM[eid].answer + ']').trigger("click");//填充答案
    });

    return true;
}

/**
 * 填充你已经填了的答案
 * @returns {boolean}
 */
function fill_entered_answer() {
    // console.log("点击了");
    let eid, _class, answer = JSON.parse(localStorage.getItem("answer_data"));
    $$("div[class^='eid-']").each(function(i) {
        _class = $$(this).attr("class");
        eid = str_replace("eid-", "", _class);
        console.log(eid, answer[eid]);

        if(answer[parseInt(eid)]){
            $$('.' + _class + ' .mcp-answer').html();
            $$('.' + _class + ' input[type=radio][value=' + EXAM[eid].answer + ']').trigger("click");//填充答案
        }
    });

    return true;
}


/**
 * 替换所有字符
 * @param str1  将该字符串
 * @param str2  替换成该字符串
 * @param str   字符串
 * @returns {*}
 */
function str_replace(str1, str2, str) {
    try{
        while (str.indexOf(str1) !== -1) {
            str = str.replace(str1, str2);
        }

        return str;
    }catch(e){
        return '';
    }
}

/**
 * @param {Object} str			题目
 * @param {Object} new_str		将括号替换成什么
 */
function replace_brackets(str, new_str){
    str = (str === null) ? '' : str;
    let start = str.indexOf("（"), end = str.indexOf("）");
    if(start === -1){
        start = str.indexOf("("), end = str.indexOf(")");
    }

    let string = str.substr(start, end-start+1);

    return str.replace(string, new_str);
}

/**
 * 不存在则写入 localStorage 后返回
 * @param name      localStorage 键
 * @param defaults  如果不存在，set 的值
 * @returns {*}
 */
function cache_remember(name, defaults) {
    let get = localStorage.getItem(name);

    if(get === null){
        localStorage.setItem(name, defaults);
        return defaults;
    }

    return get;
}
