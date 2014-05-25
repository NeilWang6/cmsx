/**
 * @author baiys
 * @date 2012.08.27
 * 
 */

jQuery(function($) {
	var formValid, locationHref = location.href, selectedBuyOfferIds = $(
			'#selectedBuyOfferIds').val(), selectedBuyOfferIdArr = selectedBuyOfferIds == "" ? []
			: selectedBuyOfferIds.split(","), checkboxs = $(":checkbox"), pageinputOffer = $('#page-offer-sale'), inputOfferNoteInfo = $('#offer-note-info'), pageinputOfferNoteInfo = $('#page-offer-note-info'), enrollInfoReq = $('#enroll-info-req'), oform = $('#offerform'), pform = $('#pageform'), oldOfferInfos = [], oldOfferNoteInfos = [], readyFun = [

			// 单击checkbox后的验证
			function() {
				$.each(checkboxs, function(index, obj) {
					var o = $(obj);
					if ($.inArray(o.val(), selectedBuyOfferIdArr) >= 0) {
						o.prop('checked', 'checked');
					}
				});
				$("#checkedBuyOffer").html(selectedBuyOfferIdArr.length);
				$('.ct-table').delegate(
						'input.buy-offer-id',
						'click',
						function(e) {
							var checkbox = $(this), val = checkbox.val();
							if (checkbox.attr('checked') === 'checked') {
								selectedBuyOfferIdArr.push(checkbox.val());
							} else {
								selectedBuyOfferIdArr.splice(
										selectedBuyOfferIdArr.indexOf(checkbox
												.val()), 1);
							}
							$("#checkedBuyOffer").html(
									selectedBuyOfferIdArr.length);
						});
			},
			// 翻页操作
			function() {
				$('.mod-page-tag')
						.delegate(
								'[data-page]',
								'click',
								function(e) {

									e.preventDefault();
									var el = $(this), pageNum = el.data('page'), pageReg = /(page=\d*)(&{0,1})/g;
									$('#selectedBuyOfferIds').val(
											selectedBuyOfferIdArr.join());
									pform[0].elements['page'].value = pageNum;
									pform.trigger('submit');

								});
			},
			// 提交选中offer
			function() {
				var oformSubmitting = false;
				oform.submit(function(e) {
					if (oformSubmitting) {
						return false;
					}
					if (selectedBuyOfferIdArr.length===0){
                        alert('请先选择要报名的产品！');
                        return false;
                    }
					$('#buyOfferIds').val(selectedBuyOfferIdArr.join())
					if (oformSubmitting) {
						return false;
					}
					oformSubmitting = true;
					return true;
				});
			} ];

	$(function() {
		for ( var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch (e) {
				if ($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});
});