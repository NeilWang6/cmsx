/**
 * author arcthur.cheny
 * date 2011-11.17
 */

;(function($, define, register) {
    var $added = $('#added'),
        $notAdded = $('#not-added'),
        $tip = $('#tip'),
        $uploaded = $('#uploaded-num'),
        $canUpload = $('#can-upload-num'),
        $addtion = $('#addtion'),
        $moneyBack = $('#moneyBack'),
        $addedLists = $('#added-lists'),
        $offersList = $('#offers-list'),
        uploadedNum = parseInt($uploaded.text(), 10),
        canUploadNum = parseInt($canUpload.text(), 10),
        tempNum = uploadedNum,
        sampleType = parseInt($('#doc').data('sample-type')),
        alreadyAdd = [];

    /**
     * @module cut offer detail title length
     * */
    define('cut-length', function(require, exports) {
        exports.cutLength = function($title, len) {
            $title.each(function(i, el) {
                var $el = $(el),
                    length = $el.text().lenB();

                if (length > len) {
                    $el.text($el.text().cut(len, '...'));
                }
            });
        };
    });

    /**
     * @module placeholder at the price input
     * */
    define('placeholder', function(require, exports) {
        exports.placeholder = function() {
            if (!('placeholder' in document.createElement('input'))) {
                $('#choosed-offers [placeholder]').live('focus', function() {
                    var $this = $(this);
                    if ($this.val() === $this.attr('placeholder')) {
                        $this.val('');
                        $this.removeClass('placeholder');
                    }
                }).live('blur', function() {
                    var $this = $(this);
                    if ($this.val() === '' || $this.val() === $this.attr('placeholder')) {
                        $this.addClass('placeholder');
                        $this.val($this.attr('placeholder'));
                    }
                }).blur();
            }
        };
    });

    // choose offers from right sidebar
    define('chooseOffer', function(require, exports) {
        var cut = require('cut-length'),
            placeholder = require('placeholder'),
            infoUrl = 'json.html';
            // infoUrl = $('#doc').data('sku-offer'),

        _requestOfferInfo = function(el) {
        //     $.ajax({
        //         url: infoUrl,
        //         datatype: 'json',
        //         data: {
        //             'offerId': offerId,
        //             '_input_charset': 'UTF-8'
        //         }
        //     })
        //     .done(function(o) {
        //         if (!! o) {
        //             var data = $.parseJSON(o);

        //             if (data.success) {
                        _commonRender(el);
                        _handleContent(el);
            //         } else {
            //             _errorInfo();
            //         }
            //     }
            // })
            // .fail(function() {
            //     _errorInfo();
            // });
        },

        _handleContent = function(el) {
            // statistics
            aliclick(this, '?tracelog=xfp_seller_product_select_add');

            // exchange the button
            el.text('已添加').removeClass('add-offer').addClass('already-add');

            // if the offer is already added, array put the offerid
            alreadyAdd[alreadyAdd.length] = el.closest('li').data('offerid');

            placeholder.placeholder();
            cut.cutLength($addedLists.find('.desc a'), 46);

            ++uploadedNum;
            --canUploadNum;

            if (canUploadNum > 0) {
                $addtion.show();
            } else {
                $addtion.hide();
            }
             $moneyBack.show();
        },

        _commonRender = function(el) {
            var nowEl = el.parents('li'),
                offerId = nowEl.data('offerid'),
                offerUrl = nowEl.data('offerurl'),
                imgSrc = nowEl.data('imgsrc'),
                title = nowEl.data('title'),
                unit = nowEl.data('unit'),
                priceHtml, isPostage, html;

            if (sampleType === 1) {
                priceHtml = '0.01<input type="hidden" value="0.01" class="price-input"/>';
                isPostage = '<font style="margin-left:25px;">包邮</font><input type="hidden" value="y" class="postage-select"/>';
            } else {
                priceHtml = '<input type="text" value="" class="price-input" placeholder="请输入价格" />';
                isPostage = '<select class="postage-select">' +
								'<option value="" selected="selected" disabled="disabled">请选择</option>' +
                                '<option value="y">包邮</option>' +
                                '<option value="n">与店铺一致</option>' +
                            '</select>';
            }

            html = '<li class="added-list fd-clr fd-hide" data-offerid=' + offerId + '>' +
                        '<div class="offer-product fd-left">' +
                            '<dl class="cell-product-3rd">' +
                                '<dt class="vertical-img">' +
                                    '<a class="box-img" href="' + offerUrl + '" title="' + title + '" target="_blank">' +
                                        '<img src="' + imgSrc + '" alt="' + title + '" />' +
                                    '</a>' +
                                '</dt>' +
                                '<dd class="desc"><a href="' + offerUrl + '" title="' + title + '" target="_blank">' + title + '</a></dd>' +
                            '</dl>' +
                        '</div>' +
                        '<div class="price-offer valid-offer fd-left">' +
                            priceHtml +
                            '<p class="n"></p>' +
                            '<p class="y error-info">请输入价格</p>' +
                        '</div>' +
                        '<div class="supplies-offer valid-offer fd-left">' +
                            '<input type="text" value="" class="supplies-input" placeholder="请输入数量" /><span>' + unit + '</span>' +
                            '<p class="n"></p>' +
                            '<p class="y error-info">请输入数量</p>' +
                        '</div>' +
                        '<div class="is-postage valid-offer fd-left">' +
                            isPostage +
							'<p class="n"></p>' +
                            '<p class="y error-info">请选择是否包邮</p>' +
                        '</div>' +
                        '<div class="remove-offer fd-left" style="margin-left:25px;">' +
                            '<a href="" title="移除" class="remove-btn">移除</a>' +
                        '</div>' +
                    '</li>';

            $notAdded.hide();
            $added.show();

            !$('.disable').length || $('.disable').removeClass('disable').addClass('obj-upload');

            $(html).appendTo($addedLists).fadeIn();
        },

        _errorInfo = function() {
            alert('系统出错，请稍后再试');
        };

        exports.chooseOffer = function() {
            $offersList.delegate('.add-offer', 'click', function(e) {
                e.preventDefault();

                var $this = $(this),
                    nowEl = $this.closest('li');
                    // offerId = nowEl.data('offerid');

                if (canUploadNum === 0) {
                    $('.obj-warn').css('top', $this.offset().top - 130)
                                  .fadeIn('slow').delay(200).fadeOut('slow');
                    return false;
                }

                _requestOfferInfo($this);
            });

            $offersList.delegate('.already-add', 'click', function(e) {
                e.preventDefault();
            });
        };

        exports.addedOffer = function() {
            $addedLists.delegate('.remove-offer', 'click', function(e) {
                e.preventDefault();

                var $this = $(this), i, len,
                    $parentList = $this.closest('li'),
                    offerId = $parentList.data('offerid');

                // statistics
                aliclick(this, '?tracelog=xfp_seller_product_select_del');

                // recover the offer could be added
                $offersList.find('li').each(function(i, el) {
                    if ($(el).data('offerid') === offerId) {
                        $(el).find('.already-add').text('添 加').addClass('add-offer').removeClass('already-add');
                    }
                });

                // clear the added offer already
                for (i = 0, len = alreadyAdd.length; i < len; i++) {
                    if (alreadyAdd[i] == offerId) {
                        alreadyAdd[i] = '';
                    }
                }

                // remove the list added
                $parentList.hide('slow', function() {
                    $(this).remove();
                });

                --uploadedNum;
                ++canUploadNum;

                // if the number of uploaded offer is equal to zero
                if (uploadedNum === tempNum) {
                    !$('.obj-upload').length || $('.obj-upload').removeClass('obj-upload').addClass('disable');
                    !$tip.length || $tip.hide();

                    $added.hide();
                    $notAdded.fadeIn('slow');
                }

                // the tip that you can add offer is showed
                if (canUploadNum > 0) {
                    $addtion.show();
                    $moneyBack.show();
                } else {
                    $addtion.hide();
                    $moneyBack.hide();
                }
            });

            // remove the error tips
            $('.added-list input').live('focus', function() {
                var $this = $(this);

                $this.closest('.valid-offer').removeClass('error');
                $this.removeClass('error-shadow');
            });
            $('#moneyBack input').live('focus', function() {
                var $this = $(this);

                $this.closest('#moneyBack').removeClass('error');
                $this.removeClass('error-shadow');
            });
			
			$('.is-postage select').live('change', function() {
				var $this = $(this);
				
				$this.closest('.valid-offer').removeClass('error');
                $this.removeClass('error-shadow');
			});
        };
    });

    // the form contained left offers
    define('form', function(require, exports) {
        var $uploadForm = $('#upload-form'),

        _vertifyData = function() {
            var flag = true,
                regMoney = /^(([1-9]{1}[0-9]{0,8})|[0]{1})([.]{1}[0-9]{1,3})?$/,
                regNum = /^[1-9]{1}[\d]{0,8}$/;
                suppliesInputNum = /^[2-5]{1}$/;
                regInt = /^\d{1,7}$/;
            
              //验证返还金额   
              if($('#backMoney').length>0){
                 if($('#backMoney').val() === ''){
              		  $('#moneyBack').addClass('error');
               		  $('#backMoney').addClass('error-shadow');
                   flag = false;
                }else{
                	 if(!regInt.test($('#backMoney').val())){
                	 	 $('#moneyBack').addClass('error');
               		   $('#backMoney').addClass('error-shadow');
                     flag = false;
                	 }else{
                	   if(parseInt($('#backMoney').val()) > 1000000)	{
                	   	  $('#moneyBack').addClass('error');
               		  		$('#backMoney').addClass('error-shadow');
                    	 	flag = false;
                	   }
                	 }
                	}
               };
            $('.price-input').each(function(i, el) {
                var $el = $(el),
                    valid = $el.closest('div.valid-offer'),
                    error = $el.siblings('.error-info'),
                    text = '请输入价格';

                if (!_validTemplate($el, error, regMoney, valid, text)) {
                    flag = false;
                }
            });

            $('.supplies-input').each(function(i, el) {
                var $el = $(el),
                    valid = $el.closest('div.valid-offer'),
                    error = $el.siblings('.error-info'),
                    text = '请输入数量';

                if (!_validTemplate($el, error, suppliesInputNum, valid, text)) {
                    flag = false;
                }
            });
			
			$('.postage-select').each(function(i, el) {
                var $el = $(el),
                    valid = $el.closest('div.valid-offer'),
                    error = $el.siblings('.error-info'),
                    text = '请选择是否包邮';

				if ($el.val() == '') {
					error.text(text);
					valid.addClass('error');
					$el.addClass('error-shadow');
					flag = false;
				}
            });

            return flag;
        },

        _validTemplate = function(el, error, reg, valid, text) {
            var flag = true,
                value = el.val();
               
            if (el.hasClass('placeholder') || el.val().trim() === '') {
                error.text(text);
                valid.addClass('error');
                el.addClass('error-shadow');

                flag = false;
								return flag;
            }

            if (el.val().trim() !== '' && !reg.test(el.val())) {
                error.text('填2-5之间的数字');
                valid.addClass('error');
                el.addClass('error-shadow');

                flag = false;
								return flag;
            }
			
			    return flag;
        },

        _collectData = function() {
            var dataset = [],
                $offersInfo = $('#offers-info'),
                $money = $('#back-money'),
                formData;

            $('.added-list').each(function(i, el) {
                var $el = $(el),
                    obj = {};

                obj.offerId = $el.data('offerid');
                obj.price = $el.find('.price-input').val();
                obj.quantity = $el.find('.supplies-input').val();
                if($el.find('.postage-select').find('option:selected').val()==undefined){
			obj.hasPost = $el.find('.postage-select').val();
		}else{
                	obj.hasPost = $el.find('.postage-select').find('option:selected').val();
		}

                dataset.push(obj);
            });

            formData = JSON.stringify({ 'data': dataset });
  			    $money.val($('#backMoney').val());
            $offersInfo.val(formData);
        };

        exports.init = function() {
            $('.disable').live('click.upload', function(e) {
                e.preventDefault();
            });

            $('.obj-upload').live('click.upload', function(e) {
                e.preventDefault();

                // statistics
                aliclick(this, '?tracelog=xfp_seller_product_select_conform');

                if (!_vertifyData()) {
                    return false;
                } else {
                    _collectData();
                }

                $uploadForm.submit();
            });
        };
    });

    define('searchOffers', function(require, exports) {
        var $notFound = $('#not-found'),
            searchUrl = $('#doc').data('search-offer');

        _requestOffers = function(value) {
            $.ajax({
                url: searchUrl,
                datatype: 'json',
                data: {
                    'k': $.util.escapeHTML(value),
                    '_input_charset': 'UTF-8',
                    'type': sampleType,
					'tid':$('#tid').val(),
                    'id': (new Date()).getTime()
                }
            }).done(function(o) {
                if (!! o) {
                    var data = $.parseJSON(o);

                    if (data.success === 'true' && data.hasOffer === 'true') {
                        $notFound.hide();
                        $offersList.show();

                        _renderOffers(data);
                    } else {
                        $offersList.hide();
                        $notFound.show();
                    }
                }
            }).fail(function() {
                $offersList.hide();
                $notFound.show();
            });
        },

        _renderOffers = function(data) {
            var html = '', addBtn,
                offers = data.offerList,
                len = offers.length,
                lenArr = alreadyAdd.length, i, m;

            for (i = 0; i < len; i++) {
                addBtn = '<dd class="btn"><a href="#" title="添加" class="add-offer">添&nbsp;加</a></dd>';

                for (m = 0; m < lenArr; m++) {
                    if (alreadyAdd[m] == offers[i].offerid) {
                       addBtn = '<dd class="btn"><a href="#" title="已添加" class="already-add">已添加</a></dd>';
                       break;
                    }
                }
                html += '<li data-unit="' + offers[i].unit + '" data-offerurl="' + offers[i].offerurl + '" data-offerid="' + offers[i].offerid + '" data-imgsrc="' + offers[i].imgsrc + '" data-title="' + offers[i].title + '">' +
                        '<div class="offer-product">' +
                            '<dl class="cell-product-3rd">' +
                                '<dt class="vertical-img">' +
                                    '<a class="box-img" href="' + offers[i].offerurl + '" title="' + offers[i].title + '">' +
                                        '<img src="' + offers[i].imgsrc + '" alt="' + offers[i].title + '" />' +
                                    '</a>' +
                                '</dt>' +
                                '<dd class="desc"><a href="' + offers[i].offerurl + '" title="">' + offers[i].title + '</a></dd>' +
                                addBtn +
                            '</dl>' +
                        '</div>' +
                    '</li>';
            }

            $offersList.html(html);
        };

        exports.init = function() {
            var $cleanInput = $('#clean-input'),
                $searchInput = $('.search-input'),
                $searchBtn = $('#search-btn');

            $cleanInput.bind('click', function(e) {
                e.preventDefault();

                $searchInput.val('');
                _requestOffers('');
            });

	    $searchInput.bind('keyup',function(){
		var $this = $(this),
                    value = $this.val();

		if(value.length==0){
                    _requestOffers(value);
		}
           });
		
            $searchBtn.bind('click', function() {
                var value = $searchInput.val(),
                    delayTimer = null;

                if (value.length > 0) {
                    $cleanInput.show();
                } else {
                    $cleanInput.hide();
                }

                if (delayTimer) {
                    clearTimeout(delayTimer);
                }

                delayTimer = setTimeout(function() {
                    _requestOffers(value);
                    delayTimer = null;
                }, 800);
            });
        };
    });

    define(function(require, exports) {
        var chooseOffer = require('chooseOffer'),
            form = require('form'),
            cut = require('cut-length'),
            searchOffers = require('searchOffers'),
            listTitle = $('.list-title'),
            NAVHEIGHT = 242,
            navLeft = listTitle.offset().left - $(window).scrollLeft();

	$('#i-know').click(function(e){
                e.preventDefault();
		$('#tip').hide();
	});

        chooseOffer.chooseOffer();
        chooseOffer.addedOffer();
        form.init();
        searchOffers.init();
        cut.cutLength($('#offers-list .desc a'), 30);

        $(window).bind('scroll', function() {
                    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                    if (NAVHEIGHT <= scrollTop) {
                        listTitle.addClass('float-nav')
                                 .css('left', navLeft);
                    } else {
                        listTitle.removeClass('float-nav');
                    }
                 });
        }).register();
})(jQuery, hexjs.define, hexjs.register);
