(function(a){var d=function(f,g){if(f&&f.nodeName=="SELECT"){this.init(f,g)}},c={blankImgUrl:"http://img.china.alibaba.com/images/common/util/1x1.gif",editable:false,disabled:false,maxHeight:250,minHeight:80,posFix:function(){if(YAHOO.env.ua.ie==6){this.topFix=-2}this.leftFix=-2},zIndex:15000},e=function(f){switch(f.keyCode){case 9:case 27:this.blur();break;case 13:FYE.preventDefault(f);this.setIndex(this._selectedIndex);this.blur();break;case 38:FYE.preventDefault(f);if(!this.hasExpand){this.expand()}if(this._selectedIndex){this.setIndex(this._selectedIndex-1)}break;case 40:FYE.preventDefault(f);if(!this.hasExpand){this.expand()}if(this._selectedIndex<this.options.length-1){this.setIndex(this._selectedIndex+1)}break}},b=function(g,h){if(window.ActiveXObject){g.fireEvent("on"+h)}else{var f=document.createEvent("HTMLEvents");f.initEvent(h,true,true);g.dispatchEvent(f)}};d.prototype={init:function(h,j){this.hasFocus=this.hasExpand=false;j=j||{};c=FD.common.applyIf(j,c);this.topFix=this.leftFix=0;if(c.posFix){c.posFix.call(this)}this.options=[];for(var f=0;f<h.options.length;f++){var g={};g.value=h.options[f].value;g.text=h.options[f].text;this.options.push(g)}this.el=h;this.comboWrap=document.createElement("span");FYD.addClass(this.comboWrap,"combo-wrap");if(c.disabled){FYD.addClass(this.comboWrap,"combo-disabled")}this.comboText=document.createElement("input");this.comboText.type="text";this.comboText.autocomplete="off";FYD.addClass(this.comboText,"combo-text");FYE.on(this.comboText,"focus",function(i,k){if(c.disabled){return}k.focus(true)},this);FYE.on(this.comboText,"blur",function(i,k){if(c.disabled){return}k.blur(true)},this);FYE.on(this.comboText,"keydown",e,null,this);if(c.disabled){this.comboText.disabled=true}if(c.editable){}else{FYD.addClass(this.comboText,"combo-text-readonly");this.comboText.readOnly=true}this.comboWrap.appendChild(this.comboText);this.comboTrigger=new Image();this.comboTrigger.src=c.blankImgUrl;FYD.addClass(this.comboTrigger,"combo-trigger");FYE.on(this.comboTrigger,"mouseover",function(i){if(c.disabled){return}FYD.addClass(this,"combo-trigger-hover")});FYE.on(this.comboTrigger,"mouseout",function(i){if(c.disabled){return}FYD.removeClass(this,"combo-trigger-hover")});FYE.on(this.comboTrigger,"mousedown",function(){if(c.disabled){return}FYD.addClass(this,"combo-trigger-click")});FYE.on(this.comboTrigger,"click",function(i,k){if(c.disabled){return}FYD.removeClass(this,"combo-trigger-click");k.focus()},this);this.comboWrap.appendChild(this.comboTrigger);this.el.parentNode.insertBefore(this.comboWrap,this.el);this.setIndex(this.el.selectedIndex);FYD.setStyle(this.el,"display","none")},focus:function(f){if(this.hasFocus){return}this.hasFocus=true;FYD.addClass(this.comboWrap,"combo-wrapfocus");if(!f){this.comboText.focus()}this.expand()},blur:function(f){if(!this.hasFocus){return}this.hasFocus=false;FYD.removeClass(this.comboWrap,"combo-wrapfocus");if(!f){this.comboText.blur()}this.collapse()},disable:function(){c.disabled=true;this.comboText.disabled=true;FYD.addClass(this.comboWrap,"combo-disabled")},enable:function(){if(this.hasExpand){this.blur()}c.disabled=false;this.comboText.disabled=false;FYD.removeClass(this.comboWrap,"combo-disabled")},scrollTo:function(f){if((f+1)*this.itemHeight>this.comboListHeight+this.comboList.scrollTop){this.comboList.scrollTop=(f+1)*this.itemHeight-this.comboListHeight}else{if(this.comboList.scrollTop>f*this.itemHeight){this.comboList.scrollTop=f*this.itemHeight}}},setIndex:function(f){if(f<0){f=0}else{if(f>=this.options.length){f=this.options.length-1}}if(this.hasExpand){this.setSelected(f)}if(this.selectedIndex==f){return}if(this.el.selectedIndex!=f){this.el.selectedIndex=f;b(this.el,"change")}this.selectedIndex=f;this.value=this.options[f].value;this.comboText.value=this.options[f].text},setSelected:function(f){if(this._selectedIndex==f){return}this._selectedIndex=f;this.scrollTo(f);FYD.removeClass(this.comboItems,"combo-selected");FYD.addClass(this.comboItems[f],"combo-selected")},reset:function(){this.collapse();this.options=[];for(var f=0;f<this.el.options.length;f++){var g={};g.value=this.el.options[f].value;g.text=this.el.options[f].text;this.options.push(g)}this.setItems();this.setIndex(this.el.selectedIndex)},setItems:function(){var f="";for(var g=0;g<this.options.length;g++){f+='<div class="combo-list-item" title="'+FD.common.escapeHTML(this.options[g].text)+'">'+FD.common.escapeHTML(this.options[g].text)+"</div>"}this.comboList.innerHTML=f;this.comboItems=FYS(">div.combo-list-item",this.comboList);if(this.options.length){this.itemHeight=FYD.getRegion(this.comboItems[0]).height}FYE.on(this.comboItems,"mouseover",function(h,i){FYD.removeClass(i.comboItems,"combo-selected");FYD.addClass(this,"combo-selected");i._selectedIndex=i.comboItems.indexOf(this)},this);FYE.on(this.comboItems,"mousedown",function(i,j){var h=j.comboItems.indexOf(this);j.setIndex(h)},this)},expand:function(){if(!this.comboListWrap){this.comboListWrap=document.createElement("div");FYD.setStyle(this.comboListWrap,"visibility","hidden");FYD.addClass(this.comboListWrap,"combo-list-wrap");FYD.setStyle(this.comboListWrap,"position","absolute");FYD.setStyle(this.comboListWrap,"top","-10000px");FYD.setStyle(this.comboListWrap,"left","-10000px");FYD.setStyle(this.comboListWrap,"z-Index",c.zIndex);FYE.on(this.comboListWrap,"mousedown",function(k){FYE.stopPropagation(k)});FYE.on(this.comboListWrap,"scroll",function(k){FYE.stopPropagation(k);FYE.preventDefault(k)});document.body.appendChild(this.comboListWrap);this.comboList=document.createElement("div");FYD.addClass(this.comboList,"combo-list");this.comboListWrap.appendChild(this.comboList);this.setItems()}if(this.hasExpand){return}this.hasExpand=true;FYD.setStyle(this.comboListWrap,"top","-10000px");FYD.setStyle(this.comboListWrap,"left","-10000px");FYD.setStyle(this.comboListWrap,"visibility","visible");FYD.setStyle(this.comboList,"height","");var i=FYD.getRegion(this.comboWrap),j=FYD.getRegion(this.comboListWrap),h=FYD.getViewportHeight(),g=FYD.getDocumentScrollTop(),f=j.height;FYD.setStyle(this.comboListWrap,"left",i.left+this.leftFix+"px");FYD.setStyle(this.comboListWrap,"width",i.width+"px");if(f>c.maxHeight){f=c.maxHeight}if(i.top+i.height+f<g+h){FYD.setStyle(this.comboList,"height",f-2+"px");FYD.setStyle(this.comboListWrap,"top",i.top+i.height+this.topFix+"px")}else{if(i.top-f>g){FYD.setStyle(this.comboList,"height",f-2+"px");FYD.setStyle(this.comboListWrap,"top",i.top-f+this.topFix+"px")}else{if(i.top+i.height*2<g+h){if(f>c.minHeight){f=g+h-(i.top+i.height);if(f<c.minHeight){f=c.minHeight}}FYD.setStyle(this.comboList,"height",f-2+"px");FYD.setStyle(this.comboListWrap,"top",i.top+i.height+this.topFix+"px")}else{if(f>c.minHeight){f=i.top-g;if(f<c.minHeight){f=c.minHeight}}FYD.setStyle(this.comboList,"height",f-2+"px");FYD.setStyle(this.comboListWrap,"top",i.top-f+this.topFix+"px")}}}this.comboListHeight=f-2;if(this.selectedIndex!=null){this.setSelected(this.selectedIndex)}},collapse:function(){if(!this.hasExpand){return}this.hasExpand=false;FYD.setStyle(this.comboListWrap,"visibility","hidden")}};a.ComboBox=d})(FD.widget);