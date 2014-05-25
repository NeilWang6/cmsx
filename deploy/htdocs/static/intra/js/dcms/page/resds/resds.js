;(function($, D) {
var pageElm = $('#js-page-num'), 
	formValid,
	htmlStr,
	htmlConfirm,
	readyFun = [
	function() {//启动函数
		//$('#js-search-page').submit();
		FE.dcms.doPage();
	}, function(){//启动函数
		htmlConfirm =  '<div class="form-vertical>\
							<dl class="item-form">\
								<dt class="topic must-fill">你确定要删除该数据吗</dt>  \
								<dd>\
								</dd>\
							</dl>\
						</div>';
		htmlStr =  '<div class="form-vertical">\
						<form method="post" action="/admin/resDs.html" class="former">\
							<input type="hidden" name="action" value="ResDsAction" />\
							<input type="hidden" name="" class="method" value="true" />\
							<input type="hidden" name="id" value="" />\
							<dl class="item-form">\
								<dt class="topic must-fill">数据源名：</dt>  \
								<dd>\
									<input name="name" class="areatext" data-valid="{required:true,key:\'数据源名\',type:\'string\',max:256}" type="text" value="" />\
									<span class="validator-tip">错误验证提示框</span>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">显示类型：</dt>  \
								<dd>\
									<input type="radio" name="showType" value="iframe" checked="checked"/>iframe&nbsp;&nbsp;&nbsp;&nbsp;\
									<input type="radio" name="showType" value="ajax" />ajax\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic must-fill">数据源URL：</dt>  \
								<dd>\
									<input name="url" size="55" data-valid="{required:true,key:\'数据源URL\',type:\'string\',max:2000}" type="text" value="" />\
									<span class="validator-tip">错误验证提示框</span>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic must-fill">数据源抽取调用名：</dt>  \
								<dd>\
									<input name="invokeName" data-valid="{required:true,key:\'数据源抽取调用名\',type:\'string\',max:32}" type="text" value="" />\
									<span class="validator-tip">错误验证提示框</span>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">数据类型CODE：</dt>  \
								<dd>\
									<select name="type">\
										<option value="offer">offer</option>\
										<option value="member">member</option>\
									</select>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">是否支持干预：</dt>  \
								<dd>\
									<input type="radio" name="canMerge" value="1" checked="checked"/>是&nbsp;&nbsp;\
									<input type="radio" name="canMerge" value="0"/>否\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">数据来源类型：</dt>  \
								<dd>\
									<input type="radio" name="sourceType" value="idc" checked="checked"/>数据中心\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">数据来源参数：</dt>  \
								<dd>\
									<textarea name="sourceParam" class="areatext"></textarea>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">负责人：</dt>  \
								<dd>\
									<input name="owner" data-valid="{key:\'负责人\',type:\'string\',max:30}" type="text" value="" />\
									<span class="validator-tip">错误验证提示框</span>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">备注：</dt>  \
								<dd>\
									<textarea name="note" data-valid="{key:\'备注\',type:\'string\',max:256}" type="text" class="areatext"></textarea>\
									<span class="validator-tip">错误验证提示框</span>\
								</dd>\
							</dl>\
						</form>\
                    </div>';
		
	},function(){//启动函数
		$(".modifyRes").click(function(){//点击编辑
			var trData=$(this).parents(".tr-data");
			var modifyBtn=$(this);
			modifyBtn.text("查询中");
			var modifyid=trData.find(".show-id").val();
			$.post("/admin/ajaxShow.html?action=ResDsAction&event_submit_do_res_ds_getOne=true",{
				id:modifyid
			},function(data){
				modifyBtn.text("编辑");
				if(data.status=="true"){//查询成功
					var rowdata=data.bean;
					D.Msg['confirm']({//打开编辑层
						'title' : '编辑内容',
						'body' : htmlStr,
						'onlymsg':false,
						'noclose':true,
						'success':function(evt){//点击保存
							if (formValid.valid()){//验证成功
								var dialogEl = evt.data.dialog;
								dialogEl.find('.btn-submit').text("保存中...");
								dialogEl.find('.method').attr('name','event_submit_do_res_ds_save');
								dialogEl.find('.former').submit();
							}
						}
					},{
						'open':function(){//弹出编辑层后
							var dialogEl = $(this), els = dialogEl.find('[data-valid]');
							dialogEl.find("input[name=name]").val(rowdata.name);
							dialogEl.find("input[name=showType][value="+rowdata.showType+"]").attr("checked","checked");
							dialogEl.find("input[name=url]").val(rowdata.url);
							dialogEl.find("input[name=owner]").val(rowdata.owner);
							dialogEl.find("input[name=status]").val(rowdata.status);
							dialogEl.find("input[name=invokeName]").val(rowdata.invokeName);
							dialogEl.find("select[name=type]").val(rowdata.type);

							dialogEl.find("input[name=canMerge][value="+rowdata.canMerge+"]").attr("checked","checked");
							dialogEl.find("input[name=sourceType][value="+rowdata.sourceType+"]").attr("checked","checked");
							dialogEl.find("textarea[name=sourceParam]").val(rowdata.sourceParam);
							dialogEl.find("textarea[name=note]").val(rowdata.note);
							dialogEl.find("input[name=id]").val(rowdata.id);//del
							dialogEl.find('.btn-submit').text("保存");
							formValid.add(els);
						},
						'close':function(){//点击编辑层的关闭
							var dialogEl = $(this),
								els = dialogEl.find('[data-valid]');
							formValid.remove(els);
						}
					});//打开编辑层
					
				}else{//查询失败
					
				}
			},"json");
		});//点击编辑
		
		$("#dcms-add").click(function(){//点击添加
			D.Msg['confirm']({//打开编辑层做为添加层
				'title' : '编辑内容',
				'body' : htmlStr,
				'onlymsg':false,
				'noclose':true,
				'success':function(evt){//点击添加
					if (formValid.valid()){//验证成功
						var dialogEl = evt.data.dialog;
						dialogEl.find('.btn-submit').text("保存中...");
						dialogEl.find('.method').attr('name','event_submit_do_res_ds_insert');
						dialogEl.find('.former').submit();
					}
				}
			},{
				'open':function(){//弹出添加层后
					
					var dialogEl = $(this), els = dialogEl.find('[data-valid]');
					dialogEl.find('.btn-submit').text("添加");
					formValid.add(els);
				},
				'close':function(){//点击编辑层的关闭
					var dialogEl = $(this),
						els = dialogEl.find('[data-valid]');
					formValid.remove(els);
				}
			});
		});
		$(".delRes").click(function(){//点击删除
				var trData=$(this).parents(".tr-data");
				var id=trData.find(".show-id").val();
				D.Msg['confirm']({//打开编辑层
					'title' : '请确认',
					'body' : htmlConfirm,
					'onlymsg':false,
					'success':function(evt){//点击确认
						var dialogEl = $(this);
						$.post("/admin/ajaxShow.html?action=ResDsAction&event_submit_do_res_ds_del=true",{
							id:id
						},function(data){
							var status=data.status;
							console.log(data);
							if(status=='true'){
								alert("已删除");
								dialogEl.dialog('close');
								trData.remove();
							}else{
								alert(data.desc);
							}
						},"json");
					}
				},{
					'open':function(){//弹出删除确认层后
						var dialogEl = $(this);
						dialogEl.find('.btn-submit').text("删除");
					}
				});
		});//点击删除
	},function(){//启动函数
		var createStart = $('#createStart'), createEnd = $('#createEnd');
		createStart.one('focus', function(){
			$.use('ui-datepicker, util-date', function(){
				createStart.datepicker({
					triggerType: 'focus',
					beforeShow: function(){
						$(this).datepicker({
							maxDate: Date.parseDate(createEnd.val())
						});
						return true;
					},
					select: function(e, ui){
						$(this).val(ui.date.format()).datepicker('hide');
					}
				}).triggerHandler('focus');
			});
		});
		createEnd.one('focus', function(){
			$.use('ui-datepicker, util-date', function(){
				createEnd.datepicker({
					triggerType: 'focus',
					beforeShow: function(){
						$(this).datepicker({
							minDate: Date.parseDate(createStart.val())
						});
						return true;
					},
					select: function(e, ui){
						$(this).val(ui.date.format()).datepicker('hide');
					}
				}).triggerHandler('focus');
			});
		});
		
		var modifyStart = $('#modifyStart'), modifyEnd = $('#modifyEnd');
		modifyStart.one('focus', function(){
			$.use('ui-datepicker, util-date', function(){
				modifyStart.datepicker({
					triggerType: 'focus',
					beforeShow: function(){
						$(this).datepicker({
							maxDate: Date.parseDate(modifyEnd.val())
						});
						return true;
					},
					select: function(e, ui){
						$(this).val(ui.date.format()).datepicker('hide');
					}
				}).triggerHandler('focus');
			});
		});
		modifyEnd.one('focus', function(){
			$.use('ui-datepicker, util-date', function(){
				modifyEnd.datepicker({
					triggerType: 'focus',
					beforeShow: function(){
						$(this).datepicker({
							minDate: Date.parseDate(modifyStart.val())
						});
						return true;
					},
					select: function(e, ui){
						$(this).val(ui.date.format()).datepicker('hide');
					}
				}).triggerHandler('focus');
			});
		});
	}, function(){
		$.use('web-valid', function(){
			var els = $();
			formValid = new FE.ui.Valid(els, {
				onValid: function(res, o) {
					var tip = $(this).closest('.item-form').find('.validator-tip'), msg;
					 
					if (res==='pass') {
						//验证通过
						tip.removeClass('validator-error');
					} else {
						console.log(o);
						//验证错误的提示信息再此配置
						switch (res){
							case 'required':  //表示必填
								msg = '请填写'+o.key;
								alert(msg);
								break;
							case 'fun':  //当type=fun，o.msg是fun返回的值
								msg = o.msg;
								break;
							case 'max':
								msg = '长度不能超过'+o.max;
								break;
						}
						tip.text(msg);
						tip.addClass('validator-error');
					}
				}
			});
		});
	}];//启动函数数组
	
    D.aaa = function(){
        console.log('aa');
        return true; //success
        //return 'message'; //fail
    };
	
	
	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch (e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});


})(dcms, FE.dcms);