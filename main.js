/**
 * Created by lenovo on 2016/8/29.
 */


console.log('通用方法：');

function inheritPrototype (subClass, superClass) {
    var p = inheritObject(superClass.prototype);
    p.constructor = subClass;
    subClass.prototype = p;
}

function inheritObject (o) {
    function F () {}
    F.prototype = o;
    return new F();
}

console.log('###########################################');
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

console.log('###########################################');
console.log('桥接模式');

var Bridge = function () {

    console.log('####原先冗余的代码');

    var spans = document.getElementsByTagName('span');
    // 为用户名绑定特效
    spans[0].onmouseover = function () {
        this.style.color = 'red';
        this.style.background = '#ddd';
    };
    spans[0].onmouseout = function () {
        this.style.color = '#333';
        this.style.background = '#f5f5f5';
    };
    // 为等级绑定特效
    spans[1].onmouseover = function () {
        this.getElementsByTagName('strong')[0].style.color = 'red';
        this.getElementsByTagName('strong')[0].style.background = '#ddd';
    };
    spans[1].onmouseout = function () {
        this.getElementsByTagName('strong')[0].style.color = '#333';
        this.getElementsByTagName('strong')[0].style.background = '#f5f5f5';
    };

    console.log('####事件与业务逻辑之间的桥梁');

    // 提取共同点
    // 抽象
    function changeColor (dom, color, bg) {
        // 设置元素的字体颜色
        dom.style.color = color;
        // 设置元素的背景颜色
        dom.style.background = bg;
    }

    var spans = document.getElementsByTagName('span');
    spans[0].onmouseover = function () {
        changeColor(this, 'red', '#ddd');
    };
    spans[0].onmouseout = function () {
        changeColor(this, '#333', '#f5f5f5');
    };
    spans[1].onmouseover = function () {
        changeColor(this.getElementsByTagName('strong')[0], 'red', '#ddd');
    };
    spans[1].onmouseout = function () {
        changeColor(this.getElementsByTagName('strong')[0], '#333', '#f5f5f5');
    };

    console.log('####多元化对象');

    // 多维变量类
    // 运动单元
    function Speed (x, y) {
        this.x = x;
        this.y = y;
    }
    Speed.prototype.run = function () {
        console.log('运动起来');
    };
    //说话单元
    function Speek (wd) {
        this.word = wd;
    }
    Speek.prototype.say = function () {
        console.log('书写字体');
    };

    function People (x, y, wd) {
        this.speed = new Speed(x, y);
        this.speek = new Speek(wd);
    }
    People.prototype.init = function () {
        this.speed.run();
        this.speek.say();
    };

    var p = new People(10, 12, 16);
    p.init();

}();

console.log('###########################################');
console.log('组合模式');

var Composite = function () {

    var News = function () {
        // 子组件容器
        this.children = [];
        // 当前组件元素
        this.element = null;
    };
    News.prototype = {
        init : function () {
            throw new Error("请重写你的方法");
        },
        add : function () {
            throw new Error("请重写你的方法");
        },
        getElement : function () {
            throw new Error("请重写你的方法");
        }
    };

    console.log('####创建容器类');

// ####容器类构造函数
    var Container = function (id, parent) {
        // 构造函数继承父类
        News.call(this);
        // 模块id
        this.id = id;
        // 模块父容器
        this.parent = parent;
        // 构建方法
        this.init();
    };
// 寄生式继承父类原型方法
    inheritPrototype(Container, News);
// 构建方法
    Container.prototype.init = function () {
        this.element = document.createElement('ul');
        this.element.id = this.id;
        this.element.className = 'new-container';
    };
// 获取当前元素
    Container.prototype.getElement = function () {
        return this.element;
    };
// 添加子元素方法
    Container.prototype.add = function (child) {
        // 在子元素容器中插入子元素
        this.children.push(child);
        // 插入当前组件元素树中
        this.element.appendChild(child.getElement());

        return this;
    };
// 显示方法
    Container.prototype.show = function () {
        this.parent.appendChild(this.element);
    };

// ####行成员集合类
    var Item = function (classname) {
        News.call(this);
        this.classname = classname || '';
        this.init();
    };
    inheritPrototype(Item, News);
    Item.prototype.init = function () {
        this.element = document.createElement('li');
        this.element.className = this.classname;
    };
    Item.prototype.add = function (child) {
        // 在父元素容器中插入子元素
        this.children.push(child);
        // 插入当前组件元素中
        this.element.appendChild(child.getElement());

        return this;
    };
    Item.prototype.getElement = function () {
        return this.element;
    };

// ####新闻组合体类
    var NewsGroup = function (classname) {
        News.call(this);
        this.classname = classname || '';
        this.init();
    };
    inheritPrototype(NewsGroup, News);
    NewsGroup.prototype.init = function () {
        this.element = document.createElement('div');
        this.element.className = this.className;
    };
    NewsGroup.prototype.add = function (child) {
        this.children.push(child);
        this.element.appendChild(child.getElement());

        return this;
    };
    NewsGroup.prototype.getElement = function () {
        return this.element;
    };

    console.log('####创建新闻类');

// 图片新闻类
    var ImageNews = function (url, href, classname) {
        News.call(this);
        this.url = url || '';
        this.href = href || '#';
        this.classname = classname || 'normal';
        this.init();
    };
    inheritPrototype(ImageNews, News);
    ImageNews.prototype.init = function () {
        this.element = document.createElement('a');
        var img = new Image();
        img.src = this.url;
        this.element.appendChild(img);
        this.element.className = 'image-news' + this.classname;
        this.element.href = this.href;
    };
    ImageNews.prototype.add = function () {};
    ImageNews.prototype.getElement = function () {
        return this.element;
    };

    var IconNews = function (text, href, type) {
        News.call(this);
        this.text = text || '';
        this.href = href || '#';
        this.type = type || 'vedio';
        this.init();
    };
    inheritPrototype(IconNews, News);
    IconNews.prototype.init = function () {
        this.element = document.createElement('a');
        this.element.innerHTML = this.text;
        this.element.href = this.href;
        this.element.className = 'icon' + this.type;
    };
    IconNews.prototype.add = function () {};
    IconNews.prototype.getElement = function () {
        return this.element;
    };

    var EasyNews = function (text, href) {
        News.call(this);
        this.text = text || '';
        this.href = href || '#';
        this.init();
    };
    inheritPrototype(EasyNews, News);
    EasyNews.prototype.init = function () {
        this.element = document.createElement('a');
        this.element.innerHTML = this.text;
        this.element.href = this.href;
        this.element.className = 'text';
    };
    EasyNews.prototype.add = function () {};
    EasyNews.prototype.getElement = function () {
        return this.element;
    };

    var TypeNews = function (text, href, type, pos) {
        News.call(this);
        this.text = text || '';
        this.href = href || '#';
        this.type = type || '';
        this.pos = pos || 'left';
        this.init();
    };
    inheritPrototype(TypeNews, News);
    TypeNews.prototype.init = function () {
        this.element = document.createElement('a');
        if (this.pos === 'left') {
            this.element.innerHTML = '[' + this.type + ']' + this.text;
        } else {
            this.element.innerHTML = this.text + '[' + this.type + ']';
        }
        this.element.href = this.href;
        this.element.className = 'text';
    };
    TypeNews.prototype.add = function () {};
    TypeNews.prototype.getElement = function () {
        return this.element;
    };

    console.log('####创建新闻类');
    var news1 = new Container('news', document.body);
    news1.add(
        new Item('normal').add(
            new IconNews('梅西不拿金球也伟大', '#', 'video')
        )
    ).add(
        new Item('normal').add(
            new IconNews('保护强国强队用意明显', '#', 'live')
        )
    ).add(
        new Item('normal').add(
            new NewsGroup('has-img').add(
                new ImageNews('img/1.jpg', '#', 'small')
            ).add(
                new EasyNews('从240斤胖子成功变型男', '#')
            ).add(
                new EasyNews('五大雷人跑步机', '#')
            )
        )
    ).add(
        new Item('normal').add(
            new TypeNews('AK47不愿为费城打球', '#', 'NBA', 'left')
        )
    ).add(
        new Item('normal').add(
            new TypeNews('火炮飚6三分创新高', '#', 'CBA', 'right')
        )
    ).show();

    console.log('####表单模块');

    var Form = function () {
        // 子组件容器
        this.children = [];
        // 当前组件元素
        this.element = null;
    };
    Form.prototype = {
        init : function () {
            throw new Error('请重写你的方法');
        },
        getElement : function () {
            throw new Error('请重写你的方法');
        },
        add : function () {
            throw new Error('请重写你的方法');
        }
    };

    // ####FormItem
    var FormItem = function (id, parent) {
        Form.call(this);
        this.id = id;
        this.parent = parent;
        this.init();
    };
    inheritPrototype(FormItem, Form);
    FormItem.prototype.init = function () {
        this.element = document.createElement('form');
        this.element.id = this.id;
        this.element.className = 'new-FormItem';
    };
    FormItem.prototype.getElement = function () {
        return this.element;
    };
    FormItem.prototype.add = function (child) {
        this.children.push(child);
        this.element.appendChild(child.getElement());

        return this;
    };
    FormItem.prototype.show = function () {
        this.parent.appendChild(this.element);
    };

    // ####FielsetItem
    var FieldsetItem = function (classname, text) {
        Form.call(this);
        this.classname = classname || '';
        this.text = text || '';
        this.legend = null;
        this.init();
    };
    inheritPrototype(FieldsetItem, Form);
    FieldsetItem.prototype.init = function () {
        this.element = document.createElement('fieldset');
        this.element.className = this.classname;
        this.legend = document.createElement('legend');
        this.legend.appendChild(document.createTextNode(this.text));
        this.element.appendChild(this.legend);
    };
    FieldsetItem.prototype.getElement = function () {
        return this.element;
    };
    FieldsetItem.prototype.add = function (child) {
        this.children.push(child);
        this.element.appendChild(child.getElement());

        return this;
    };

    // ####Group
    var Group = function (classname) {
        Form.call(this);
        this.classname = classname || '';
        this.init();
    };
    inheritPrototype(Group, Form);
    Group.prototype.init = function () {
        this.element = document.createElement('div');
        this.element.className = this.classname;
    };
    Group.prototype.getElement = function () {
        return this.element;
    };
    Group.prototype.add = function (child) {
        this.children.push(child);
        this.element.appendChild(child.getElement());

        return this;
    };

    // ####LabelItem
    var LabelItem = function (classname, text) {
        Form.call(this);
        this.classname = classname || '';
        this.text = text;
        this.init();
    };
    inheritPrototype(LabelItem, Form);
    LabelItem.prototype.init = function () {
        this.element = document.createElement('label');
        this.element.className = this.classname;
        this.element.appendChild(document.createTextNode(this.text));
    };
    LabelItem.prototype.getElement = function () {
        return this.element;
    };
    LabelItem.prototype.add = function () {};

    // ####InputItem
    var InputItem = function (classname) {
        Form.call(this);
        this.classname = classname || '';
        this.init();
    };
    inheritPrototype(InputItem, Form);
    InputItem.prototype.init = function () {
        this.element = document.createElement('input');
        this.element.className = this.classname;
    };
    InputItem.prototype.getElement = function () {
        return this.element;
    };
    InputItem.prototype.add = function () {};

    // ####SpanItem
    var SpanItem = function (text) {
        Form.call(this);
        this.text = text;
        this.init();
    };
    inheritPrototype(SpanItem, Form);
    SpanItem.prototype.init = function () {
        this.element = document.createElement('span');
        this.element.className = this.classname;
    };
    SpanItem.prototype.getElement = function () {
        return this.element;
    };
    SpanItem.prototype.add = function () {};

    var form = new FormItem('FormItem', document.body);
    form.add(
        new FieldsetItem('account', '账号').add(
            new Group().add(
                new LabelItem('user_name', '用户名：')
            ).add(
                new InputItem('username')
            ).add(
                new SpanItem('4到6位数字或字母')
            )
        ).add(
            new Group().add(
                new LabelItem('user_password', '密码：')
            ).add(
                new InputItem('user_password')
            ).add(
                new SpanItem('6到12位数字或者字母')
            )
        )
    ).add(
        new FieldsetItem('message', '信息').add(
            new Group().add(
                new LabelItem('nick_name', '昵称：')
            ).add(
                new InputItem('nick_name')
            )
        ).add(
            new Group().add(
                new LabelItem('status', '状态：')
            ).add(
                new InputItem('status')
            )
        )
    ).show();

}();
