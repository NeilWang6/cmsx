/**
* FD.widget.ComboBox
*
* 下拉模拟组件
* 限制：
* 		1、需要YUI库支持
* 		2、需要JSON转化支持
* 调用方法：
*		<script type="text/javascript">
*           var myComboBox=new FD.widget.ComboBox(...);
*		</script>
*
* @author 	Daniel Shi<swainet@126.com>
* @link     http://www.fdev-lib.cn/
* @version  1.0
* @version  1.1
*    BUGFIX 修复索引改变的顺序
*    UPDATE 汲取囧豪的建议，通过input框的focus和blur替代document的全局监控
*/
;(function (w) {
    var ComboBox=function (el,configs) {
        if(el&&el.nodeName=='SELECT') this.init(el,configs);
    },defaults={
        blankImgUrl: 'http://img.china.alibaba.com/images/common/util/1x1.gif',     //占位图片地址
        editable: false,            //文本框是否可编辑    
        disabled: false,
        maxHeight: 250,
        minHeight: 80,
        posFix: function () {
            if(YAHOO.env.ua.ie==6) this.topFix= -2;this.leftFix= -2;
        },
        zIndex: 15000
    },
    keyDownEventHandler=function (e) {
        switch(e.keyCode) {
            case 9:
            case 27:
                this.blur();
                break;
            case 13:
                FYE.preventDefault(e);
                this.setIndex(this._selectedIndex);
                this.blur();
                break;
            case 38:
                FYE.preventDefault(e);
                if(!this.hasExpand) this.expand();
                if(this._selectedIndex)
                    this.setIndex(this._selectedIndex-1);
                break;
            case 40:
                FYE.preventDefault(e);
                if(!this.hasExpand) this.expand();
                if(this._selectedIndex<this.options.length-1)
                    this.setIndex(this._selectedIndex+1);
                break;
        }
    },
    //    docMousedownEventHandler=function(e) {
    //        if(!FYD.isAncestor(this.comboWrap,FYE.getTarget(e)))
    //            this.collapse();
    //    },
    fireEventHandler=function (el,e) {
        if(window.ActiveXObject) {
            el.fireEvent('on'+e);
        } else {
            var evt=document.createEvent('HTMLEvents');
            evt.initEvent(e,true,true);
            el.dispatchEvent(evt);
        }
    };
    ComboBox.prototype={
        init: function (el,configs) {
            this.hasFocus=this.hasExpand=false;
            configs=configs||{};
            defaults=FD.common.applyIf(configs,defaults);
            this.topFix=this.leftFix=0;
            if(defaults.posFix) defaults.posFix.call(this);
            //data
            this.options=[];
            for(var i=0;i<el.options.length;i++) {
                var option={};
                option.value=el.options[i].value;
                option.text=el.options[i].text;
                this.options.push(option);
            }
            this.el=el;
            //comboWrap
            this.comboWrap=document.createElement('span');
            FYD.addClass(this.comboWrap,'combo-wrap');
            if(defaults.disabled) FYD.addClass(this.comboWrap,'combo-disabled');
            //comboText
            this.comboText=document.createElement('input');
            this.comboText.type='text';
            this.comboText.autocomplete='off';
            FYD.addClass(this.comboText,'combo-text');
            FYE.on(this.comboText,'focus',function (e,o) {
                if(defaults.disabled) return;
                o.focus(true);
            },this);
            FYE.on(this.comboText,'blur',function (e,o) {
                if(defaults.disabled) return;
                o.blur(true);
            },this);
            FYE.on(this.comboText,'keydown',keyDownEventHandler,null,this);
            if(defaults.disabled) this.comboText.disabled=true;
            if(defaults.editable) {
                //TODO: 
            } else {
                FYD.addClass(this.comboText,'combo-text-readonly');
                this.comboText.readOnly=true;
                //                FYE.on(this.comboText,'click',function() {
                //                    if(defaults.disabled) return;
                //                    if(this.hasExpand) this.collapse();
                //                    else this.expand();
                //                },null,this);
            }
            this.comboWrap.appendChild(this.comboText);
            //comboTrigger
            this.comboTrigger=new Image();
            this.comboTrigger.src=defaults.blankImgUrl;
            FYD.addClass(this.comboTrigger,'combo-trigger');
            FYE.on(this.comboTrigger,'mouseover',function (e) {
                if(defaults.disabled) return;
                FYD.addClass(this,'combo-trigger-hover');
            });
            FYE.on(this.comboTrigger,'mouseout',function (e) {
                if(defaults.disabled) return;
                FYD.removeClass(this,'combo-trigger-hover');
            });
            //            function onMouseupEventHandler() {
            //                FYD.removeClass(this.comboTrigger,'combo-trigger-click');
            //                FYE.removeListener(document,'mouseup',onMouseupEventHandler);
            //            }
            FYE.on(this.comboTrigger,'mousedown',function () {
                if(defaults.disabled) return;
                //FYE.on(document,'mouseup',onMouseupEventHandler,null,o);
                FYD.addClass(this,'combo-trigger-click');
            });
            FYE.on(this.comboTrigger,'click',function (e,o) {
                if(defaults.disabled) return;
                FYD.removeClass(this,'combo-trigger-click');
                //FYE.on(document,'mouseup',onMouseupEventHandler,null,o);
                //FYD.addClass(this,'combo-trigger-click');
                //if(o.hasExpand) 
                //o.blur();
                //else 
                o.focus();
            },this);
            this.comboWrap.appendChild(this.comboTrigger);
            this.el.parentNode.insertBefore(this.comboWrap,this.el);
            //init selection
            this.setIndex(this.el.selectedIndex);
            FYD.setStyle(this.el,'display','none');
            //            document.body.appendChild(this.el);
            //            FYD.setStyle(this.el,'position','absolute');
            //            FYD.setStyle(this.el,'left','-10000px');
            //            FYD.setStyle(this.el,'top','-10000px');
        },
        focus: function (mark) {
            if(this.hasFocus) return;
            this.hasFocus=true;
            FYD.addClass(this.comboWrap,'combo-wrapfocus');
            if(!mark) this.comboText.focus();
            this.expand();
            //            if(this.options.length)
            //                FYE.on(document,'keydown',keyDownEventHandler,null,this);
        },
        blur: function (mark) {
            if(!this.hasFocus) return;
            this.hasFocus=false;
            FYD.removeClass(this.comboWrap,'combo-wrapfocus');
            if(!mark) this.comboText.blur();
            this.collapse();
            //FYE.removeListener(document,'mousedown',this.blur);
            //            if(this.options.length)
            //                FYE.removeListener(document,'keydown',keyDownEventHandler);
        },
        disable: function () {
            defaults.disabled=true;
            this.comboText.disabled=true;
            FYD.addClass(this.comboWrap,'combo-disabled');
        },
        enable: function () {
            if(this.hasExpand) this.blur();
            defaults.disabled=false;
            this.comboText.disabled=false;
            FYD.removeClass(this.comboWrap,'combo-disabled');
        },
        scrollTo: function (i) {
            if((i+1)*this.itemHeight>this.comboListHeight+this.comboList.scrollTop)
                this.comboList.scrollTop=(i+1)*this.itemHeight-this.comboListHeight;
            else if(this.comboList.scrollTop>i*this.itemHeight)
                this.comboList.scrollTop=i*this.itemHeight;
        },
        setIndex: function (i) {
            if(i<0) i=0;
            else if(i>=this.options.length) i=this.options.length-1;
            if(this.hasExpand) this.setSelected(i);
            if(this.selectedIndex==i) return;
            if(this.el.selectedIndex!=i) {
                this.el.selectedIndex=i;
                fireEventHandler(this.el,'change');
            }
            this.selectedIndex=i;
            this.value=this.options[i].value;
            this.comboText.value=this.options[i].text;
        },
        setSelected: function (i) {
            if(this._selectedIndex==i) return;
            this._selectedIndex=i;
            this.scrollTo(i);
            FYD.removeClass(this.comboItems,'combo-selected');
            FYD.addClass(this.comboItems[i],'combo-selected');
        },
        reset: function () {
            this.collapse();
            //data
            this.options=[];
            for(var i=0;i<this.el.options.length;i++) {
                var option={};
                option.value=this.el.options[i].value;
                option.text=this.el.options[i].text;
                this.options.push(option);
            }
            this.setItems();
            this.setIndex(this.el.selectedIndex);
        },
        setItems: function () {
            var listHTML='';
            for(var i=0;i<this.options.length;i++) {
                listHTML+='<div class="combo-list-item" title="'+FD.common.escapeHTML(this.options[i].text)+'">'+FD.common.escapeHTML(this.options[i].text)+'</div>';
            }
            this.comboList.innerHTML=listHTML;
            this.comboItems=FYS('>div.combo-list-item',this.comboList);
            if(this.options.length) this.itemHeight=FYD.getRegion(this.comboItems[0]).height;
            FYE.on(this.comboItems,'mouseover',function (e,o) {
                FYD.removeClass(o.comboItems,'combo-selected');
                FYD.addClass(this,'combo-selected');
                o._selectedIndex=o.comboItems.indexOf(this);
            },this);
            FYE.on(this.comboItems,'mousedown',function (e,o) {
                var index=o.comboItems.indexOf(this);
                o.setIndex(index);
                //o.collapse();
            },this);
        },
        expand: function () {
            if(!this.comboListWrap) {
                //comboListWrap
                this.comboListWrap=document.createElement('div');
                FYD.setStyle(this.comboListWrap,'visibility','hidden');
                FYD.addClass(this.comboListWrap,'combo-list-wrap');
                FYD.setStyle(this.comboListWrap,'position','absolute');
                FYD.setStyle(this.comboListWrap,'top','-10000px');
                FYD.setStyle(this.comboListWrap,'left','-10000px');
                FYD.setStyle(this.comboListWrap,'z-Index',defaults.zIndex);
                FYE.on(this.comboListWrap,'mousedown',function (e) { FYE.stopPropagation(e); });
                FYE.on(this.comboListWrap,'scroll',function (e) { FYE.stopPropagation(e);FYE.preventDefault(e); });
                document.body.appendChild(this.comboListWrap);
                this.comboList=document.createElement('div');
                FYD.addClass(this.comboList,'combo-list');
                this.comboListWrap.appendChild(this.comboList);
                this.setItems();
            }
            if(this.hasExpand) return;
            this.hasExpand=true;
            FYD.setStyle(this.comboListWrap,'top','-10000px');
            FYD.setStyle(this.comboListWrap,'left','-10000px');
            FYD.setStyle(this.comboListWrap,'visibility','visible');
            FYD.setStyle(this.comboList,'height','');
            var comboWrapRegion=FYD.getRegion(this.comboWrap),
                comboListRegion=FYD.getRegion(this.comboListWrap),
                viewHeight=FYD.getViewportHeight(),
                docScrollTop=FYD.getDocumentScrollTop(),
                height=comboListRegion.height;
            FYD.setStyle(this.comboListWrap,'left',comboWrapRegion.left+this.leftFix+'px');
            FYD.setStyle(this.comboListWrap,'width',comboWrapRegion.width+'px');
            if(height>defaults.maxHeight) height=defaults.maxHeight;
            if(comboWrapRegion.top+comboWrapRegion.height+height<docScrollTop+viewHeight) {
                //reset list height
                FYD.setStyle(this.comboList,'height',height-2+'px');
                //reset list top
                FYD.setStyle(this.comboListWrap,'top',comboWrapRegion.top+comboWrapRegion.height+this.topFix+'px');
            } else {
                if(comboWrapRegion.top-height>docScrollTop) {
                    //reset list height
                    FYD.setStyle(this.comboList,'height',height-2+'px');
                    FYD.setStyle(this.comboListWrap,'top',comboWrapRegion.top-height+this.topFix+'px');
                } else {
                    if(comboWrapRegion.top+comboWrapRegion.height*2<docScrollTop+viewHeight) {
                        if(height>defaults.minHeight) {
                            height=docScrollTop+viewHeight-(comboWrapRegion.top+comboWrapRegion.height);
                            if(height<defaults.minHeight)
                                height=defaults.minHeight;
                        }
                        FYD.setStyle(this.comboList,'height',height-2+'px');
                        FYD.setStyle(this.comboListWrap,'top',comboWrapRegion.top+comboWrapRegion.height+this.topFix+'px');
                    } else {
                        if(height>defaults.minHeight) {
                            height=comboWrapRegion.top-docScrollTop;
                            if(height<defaults.minHeight)
                                height=defaults.minHeight;
                        }
                        FYD.setStyle(this.comboList,'height',height-2+'px');
                        FYD.setStyle(this.comboListWrap,'top',comboWrapRegion.top-height+this.topFix+'px');
                    }
                }
            }
            this.comboListHeight=height-2;
            if(this.selectedIndex!=null)
                this.setSelected(this.selectedIndex);
            //FYE.on(document,'mousedown',docMousedownEventHandler,null,this);
        },
        collapse: function () {
            if(!this.hasExpand) return;
            this.hasExpand=false;
            FYD.setStyle(this.comboListWrap,'visibility','hidden');
            //FYE.removeListener(document,'mousedown',docMousedownEventHandler);
        }
    };
    w.ComboBox=ComboBox;
})(FD.widget);