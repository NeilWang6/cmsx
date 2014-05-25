/**
 * @author shanshan.hongss
 * @userfor templatesource codemirror
 * @date 2012-07-10
 */

;
(function($, D) {
	var readyFun = [
        function() {
            var href = window.location.href,isOpenCodeMirror=false,obj = {
				className:'',
				txt:''
			};
			
			
			if(href.indexOf('codemirror=true')!=-1){
				isOpenCodeMirror = true;
			}
			if(isOpenCodeMirror){
				obj.className = 'btn-codemirror-close';
				obj.txt = '�رմ��븻�ı��༭';
			}else{
				obj.className = 'btn-codemirror-open';
				obj.txt = '���ô��븻�ı��༭';
			}
			
			$('<a class="dcms-btn submit-btn btn-codemirror '+obj.className+'" href="#" target="_self" title="��꽹��۽��ڱ༭�򣬰�F11���У�����ȫ���༭����ESC,�˳�ȫ���༭">'+obj.txt+'</a>')
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
                .appendTo('.option-btns');
			
			
			if(!isOpenCodeMirror){
				return;
			}
            
            var pcontentId = document.getElementById("pcontent-id");
			if(!pcontentId) return;
			var editor = CodeMirror.fromTextArea(pcontentId, {
				lineNumbers : true,
				theme:"rubyblue",
				mode: "text/html", 
				tabMode: "indent",
				matchBrackets: true,
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
	$(function() {
		$.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch (e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':'
                            + e.message);
                }
            }
        });
	});

})(dcms, FE.dcms);
