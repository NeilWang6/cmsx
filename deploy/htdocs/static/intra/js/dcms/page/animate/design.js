/*
 * @Author      changbin.wangcb
 * @Date        2013.08.08
 * @Description design
 */

jQuery.namespace('FE.tools.design');
(function($, Design){
    var jq          = $,                // ����ʹ��jq����$,��ΪVM��$�ǹؼ���
        doc = $(document),
        win = $(window),
        animateIdx  = 1,                // ����Ԫ��index
        anchorIdx   = 1,                // ê��index
        currentTime = 0.1,              // ��ǰʱ��
        currentZIndex = 1,              // ����zIndex
        vm          = null,
        emptyam     = {
            name             : '����' + animateIdx,
            className        : 'img img-' + animateIdx,
            img              : 'http://img.china.alibaba.com/cms/upload/2014/792/909/1909297_1625054590.png',
            title            : '',
            beginTime        : currentTime,
            duration         : 1,
            animateCount     : false,
            animateType      : '',
            top              : 0,
            left             : 0,
            height           : 0,
            width            : 0,
            zIndex           : currentZIndex,
            hoverAnimateType : ''
        },
        currentAm = null,               // ��ǰѡ�еĶ���ͼ��
        $amMask = null,                 // ����ͼ������������
        emptyac = {
            className : 'anchor anchor-' + anchorIdx,
            title     : '',
            height    : 100,
            width     : 100,
            href      : '#',
            top       : 0,
            left      : 0,
            action    : false
        },
        currentAc = null,               // ��ǰѡ�е�����
        $acMask = null,                 // ��������������
        $container = null,              // ��ͼ��������
        $titu = null,                   // ��ͼ����990����
        $mainStage = null,              // ����������ko�󶨽ڵ�
        $background = null,             // ����������
        $animateSet = null,             // ����ͼ��������
        $anchorSet = null,              // ����������
        $toolbox = null,                // ������
        playing = false,                // �Ƿ��ڲ���
        newAM = null,
        newCM = null,
        hLen = 21,                      // ��ʷ��¼�ĳ���
        historys = [],                  // ��ʷ��¼
        rHistorys = [],                 // ������ʷ��¼
        uploadUrl = null;

    /* ��ͼ������ʼ������ */
    var inDesign = {
        init: function () {
            var supportTrans = Modernizr.csstransitions;

            if( jq.util.ua.ie6 ) return;

            if( supportTrans ){
                inDesignHoverAm.init();

                for ( var i in this ) {
                    if (i !== 'init' ) {
                        this[i]();
                    }
                }
            }else{ 
                jq('#in-design div.mod-titu img.img').css('opacity', 1);
            }
        },
        bookmark: function(){
            jq.add('web-browser', {
                js: ['/static/fdevlib/js/fdev-v4/widget/web/browser-min.js'],
                ver: '1.0'
            });

            jq('#in-design div.mod-titu a.bookmark').click(function(e){
                if( !playing ) return;
                e.preventDefault();

                jq.use('web-browser', function(){
                    FE.util.addBookmark();
                });
            });
        }
    };

    /* ��ͼhover�����������һ�����������ʱ�򴥷� */
    var inDesignHoverAm = {
        init: function () {
            var self = this;

            jq('#in-design div.mod-titu img.animated:not(.infinite):last').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
                for ( var i in self ) {
                    if (i !== 'init' ) {
                        self[i]();
                    }
                }
            });
        }
    };

    // ����Ԥ����ʼ
    // �༭��ʱ�����editing class����֤����ѭ���Ķ���ֻ����һ�Σ�chrome33����bug������Ҫ�ֶ�ȥ������class��
    function start(){
        $('#content').removeClass('editing');
        $('#play-wrap header a.play').addClass('paused').attr('title', '��ͣ');
    }

    // ����Ԥ������
    // ���Ž���ʱ�����paused class������animation-play-state: paused;��ͣ����
    function end(){
        $('#content').addClass('editing').addClass('paused');
        $('#play-wrap header a.play').removeClass('paused', '����');

        // ȥ��hover�������¼�����֤�༭��ʱ�򲻻ᴥ��
        $container.off('mouseenter').off('mouseleave');

        setTimeout(function(){
            // �ֶ�ȥ��class����֤chrome33+ ���޶�����ֹͣ
            $titu.find('img.animated:not(.disable)').each(function(idx, el){
                var _this = $(el),
                    className = _this.attr('class');

                _this.removeClass().addClass(className.replace(/(img img-(\d)+( animated)?( infinite)?).*/g, '$1'));
            });

            $('#content').removeClass('paused');
        }, 1000);
    }

    // ��ͼ���ģ��
    function designModel (screenGrid) {
        this['screenGrid']   = ko.observable(screenGrid || 'design-990');   // դ��
        this['designBgImg']  = ko.observable('http://img.china.alibaba.com/cms/upload/2014/152/498/1894251_1625054590.png');        // ��ͼ����
        this['fixBgImg']     = ko.observable('');        // ie6 fix jpg����
        this['contentBgImg'] = ko.observable('');        // ������ͼ�Ľ��䱳��
        this['contentBg']    = ko.observable('#fff');    // ����ɫ
        this['designHeight'] = ko.observable(300);       // ��ͼ�߶�
        this['designStyle']  = ko.computed({             // ��ͼ��ʽ
            read: function(){
                var style = '';

                style = '#in-design .mod-titu { height: ' + this.designHeight() + 'px; }';

                if ( this.designBgImg() !== '' ){
                    style += '#in-design { background-color: ' + this.contentBg() + '; background-image: url(' + this.designBgImg() + ');';

                    if( this.fixBgImg() !== '' ){
                        style += ' _background-image: url(' + this.fixBgImg() + ');';
                    }

                    style += ' }'
                }

                return style;
            },
            owner: this
        });
        // �󱳾���ʽ�ɺ����ṩ
        /*this['contentStyle'] = ko.computed({            // �󱳾���ʽ
            read: function(){
                var style = '';

                // style = '.cell-page-main { background-color: ' + this.contentBg() + ';';

                if( this.contentBgImg() !== '' ){
                    style += ' background-image: url(' + this.contentBgImg() + ')';
                }

                style += ' }';

                return style;
            },
            owner: this
        });*/
        this['animates']     = ko.observableArray([  // �����б?��̬��ӣ�
            
        ]);
        this['anchors']      = ko.observableArray([  // ê���б?��̬��ӣ�

        ]);
        this['style']        = ko.computed({         // ��ͼ������ʽ
            read: function(){
                var style = '',
                    animates = this.animates(),
                    anchors = this.anchors();

                style = this.designStyle() + '\n'/* + this.contentStyle() + '\n'*/;
                
                if( animates.length > 0 ){
                    for( var i = 0, l = animates.length; i < l; i++ ){
                        style += animates[i].style() + '\n';
                    }
                }

                if( anchors.length > 0 ){
                    for( var i = 0, l = anchors.length; i < l; i++ ){
                        style += anchors[i].style() + '\n';
                    }
                }

                return style;
            },
            owner: this
        });
    }

    // ��ͼ����Ԫ�����ģ��
    function animateModel (obj) {
        if( typeof obj !== 'undefined' ){   // set
            this['name']             = ko.observable(obj.name);
            this['className']        = ko.observable(obj.className);        // ����img class
            this['img']              = ko.observable(obj.img);              // ����img png24
            this['title']            = ko.observable(obj.title);            // alt
            this['beginTime']        = ko.observable(obj.beginTime);        // ��ʼʱ��
            this['duration']         = ko.observable(obj.duration);         // ����ʱ��
            this['animateCount']     = ko.observable(obj.animateCount);     // �������Ŵ���
            this['animateType']      = ko.observable(obj.animateType);      // ��������
            this['top']              = ko.observable(obj.top);              // top
            this['left']             = ko.observable(obj.left);             // left
            this['height']           = ko.observable(obj.height);          
            this['width']            = ko.observable(obj.width);
            this['zIndex']           = ko.observable(obj.zIndex);
            // this['hasHoverEvent']    = ko.observable(obj.hasHoverEvent);    // �Ƿ���hoverЧ��
            this['hoverAnimateType'] = ko.observable(obj.hoverAnimateType); // hover��������
            this['disable']          = ko.observable(false);                // �༭ʱɾ��ı�ʶ��ʵ������л�ɾ��
        }else{  // get
            this['name']             = ko.observable('����' + animateIdx);
            this['className']        = ko.observable('img img-' + animateIdx);      // ����img class
            this['img']              = ko.observable('');                           // ����img png24
            this['title']            = ko.observable('');                           // alt
            this['beginTime']        = ko.observable(currentTime);                  // ��ʼʱ��
            this['duration']         = ko.observable(1);                            // ����ʱ��
            this['animateCount']     = ko.observable(false);                        // �������Ŵ���
            this['animateType']      = ko.observable('');                           // ��������
            this['top']              = ko.observable(0);                            // top
            this['left']             = ko.observable(0);                            // left
            this['height']           = ko.observable(0);          
            this['width']            = ko.observable(0);
            this['zIndex']           = ko.observable(currentZIndex);
            // this['hasHoverEvent']    = ko.observable(false);                        // �Ƿ���hoverЧ��
            this['hoverAnimateType'] = ko.observable('');                           // hover��������
            this['disable']          = ko.observable(false);
        }
        
        // ��ͼ����Ԫ����ʽ
        this['style']            = ko.computed({
            read: function(){
                var style = '',
                    classNames = this.className();

                style = '#in-design .mod-titu .' + this.className().split(' ')[1] + ' { top: ' + this.top() + 'px; left: ' + this.left() + 'px; ';

                if( this.zIndex() !== 0 ){
                    style = style + 'z-index: ' + this.zIndex() +';';
                }

                if( this.duration() !== 1 ){
                    style = style + '-webkit-animation-duration: ' + this.duration() + 's;'
                          + '-moz-animation-duration: ' + this.duration() + 's;'
                          + '-o-animation-duration: ' + this.duration() + 's;'
                          + '-ms-animation-duration: ' + this.duration() + 's;'
                          + 'animation-duration: ' + this.duration() + 's;';
                }

                // ����ѭ��������hover����disable
                if( this.animateCount() ){
                    if( classNames.indexOf('infinite') < 0 ){
                        this.className(classNames + ' infinite');

                        this.hoverAnimateType('none');
                        $animateSet.find('div.am-hover').slideUp(0).prev('div').addClass('disable');
                        autoHeight(true);

                        tool.current && tool.current.addClass('selected');
                    }
                }else{
                    if( classNames.indexOf('infinite') > -1 ){
                        classNames = classNames.replace(' infinite', '');
                        this.className(classNames);

                        $animateSet.find('div.am-hover').prev('div').removeClass('disable');
                        tool.current && tool.current.addClass('selected');
                    }
                }

                style = style + '}';

                return style;
            },
            owner: this
        });

        // ��ͼ����js
        this.animateFn           = ko.computed({
            read: function(){
                if( !this.disable() ){
                    var classNames = this.className(),
                        className = classNames.split(' ')[1],
                        _this = $('#in-design div.mod-titu img.' + className);

                    if( this.animateType() !== '' && this.animateType() !== 'none' ){
                        if( classNames.indexOf('animated') < 0 ){
                            classNames = classNames + ' animated';
                            this.className(classNames);
                        }

                        _this.removeClass().addClass( classNames + ' ' + this.animateType() );
                    }else{
                        if( classNames.indexOf('animated') > -1 ){
                            this.className(classNames.replace(/( animated)?( infinite)?/g, ''));
                            this.animateCount(false);
                        }
                    }
                }
            },
            owner: this
        });
    }

    // ê�����ģ��
    function anchorModel (obj) {
        if( typeof obj !== 'undefined' ){
            this['className'] = ko.observable(obj.className);
            this['title']     = ko.observable(obj.title);
            this['height']    = ko.observable(obj.height);
            this['width']     = ko.observable(obj.width);
            this['href']      = ko.observable(obj.href);
            this['top']       = ko.observable(obj.top);          // top
            this['left']      = ko.observable(obj.left);         // left
            this['disable']   = ko.observable(false);
            this['action']    = ko.observable(obj.action);       // Ԥ�蹦�ܣ�����ֻ֧���ղ�ҳ�棩
        }else{
            this['className'] = ko.observable('anchor anchor-' + anchorIdx);
            this['title']     = ko.observable('');
            this['height']    = ko.observable(100);
            this['width']     = ko.observable(100);
            this['href']      = ko.observable('#');
            this['top']       = ko.observable(0);         // top
            this['left']      = ko.observable(0);         // left
            this['disable']   = ko.observable(false);
            this['action']    = ko.observable(false);
        }
        
        // ê����ʽ
        this['style']     = ko.computed({
            read: function(){
                var style = '',
                    className = '',
                    id = '';

                className = this.className();
                id = this.className().split(' ')[1];

                // ͨ�����class�ķ�ʽ����ղع���
                if( this.action() ){
                    if( className.indexOf('bookmark') === -1 ){
                        this.className(className + ' ' + 'bookmark');
                        tool.current && tool.current.addClass('selected');
                    }
                }else{
                    if( className.indexOf('bookmark') > -1 ){
                        this.className(className.replace(' bookmark', ''));
                        tool.current && tool.current.addClass('selected');
                    }
                }

                // ie9���£����ӻᱻpng24��ͼƬĪ���
                style = '#in-design .mod-titu .' + id + ' { top: ' + this.top() + 'px; left: ' + this.left() + 'px;' 
                      + 'height: ' + this.height() + 'px; width: ' + this.width() + 'px; }';

                return style;
            },
            owner: this
        });
    }

    // �򵥵Ķ���ת����string
    function objectToString( obj ) {
        var str = '';

        function nativeToString( value ) {
            var result = {};

            // ������ֵΪobject��ת����string
            for( var i in value ){
                if( value.hasOwnProperty(i) ){
                    if( value[i] !== null ){
                        result[i] = value[i].toString().replace(/[\n\r]/g, '');
                    }
                }
            }

            result = JSON.stringify(result, null, 4);

            return result;
        }

        str = nativeToString(obj);

        return str;
    }

    // ��ȡ��ͼhtml
    function getHTML(){
        var style = '',
            html = '',
            js = '',
            code = '',
            className = '',
            isAnimate = false,
            isHoverAnimate = false,
            isBookmark = false,
            am = null,
            fnObj = null,
            fnStr = '',
            hoverFnStr = '',
            i, len;

        tool.hide();
        // getModel();

        // ���?��Ԫ����Ԥ��ʱ����Ĵ���
        $('img.img', $titu).each(function(idx, el){
            var _this = $(el),
                className = _this.attr('class');

            className = className.replace(/(img img-(\d)+( animated)?( infinite)?( disable)?).*/g, '$1');
            _this.removeClass().addClass(className);
        });
        
        // style
        style = $('.const-style').html() + $('.var-style').html();

        // ȥ����ɾ����Ϊdisable��Ԫ��style
        $('img.img, a.anchor', $titu).each(function(idx, el){
            var _this = $(el),
                className = _this.attr('class').split(' ')[1],
                reg;

            if( _this.hasClass('disable') ){
                reg = new RegExp('\\#in-design \\.mod-titu \\.' + className + ' \\{[\\s\\S]*?\\}', 'gi');
                style = style.replace(reg, '');
            }
        });

        style = cssbeautify(style, {    // ��ʽ��css
            indent        : '    ',
            autosemicolon : true
        });
        style = '<style type="text/css">' + '\n' + style + '</style>';
        style = '<link rel="stylesheet" type="text/css" href="/static/fdevlib/css/gallery/animate/animate-min.css" />' + '\n' + style;

        // html
        html = $('#in-design').html();
        // ȥ��knouckout�İ����
        html = html.replace(/data-bind=\".*?\"/gi, '');
        html = html.replace(/<!-- \/?ko.*-->/gi, '');
        html = html.replace(/<img(.*?)>/gi, '<img$1 />');    // �պ�img��ǩ
        html = html.replace(/style=\".*?\"/gi, '');         // ȥ������style
        html = html.replace(/aria-disabled=\".*?\"/gi, '');     // ȥ��dragable��ӵı�ʶ
        html = html.replace(/<div class=\"tool-panel.*?<\/div>/gi, '');    // ȥ��toolPannel
        html = html.replace(/<img .*?disable.*? \/>/gi, '');               // ȥ����ɾ����Ϊdisable��Ԫ��
        html = html.replace(/<a .*?disable.*?>.*?<\/a>/gi, '');
        html = '<div id="in-design">' + '\n' + html + '</div>';

        // ���������ͼ����
        for( i in inDesign ){
            if( i !== 'init' && i !== 'bookmark' ){
                delete inDesign[i];
            }
        }

        for( i in inDesignHoverAm ){
            if( i !== 'init' ){
                delete inDesignHoverAm[i];
            }
        }

        // �ж��Ƿ��ж���,����ɶ�������
        for( i = 0, len = vm.animates().length; i < len; i++ ){
            am = vm.animates()[i];
            className = am.className().split(' ')[1];

            if( am.disable() ){
                continue;
            }

            if( am.animateType() !== '' && am.animateType() !== 'none' ){
                isAnimate = true;

                fnStr = "var _this = jQuery('#in-design div.mod-titu img." + className + "');";
                fnStr = fnStr + "setTimeout(function(){ _this.css({ 'opacity': 1 }).addClass('" + am.animateType() + "');";
                fnStr = fnStr + "}, " + am.beginTime() * 1000 + ");";

                inDesign[className] = new Function(fnStr);
            }

            if( am.hoverAnimateType() !== '' && am.hoverAnimateType() !== 'none' ){
                isHoverAnimate = true;

                hoverFnStr = "var _this = jQuery('#in-design div.mod-titu img." + className + "');";
                hoverFnStr = hoverFnStr + "_this.removeClass('" + am.animateType() + "');"
                      + "jQuery('#in-design').on('mouseenter.design', function(){ _this.addClass('" + am.hoverAnimateType() + "'); });"
                      + "jQuery('#in-design').on('mouseleave.design', function(){ _this.removeClass('" + am.hoverAnimateType() + "'); });"; 

                inDesignHoverAm[className] = new Function(hoverFnStr);
            }
        }

        // extend����Ϊ��ϣ��༭�е��ղط���ȥ��
        fnObj = $.extend(true, {}, inDesign);

        // �ж��Ƿ����ղ�ҳ������û�еĻ���ɾ���ղط���
        for( i = 0, len = vm.anchors().length; i < len; i++ ){
            if( vm.anchors()[i].action() ){
                isBookmark = true;
            }
        }  

        if( !isBookmark ){
            delete fnObj['bookmark'];
        }

        // �������ͼ����Ԫ�أ����js
        if( isAnimate || isBookmark ){
            js = objectToString(fnObj);
            js = '(function(jq){ var inDesign = ' + js + ';';

            if( isHoverAnimate ){
                js = js + 'var inDesignHoverAm = ' + objectToString(inDesignHoverAm) + ';';
            }else{
                js = js.replace('inDesignHoverAm.init();', '');
            }    

            js = js + 'jq(function(){ inDesign.init(); }); })(jQuery);';
            js = js_beautify(js.replace(/\"(function(.*)\(\)\s*{.*})\"/g, '$1'));   // ��֮ǰת��Ϊ�ַ��function���Ȱ�˫���ȥ��
            js = '<script type="text/javascript" src="http://static.c.aliimg.com/js/app/operation/module/third/modernizr.min.js"></script>'
               + '<script type="text/javascript">' + '\n'
               + js + '\n' + '</script>';
        }

        js = js.replace('if (!playing) return;', '');
        fnObj = null;

        code = style + '\n' + html + '\n' + js;

        return code;
    }

    // ��ȡ��ͼ���ģ��
    function getModel(){
        var vmObj      = ko.mapping.toJS(vm),
            temp       = '',
            anchorTemp = '',
            model      = null;

        // ��style������Ϊnull����Ϊ���ģ���ﲻ��Ҫ��Щ��������Ϊnull�����toString��ʱ����˵�
        vmObj['contentStyle'] = null;
        vmObj['designStyle']  = null;
        vmObj['style']        = null;
        temp                  = '[';
        anchorTemp            = '[';

        for( var i = 0, l = vmObj['animates'].length; i < l; i++ ){
            delete vmObj['animates'][i]['style'];
            delete vmObj['animates'][i]['disable'];

            temp = temp + (i > 0 ? ',' : '') + JSON.stringify(vmObj['animates'][i], null, 4);
        }

        temp += ']';

        for( var i = 0, l = vmObj['anchors'].length; i < l; i++ ){
            delete vmObj['anchors'][i]['style'];
            delete vmObj['anchors'][i]['disable'];

            anchorTemp = anchorTemp + (i > 0 ? ',' : '') + JSON.stringify(vmObj['anchors'][i], null, 4);
        }

        anchorTemp += ']';

        model = objectToString(vmObj);
        model = model.replace(/\"animates\": \"(\[object Object\](,)?)*\"/gi, '"animates": ' + temp);
        model = model.replace(/\"anchors\": \"(\[object Object\](,)?)*\"/gi, '"anchors": ' + anchorTemp);
        model = js_beautify(model);

        return model;
    }

    // �½�
    function add(screenGrid){
        vm = new designModel(screenGrid);
        newAM = new animateModel($.extend({}, emptyam));
        newCM = new anchorModel($.extend({}, emptyac));
        setHistory('new');

        ko.applyBindings(vm, $mainStage[0]);
        ko.applyBindings(vm, $background[0]);
        ko.applyBindings(newAM, $animateSet[0]);
        ko.applyBindings(newCM, $anchorSet[0]);

        fullScreen();
        autoHeight();
        bindEvent();
    }

    /**
     * �޸�
     * @param  {Json} obj ���ģ��
     * @return {Boolean}
     */
    function edit(obj){
        var vmObj = null,
            amL = 0,
            anL = 0,
            am = null,
            cm = null;

        vm = new designModel();
        newAM = new animateModel($.extend({}, emptyam));
        newCM = new anchorModel($.extend({}, emptyac));

        try{
            vmObj = JSON.parse(obj);
        }catch(ex){
            alert('��������ȷ���ģ��!');

            return;
        }
        
        for( var i in vmObj ){
            if( !(vmObj[i] instanceof Array) ){
                vm[i](vmObj[i]);
            }else{
                for( var j = 0, l = vmObj[i].length; j < l; j++ ){
                    if( i === 'animates' ){
                        vm.animates.push(new animateModel(vmObj[i][j]));
                    }else{
                        vm.anchors.push(new anchorModel(vmObj[i][j]));
                    }
                }
            }
        }

        currentZIndex = vm.animates().length + 1;

        amL = vmObj['animates'].length;
        anL = vmObj['anchors'].length;

        if( amL > 0 ){
            animateIdx = parseInt(vmObj['animates'][amL - 1].className.slice(8)) + 1;
        }

        if( anL > 0 ){
            anchorIdx = parseInt(vmObj['anchors'][anL - 1].className.slice(14)) + 1;
        }

        ko.applyBindings(vm, $mainStage[0]);
        ko.applyBindings(vm, $background[0]);
        
        currentAm = vm.animates()[0] || null;

        if( currentAm ){
            ko.applyBindings(currentAm, $animateSet[0]);
        }else{
            ko.applyBindings(newAM, $animateSet[0]);
        }

        currentAc = vm.anchors()[0] || null;

        if( currentAc ){
            ko.applyBindings(currentAc, $anchorSet[0]);
        }else{
            ko.applyBindings(newCM, $anchorSet[0]);
        }

        fullScreen();
        autoHeight();
        setHistory('edit');
        bindEvent();

        return true;
    }

    // ����ͼ�㹤���¼�
    function animateSetEvent(){
        // ��Ӷ���ͼ��
        $('div.action button', $animateSet).click(function(e){
            var am = null,
                elem = null,
                amObj = {
                    name      : '����' + animateIdx,
                    className : 'img img-' + animateIdx,
                    beginTime : currentTime,
                    zIndex    : currentZIndex
                };

            e.preventDefault();

            amObj = $.extend({}, emptyam, amObj);
            am = new animateModel(amObj);
            currentAm = am;

            vm.animates.push(am);
            ko.applyBindings(am, $animateSet[0]);

            // ����Ч���б�߶�������Ӧ�ģ�����Ҫ��һ��
            autoHeight();

            // ����ק�¼�
            elem = $('img.' + am.className().split(' ')[1], $titu);

            elem.zoomAndMove({
                isMove: true,
                isZoom: false,
                moveStart: function(info) {
                    tool.container.hide();
                },
                moveEnd: function(info) {
                    var _this = info.obj,
                        ops = {};

                    currentAm = am;     // ��ʱ����

                    ops.oLeft = am.left();
                    ops.oTop = am.top();
                    am.left(info.left);
                    am.top(info.top); 
                    ops.left = info.left;
                    ops.top = info.top; 

                    _this.attr('style', 'opacity: 1;');     // ȥ��left��top��������ʽ��������������¼���ʧЧ����Ϊ�������Ҹĵ�Ҳ��style�ļ�����ʽ�Ḳ�ǣ�
                    tool.pos();
                    setHistory('AMmove', ops);
                },
                always: function(){
                    tool.current && tool.container.show();
                }
            });
            
            tool.show(elem);

            animateIdx++;
            // TODO: ����Ӧ�üӵ���duration�űȽϺ�
            currentTime += 1;
            currentZIndex += 1;
            setHistory('add');

            $amMask.hide();
        });

        // ���ö���Ч��
        $animateSet.on('click', 'div.am-normal dl.am-list a', function(e){
            var type = {};

            e.preventDefault();

            $animateSet.find('div.am-normal dl.am-list a').removeClass('selected');
            $(this).addClass('selected');
            
            type.oType = currentAm.animateType();
            type.type = $(this).data('value');
            currentAm.animateType(type.type);
            setHistory('amType', type);

            tool.current && tool.current.addClass('selected');
        });

        // ����hover����Ч��
        $animateSet.on('click', 'div.am-hover dl.am-list a', function(e){
            var type = {};

            e.preventDefault();

            $animateSet.find('div.am-hover dl.am-list a').removeClass('selected');
            $(this).addClass('selected');

            type.oType = currentAm.hoverAnimateType();
            type.type = $(this).data('value');
            currentAm.hoverAnimateType(type.type);

            $titu.find('img.' + currentAm.className().split(' ')[1]).removeClass().addClass(currentAm.className()).addClass('animated').addClass(type.type);

            setHistory('hoverType', type);

            tool.current && tool.current.addClass('selected');
        });

        // ����Ч��Ԥ��
        $animateSet.on('click', 'a.play', function(e){
            var parent,
                classNames = currentAm.className(),
                className,
                elem;

            e.preventDefault();

            className = classNames.split(' ')[1];
            elem = $('img.' + className, $titu);
            elem.removeClass().addClass(classNames);

            parent = $(this).closest('div.am-content');

            if( parent.hasClass('am-normal') ){
                setTimeout(function(){
                    elem.addClass(' ' + currentAm.animateType());
                }, 100);
                
            }else{
                setTimeout(function(){
                    elem.addClass(' ' + currentAm.hoverAnimateType());
                }, 100);   
            }

            tool.current && tool.current.addClass('selected');
        });
    }

    // nav�¼�
    function navEvent(){
        var nav = $('div.nav ul.options'),
            preview = $('#play-wrap'),
            previewContent = $('div.default-area', preview);

        $('a.bar-a-repeal', nav).on('click', repeal);

        $('a.bar-a-recover', nav).on('click', recover);

        $('a.bar-a-preview', nav).on('click', function(e){
            e.preventDefault();

            preview.addClass('md-modal');
            previewContent.addClass('md-content');
            
            setTimeout(function(){
                preview.addClass('md-show');

                playing = true;
                $('header a.play', preview).trigger('click');
            }, 100);
        });

        $('header a.close', preview).click(function(e){
            e.preventDefault();

            preview.removeClass('md-show');

            setTimeout(function(){
                previewContent.removeClass('md-content');
                preview.removeClass('md-modal');

                playing = false;
                end();
            }, 100);
        });

        // ����κ����򣬽����
        doc.on('click', function(e){
            var _this = $(e.target);

            if( $('#content').hasClass('editing') ){
                return;
            }

            // Ԥ����ʱ�򲻽���
            if( preview.hasClass('md-modal') ){
                return;
            }

            if( !_this.hasClass('play') && !_this.hasClass('bar-a-preview') ){
                end();
            }
        });
    }

    function bindEvent(e){
        // δѡ��״̬���������
        $amMask.show();
        $acMask.show();

        animateSetEvent();
        navEvent();
        tool.init();

        getLength();
        getRLength();

        // focus
        $titu.on('click', 'img.img', function(){
            tool.show($(this));
        }).on('click', 'a.anchor', function(e){
            e.preventDefault();

            tool.show($(this));
        });

        // ȡ��ѡ��
        $titu.on('click', function(e){
            var _this = $(e.target);
            
            if( !_this.hasClass('img') && !_this.hasClass('anchor') && !_this.closest('div.tool-panel').length && !_this.closest('a').hasClass('anchor') ){
                tool.hide();
            }
        });

        // ����չ��
        $('#toolbox').on('click', 'div.am-header', function(){
            var _this = $(this);

            if( _this.hasClass('disable') ){
                return;
            }

            _this.toggleClass('expand').next('div.am-content').toggle(0, function(){
                autoHeight(true);
            });
        });

        $animateSet.on('click', 'dl.am-list dt', function(){
            $(this).toggleClass('expand').next('dd').slideToggle();
        });

        // �������
        $('div.action button', $anchorSet).click(function(e){
            var ac = null,
                elem = null,
                acObj = {
                    className : 'anchor anchor-' + anchorIdx,
                };

            e.preventDefault();

            acObj = $.extend({}, emptyac, acObj);
            ac = new anchorModel(acObj);
            currentAc = ac;

            vm.anchors.push(ac);
            ko.applyBindings(ac, $anchorSet[0]);

            // ����ק�¼�
            elem = $('a.' + ac.className().split(' ')[1], $titu);

            // ����ק�¼�
            elem.zoomAndMove({
                isMove: true,
                isZoom: true,
                moveStart: function(info) {
                    tool.container.hide();
                },
                moveEnd: function(info) {
                    var _this = info.obj,
                        ops = {};

                    currentAc = ac; // ��ʱ����

                    ops.oLeft = ac.left();
                    ops.oTop = ac.top();
                    ac.left(info.left);
                    ac.top(info.top);
                    ops.left = info.left;
                    ops.top = info.top;

                    _this.attr('style', '');
                    tool.pos();
                    setHistory('ACmove', ops);
                },
                zoomStart: function() {
                    tool.container.hide();
                },
                zoomEnd: function(info) {
                    var _this = info.obj,
                        ops = {};

                    currentAc = ac;     // ��ʱ����

                    ops.oWidth = ac.width();
                    ops.oHeight = ac.height();
                    ac.width(info.width);
                    ac.height(info.height);
                    ops.width = info.width;
                    ops.height = info.height;

                    // zoom��ʱ����ܼ���zoom������������move�Ĳ���
                    ops.oLeft = ac.left();
                    ops.oTop = ac.top();
                    ac.left(info.left);
                    ac.top(info.top);
                    ops.left = info.left;
                    ops.top = info.top;

                    _this.attr('style', '');
                    tool.pos();
                    setHistory('ACzoom', ops);
                },
                always: function(){
                    tool.current && tool.container.show();
                }
            });

            tool.show(elem);
            
            anchorIdx++;
            setHistory('add');

            $acMask.hide();
        });

        // Ԥ����ͼ���嶯��
        $('#content div.main-stage a.play').on('click', function(e){
            e.preventDefault();

            if( $(this).hasClass('paused') ){
                end();
            }else{
                start();

                getHTML();
                tool.hide();            
                inDesign.init();    // Ԥ����ͼ����Ч��
            }
        });

        // �����ز���ק
        $('img', $titu).zoomAndMove({
            isMove: true,
            isZoom: false,
            moveStart: function(info) {
                tool.container.hide();
            },
            moveEnd: function(info) {
                var _this = info.obj,
                    idx = $('img', $titu).index(_this),
                    am = vm.animates()[idx];
                    ops = {};

                currentAm = am;     // ��ʱ����

                ops.oLeft = am.left();
                ops.oTop = am.top();
                am.left(info.left);
                am.top(info.top); 
                ops.left = info.left;
                ops.top = info.top;    

                _this.attr('style', 'opacity: 1;');     // ȥ��left��top��������ʽ��������������¼���ʧЧ����Ϊ�������Ҹĵ�Ҳ��style�ļ�����ʽ�Ḳ�ǣ�
                tool.pos();
                setHistory('AMmove', ops);
            },
            always: function(){
                tool.current && tool.container.show();
            }
        });

        $('a.anchor', $titu).zoomAndMove({
            isMove: true,
            isZoom: true,
            moveStart: function(info) {
                tool.container.hide();
            },
            moveEnd: function(info) {
                var _this = info.obj,
                    idx = $('a', $titu).index(_this),
                    ac = vm.anchors()[idx],
                    ops = {};

                currentAc = ac;     // ��ʱ����

                ops.oLeft = ac.left();
                ops.oTop = ac.top();
                ac.left(info.left);
                ac.top(info.top);
                ops.left = info.left;
                ops.top = info.top;

                _this.attr('style', '');
                tool.pos();
                setHistory('ACmove', ops);
            },
            zoomStart: function() {
                tool.container.hide();
            },
            zoomEnd: function(info) {
                var _this = info.obj,
                    idx = $('a', $titu).index(_this),
                    ac = vm.anchors()[idx],
                    ops = {};

                currentAc = ac;     // ��ʱ����

                ops.oWidth = ac.width();
                ops.oHeight = ac.height();
                ac.width(info.width);
                ac.height(info.height);
                ops.width = info.width;
                ops.height = info.height;

                // zoom��ʱ����ܼ���zoom������������move�Ĳ���
                ops.oLeft = ac.left();
                ops.oTop = ac.top();
                ac.left(info.left);
                ac.top(info.top);
                ops.left = info.left;
                ops.top = info.top;

                _this.attr('style', '');
                tool.pos();
                setHistory('ACzoom', ops);
            },
            always: function(){
                tool.current && tool.container.show();
            }
        });

        // ����ͼƬ�޸�����Ӧ�߶�
        $('#design-bg').on('change', function(){
            var _this = $('img.img-hid');

            _this.on('load', function(){
                vm.designHeight(_this.height());
                setHistory('height');
            });
        });
    }

    // ����
    function repeal(e){
        var obj = null,
            current = null,
            idx,
            len;

        e.preventDefault();

        if( historys.length <= 1 ){
            return;
        }

        rHistorys.length >= hLen && rHistorys.shift();
        obj = historys.pop();
        current = historys.length && historys[historys.length - 1];
        rHistorys.push(obj);
        vm = current && current.viewModel;

        switch(obj.operation){
            case 'add':     // ���
                if( obj.am ){
                    obj.am.disable(true);
                    obj.am.className(obj.am.className() + ' disable');
                }

                if( obj.cm ){
                    obj.cm.disable(true);
                    obj.cm.className(obj.cm.className() + ' disable');
                }

                tool.hide();
                swap(current);
                break;
            case 'delete':  // ɾ��
                if( obj.am ){
                    obj.am.disable(false);
                    obj.am.className(obj.am.className().replace(' disable', ''));
                }

                if( obj.cm ){
                    obj.cm.disable(false);
                    obj.cm.className(obj.cm.className().replace(' disable', ''));
                }

                tool.hide();
                swap(current);
                obj.extra.am && zIndex('deleteR', obj.am);
                break;
            case 'AMmove':  // �ƶ�����ͼ��
                obj.am.left(obj.extra.oLeft);
                obj.am.top(obj.extra.oTop);
                swap(current);
                tool.pos();
                break;
            case 'ACmove':  // �ƶ�����
                obj.cm.left(obj.extra.oLeft);
                obj.cm.top(obj.extra.oTop);
                swap(current);
                tool.pos();
                break;
            case 'zIndex':  // ��������ͼ��
                obj.am.zIndex(obj.extra.oIndex);
                obj.extra.oIndex > obj.extra.index ? zIndex('downR', obj.am) : zIndex('upR', obj.am);
                swap(current);
                tool.pos();
                break;
            case 'ACzoom':  // ��������
                obj.cm.left(obj.extra.oLeft);
                obj.cm.top(obj.extra.oTop);
                obj.cm.width(obj.extra.oWidth);
                obj.cm.height(obj.extra.oHeight);
                swap(current);
                tool.pos();
                break;
            case 'amType':  // ��������
                obj.am.animateType(obj.extra.oType);
                swap(current);
                break;
            case 'hoverType':   // hover��������
                obj.am.hoverAnimateType(obj.extra.oType);
                swap(current);
                break;
        }

        getLength();
        getRLength();
    }

    // �ָ�
    function recover(e){
        var obj = null,
            current = null;

        e.preventDefault();

        if( rHistorys.length < 1 ){
            return;
        }

        // rHistorys.length >= hLen && rHistorys.shift();
        current = rHistorys.pop();
        obj = historys.length && historys[historys.length - 1];
        historys.push(current);
        vm = current && current.viewModel;

        switch(current.operation){
            case 'add':
                if( current.am ){
                    current.am.disable(false);
                    current.am.className(current.am.className().replace(' disable', ''));
                }

                if( current.cm ){
                    current.cm.disable(false);
                    current.cm.className(current.cm.className().replace(' disable', ''));
                }

                tool.hide();
                swap(current);
                break;
            case 'delete':
                if( current.am ){
                    current.am.disable(true);
                    current.am.className(current.am.className() + ' disable');
                }

                if( current.cm ){
                    current.cm.disable(true);
                    current.cm.className(current.cm.className() + ' disable');
                }

                tool.hide();
                swap(current);
                current.extra.am && zIndex('delete', current.am);
                break;
            case 'AMmove':
                current.am.left(current.extra.left);
                current.am.top(current.extra.top);
                swap(current);
                tool.pos();
                break;
            case 'ACmove':
                current.cm.left(current.extra.left);
                current.cm.top(current.extra.top);
                swap(current);
                tool.pos();
                break;
            case 'zIndex':
                current.am.zIndex(current.extra.index);
                obj.extra.oIndex > obj.extra.index ? zIndex('down', current.am) : zIndex('up', current.am);
                swap(current);
                break;
            case 'ACzoom':
                current.cm.left(current.extra.left);
                current.cm.top(current.extra.top);
                current.cm.width(current.extra.width);
                current.cm.height(current.extra.height);
                swap(current);
                tool.pos();
                break;
            case 'amType':
                current.am.animateType(current.extra.type);
                swap(current);
                break;
            case 'hoverType':
                current.am.hoverAnimateType(current.extra.type);
                swap(current);
                break;
        }

        getLength();
        getRLength();
    }

    // ���ӻ���ɾ���ʱ���滻��ǰѡ�е�״̬
    function swap(current){
        if( !current ){
            return;
        }

        if( current.am ){
            current.am.disable() || tool.show($('img.' + current.am.className().split(' ')[1], $titu));
            ko.applyBindings(current.am, $animateSet[0]);
        }else{
            ko.applyBindings(newAM, $animateSet[0]);
        }

        // ����Ч���б�߶�������Ӧ�ģ�����Ҫ��һ��
        // $('div.am-content:gt(0)', $animateSet).height($animateSet.data('height'));
        autoHeight();

        if( current.cm ){
            current.cm.disable() || tool.show($('a.' + current.cm.className().split(' ')[1], $titu));   
            ko.applyBindings(current.cm, $anchorSet[0]);
        }else{
            ko.applyBindings(newCM, $anchorSet[0]);
        }
    }

    // ��ʷ��¼
    function setHistory(op, ex){
        historys.length >= hLen && historys.shift();
        historys.push({
            viewModel : $.extend(true, {}, vm),
            am        : currentAm,
            cm        : currentAc,
            operation : op,
            extra     : ex
        });
        rHistorys.length = 0;
        
        getLength();
        getRLength();
    }

    // ���Ƴ���ť��disable
    function getLength(){
        var len = historys.length,
            repeal = $('div.nav ul.options a.bar-a-repeal');

        if( len > 1 ){
            repeal.removeClass('btn-disabled');
        }else{
            repeal.addClass('btn-disabled');
        }
    }

    // ���ƻָ���ť��disable
    function getRLength(){
        var len = rHistorys.length,
            recover = $('div.nav ul.options a.bar-a-recover');

        if( len > 0 ){
            recover.removeClass('btn-disabled');

            return true;
        }else{
            recover.addClass('btn-disabled');

            return false;
        }
    }

    // tool �ز�С����
    var tool = {
        init: function(){
            this.render();
            this.bindEvent();
            this.current = null;
            this.type = null;
        },
        render: function(){
            var html = '';

            html = '<div class="tool-panel">'
                 +      '<span class="fn-panel del" title="ɾ��"></span>'
                 +      '<span class="fn-panel setUp" title="����ͼ��"></span>'
                 +      '<span class="fn-panel setBottom" title="����ͼ��"></span>'
                 + '</div>';

            this.container = $(html).appendTo($titu);
        },
        show: function(elem){
            var className,
                lists = null,
                am = null,
                ac = null,
                idx = 0,
                amType = '',
                hoverAmType = '',
                pos;

            if( !elem && !this.current ){
                return;
            }
            
            this.container.css('zIndex', elem.css('zIndex')); 

            if( this.current && this.current[0] == elem[0] ){
                return;
            }

            this.current && this.current.removeClass('selected')/*.draggable("disable")*/;
            this.container.removeClass('tool-panel-swap').hide();
            $amMask.show();
            $acMask.show();

            className = elem.attr('class').split(' ');
            this.type = className[0];
            elem.addClass('selected')/*.draggable("enable")*/;

            this.current = elem;
            this.pos();

            if( this.type === 'img' ){
                lists = $titu.find('img.img');
                idx = lists.index(elem);
                am = vm.animates()[idx];
                ko.applyBindings(am, $animateSet[0]);
                currentAm = am;

                if( $titu.find('img.img:not(.disable)').length > 1 ){
                    this.container.addClass('tool-panel-swap');
                }

                amType = currentAm.animateType();
                hoverAmType = currentAm.hoverAnimateType();

                if( amType !== '' ){
                    $animateSet.find('div.am-normal span.an-list-' + amType).parent().addClass('selected');
                }

                if( hoverAmType !== '' ){
                    $animateSet.find('div.am-hover span.an-list-' + hoverAmType).parent().addClass('selected');
                }

                if( currentAm.animateCount() ){
                    $animateSet.find('div.am-hover').prev('div').addClass('disable');
                }

                $toolbox.tabs('select', 1);
                
                upload($('div.am-content:eq(0) div.btnUpadte', $animateSet));

                // ����Ч���б�߶�������Ӧ�ģ�����Ҫ��һ��
                autoHeight();
                $amMask.hide();
            }else{
                idx = $titu.find('a.anchor').index(elem);
                ac = vm.anchors()[idx];
                ko.applyBindings(ac, $anchorSet[0]);
                currentAc = ac;

                $toolbox.tabs('select', 2);
                $acMask.hide();
            } 

            if( !$titu.data('events')['keydown'] ){
                doc.on('keydown.inDesign', keydownIndesign);
            }
        },
        hide: function(){
            if( !this.current ){
                return;
            }

            // this.current.draggable("disable");
            this.current.removeClass('selected');
            this.container.hide();
            this.current = null;
            currentAm = null;
            currentAc = null;
            $amMask.show();
            $acMask.show();
            doc.off('keydown.inDesign');
        },
        pos: function(){
            var pos;

            if( !this.current ){
                return;
            }

            pos = this.current.position();
            this.container.show().css({
                'left': pos.left - 22,
                'top': pos.top - 2
            });
        },
        bindEvent: function(){
            var self = this;

            // ɾ��
            self.container.find('span.del').click(function(){
                var classNameArr = self.current.attr('class').split(' '),
                    className,
                    current;

                self.container.hide();

                classNameArr.length = 2;
                className = classNameArr.join(' ');

                if( self.type === 'img' ){
                    currentAm.disable(true);
                    currentAm.className(currentAm.className() + ' disable');

                    current = $.extend(true, {}, currentAm);
                    zIndex('delete', currentAm);
                    setHistory('delete', {am: current});
                    currentAm = null;
                    ko.applyBindings(newAM, $animateSet[0]);

                    // $('div.am-content:gt(0)', $animateSet).height($animateSet.data('height'));
                    autoHeight();
                }else{
                    currentAc.disable(true);
                    currentAc.className(currentAc.className() + ' disable');

                    current = $.extend(true, {}, currentAc);
                    setHistory('delete', {cm: current});
                    currentAc = null;
                    ko.applyBindings(newCM, $anchorSet[0]);
                }
            });

            // ����
            self.container.on('click', 'span.setUp', function(){
                var _this = null,
                    index = {};

                if( !currentAm ){
                    return;
                }

                _this = $('img.' + currentAm.className().split(' ')[1], $titu);

                index.oIndex = currentAm.zIndex();
                if( !zIndex('up', currentAm) ) return;
                index.index = currentAm.zIndex();

                // tool.show(_this);
                setHistory('zIndex', index);
            });

            // ����
            self.container.find('span.setBottom').click(function(){
                var _this = null,
                    index = {};

                if( !currentAm ){
                    return;
                }

                index.oIndex = currentAm.zIndex();
                if( !zIndex('down', currentAm) ) return;
                index.index = currentAm.zIndex();

                // tool.show(_this);
                setHistory('zIndex', index);
            });
        }
    };

    // ����ͼ��zIndex����
    function zIndex(op, am){
        var idx = am.zIndex(),
            i = 0,
            len = vm.animates().length,
            item = null,
            current = vm.animates().indexOf(am),
            itemIdx;

        switch( op ){
            case 'delete':
                // ɾ���ɾ���zIndex��Ķ���1
                for( ; i < len; i++ ){
                    if( i === current ){
                        continue;
                    }

                    item = vm.animates()[i];
                    if( item.disable() ) continue;
                    itemIdx = item.zIndex();

                    if( itemIdx > idx ){
                        item.zIndex(itemIdx - 1);
                    }
                }

                currentZIndex--;
                break;
            case 'deleteR':
                // ɾ�����ɾ���zIndex��Ķ���1
                for( ; i < len; i++ ){
                    if( i === current ){
                        continue;
                    }

                    item = vm.animates()[i];
                    if( item.disable() ) continue;
                    itemIdx = item.zIndex();

                    if( itemIdx >= idx ){
                        item.zIndex(itemIdx + 1);
                    }
                }

                currentZIndex++;
                break;
            case 'up':
                // ���ƣ������ϲ�ļ�1
                if( idx === currentZIndex - 1 ){
                    return;
                }

                for( ; i < len; i++ ){
                    if( i === current ){
                        continue;
                    }

                    item = vm.animates()[i];
                    if( item.disable() ) continue;
                    itemIdx = item.zIndex();

                    if( itemIdx > idx ){
                        item.zIndex(itemIdx - 1);
                    }
                }

                am.zIndex(currentZIndex - 1);
                break;
            case 'upR':
                // ���Ƴ�������ϲ�ļ�1
                for( ; i < len; i++ ){
                    if( i === current ){
                        continue;
                    }

                    item = vm.animates()[i];
                    if( item.disable() ) continue;
                    itemIdx = item.zIndex();

                    if( itemIdx >= idx ){
                        item.zIndex(itemIdx + 1);
                    }
                }

                break;
            case 'down':
                // ���ƣ������²�ļ�1
                if( idx === 1 ){
                    return;
                }

                for( ; i < len; i++ ){
                    if( i === current ){
                        continue;
                    }

                    item = vm.animates()[i];
                    if( item.disable() ) continue;
                    itemIdx = item.zIndex();

                    if( itemIdx < idx ){
                        item.zIndex(itemIdx + 1);
                    }
                }

                am.zIndex(1);
                break;
            case 'downR':
                // ���Ƴ�������²�ļ�1
                for( ; i < len; i++ ){
                    if( i === current ){
                        continue;
                    }

                    item = vm.animates()[i];
                    if( item.disable() ) continue;
                    itemIdx = item.zIndex();

                    if( itemIdx <= idx ){
                        item.zIndex(itemIdx - 1);
                    }
                }

                break;
        }

        return true;
    }

    // ȫ��
    function fullScreen(){
        var content = $('#content'),
            oHeight = 0,
            h = 0;

        content.height(win.height() - 40);
        oHeight = $animateSet.outerHeight() + $('#toolbox div.header').height();
        h = (win.height() - 40 - oHeight);
        // $('div.am-content:gt(0)', animateSet).height(h);
        $animateSet.data('height', h);
        autoHeight();

        win.on('resize', function(){
            content.height(win.height() - 40);
            h = (win.height() - 40 - oHeight);
            // $('div.am-content:gt(0)', animateSet).height(h);
            $animateSet.data('height', h);
            autoHeight();
        });
    }

    // ����ͼ��߶�����Ӧ
    function autoHeight(isToggle){
        var height = $animateSet.data('height'),
            amContent = $('div.am-content', $animateSet),
            amContentGt0 = amContent.filter(':gt(0):visible'),
            length = amContentGt0.length;

        isToggle && amContent.addClass('toggle');

        if( amContent.eq(0).is(':visible') ){
            amContentGt0.height(height / length);
        }else{
            amContentGt0.height((height + 46) / length);
        }

        setTimeout(function(){
            amContent.removeClass('toggle');
        }, 300);
    }

    // ��������΢��
    function keydownIndesign(e){
        var _this = $('#in-design .selected'),
            idx = 0,
            current = null,  
            ops = {},
            left,
            top;

        // e.preventDefault();
        if( _this.length > 0 ){
            if( _this[0].tagName.toLowerCase() === 'img' ){
                idx = $('img', $titu).index(_this);
                current = vm.animates()[idx];

                ops.oLeft = left = current.left();
                ops.oTop = top = current.top();

                switch(e.keyCode){
                    case $.ui.keyCode.LEFT:
                        tool.hide();
                        current.left(left - 1);
                        ops.left = current.left();
                        ops.top = ops.oTop;
                        tool.pos();
                        tool.show(_this);
                        setHistory('AMmove', ops);
                        break;
                    case $.ui.keyCode.UP:
                        tool.hide();
                        current.top(top - 1);
                        ops.left = ops.oLeft;
                        ops.top = current.top();
                        tool.pos();
                        tool.show(_this);
                        setHistory('AMmove', ops);
                        break;
                    case $.ui.keyCode.RIGHT:
                        tool.hide();
                        current.left(left + 1);
                        ops.left = current.left();
                        ops.top = ops.oTop;
                        tool.pos();
                        tool.show(_this);
                        setHistory('AMmove', ops);
                        break;
                    case $.ui.keyCode.DOWN:
                        tool.hide();
                        current.top(top + 1);
                        ops.left = ops.oLeft;
                        ops.top = current.top();
                        tool.pos();
                        tool.show(_this);
                        setHistory('AMmove', ops);
                        break;
                    // ����Ҫdefault
                }
            }else{
                idx = $('a.anchor', $titu).index(_this);
                current = vm.anchors()[idx];

                ops.oLeft = left = current.left();
                ops.oTop = top = current.top();

                switch(e.keyCode){
                    case $.ui.keyCode.LEFT:
                        tool.hide();
                        current.left(left - 1);
                        ops.left = current.left();
                        ops.top = ops.oTop;
                        tool.pos();
                        tool.show(_this);
                        setHistory('ACmove', ops);
                        break;
                    case $.ui.keyCode.UP:
                        tool.hide();
                        current.top(top - 1);
                        ops.left = ops.oLeft;
                        ops.top = current.top();
                        tool.pos();
                        tool.show(_this);
                        setHistory('ACmove', ops);
                        break;
                    case $.ui.keyCode.RIGHT:
                        tool.hide();
                        current.left(left + 1);
                        ops.left = current.left();
                        ops.top = ops.oTop();
                        tool.pos();
                        tool.show(_this);
                        setHistory('ACmove', ops);
                        break;
                    case $.ui.keyCode.DOWN:
                        tool.hide();
                        current.top(top + 1);
                        ops.top = current.top();
                        ops.left = ops.oLeft;
                        tool.pos();
                        tool.show(_this);
                        setHistory('ACmove', ops);
                        break;
                    // ����Ҫdefault
                }
            }
        }
    }

    // ͼƬ�ϴ�
    function upload(elem){
        var errorMessage = {
                'img_too_big' : '�ļ�̫��',
                'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
                'img_optimization_required' : '��С����',
                'unauthorized' : '��ȫУ�鲻ͨ��',
                'unknown' : 'δ֪����'
            },
            // ��ťƤ�� 
            buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/081/364/463180_133354742.png';

        if( !elem ){ return; }

        $.use('ui-flash-uploader', function() {
            elem.flash({
                module : 'uploader',
                width : 70,
                height : 25,
                flash : true,
                inputName : 'Filedata',
                flashvars : {
                    buttonSkin : buttonSkin
                }
            }).bind('fileSelect.flash', function(e, o) {
                $(this).flash('uploadAll', uploadUrl, {
                    // _csrf_token: 'dcms-box'
                }, 'image', 'fname');
            }).bind('uploadCompleteData.flash', function(e, o) {
                var data = $.unparam(o.data);

                if(data.success === '1') {// �ϴ��ɹ�

                    $(this).closest('dl.layout-row').find('input').val(data.url).trigger('change');

                } else {// �ϴ�ʧ��
                    alert(errorMessage[data.msg]);
                }
            });
        });
    }

    Design.getHTML = getHTML;
    Design.getModel = getModel;
    Design.add = add;
    Design.edit =edit;
    Design.upload = upload;

    $(function(){
        $.use('ui-colorbox', function(){
            $('.colorBox').colorbox({
                update: true,
                triggerType: 'focus',
                select:function(e,ui){
                    $(this).trigger('change');
                    setHistory('color');
                }
            });
        });

        $amMask     = $('#animate-set div.mask');
        $acMask     = $('#anchor-set div.mask');
        $container  = $('#in-design');
        $titu       = $('div.mod-titu', $container);
        $mainStage  = $('#content div.main-stage');
        $background = $('#content div.background');
        $animateSet = $('#animate-set');
        $anchorSet  = $('#anchor-set');
        $toolbox    = $('#toolbox');
        uploadUrl   = $('#dcms_upload_url').val();

        fullScreen();
    });

})(jQuery, FE.tools.design);