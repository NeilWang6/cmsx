/**
 * tab UI 组件
 * @update by xuping.nie: close tab by double click
 * @TODO: close button replace statuticon when mouse over
 * @update by levy.jiny: 解决打开多窗口显示左右导航时界面会乱的问题
 */
jQuery.namespace("FE.sys.webww.ui");
(function ($) {
    var TabManager = function () {
        var container = $('#webatm-mainTab')[0], prefix = $('#webatm-mainTab div.prefix')[0], tabs = $('#webatm-mainTab ul.tabs ')[0];
        var slider = $('#webatm-mainTab div.slider')[0], prev = $('#webatm-mainTab div.prev')[0], next = $('#webatm-mainTab div.next')[0];

        var prefixWidth = getWidthWithMargin(prefix), sliderWidth = getWidthWithMargin(slider);

        var tabIndex = [], tabElements = {}, selectedTab = null, basePos = 0;

        var MAX_TAB_COUNT = 8;
        /*
         IMPREDEFSTATUS_OFFLINE   = 0,// 离线
         IMPREDEFSTATUS_FREE   = 1,// 在线
         IMPREDEFSTATUS_BUSY   = 2,//忙碌中
         IMPREDEFSTATUS_AWAY   = 3,//不在电脑旁
         IMPREDEFSTATUS_INCALL   = 4,//接听电话中
         IMPREDEFSTATUS_OUTFORDINNER   = 5,//外出就餐
         IMPREDEFSTATUS_WAIT   = 6,//稍候
         IMPREDEFSTATUS_INVISIBLE   = 7,// 隐身
         IMPREDEFSTATUS_OFFLINELOGON   = 8,//离线登陆
         */
        var iconMap = {
            '0':'offline',
            '1':'free',
            '2':'busy',
            '3':'away',
            '4':'incall',
            '5':'outfordinner',
            '6':'wait',
            '7':'invisible',
            '8':'offlinelogon'
        };

        var onTabCloseListener = function () {
        };
        var onTabSelectedListener = function () {
        };

        $(prev).bind('click', onClickSlider);
        $(next).bind('click', onClickSlider);

        function onClickSlider(e) {
            if ($(this).hasClass('enable')) {
                $(this).hasClass('prev') ? basePos-- : basePos++;
                changeViewport();
            }
        }

        function onMouseOverTab(e) {
//            if (!this.mouseovered) {
//                this.mouseovered = true;
            if (tabIndex.length > 1) {
                $(this.statusIcon).css('display', 'none');
                $(this.closeBtn).css('display', 'block');
            }
//            }
        }

        function onMouseOutTab(e) {
//            var region = $Region(this);
//            if (e.clientX <= region.left || e.clientX >= region.right || e.clientY <= region.top || e.clientY >= region.bottom) {
//            this.mouseovered = false;
            $(this.closeBtn).css('display', 'none');
            $(this.statusIcon).css('display', 'block');
//            }
        }

        function onClickTab(e) {
            if ($(e.target).hasClass('close')) {
                if (tabIndex.length > 1) {
                    _removeTab(this);
                }
            } else {
                selectTab(this);
            }
        }

        function onDoubleClickTab(e) {
            if (tabIndex.length > 1) {
                _removeTab(this);
            }
        }

        function getWidthWithMargin(elem) {
            var marginLeft = parseInt($(elem).css('marginLeft'), 10), marginRight = parseInt($(elem).css('marginRight'), 10);
            var result = 0;
            try {
                result = marginLeft + elem.offsetWidth + marginRight;
            } catch (e) {
                result = 0;
            }
            return result;
        }

        function _removeTab(elem) {
            var tmp = [], id = elem.id;
            console.log("removeTab:" + id);
            for (var i = 0, len = tabIndex.length; i < len; ++i) {
                if (tabIndex[i] != elem) {
                    tabIndex[i].index = tmp.length;
                    tmp.push(tabIndex[i]);
                } else {
                    tabs.removeChild(elem);
                    delete tabIndex[i];
                    delete tabElements[id];
                    selectTab(tabIndex[i != len - 1 ? i + 1 : i - 1]);
                }
            }
            tabIndex = tmp;
            if (basePos > 0) {
                basePos--;
            }
            changeViewport();
            switchStyle();
            onTabCloseListener(id);
        }

        function removeTab(id) {
            if (id && tabElements[id]) {
                _removeTab(tabElements[id]);
            }
        }

        function selectTab(elem) {
            if (selectedTab) {
                $(selectedTab).removeClass('selected');
            }
            $(elem).removeClass('notify');
            $(elem).addClass('selected');
            selectedTab = elem;
            onTabSelectedListener(elem.id);
        }

        function enableSlider(elem) {
            $(elem).addClass('enable');
            $(slider).css('display', 'block');
        }

        function disableSlider(elem) {
            $(elem).removeClass('enable');
            var another = (elem == prev ? next : prev);

            if (!$(another).hasClass('enable')) {
                $(slider).css('display', 'none');
            }
        }

        function switchStyle() {
            container.className = 'multiTab';
        }

        function addTab(tab) {
            var newTab = document.createElement('li');

            var wrapper = document.createElement('div');
            $(wrapper).addClass('tabWrapper');
            newTab.appendChild(wrapper);


            var titleTxt = document.createElement('div');
            $(titleTxt).addClass('title');
            titleTxt.innerHTML = tab.title;
            wrapper.appendChild(titleTxt);

            var statusIcon = document.createElement('div');
            $(statusIcon).addClass('statusIcon');
            $(statusIcon).addClass('free');
            wrapper.appendChild(statusIcon);

            var closeBtn = document.createElement('div');
            $(closeBtn).addClass('close');
            wrapper.appendChild(closeBtn);

            for (var i = 0, len = tabIndex.length; i != len; ++i) {
                $(tabIndex[i]).css('display', 'none');
            }

            tabs.appendChild(newTab);
            newTab.id = tab.id;
            newTab['widthWithMargin'] = getWidthWithMargin(newTab);
            $(newTab).css('display', 'none');
            newTab.index = tabIndex.length;
            newTab.closeBtn = closeBtn;
            newTab.statusIcon = statusIcon;
            newTab.titleTxt = titleTxt;
            basePos = newTab.index;
            tabIndex.push(newTab);
            tabElements[newTab.id] = newTab;

            $(newTab).bind('mouseover', onMouseOverTab);
            $(newTab).bind('mouseout', onMouseOutTab);
            $(newTab).bind('click', onClickTab);
            $(newTab).bind('dblclick', onDoubleClickTab);
            changeViewport();

            if (1 == tabIndex.length) {
                selectTab(newTab);
            }
            if (tabIndex.length > MAX_TAB_COUNT) {
                _removeTab(tabIndex[0]);
            }
            switchStyle();
        }

        function addTabCloseListener(listener) {
            if (typeof listener == 'function') {
                onTabCloseListener = listener;
            }
        }

        function addTabSelectedListener(listener) {
            if (typeof listener == 'function') {
                onTabSelectedListener = listener;
            }
        }

        function changeViewport() {
            var viewportWidth = container.offsetWidth - prefixWidth - sliderWidth - 50, visibleTabsWidth = 0, i;
            for (i = basePos; i > -1; --i) {
                var tab = tabIndex[i];
                var wm = 0;
                try {
                    if (tab['widthWithMargin'] == null) {
                        wm = getWidthWithMargin(tab);
                    } else {
                        wm = tab['widthWithMargin'];
                    }
                } catch (e) {
                }
                if (visibleTabsWidth + wm < viewportWidth) {
                    visibleTabsWidth += wm;
                    $(tab).css('display', 'block');
                } else {
                    break;
                }
            }

            if (i > -1) {
                enableSlider(prev);
                for (; i > -1; --i) {
                    var tab = tabIndex[i];
                    $(tab).css('display', 'none');
                }
            } else {
                disableSlider(prev);
            }

            for (i = basePos + 1, len = tabIndex.length; i < len; ++i) {
                var tab = tabIndex[i];
                var wm = 0;
                try {
                    if (tab['widthWithMargin'] == null) {
                        wm = getWidthWithMargin(tab);
                    } else {
                        wm = tab['widthWithMargin'];
                    }
                } catch (e) {
                }
                if (visibleTabsWidth + wm < viewportWidth) {
                    visibleTabsWidth += wm;
                    $(tab).css('display', 'block');
                } else {
                    break;
                }
            }

            if (i < tabIndex.length) {
                enableSlider(next);
                for (len = tabIndex.length; i < len; ++i) {
                    var tab = tabIndex[i];
                    $(tab).css('display', 'none');
                }
            } else {
                disableSlider(next);
            }
        }

        function notify(id) {
            var tab = tabElements[id];
            if (!$(tab).hasClass('selected')) {
                $(tab).addClass('notify');
                basePos = tab.index;
            }
            changeViewport();
        }

        function updateStatus(id, status) {
            if (tabElements[id] && tabElements[id].statusIcon) {
                tabElements[id].statusIcon.className = 'statusIcon ' + iconMap[status];
            }
        }

        function updateTitle(id, title) {
            if (!tabElements[id]) {
                return;
            }
            if (title) {
                tabElements[id].titleTxt.innerHTML = title;
            }
            $(tabElements[id]).css('display', 'block');
            tabElements[id].widthWithMargin = getWidthWithMargin(tabElements[id]);
            $(tabElements[id]).css('display', 'none');
            if (tabElements[id].widthWithMargin > 150) {
                tabElements[id].widthWithMargin = 150;
                tabElements[id].titleTxt.innerHTML = title.substr(0, 15) + '...';
            }

            changeViewport();
        }

        function activeTab(id) {
            if (id && tabElements[id]) {
                selectTab(tabElements[id]);
            }
            if ($(tabElements[id]).css('display') == 'none') {
                basePos = tabElements[id].index;
                changeViewport();
            }
        }

        return {
            'addTab':addTab,
            'addTabCloseListener':addTabCloseListener,
            'addTabSelectedListener':addTabSelectedListener,
            'changeViewport':changeViewport,
            'notify':notify,
            'updateStatus':updateStatus,
            'updateTitle':updateTitle,
            'activeTab':activeTab,
            'removeTab':removeTab
        };
    };
    FE.sys.webww.ui.TabManager = TabManager;

})(jQuery);