/**
 * @package FE.app.elf.enroll.arrangedialog
 * @author: qinming.zhengqm
 * @Date: 2013-02-28
 */
;(function($, T) {
	function showConfirmDialog(okFunc,ok2Func,msg){
		var dialogEl = $("#rule-confirm-dialog");
		var dialog = $.use('ui-dialog', function(){
			dialogEl.find("section").html(msg);
			//���ж�������㣬�����ID��class
			var dialog = dialogEl.dialog({
				center: true,
				fixed:false,
				timeout: 0
			});
			dialogEl.find(".btn-ok").click(function(ev){
				okFunc.call($(this));
				dialog.dialog('close');
			});
			dialogEl.find(".btn-ok2").click(function(ev){
				ok2Func.call($(this));
				dialog.dialog('close');
			});
			dialogEl.find(".btn-cancel").click(function(){
				dialog.dialog('close');
			});
		});
	}
	T.doShowConfirmDialog = showConfirmDialog;

	function showAlertDialog(msg){
		var dialogEl = $("#rule-alert-dialog");
		dialogEl.find('section .msg').html(msg);
		$.use('ui-dialog', function(){
			//���ж�������㣬�����ID��class
			var dialog = dialogEl.dialog({
				center: true,
				fixed:false,
				timeout: 0
			});
			dialogEl.find('.btn-close').click(function(){
				dialog.dialog('close');
			});
		});
	}
	function getBlockNameByBlockId(blockid){
		var blockname = "";
		if(blockid){
			$(".block-arg-nav .blockitem").each(function(i, el){
				if($(el).data("blockid")==blockid){
					blockname = $(el).data("blockname");
				}
			});
		}
		return blockname;
	}
	T.doShowAlertDialog = showAlertDialog;
	T.doAfterCheckRuleData = function (jsonobj,okFunc,ok2Func){
		var warnlist = jsonobj.warnList ||[];
		var expiredlist = jsonobj.expiredList ||[];
		var invalidlist = jsonobj.invalidList ||[];
		var mbrOfferList = jsonobj.mbrOfferList ||[]; //offer������memberID��ƥ��
		var errmsg = "";
		var blockName = $("#currentBlockName").val();
		if(invalidlist.length>0){
			errmsg="����OfferId��Ч��<br/>&nbsp;&nbsp;" + invalidlist +"��<br/>";
		}
		if(expiredlist.length>0){
			errmsg=errmsg+"����OfferId���ڣ�<br/>&nbsp;&nbsp;" + expiredlist +"��<br/>";
		}
		if(mbrOfferList.length>0){
			errmsg="����OfferId��memberID��ƥ�䣺<br/>";
			for(var i=0; i<mbrOfferList.length; i++){
				errmsg=errmsg+"    "+mbrOfferList[i].memberId + ": "+ mbrOfferList[i].offerIds+"<br/>";
			}
		}
		//var warnConfirmMsg = "";
		if(warnlist.length>0){
			for(var i=0; i<warnlist.length; i++){
				var bname=getBlockNameByBlockId(warnlist[i].blockId);
				if(bname==""){
					bname=warnlist[i].blockName;
				}
				errmsg=errmsg+"    "+warnlist[i].offerId + " �� ��" + bname +"�� ���Ѵ��ڡ�<br/>";
				//warnConfirmMsg = warnlist[i].offerId + " �ӡ�"+warnlist[i].blockName+"���ƶ�����"+blockName+"��<br/>";
			}
		}
		if( expiredlist.length>0 || invalidlist.length>0 || mbrOfferList.length>0){
			showAlertDialog(errmsg);
		}else if(warnlist.length>0){
			//errmsg = errmsg + "�ƶ�������offer����ԭ��������ɾ������ȷ���Ƿ��ƶ������顰"+blockName+"���У�";
			errmsg = errmsg + "��ȷ���Ƿ�����offer��ԭ�������ƶ������顰"+blockName+"���У�";
			showConfirmDialog(okFunc,ok2Func,errmsg);
		}else{
			okFunc.call();
		};
	};

})(jQuery, FE.tools);