jQuery.namespace("FSH");(function(i,w){var f={pageUrl:0,autoShow:0,position:{right:3,top:100},searchUrl:0,contentUrl:"",sceneId:1};var t=false;var x="cn-help-aniu";var z="full-site-help";var s=["tracelog=helpanywhere_aniu_","open","close","read","search","show"];var o=null;var q=null;var c=null;var v=function(){i.loadCSS("http://style.c.aliimg.com/sys/css/side/full-site-help/cn-help-min.css",function(){C();g();if(f.autoShow){callback=null;if(f.autoShow>0){callback=function(){o=setTimeout(function(){l()},f.autoShow*1000)}}j(callback)}})};var C=function(){i("body").append('<a id="'+x+'" class="cn-help-aniu" href="javascript:;"></a>');if(f.position){i("#"+x).css(f.position)}var e='<div class="full-site-help" id="full-site-help">'+'<div class="FSH-header">�����ܹ��ĵ����ʣ�<a href="javascript:;" id="FSH-close" class="FSH-close" title="�ر�">X</a></div>'+'<div class="FSH-body fd-clr" id="FSH-body">'+'<div class="scrollbar"><div class="track"><div class="thumb"><div class="prev-end"></div><div class="next-end"></div></div></div></div>'+'<div class="viewport"><div class="overview FSH-content" id="FSH-content"></div></div>'+"</div>"+'<div class="FSH-footer"><dl class="FSH-ask-aniu">'+'<dt>�һ�����</dt><dd class="fd-clr">'+'<input id="FSH-aniu-input" value="��������������" class="FSH-aniu-input default-tip fd-left"/>'+'<a href="javascript:;" class="go-search fd-left" id="go-ask-search"></a>'+"</dd></dl></div></div>";i("body").append(e)};var g=function(){i("#"+x).click(function(){if(!t||q.css("display")=="none"){n(1)}j();return false});i("#FSH-close").click(function(){n(2);l();return false});i(window).resize(function(){u()});if(i.util.ua.ie6){i(window).scroll(function(){var e=f.position.top+m();i("#"+x).css("top",e)})}i("#full-site-help").click(function(){if(o){clearTimeout(o)}})};var j=function(e){if(t){if(q.css("display")=="none"){q.show()}}else{r(e);B()}n(5)};var l=function(){if(t){q.hide()}};var u=function(){if(t){var D=i("#"+x).position();if(i.util.ua.ie6){var e=document.body.clientWidth-304-f.position.right;q.css("left",e);i(window).scroll(function(){q.css("left",e)})}else{q.css("left",D.left-264)}}};var m=function(){return document.documentElement.scrollTop||document.body.scrollTop};var r=function(D){var e=i("#"+x).position();i.use("ui-draggable, ui-dialog",function(){i("#"+z).dialog({modal:false,fixed:true,css:{width:255,left:e.left-264,top:f.position.top},draggable:{handle:"div.FSH-header"},show:{effect:"blind",duration:1000},open:function(){b(f.contentUrl,"help",k);if(D){D()}}});q=i("#"+z).parent(".ui-dialog")})};var B=function(){var e="FSH-aniu-input";i.use("ui-autocomplete",function(){i("#"+e).autocomplete({position:{my:"left bottom",at:"left top"},focus:function(D,E){i("#"+e).val(E.item.value);return false},source:function(E,D){i.ajax({url:"http://baike.1688.com/user/service/kefuSuggest.html",dataType:"script",scriptCharset:"gbk",data:i.paramSpecial({type:"saleoffe",q:E.term}),success:function(){var F=window["_suggest_result_"].result||[];var H=new RegExp(i.ui.autocomplete.escapeRegex(E.term),"gi");var G=i.map(F,function(J,I){if(I>4){return}if(I==4){return{label:"",value:"",index:I}}else{return{label:J[0].replace(H,function(K){return"<em>"+K+"</em>"}),value:J[0],index:I}}});D(G)}})},select:function(E,F){var D=F.item.index;if(D===4){A("");return false}else{A(F.item.value)}}}).data("autocomplete")._renderItem=function(D,E){if(E.index<4){return i("<li></li>").data("item.autocomplete",E).append("<a href='javascript:;'>"+E.label+"</a>").appendTo(D)}else{return i("<li></li>").data("item.autocomplete",E).append("<a class='more' href='javascript:;'>����������� ></a>").appendTo(D)}};c=i("#"+e).parent(".ui-autocomplete")});i("#"+e).focus(function(){if(i(this).hasClass("default-tip")){i(this).val("");i(this).removeClass("default-tip")}}).blur(function(){if(i(this).val()===""){i(this).val("��������������");i(this).addClass("default-tip")}}).keydown(function(D){if(D.which==13){var E=i.trim(i(this).val());return A(E)}});i("#go-ask-search").click(function(D){D.preventDefault();var E=(i("#"+e).hasClass("default-tip"))?"":i.trim(i("#"+e).val());A(E)})};var A=function(E){var D=f.searchUrl;if(E!=""){D=D+encodeURIComponent("&question="+encodeURIComponent(E))}var e="http://exodus.1688.com/member/sso/sso.do?to_url="+D+"&unlogin_url="+D;window.open(e,"newwindow");n(4);return false};var b=function(e,D,E){i.ajax({url:e,dataType:"script",scriptCharset:"gbk",success:function(){var F=(D=="config")?window["_fsh_config_result_"]:window["_fsh_help_data_result_"];try{E(F)}catch(G){h()}}})};var k=function(e){i.ajax({url:"http://style.c.aliimg.com/sys/js/side/full-site-help/jquery.tinyscrollbar.min.js",dataType:"script",success:function(){i.use("web-sweet",function(){var D="<% for ( var i = 0; i < $data.length; i++ ) { %>"+'<dl><dt class="FSH-question<% if(i == 0){ %> FSH-question-first<% } %> FSH-accordion-head fd-clr" qid="<%= $data[i].questionId %>"><span class="arrow arrow-right"></span><a href="javascript:;"><%= $data[i].question %></a></dt>'+'<dd class="FSH-answer FSH-accordion-body"><div class="FSH-answer-triangle"></div><div class="FSH-answer-content"><%= $data[i].answer %></div></dd>'+"</dl>"+"<% } %>";
var E=FE.util.sweet(D).applyData(e);i("#FSH-content").html(E);a();t=true})}})};var p=function(){var e="http://view.1688.com/cms/services/fullsitehelp/config.html";b(e,"config",d)};var d=function(G){var F=0,e=G.length;var E=location.href,D=null;for(;F<e;F++){if(E.indexOf(G[F].pageUrl)!=-1){D=G[F];break}}if(D){i.extend(f,D);v()}};var a=function(){var e=i("#FSH-body").tinyscrollbar();var D=function(){e.tinyscrollbar_update()};var E=i(".FSH-accordion-head");E.click(function(G){G.preventDefault();if(!i(this).hasClass("active")){var F=i(this);var H=i(this).attr("qid");n(3,H);i(".FSH-accordion-body").slideUp("normal");E.removeClass("active");E.find(".arrow").removeClass("arrow-down").addClass("arrow-right");i(this).addClass("active");i(this).find(".arrow").removeClass("arrow-right").addClass("arrow-down");i(this).next().stop(true,true).slideToggle("normal",D)}else{i(this).next().slideToggle("normal",D);i(this).removeClass("active");i(this).find(".arrow").removeClass("arrow-down").addClass("arrow-right")}});i(".FSH-question").on("mouseenter",function(){i(this).addClass("FSH-question-hover")}).on("mouseleave",function(){i(this).removeClass("FSH-question-hover")})};var n=function(e,E){var D=s[0]+s[e]+"_"+f.sceneId;if(E){D+="_"+E}if(typeof dmtrack!="undefined"){dmtrack&&dmtrack.clickstat("http://stat.1688.com/tracelog/click.html",D)}};var h=function(){i("#"+x)&&i("#"+x).remove();q&&q.remove();c&&c.remove()};w.init=function(e){p()};try{w.init()}catch(y){h()}})(jQuery,FSH);