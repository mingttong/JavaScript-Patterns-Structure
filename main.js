/**
 * Created by lenovo on 2016/8/29.
 */

console.log('外观模式');

var Facade = function () {

    function addEvent(dom, type, fn) {
        if (dom.addEventListener) {
            // 对于支持DOM2级事件处理程序addEventListener方法的浏览器
            dom.addEventListener(type, fn, false);
            console.log('我是用addEventListener方法绑定的');
        } else if (dom.attachEvent) {
            // 对于不支持addEventListener方法但支持attachEvent方法的浏览器
            dom.attachEvent('on' + type, fn);
            console.log('我是用attachEvent方法绑定的');
        } else {
            // 对于两者都不支持，但支持on + '事件名'的浏览器
            dom['on' + type] = fn;
            console.log('我是用on + \'事件名\'方法绑定的');
        }
    }

    var myInput = document.getElementById('myinput');
    addEvent(myInput, 'click', function () {
        console.log('绑定第一个事件');
    });
    addEvent(myInput, 'click', function () {
        console.log('绑定第二个事件');
    });
    addEvent(myInput, 'click', function () {
        console.log('绑定第三个事件');
    });

    // 简约版属性样式方法库
    var A = {
        // 通过id获取元素
        g : function (id) {
            return document.getElementById(id);
        },
        // 设置元素css属性
        css : function (id, key, value) {
            document.getElementById(id).style[key] = value;
        },
        // 设置元素的属性
        attr : function (id, key, value) {
            document.getElementById(id)[key] = value;
        },
        html : function (id, html) {
            document.getElementById(id).innerHTML = html;
        },
        // 为元素绑定事件
        on : function (id, type, fn) {
            document.getElementById(id)['on' + type] = fn;
        }
    };

}();

console.log('###########################################');
console.log('适配器模式');

var Adapter = function () {

    console.log('####适配异类框架####');

    // 定义框架
    var A = A || {};
    // 通过ID获取元素
    A.g = function (id) {
        return document.getElementById(id);
    };
    // 为元素绑定事件
    A.on = function (id, type, fn) {
        // 如果传递参数是字符串则以id处理，否则以元素对象处理
        var dom = typeof id === 'string' ? this.g(id) : id;
        if (dom.addEventListener) {
            // 标准DOM2级添加事件方式
            dom.addEventListener(type, fn, false);
        } else if (dom.attachEvent) {
            // IE DOM2级添加时间方式
            dom.attachEvent('on' + type, fn);
        } else {
            // 简易添加事件方式
            dom['on' + type] = fn;
        }
    };

    // 窗口加载完成事件
    A.on(window, 'load', function () {
        // 按钮点击事件
        A.on('mybutton', 'click', function () {
            console.log('do something');
        });
    });

    // 开始适配
    A.g = function (id) {
        // 通过jQuery获取jQuery对象，然后返回第一个成员
        return $(id).get(0);
    };
    A.on = function (id, type, fn) {
        // 如果传递参数是字符串则以id处理，否则以元素对象处理
        var dom = typeof id === 'string' ? $('#' + id) : $(id);
        dom.on(type, fn);
    };

    console.log('####参数适配器####');

    function doSomeThing (obj) {
        var i;
        var _adapter = {
            name : '周吾南',
            title : '设计模式',
            age : '20',
            color : 'pink',
            size : '100',
            prize : '50'
        };
        for (i in _adapter) {
            _adapter[i] = obj[i] || _adapter[i];
        }
    }

    // 而此时我们再传递参数时就传递一个obj对象
    /**
     * obj.name : name
     * obj.title : title
     * obj.age : age
     * obj.color : color
     * obj.size : size
     * obj.prize : prize
     ***/

    console.log('####数据适配####');

    var arr = ['JavaScript', 'book', '前端编程语言', '8月1日'];

    var obj = {
        name : '',
        type : '',
        title : '',
        time : ''
    };

    function arrToObjAdapter (arr) {
        return {
            name : arr[0],
            type : arr[1],
            title : arr[2],
            time : arr[3]
        };
    }

    var adapterData = arrToObjAdapter(arr);
    console.log(adapterData);

    console.log('####服务器适配器####');

    // 为简化模型，这里使用jQuery的ajax方法 理想数据是一个一位数组
    //function ajaxAdapter (data) {
    //    // 处理数据并返回新数据
    //    return [data['key1'], data['key2'], data['key3']];
    //}
    //$.ajax({
    //    url : 'someAddress.php',
    //    success : function (data, status) {
    //        if (data) {
    //            // 使用适配后的数据——返回的对象
    //            doSomething(ajaxAdapter(data));
    //        }
    //    }
    //});

}();

console.log('###########################################');
console.log('代理模式');

var Proxy = function () {
    console.log('代理模式没看懂');
}();

console.log('###########################################');
console.log('装饰者模式');

var DecoratorPattern = function () {

    var decorator = function (input, type, fn) {
        // 获取事件源
        var input = document.getElementById(input);
        // 若事件源已经绑定事件
        if (input['on' + type] === 'function') {
            // 缓存事件源原有回调函数
            var oldEvent = input['on' + type];
            // 为事件源定义新的事件
            input['on' + type] = function () {
                // 事件源原有回调函数
                oldEvent();
                // 执行事件源新增回调函数
                fn();
            }
        } else {
            // 事件源未绑定事件，直接为事件源添加新增回调函数
            input['on' + type] = fn;
        }
        // 做其他事情
    };

    // 输入框的新需求
    // 输入框元素
    var telInput = document.getElementById('tel_input');
    // 输入格式提示文案
    var telWarnText = document.getElementById('tel_warn_text');
    // 点击 输入框 提示 输入框输入格式 提示文案
    telInput.onclick = function () {
        telWarnText.style.display = 'inline-block';
    };

    // 电话输入框功能装饰
    decorator('tel_input', 'click', function () {
        document.getElementById('tel_demo_text').style.display = 'none';
    });
    decorator('tel_input', 'focus', function () {
        console.log('event onfocus');
    });

}();
