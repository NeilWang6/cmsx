;(function($, D) {
var pageElm = $('#js-page-num'), 
	formValid,
	htmlStr,
	htmlConfirm,
	readyFun = [
	function() {//��������
		//$('#js-search-page').submit();
		FE.dcms.doPage();
	}, function(){//��������
		htmlConfirm =  '<div class="form-vertical>\
							<dl class="item-form">\
								<dt class="topic must-fill">��ȷ��Ҫɾ����������</dt>  \
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
								<dt class="topic must-fill">����Դ����</dt>  \
								<dd>\
									<input name="name" class="areatext" data-valid="{required:true,key:\'����Դ��\',type:\'string\',max:256}" type="text" value="" />\
									<span class="validator-tip">������֤��ʾ��</span>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">��ʾ���ͣ�</dt>  \
								<dd>\
									<input type="radio" name="showType" value="iframe" checked="checked"/>iframe&nbsp;&nbsp;&nbsp;&nbsp;\
									<input type="radio" name="showType" value="ajax" />ajax\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic must-fill">����ԴURL��</dt>  \
								<dd>\
									<input name="url" size="55" data-valid="{required:true,key:\'����ԴURL\',type:\'string\',max:2000}" type="text" value="" />\
									<span class="validator-tip">������֤��ʾ��</span>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic must-fill">����Դ��ȡ��������</dt>  \
								<dd>\
									<input name="invokeName" data-valid="{required:true,key:\'����Դ��ȡ������\',type:\'string\',max:32}" type="text" value="" />\
									<span class="validator-tip">������֤��ʾ��</span>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">��������CODE��</dt>  \
								<dd>\
									<select name="type">\
										<option value="offer">offer</option>\
										<option value="member">member</option>\
									</select>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">�Ƿ�֧�ָ�Ԥ��</dt>  \
								<dd>\
									<input type="radio" name="canMerge" value="1" checked="checked"/>��&nbsp;&nbsp;\
									<input type="radio" name="canMerge" value="0"/>��\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">������Դ���ͣ�</dt>  \
								<dd>\
									<input type="radio" name="sourceType" value="idc" checked="checked"/>��������\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">������Դ������</dt>  \
								<dd>\
									<textarea name="sourceParam" class="areatext"></textarea>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">�����ˣ�</dt>  \
								<dd>\
									<input name="owner" data-valid="{key:\'������\',type:\'string\',max:30}" type="text" value="" />\
									<span class="validator-tip">������֤��ʾ��</span>\
								</dd>\
							</dl>\
							<dl class="item-form">\
								<dt class="topic">��ע��</dt>  \
								<dd>\
									<textarea name="note" data-valid="{key:\'��ע\',type:\'string\',max:256}" type="text" class="areatext"></textarea>\
									<span class="validator-tip">������֤��ʾ��</span>\
								</dd>\
							</dl>\
						</form>\
                    </div>';
		
	},function(){//��������
		$(".modifyRes").click(function(){//����༭
			var trData=$(this).parents(".tr-data");
			var modifyBtn=$(this);
			modifyBtn.text("��ѯ��");
			var modifyid=trData.find(".show-id").val();
			$.post("/admin/ajaxShow.html?action=ResDsAction&event_submit_do_res_ds_getOne=true",{
				id:modifyid
			},function(data){
				modifyBtn.text("�༭");
				if(data.status=="true"){//��ѯ�ɹ�
					var rowdata=data.bean;
					D.Msg['confirm']({//�򿪱༭��
						'title' : '�༭����',
						'body' : htmlStr,
						'onlymsg':false,
						'noclose':true,
						'success':function(evt){//�������
							if (formValid.valid()){//��֤�ɹ�
								var dialogEl = evt.data.dialog;
								dialogEl.find('.btn-submit').text("������...");
								dialogEl.find('.method').attr('name','event_submit_do_res_ds_save');
								dialogEl.find('.former').submit();
							}
						}
					},{
						'open':function(){//�����༭���
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
							dialogEl.find('.btn-submit').text("����");
							formValid.add(els);
						},
						'close':function(){//����༭��Ĺر�
							var dialogEl = $(this),
								els = dialogEl.find('[data-valid]');
							formValid.remove(els);
						}
					});//�򿪱༭��
					
				}else{//��ѯʧ��
					
				}
			},"json");
		});//����༭
		
		$("#dcms-add").click(function(){//������
			D.Msg['confirm']({//�򿪱༭����Ϊ��Ӳ�
				'title' : '�༭����',
				'body' : htmlStr,
				'onlymsg':false,
				'noclose':true,
				'success':function(evt){//������
					if (formValid.valid()){//��֤�ɹ�
						var dialogEl = evt.data.dialog;
						dialogEl.find('.btn-submit').text("������...");
						dialogEl.find('.method').attr('name','event_submit_do_res_ds_insert');
						dialogEl.find('.former').submit();
					}
				}
			},{
				'open':function(){//������Ӳ��
					
					var dialogEl = $(this), els = dialogEl.find('[data-valid]');
					dialogEl.find('.btn-submit').text("���");
					formValid.add(els);
				},
				'close':function(){//����༭��Ĺر�
					var dialogEl = $(this),
						els = dialogEl.find('[data-valid]');
					formValid.remove(els);
				}
			});
		});
		$(".delRes").click(function(){//���ɾ��
				var trData=$(this).parents(".tr-data");
				var id=trData.find(".show-id").val();
				D.Msg['confirm']({//�򿪱༭��
					'title' : '��ȷ��',
					'body' : htmlConfirm,
					'onlymsg':false,
					'success':function(evt){//���ȷ��
						var dialogEl = $(this);
						$.post("/admin/ajaxShow.html?action=ResDsAction&event_submit_do_res_ds_del=true",{
							id:id
						},function(data){
							var status=data.status;
							console.log(data);
							if(status=='true'){
								alert("��ɾ��");
								dialogEl.dialog('close');
								trData.remove();
							}else{
								alert(data.desc);
							}
						},"json");
					}
				},{
					'open':function(){//����ɾ��ȷ�ϲ��
						var dialogEl = $(this);
						dialogEl.find('.btn-submit').text("ɾ��");
					}
				});
		});//���ɾ��
	},function(){//��������
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
						//��֤ͨ��
						tip.removeClass('validator-error');
					} else {
						console.log(o);
						//��֤�������ʾ��Ϣ�ٴ�����
						switch (res){
							case 'required':  //��ʾ����
								msg = '����д'+o.key;
								alert(msg);
								break;
							case 'fun':  //��type=fun��o.msg��fun���ص�ֵ
								msg = o.msg;
								break;
							case 'max':
								msg = '���Ȳ��ܳ���'+o.max;
								break;
						}
						tip.text(msg);
						tip.addClass('validator-error');
					}
				}
			});
		});
	}];//������������
	
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