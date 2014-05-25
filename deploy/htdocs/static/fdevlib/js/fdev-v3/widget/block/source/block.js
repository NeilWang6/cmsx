/// <reference path="../../../core/fdev-min.js" />
/*
* @fileoverview ÕÚÕÖ¸¡²ãÐ§¹û
* @author Denis<danxia.shidx@alibaba-inc.com>
* @version 2.0.0
*/
;(function(w) {
    /**
    * @method FD.widget.block
    * @param {HTMLElement} el HTMLElement
    * @param {Object} opts ÅäÖÃ
    */
    w.block=function(el,opts) {
        install(el,opts);
    };
    /**
    * @method FD.widget.unblock
    * @param {Object} opts ÅäÖÃ
    */
    w.unblock=function(opts) {
        remove(opts);
    };
    w.block.defaults={
        css: {},
        overlayCSS: {
            backgroundColor: '#000',
            opacity: .3
        },
        baseZ: 10000,
        //when show iframe in ie6
        iframe: false,
        fixed: false,
        center: true,
        // allow body element to be stetched in ie6;
        allowBodyStretch: true,
        // be default blockUI will supress tab navigation from leaving blocking content;
        constrainTabKey: true,
        // disable if you don't want to show the overlay
        showOverlay: true,
        // if true, focus will be placed in the first available input field
        focusInput: true,
        focusIndex: 0,
        // suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
        applyPlatformOpacityRules: true,
        // callback method invoked when unblocking has completed;
        onUnblock: null
    };
    //»º´æ×´Ì¬
    w.block.cache={};

    var YEU=YAHOO.env.ua,
        ie6=YEU.ie==6,
        pageBlock=pageTop=pageLeft=null,
        focusIndex,
        pageBlockEls=[];

    function install(el,opts) {
        opts=FD.common.applyIf(opts||{},w.block.defaults);
        opts.css=FD.common.applyIf(opts.css||{},w.block.defaults.css);
        opts.overlayCSS=FD.common.applyIf(opts.overlayCSS||{},w.block.defaults.overlayCSS);

        // remove the current block (if there is one)
        if(pageBlock)
            remove();

        // if an existing element is being used as the blocking content then we capture
        // its current place in the DOM (and current display style) so we can restore
        // it when we unblock
        if(el.parentNode) {
            var data={};
            data.el=el;
            data.parent=el.parentNode;
            data.display=el.style.display;
            data.position=el.style.position;
            w.block.cache.history=data;
        }

        // blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
        // layer1 is the iframe layer which is used to supress bleed through of underlying content
        // layer2 is the overlay layer which has opacity
        // layer3 is the message content that is displayed while blocking
        var lyr1,lyr2,lyr3,z=opts.baseZ;

        if(ie6) {
            // IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
            // (hat tip to Jorge H. N. de Vasconcelos)
            var iframeSrc=/^https/i.test(window.location.href||'')?'javascript:false':'about:blank';
            if(opts.iframe) {
                lyr1=document.createElement('iframe');
                FYD.addClass(lyr1,'blockui');
                FYD.setStyle(lyr1,'z-index',z++);
                FYD.setStyle(lyr1,'display','none');
                FYD.setStyle(lyr1,'margin','0');
                FYD.setStyle(lyr1,'padding','0');
                FYD.setStyle(lyr1,'width','100%');
                FYD.setStyle(lyr1,'height','100%');
                FYD.setStyle(lyr1,'top','0');
                FYD.setStyle(lyr1,'left','0');
                FYD.setStyle(lyr1,'border','0 none');
                FYD.setAttribute(lyr1,'src',iframeSrc);
            }
        }
        if(opts.showOverlay) {
            lyr2=document.createElement('div');
            FYD.addClass(lyr2,'blockui');
            FYD.addClass(lyr2,'blockoverlay');
            FYD.setStyle(lyr2,'position','fixed');
            FYD.setStyle(lyr2,'z-index',z++);
            FYD.setStyle(lyr2,'display','none');
            FYD.setStyle(lyr2,'margin','0');
            FYD.setStyle(lyr2,'padding','0');
            FYD.setStyle(lyr2,'width','100%');
            FYD.setStyle(lyr2,'height',ie6?FYD.getDocumentHeight():'100%');
            FYD.setStyle(lyr2,'top','0');
            FYD.setStyle(lyr2,'left','0');
            FYD.setStyle(lyr2,'border','0 none');
        }
        lyr3=document.createElement('div');
        FYD.addClass(lyr3,'blockui');
        FYD.addClass(lyr3,'blockmsg');
        FYD.setStyle(lyr3,'z-index',z);
        FYD.setStyle(lyr3,'display','none');
        FYD.setStyle(lyr3,'position',(opts.fixed&&!ie6)?'fixed':'absolute');

        // if we have a message, style it
        for(prop in opts.css) FYD.setStyle(lyr3,prop,opts.css[prop]);



        // style the overlay
        if(lyr2&&!opts.applyPlatformOpacityRules||!(YEU.gecko>0&&/Linux/.test(navigator.platform)))
            for(prop in opts.overlayCSS) FYD.setStyle(lyr2,prop,opts.overlayCSS[prop]);

        // make iframe layer transparent in IE6
        if(lyr1)
            FYD.setStyle(lyr1,'opacity',0);

        if(lyr1) document.body.appendChild(lyr1);
        if(lyr2) document.body.appendChild(lyr2);
        if(0<YEU.ie&&YEU.ie<8) fixChecked(pageBlockEls);
        document.body.appendChild(lyr3);

        if(ie6) {
            // simulate fixed position
            FYD.batch([lyr1,lyr2,lyr3],function(lyr) {
                if(lyr) {
                    var s=lyr.style;
                    if(lyr==lyr1||lyr==lyr2) {
                        FYD.setStyle(lyr,'position','absolute');
                    } else if(lyr==lyr3&&!opts.center) {
                        s.top=(opts.css&&opts.css.top)?parseInt(opts.css.top):0;
                        s.left=(opts.css&&opts.css.left)?parseInt(opts.css.left):0;
                    }
                }
            });
            if(opts.fixed)
                FYE.on(window,'scroll',onScrollEventHandler,[lyr1,lyr2,lyr3],opts);
        }

        // show the message
        lyr3.appendChild(el);
        FYD.setStyle([lyr1,lyr2,lyr3,el],'display','block');

        //window resize
        FYE.on(window,'resize',onResizeHandler,[lyr1,lyr2,lyr3],opts);
        //auto centered
        onResizeHandler.call(opts,null,[lyr1,lyr2,lyr3]);
        // bind key events
        if(opts.constrainTabKey&&opts.showOverlay) bind(true);

        pageBlock=lyr3;
        pageBlockEls=FYS('input,textarea',lyr3).filter(function(node) { return (!node.disabled&&node.type!=='hidden'&&(node.offsetWidth>0||node.offsetHeight>0))?true:false; });
        if(opts.focusInput&&pageBlockEls.length) {
            focusIndex=opts.focusIndex;
            pageBlockEls[focusIndex].focus();
        }
        if(opts.onBlock) opts.onBlock();
    }
    // remove the block
    function remove(opts) {
		if(!pageBlock) return;
        FYE.removeListener(window,'resize',center);
        FYE.removeListener(window,'scroll',onScrollEventHandler);
        FYE.removeListener(window,'resize',onResizeHandler);
        opts=opts||{};
        bind(false,opts); // unbind events
        pageBlock=pageLeft=pageTop=null;
        pageBlockEls=[];
        var data=w.block.cache.history;
        if(0<YEU.ie&&YEU.ie<8) fixChecked(pageBlockEls);
        if(data) {
            data.el.style.display=data.display;
            data.el.style.position=data.position;
            if(data.parent)
                data.parent.appendChild(data.el);
            data=null;
        }
        var els=FYS('div.blockui,iframe.blockui');
        for(var i=0;i<els.length;i++) {
            if(els[i].parentNode)
                els[i].parentNode.removeChild(els[i]);
        }
        if(typeof opts.onUnblock=='function')
            opts.onUnblock();
    }
    // bind/unbind the handler
    function bind(b) {
        // don't bother unbinding if there is nothing to unbind
        if(!b&&!pageBlock) return;
        // bind anchors and inputs for mouse and key events
        b?FYE.addListener(document,'keydown',handler):$E.removeListener(document,'keydown',handler);

    }
    // event handler to suppress keyboard/mouse events when blocking
    function handler(e) {
        // allow tab navigation (conditionally)
        if(e.keyCode&&e.keyCode==9) {
            FYE.preventDefault(e);
            if(pageBlockEls.length) {
                e.shiftKey?focusIndex--:focusIndex++;
                if(e.shiftKey&&focusIndex<0) focusIndex=pageBlockEls.length-1;
                if(!e.shiftKey&&focusIndex==pageBlockEls.length) focusIndex=0;
                pageBlockEls[focusIndex].focus();
            }
        }
    }
    //resize handler
    function onResizeHandler(e,lyrs) {
        if(this.center)
            center.call(lyrs[2],null,this);
        if(ie6) {
            FYD.setStyle([lyrs[0],lyrs[1]],'width',FYD.getDocumentWidth()+'px');
            FYD.setStyle([lyrs[0],lyrs[1]],'height',FYD.getDocumentHeight()+'px');
        }
    }
    function onScrollEventHandler(e,lyrs) {
        var sTop=FYD.getDocumentScrollTop(),
            sLeft=FYD.getDocumentScrollLeft();
        FYD.setStyle(lyrs[2],'top',sTop+pageTop+'px');
        FYD.setStyle(lyrs[2],'left',sLeft+pageLeft+'px');
    }
    //make el centered
    function center(e,opts) {
        var region=FYD.getRegion(this);
        pageLeft=(FYD.getViewportWidth()-region.width)/2;
        pageTop=(FYD.getViewportHeight()-region.height)/2;
        var left=((opts.fixed&&!ie6)?0:FYD.getDocumentScrollLeft())+pageLeft,
            top=((opts.fixed&&!ie6)?0:FYD.getDocumentScrollTop())+pageTop;
        if(left<0) left=0;
        if(top<0) top=0;
        FYD.setStyle(this,'left',left+'px');
        FYD.setStyle(this,'top',top+'px');
    }
    //in IE6 IE7 radio or checkbox will reset when change dom place
    function fixChecked(els) {
        for(var i=0;i<els.length;i++) {
            if(els[i].type=='checkbox'||els[i].type=='radio')
                els[i].defaultChecked=els[i].checked;
        }
    }
})(FD.widget);
