/**
 * @package FD.app.cms.copytemplate
 * @author: arcthur.cheny
 * @Date: 2011-09-21
 * modify by hongss on 2011.10.08 for valid checkEditorIsNotExist and checkAssessorIsNotExist
 */

;(function($, D){
    var checkFlag = false,
        editorFlag = false,
        tag = $('#assessorTag'),
        assessorKey = $('#assessorKey'),

    myValid = new FE.ui.Valid($('.dcms-form .need-verify'), {
        onValid: function (res, o) {
            var tip = $(this).nextAll('.dcms-validator-tip'),
                msg;
            if (res === 'pass') {
                tip.removeClass('dcms-validator-error');
            } else {
                switch (res) {
                case 'required':
                    msg = o.key + '必需填写';
                    break;
                }
                tip.html(msg);
                tip.addClass('dcms-validator-error');
            }
        }
    }),

    //检查审核用户提示信息
    assessorInfo = function (content) {
        $('#assessorTag').css('color', 'red').html(content);
    },

    editorInfo = function (content) {
        $('#editorTag').css('color', 'red').html(content);
    },

    checkAssessorIsNotExist = function (inputUsersObj,permission, callback) {
        var userStrings = inputUsersObj.val(),
            url = D.domain + '/page/check_user.html?users=' + userStrings + '&permission=' + permission;

        if( userStrings === '' || assessorKey.val() !== 'true'){
            checkFlag = true;
            assessorInfo('');

            execCallback(callback, this);
        } else {
            $.ajax({
                url: url,
                type: 'POST'
            }).success(function(checkUser) {
                if (!! checkUser) {
                    if( checkUser !== "ok" ){
                        checkFlag = false;
                        assessorInfo("用户[" + checkUser + "]不存在或权限不够,请将其删除");
                    } else {
                        checkFlag = true;
                        assessorInfo('');
                    }
                } else {
                    checkFlag = false;
                }
                execCallback(callback, this);
            });
        }
    },

    checkEditorIsNotExist = function (inputUsersObj,permission, callback) {
        var userStrings = inputUsersObj.val(),
            url = D.domain + '/page/check_user.html?users=' + userStrings + '&permission=' + permission;

        if( userStrings === ''){
            editorFlag = true;
            editorInfo('');

            execCallback(callback, this);
        } else {
            $.ajax({
                url: url,
                type: 'POST'
            }).success(function(checkUser) {
                if (!! checkUser) {
                    if( checkUser !== "ok" ){
                        editorFlag = false;
                        editorInfo("用户[" + checkUser + "]不存在或权限不够,请将其删除");
                    } else {
                        editorFlag = true;
                        editorInfo('');
                    }
                } else {
                    editorFlag = false;
                }
                execCallback(callback, this);
            });
        }
    };

    function execCallback(callback, self){
        if (callback && $.isFunction(callback)===true){
            callback.call(self);
        }
    }

    function checkEditAssess(){
        if ( editorFlag && checkFlag ) {
            $('#templateForm').submit();
        } /*else {
            if( !editorFlag ) {
                alert("请检查编辑用户是否正确");
                return;
            }

            if( !checkFlag ){
                alert("请检查审核用户是否正确");
                return;
            }
        }*/
    }

    var readyFun = [
        function() {
            $('#save-btn').click(function(e){
                e.preventDefault();

                checkEditorIsNotExist($('#editor'), '', function(){
                    checkEditAssess();
                });

                checkAssessorIsNotExist($('#assessor'), '', function(){
                    checkEditAssess();
                });


            });

            $('#templateForm').submit(function(){
				if(D.editor){
					D.editor.save();
				}
                return myValid.valid();
            });
        },
        function() {
            // active template
            $('#active-btn').click(function(e){
                e.preventDefault();

                var templateId = $(this).data('tpid');

                if( window.confirm("确实要激活该模板吗？") ){
                    window.location.href= D.domain + '/page/edit_template.html?action=TemplateManagerAction&event_submit_do_active=true&templateId=' + templateId;
                }
            });

            // disable template
            $('#disable-btn').click(function(e){
                e.preventDefault();

                var templateId = $(this).data('tpid');

                if(window.confirm("确实要禁用该模板吗？")){
                    window.location.href = D.domain + '/page/edit_template.html?action=TemplateManagerAction&event_submit_do_disable=true&templateId=' + templateId;
                }
            });

            // cancel template
            $('#cancel-btn').click(function(e){
                e.preventDefault();

                var templateId = $(this).data('tpid');

                window.location.href = D.domain + '/page/edit_template.html?action=TemplateManagerAction&event_submit_do_cancle=true&templateId=' + templateId;
            });

            // edit template
            $('#modified-btn').click(function(e){
                e.preventDefault();

                var templateId = $(this).data('tpid');

                window.location.href = D.domain + '/page/edit_template.html?templateId=' + templateId + "&checkout=true";
                $('textarea').attr('readonly', 'false');
            });

            // unlock button
            $('#unlock-btn').click(function(e) {
                e.preventDefault();

                var templateId = $(this).data('tpid');

                window.location.href = D.domain + '/page/edit_template.html?action=TemplateManagerAction&event_submit_do_unlock=true&templateId=' + templateId;
            });
        },
        function() {
            $('#editor').blur(function(){
                checkEditorIsNotExist($(this), '');
            });

            $('#assessor').blur(function(){
                checkAssessorIsNotExist($(this), '');
            });
        },
        function(){
            //D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
            var categoryIdEl = $('#selCategoryId'),
				categoryEl = $('#selcategoryName'),
				popTree = new D.PopTree({
					modify: function(){
						myValid.valid(categoryEl);
					}
				});

            popTree.show(categoryEl, categoryEl, categoryIdEl, false);
            categoryEl.click(function(){
                popTree.show(categoryEl, categoryEl, categoryIdEl);
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

			/*var href = window.location.href,isOpenCodeMirror=false,obj = {
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

			$('<a type="button" class="dcms-btn submit-btn btn-codemirror '+obj.className+'" href="#" target="_self" title="鼠标焦点聚焦在编辑框，按F11进行，进行全屏编辑，按ESC,退出全屏编辑">'+obj.txt+'</a>')
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
                .appendTo('.operating-area');


			if(!isOpenCodeMirror){
				//return;
			}*/
			var links = $('.operating-area a','#js-edit-page-content'),link;

			if(links.length>0){
				link = $(links[0]);
				if(link&&link.html()=='我要修改'){
					link.attr('href',link.attr('href')+'&codemirror=true');
				}
			}


			var pcontentId = document.getElementById("description");
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
			D.editor = editor;
		}
    ];

    $(function(){
        for (var i = 0, l = readyFun.length; i<l; i++) {
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
