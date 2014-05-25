/**********************************************************************************************************************/
/*                                                   Tips 推广组件                                                    */
/**********************************************************************************************************************/
/*if (!FD) {
    var FD = {};
}

if (!FD.widget) {
	FD.widget = {};
}*/

FD.widget.SimpleTips = function (els, settings) {
    this.init(els, settings);
};

/**
* settings 模型
*/
FD.widget.SimpleTips.defConfig = {
    graveId: 'aissaSimpleTipsBox',  /* 预埋容器id -- */
    boxId: 'aissaSimpleTips',       /* tips box容器id */
    local: 1,                       /* tips 浮动的相对位置 1:top left 2:top right 3:bottom left 4:bottom right 5:left top 6:left bottom 7:right top 8:right bottom -- */
    arrow: 9,                       /* tips的arrow相对位置 0:null 1:top left 2:top right 3:bottom left 4:bottom right 5:left top 6:left bottom 7:right top 8:right bottom 9:default -- */
    width: 64,                      /* tips 宽度 -- */
    dLeft: 0,                       /* 向左微调坐标 -- */
    dTop: 0,                        /* 向上微调坐标 -- */
    isAnim: true,                   /* 动画弹动效果是否开启 -- */
    isHold: true,                   /* 鼠标经过时是否hold -- */
    tipsHold: true,                 /* 鼠标经过tips固定tips */
    keep: 200,                      /* 显示持续时间，单位毫秒 -- */
    isOnloadShow: false,            /* 页面onload时是否显示 -- */
    onloadHold: 5000,               /* onload时显示持续时间 -- */
    txt: 'Message',                 /* 提示文案 -- */
    overflowChange: true,           /* 超出边框是否反向处理 -- */
    eListener: 'mouseover'          /* 显示box触发方式 -- */
};

FD.widget.SimpleTips.prototype = {
    /**
    * 组件初始化
    * @param {string|object|array} els 调用此组件的对象节点，可以是classname、id、dom
    * @param {object} settings 组件外部配置
    * @return {null}
    * @author Aissa 2010-1-9
    */
    init: function (els, settings) {
        var t = this, grave = null, box = null, html = [], doms = null, tmp = null, arr = null,
			$EO = $E.on, $DS = $D.setStyle;
        t.s = settings = FD.common.applyIf(settings || {}, FD.widget.SimpleTips.defConfig);

        /* 重置 */
        if (t.sto != null) clearTimeout(t.sto);
        t.sto = null;
        t.a = 0;

        /* 判断id是否冲突 */
        if ($(t.s.graveId) || $(t.s.boxId)) {
            alert('@err - settings.id: ' + t.s.graveId + ' || ' + t.s.boxId);
            return;
        }

        /* 获取组件应用的dom节点 */
        if (els instanceof Array) {
            doms = $(els);
            tmp = doms[0];
        } else {
            doms = $(els);
            tmp = doms;
            if (!doms) {
                doms = $D.getElementsByClassName(els);
                tmp = doms[0];
            }
        }

        if (!doms) return;

        /* 生成预埋容器 */
        grave = document.createElement('div');
        grave.id = t.s.graveId;
        $DS(grave, 'position', 'relative');
        $DS(grave, 'width', '0px');
        $DS(grave, 'height', '0px');
        $DS(grave, 'overflow', 'hidden');
        document.body.appendChild(grave);
        t.grave = grave;

        /* 生成tips box */
        box = document.createElement('div');
        box.id = t.s.boxId;
        $D.addClass(box, 'tips-box');
        $DS(box, 'width', t.s.width + 'px');

        html.push('<div class="top-1"></div><div class="top-2"></div><div class="top-3"></div><div class="content">');
        html.push(t.s.txt);
        html.push('</div><div class="bottom-3"></div><div class="bottom-2"></div><div class="bottom-1"></div>'); 
		/*<div class="bottom-0"></div>*/

        if (t.s.arrow != 0) {
            t.getArrowNumber(t.s.local);
            html.push('<div class="arrow-');
            html.push(t.a); html.push('">');
            html.push('<div class="arr-0"></div>');
            html.push('<div class="arr-1"></div><div class="arr-2"></div><div class="arr-3"></div><div class="arr-4"></div><div class="arr-5"></div><div class="arr-6"></div><div class="arr-7"></div>');
            html.push('</div>');
        }

        box.innerHTML = html.join('');

        grave.appendChild(box);
        t.box = box;
        if (t.s.arrow != 0) {
            t.arrow = arr = $D.getLastChild(box);
        }

        t.ieBug();

        /* 获取box 高宽 */
        t.boxWidth = box.offsetWidth + (t.a >= 5 && t.a <= 8 ? 7 : 0);
        t.boxHeight = box.offsetHeight + (t.a >= 1 && t.a <= 4 ? 7 : 0);

        /* 添加显示事件 */
        $EO(doms, t.s.eListener, function (e) {
            t.showTips(this);
        });

        /* 添加隐藏事件 */
        $EO(doms, 'mouseout', function (e) {
            t.hiddenTips();
        });

        t.onloadShow(tmp);

        /* 对应 window resize 事件，重定坐标 */
        $EO(window, 'resize', function (e) {
            t.onloadShow(tmp);
        });

        /* 对应mouseover tips 事件 */
        if (t.s.tipsHold) {
            $EO(box, 'mouseover', function () {
                t.isTipsHold();
            });

            $EO(box, 'mouseout', function () {
                t.hiddenTips();
            });
        }
    },
    /**
    * 当箭头配置为默认时设置箭头方向
    * @param {int} local 浮动的相对位置
    * @return {null}
    * @author Aissa 2010-1-19
    */
    getArrowNumber: function (local) {
        var t = this;

        t.a = t.s.arrow;

        if (t.s.arrow != 9) return;

        switch (local) {
            case 1:
                t.a = 3;
                break;
            case 2:
                t.a = 4;
                break;
            case 3:
                t.a = 1;
                break;
            case 4:
                t.a = 2;
                break;
            case 5:
                t.a = 7;
                break;
            case 6:
                t.a = 8;
                break;
            case 7:
                t.a = 5;
                break;
            case 8:
                t.a = 6;
                break;
        }
    },
    /**
    * 页面加载时事件
    * @param {object} el 组件对应dom节点
    * @return {null}
    * @author Aissa 2010-1-13
    */
    onloadShow: function (el) {
        var t = this;

        $D.setStyle(t.grave, 'position', 'relative');

        if (t.s.isOnloadShow) {
            t.showTips(el);
            t.holdTips(t.s.onloadHold);
        }
    },
    /**
    * 显示tips box
    * @param {object} el 组件对应dom节点
    * @return {null}
    * @author Aissa 2010-1-10
    */
    showTips: function (el) {
        var t = this, l = 0, $DS = $D.setStyle;

        t.isTipsHold();

        $DS(t.grave, 'position', 'relative');

        l = t.s.local;

        t.setXY(el, l);

        /* 溢出反转 */
        if (t.s.overflowChange) {
            l = t.inversionIt(el, l);
        }

        if (t.animSto != null) clearTimeout(t.animSto);
        t.animSto = null;

        $DS(t.box, 'left', t.x + 'px');
        $DS(t.box, 'top', t.y + 'px');
        $DS(t.grave, 'position', 'static');

        if (t.s.isAnim) {
            t.count = 0;
            t.animTips(t.x, t.y, l);
        }
    },
    /**
    * 溢出反转  
    * @param {object} el 组件对应dom节点
    * @param {int} local 组件显示相对位置
    * @return {int} local 副本
    * @author Aissa 2010-1-27
    */
    inversionIt: function (el, local) {
        var t = this, wW = 0, wH = 0, sW = 0, sH = 0, dX = 0, dY = 0, _x = 0, x_ = 0, _y = 0, y_ = 0, d = null, w = el.offsetWidth, h = el.offsetHeight;

        d = document.documentElement;
        wW = d.clientWidth;
        wH = d.clientHeight;
        sW = $D.getDocumentScrollLeft();
        sH = $D.getDocumentScrollTop();

        dY = sH > t.y ? 1 : (sH + wH < t.y + h + t.boxHeight ? 2 : 0);
        dX = sW > t.x ? 6 : (sW + wW < t.x + w + t.boxWidth ? 3 : 0);

        _x = t.eX - sW;
        x_ = sW + wW - t.eX - w;
        _y = t.eY - sH;
        y_ = sH + wH - t.eY - h;

        if (t.s.local > 0 && t.s.local < 5) {
            if (dY == 1 && y_ > _y) {
                local = t.s.local == 1 ? 3 : (t.s.local == 2 ? 4 : local);
            } else if (dY == 2 && _y > y_) {
                local = t.s.local == 3 ? 1 : (t.s.local == 4 ? 2 : local);
            }
        } else if (t.s.local > 4 && t.s.local < 9) {
            if (dX == 6 && x_ > _x) {
                local = t.s.local == 5 ? 7 : (t.s.local == 6 ? 8 : local);
            } else if (dX == 3 && _x > x_) {
                local = t.s.local == 7 ? 5 : (t.s.local == 8 ? 6 : local);
            }
        }

        t.getArrowNumber(local);

        if (t.s.arrow != 0) {
            t.arrow.className = 'arrow-' + t.a;
        }

        t.ieBug();

        t.setXY(el, local);

        return local;
    },
    /**
    * ie 6, 7 bug
    * @return {null}
    * @author Aissa 2010-1-27
    */
    ieBug: function () {
        var t = this, $DS = $D.setStyle;

        if (t.s.arrow != 0) {
            if (YAHOO.env.ua.ie == 6 && (t.a == 3 || t.a == 4)) {
                $DS(t.arrow, 'top', (t.box.offsetHeight - 1) + 'px');
            } else if (YAHOO.env.ua.ie == 6 && (t.a == 1 || t.a == 2)) {
                $DS(t.arrow, 'top', '-7px');
            } 
        }
    },
    /**
    * 设置显示坐标
    * @param {object} el 组件对应dom节点
    * @param {int} local box显示的相对位置
    * @return {null}
    * @author Aissa 2010-1-27
    */
    setXY: function (el, local) {
        var t = this, eX = 0, eY = 0, x = 0, y = 0, w = el.offsetWidth, h = el.offsetHeight;

        /* 获取此节点坐标值 */
        t.eY = eY = $D.getRegion(el).top;
        t.eX = eX = $D.getRegion(el).left;

        switch (local) {
            case 1:
                x = eX;
                y = eY - t.boxHeight - 2;
                break;
            case 2:
                x = eX + w - t.boxWidth;
                y = eY - t.boxHeight - 2;
                break;
            case 3:
                x = eX;
                y = eY + h + 7;
                break;
            case 4:
                x = eX + w - t.boxWidth;
                y = eY + h + 7;
                break;
            case 5:
                x = eX - t.boxWidth - 2;
                y = eY;
                break;
            case 6:
                x = eX - t.boxWidth - 2;
                y = eY + h - t.boxHeight;
                break;
            case 7:
                x = eX + w + 7;
                y = eY;
                break;
            case 8:
                x = eX + w + 7;
                y = eY + h - t.boxHeight;
                break;
        }

        /* 绑定坐标偏差值 */
        x -= t.s.dLeft;
        y -= t.s.dTop;

        t.x = x;
        t.y = y;
    },
    /**
    * 显示tips box时简单弹动效果
    * @param {int} x 初始x轴坐标值
    * @param {int} y 初始y轴坐标值
    * @param {int} local 相对显示区域
    * @return {null}
    * @author Aissa 2010-1-10
    */
    animTips: function (x, y, local) {
        var t = this, $DS = $D.setStyle;

        t.animSto = setTimeout(function () {
            switch (local) {
                case 1:
                case 2:
                    y += t.count < 4 ? -1 : 1;
                    $DS(t.box, 'top', y + 'px');
                    break;
                case 3:
                case 4:
                    y += t.count < 4 ? 1 : -1;
                    $DS(t.box, 'top', y + 'px');
                    break;
                case 5:
                case 6:
                    x += t.count < 4 ? -1 : 1;
                    $DS(t.box, 'left', x + 'px');
                    break;
                case 7:
                case 8:
                    x += t.count < 4 ? 1 : -1;
                    $DS(t.box, 'left', x + 'px');
                    break;
            }
            t.count++;
            if (t.count >= 8) return;
            t.animTips(x, y, local);
        }, 7);
    },
    /**
    * 隐藏tips box        
    * @return {null}
    * @author Aissa 2010-1-10
    */
    hiddenTips: function () {
        var t = this;

        if (t.s.isHold) {
            t.holdTips(t.s.keep);
        } else {
            $D.setStyle(t.grave, 'position', 'relative');
        }

    },
    /**
    * 去除自动消失
    * @return {null}
    * @author Aissa 2010-1-28
    */
    isTipsHold: function () {
        var t = this;
        if (t.sto != null) clearTimeout(t.sto);
        t.sto = null;
    },
    /**
    * hold tips box
    * @param {int} keep 持续时间 
    * @return {null}
    * @author Aissa 2010-1-10
    */
    holdTips: function (keep) {
        var t = this;
        if (t.sto != null) clearTimeout(t.sto);
        t.sto = null;

        t.sto = setTimeout(function () {
            $D.setStyle(t.grave, 'position', 'relative');
        }, keep);
    }
};

/* 实例化上传组件 */
/*FD.widget.newSimpleTips = new function (els, settings) {
    return new FD.widget.SimpleTips(els, settings);
}*/