/**
 * @package FD.app.cms.page.edit
 * @author: hongss
 * @Date: 2011-09-26
 */

 ;(function($, D){
    var form = $('#js-edit-page-content'),
    readyFun = [
        /**
         * 各种提交表单
         */
        function(){
            var createNotExists = $('#js-create-not-exists');
            $('#js-save-continue').click(function(e){
                createNotExists.val(1);
                form.submit();
            });
            $('#js-create-and-save').click(function(e){
                createNotExists.val(2);
                form.submit();
            });
            
        },
        /*
         * 离开页面时触发的事件
         */
        function(){
            var isChecked = $('#js-is-checked').val();
            $(window).bind('beforeunload', function(){
                if (isChecked==='true'){
                    return '当前页面尚未保存！确认离开吗？';
                } else {
                    return;
                }
            });
            $('#js-save-edit').click(function(){
                $(window).unbind('beforeunload');
                form.submit();
            });
        },

        /*
         * fdlint
         */
        function(){
            $('<a type="button" class="dcms-btn submit-btn btn-fdlint" href="#" target="_self">检查语法(beta)</a>')
                .click(function(e){
						e.preventDefault();
                        D.fdlint();
                    })
                .appendTo('.operating-area');
        },
		function(){
		
			var href = window.location.href,isOpenCodeMirror=false,obj = {
				className:'',
				txt:''
			};
			
			
			if(href.indexOf('codemirror=true')!=-1){
				isOpenCodeMirror = true;
			}
			if(isOpenCodeMirror){
				obj.className = 'btn-codemirror-close';
				obj.txt = '关闭代码富文本编辑';
			}else{
				obj.className = 'btn-codemirror-open';
				obj.txt = '启用代码富文本编辑';
			}
			
			/*$('<a type="button" class="dcms-btn submit-btn btn-codemirror '+obj.className+'" href="#" target="_self" title="鼠标焦点聚焦在编辑框，按F11进行，进行全屏编辑，按ESC,退出全屏编辑"><i class="code-tips"></i>'+obj.txt+'</a>')
                .click(function(e){
						e.preventDefault();
						if($(this).hasClass('btn-codemirror-open')){
							if(href.indexOf('?')!=-1){
								window.location.href = href + '&codemirror=true';
							}else{
								window.location.href = href + '?codemirror=true';
							}
						}else{
							window.location.href = href.replace(/[&\?]codemirror=true/g,'');
						}
						window.reload();
                    })
                .appendTo('.operating-area');*/
			
			//$('<span class="code-tips">新功能上线马上来体验下</span>').appendTo('.operating-area');
			if(!isOpenCodeMirror){
				//return;
			}
			var links = $('.operating-area a','#js-edit-page-content'),link;
			
			if(links.length>0){
				link = $(links[0]);
				if(link&&link.html()=='我要修改'){
					link.attr('href',link.attr('href')+'&codemirror=true');
				}
			}
			
			
			var pcontentId = document.getElementById("pcontent-id");
			
			var isReadOnly = window.location.href.indexOf("checkout=true")==-1;
			
			if(!pcontentId) return;
			var editor = CodeMirror.fromTextArea(pcontentId, {
				lineNumbers : true,
				theme:"rubyblue",
				mode: "text/html", 
				tabMode: "indent",
				matchBrackets: true,
				lineWrapping:true,
				readOnly:isReadOnly,
				onCursorActivity: function() {
					editor.matchHighlight("CodeMirror-matchhighlight");
				},
				extraKeys: {
					"F11": function() {
					  var scroller = editor.getScrollerElement();
					  if (scroller.className.search(/\bCodeMirror-fullscreen\b/) === -1) {
						scroller.className += " CodeMirror-fullscreen";
						scroller.style.height = "100%";
						scroller.style.width = "100%";
						editor.refresh();
					  } else {
						scroller.className = scroller.className.replace(" CodeMirror-fullscreen", "");
						scroller.style.height = '';
						scroller.style.width = '';
						editor.refresh();
					  }
					},
					"Esc": function() {
					  var scroller = editor.getScrollerElement();
					  if (scroller.className.search(/\bCodeMirror-fullscreen\b/) !== -1) {
						scroller.className = scroller.className.replace(" CodeMirror-fullscreen", "");
						scroller.style.height = '';
						scroller.style.width = '';
						editor.refresh();
					  }
					}
				}
			});
		}
    ];
     
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
    
 })(dcms, FE.dcms);
