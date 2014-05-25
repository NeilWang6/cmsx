/**
 *专场活动报名-专业市场(档口)资质提交页面
 *@author jiankai.xujk
 *@version 2012-08-13
 *@modify author wb_xiaojun.wangxj
 *@version 2012-9-22
 */

(function( $, define, register ){
	
	/**
	 * @module init page
	 * */
	define( 'init-page', function(){
		var node=$('.mod-placard');
		node.delegate('.placard-close','click',function(e){
			e.preventDefault();
			$(this).closest('.mod-placard').hide();
		});
	});

	/**
	 * @module PC cascade
	 * */
	define( 'seller-pc', function(){
		
		new FE.ui.PCA( $('#item-address select'), {
			showTitle: true,
			title: ['请选择省份','请选择城市','请选择区域'],           
			store: FE.ui.PCA.data2
		} );
		
	} );

	/**
	 * @module flash uploader init
	 * */
	define( 'uploader-init', function(){
	  $('#biz-license-upload').uploader({
            numLimit: 1,
            width:121,
            flashvars: {
                buttonSkin: 'http://img.china.alibaba.com/cms/upload/other/topic/upload-1.png'
            }
        });
        $('#applicant-front-upload').uploader({
            numLimit: 1,
            width:121,
            flashvars: {
                buttonSkin: 'http://img.china.alibaba.com/cms/upload/other/topic/upload-2.png'
            }
        });
        $('#applicant-reverse-upload').uploader({
            numLimit: 1,
            width:121,
            flashvars: {
                buttonSkin: 'http://img.china.alibaba.com/cms/upload/other/topic/upload-3.png'
            }
        });
        $('#shop-upload').uploader({
            numLimit: 1,
            width:160,
            flashvars: {
                buttonSkin: 'http://img.china.alibaba.com/cms/upload/other/topic/upload-4.png'
            }
        });
        $('#shop-inside-upload').uploader({
            numLimit: 1,
            width:140,
            flashvars: {
                buttonSkin: 'http://img.china.alibaba.com/cms/upload/other/topic/upload-5.png'
            }
        });
        $('#counter-upload').uploader({
            numLimit: 1,
            width:140,
            flashvars: {
                buttonSkin: 'http://img.china.alibaba.com/cms/upload/other/topic/upload-6.png'
            }
        });
        $('#biz-information-upload').uploader({
            numLimit: 1,
            width:140,
            flashvars: {
                buttonSkin: 'http://img.china.alibaba.com/cms/upload/2012/808/584/485808_1020367891.png'
            }
        });
	} );
	
	/**
	 * @module placeholder support
	 * */

	define( 'seller-placeholder', function(){
	
		var placeholderClass = 'placeholder';
		
		if ( !$.support.placeholder ){
			$('.mod-form input[placeholder]').bind( 'focus.placeholder', function(){
				var $this = $(this);
				if ( $this.val() === $this.attr('placeholder') ){
					$this.val('');
					$this.removeClass( placeholderClass );
				}
			}).bind( 'blur.placeholder', function(){
				var $this = $(this);
				if ( $this.val() === '' || $this.val() === $this.attr('placeholder') ){
					$this.addClass( placeholderClass );
					$this.val($this.attr('placeholder'));
				}
			}).trigger('blur.placeholder');
		}
	});
	
	/**
	 * @module switch biz area
	 * */
	define( 'sw-area', {
		init: function(){
				// if($("#building").val() ===''){
				//	 $('#floor').css("display","none");
				// }
    		// $('#region').css("display","none");
    		// $('#area').css("display","none");
		//	this._click();
		},
		
		_click: function(){
			var _this = this;
			$('#item-area').delegate( 'input', 'click.sw', function(){
				$('.mod-form input[placeholder]').blur();
				$('#spmarket-form').find('.form-elem').removeClass('error');
			} );
		}
	});
	
	/**
	 * @module valid
	 * */
	define( 'seller-valid', function( require, exports, module ){
		var message = require('seller-message');
 		
 		$('#region').live( 'change', function(){
		     if($('#biz-addr-region').get(0).selectedIndex === 0){
		       	$('#region').addClass('error');
		     }else{
		     	 	$('#region').removeClass('error');
		     }
		} );
 		
 		
 		$('#building').live( 'blur.valid', function(){
			var $this = $(this),
			val = $this.val();
			if ( val === '' ){
 						$('#build').addClass('error');
 			} else{
				    $('#build').removeClass('error');
			} 
		} );
 		
 		
		$('#register-no').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
			if ( val === '' || /^[0-9]*$/.test( val ) ){
				message.reset( $this );
			} else {
				message.set( $this, '请输入正确营业执照注册号' );
			}
		} );
		
		$('#applicant-mobile').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
			if ( val === '' || /^[1][3|5|8]\d{9}$/.test( val ) ){
				message.reset( $this );
			} else {
				message.set( $this, '请输入正确手机号码' );
			}
		} );
		
		$('#register-card').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
			if ( val === '' || /^\d{17}[\d|X|x]$/.test( val ) ){
				message.reset( $this );
			} else {
				message.set( $this, '请输入正确身份证号码' );
			}
		} );
		
		$('#floorNum').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
				var $c = $('#floor');
			
			if(	val!=''){
				if(/^(-)?[0-9]*$/.test( val )){
					 $c.removeClass('error');
				   return;
				}else{
					$c.addClass('error').find('span.message').html( '请输入正确的楼层。' );
				}
			}
			
			if ( val === '' || /^(-)?[0-9]*$/.test( val ) ){
				   
				  $m = $c.find('span.message');
				  $c.addClass('error');
				  $m.html( $m.attr('data-default') );
 		    	
			} else {
				$c.addClass('error').find('span.message').html( '请输入正确楼层。' );
			}
		});

   $('#address').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
		   	if ( val === ''  ){
		 			 $this.closest('.item-area').addClass('error');
		     }else{
		     	 	$this.closest('.item-area').removeClass('error');
		     }
		} );
		
		$('#doorNum').bind( 'blur.valid', function(){
			
			var $this = $(this),
				val = $this.val();
		   	if ( val === ''  ){
		 			 $this.closest('.item-area').addClass('error');
		     }else{
		     	 	$this.closest('.item-area').removeClass('error');
		     }
		} );		
			$('#shop-name').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
		   	if ( val === ''  ){
		 			 $this.closest('.item-area').addClass('error');
		     }else{
		     	 	$this.closest('.item-area').removeClass('error');
		     }
		} );
			$('#applicant-name').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
		   	if ( val === ''  ){
		 			 $this.closest('.item-area').addClass('error');
		     }else{
		     	 	$this.closest('.item-area').removeClass('error');
		     }
		} );
	 $('#register-no').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
		   	if ( val === ''  ){
		 			 $this.closest('.item-area').addClass('error');
		     }else{
		     	 	$this.closest('.item-area').removeClass('error');
		     }
		} );
		 $('#register-card').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
		   	if ( val === ''  ){
		 			 $this.closest('.item-area').addClass('error');
		     }else{
		     	 	$this.closest('.item-area').removeClass('error');
		     }
		} );
		$('#applicant-mobile').live( 'blur.valid', function(){
			var $this = $(this),
				val = $this.val();
		   	if ( val === ''  ){
		 			 $this.closest('.item-area').addClass('error');
		     }else{
		     	 	$this.closest('.item-area').removeClass('error');
		     }
		} );
	} );
	
	
	/**
	 * @module vertify & fill data
	 * */

	define( 'seller-vertify', function( require, exports, module ){
		
		var isValidation = true,
			message = require('seller-message'),
			
		checkPlaceholder = function( $el ){
			$el.each(function(){
				var $this = $(this),
					val = $this.val().trim();
				
				if ( 'none' === $this.closest('div.form-item').css('display') ){
					$this.val('');
					return;
				}
				
				if ( $this.closest('div.form-elem').hasClass('non-required') ){
					if ( val === $this.attr('placeholder') ){
						$this.val('');
						$this.removeClass( 'placeholder' );
					}
					return;
				}
				
				if ( val === '' || val === $this.attr('placeholder') ){
					isValidation = false;
					message.display( $this );
				}
			});
		},
		
		check = [
			// check error num
			function(){
				if($('#floorNum').val()==='' && $('#round').val()=='n'){
					isValidation = false;
					$('#floorNum').closest('#floor').addClass('error');
				}else{
					if(/^(-)?[0-9]*$/.test($('#floorNum').val())){
						$('#floorNum').closest('#floor').removeClass('error');
					}else {
						isValidation = false;
						$('#floorNum').closest('#floor').addClass('error').find('span.message').html( '请输入正确的楼层！' );
					}
				}
				
				
				if($('#doorNum').val()==='' && $('#round').val()=='n'){
						isValidation = false;
				    $('#doorNum').closest('.item-area').addClass('error');
				}else{
				    $('#doorNum').closest('.item-area').removeClass('error');
				}
				
				if($('#shop-name').val()===''){
						isValidation = false;
				    $('#shop-name').closest('.item-area').addClass('error');
				}else{
				    $('#shop-name').closest('.item-area').removeClass('error');
				}
				
				if($('#register-no').val()===''){
						isValidation = false;
				    $('#register-no').closest('.item-area').addClass('error');
				}else{
					if(/^[0-9]*$/.test($('#register-no').val())){
					  $('#register-no').closest('.item-area').removeClass('error');
					}else {
						isValidation = false;
				    $('#register-no').closest('.item-area').addClass('error').find('span.message').html( '请输入正确营业执照注册号' );
					}
				    
				}
				
				if($('#applicant-name').val()===''){
						isValidation = false;
				    $('#applicant-name').closest('.item-area').addClass('error');
				}else{
				    $('#applicant-name').closest('.item-area').removeClass('error');
				}

				if($('#register-card').val()===''){
						isValidation = false;
				    $('#register-card').closest('.item-area').addClass('error');
				}else{
						if (/^\d{17}[\d|X|x]$/.test( $('#register-card').val() ) ){
						   $('#register-card').closest('.item-area').removeClass('error');
						} else {
							isValidation = false;
				      $('#register-card').closest('.item-area').addClass('error').find('span.message').html( '请输入正确身份证号码' );
						}
				}
				
				if($('#applicant-mobile').val()===''){
						isValidation = false;
				    $('#applicant-mobile').closest('.item-area').addClass('error');
				}else{
					if (/^[1][3|5|8]\d{9}$/.test($('#applicant-mobile').val()) ){
					   $('#applicant-mobile').closest('.item-area').removeClass('error');
					} else {
						isValidation = false;
				    $('#applicant-mobile').closest('.item-area').addClass('error').find('span.message').html( '请输入正确手机号码' );
					}
 				}
				
				if($('#address').val()==='' && $('#round').val()=='y'){
						isValidation = false;
				    $('#address').closest('.item-area').addClass('error');
				}else{
				    $('#address').closest('.item-area').removeClass('error');
				}
				if($('#biz-addr-region').val()==='' && $('#round').val()=='y'){
						isValidation = false;
				    $('#biz-addr-region').closest('#region').addClass('error');
				}else{
				    $('#biz-addr-region').closest('#region').removeClass('error');
				}
 			},
  					
			function(){
 					if ( $('#building').val() === ''){
						  isValidation = false;
					    $('#build').addClass('error');
					}else{
						  $('#build').removeClass('error');
					}
			},
			
			function(){
				var certCommentNew = $.trim($("#certCommentNew").val());
				if (certCommentNew.length > 500) {
					isValidation = false;
					alert("请填写小于等于500字的备注");
				}
				$('input[name=comment]').val(certCommentNew);
			},
			// check upload file
			function(){
				if($('#bizLicenseImg').val()===''){
 					 $('#bizLicenseImg').closest("div.uplod-image").addClass('error');
 					 isValidation = false;
				} 
				
				if($('#applicantIdFrontImg').val()===''){
 					 $('#applicantIdFrontImg').closest("div.uplod-image").addClass('error');
 					 isValidation = false;
				} 

				if($('#applicantIdReverseImg').val()===''){
 					 $('#applicantIdFrontImg').closest("div.uplod-image").addClass('error');
 					 isValidation = false;
				} 
				
	 
				if($('#shopImg').val()===''){
 					 $('#shopImg').closest("div.uplod-image").addClass('error');
 					 isValidation = false;
				} 
				if($('#shop-inside-img').val()===''){
 					 $('#shopImg').closest("div.uplod-image").addClass('error');
 					 isValidation = false;
				} 
				if($('#counter-img').val()===''){
 					 $('#shopImg').closest("div.uplod-image").addClass('error');
 					 isValidation = false;
				} 
 				if($('#biz-information-Img').val()===''){
 					 $('#biz-information-Img').closest("div.uplod-image").addClass('error');
 					 isValidation = false;
				} 
			}
		];
		
		exports.all = function(){
			isValidation = true;
			for ( var i = 0, l = check.length; i < l; i++ ){
				check[i]();
			}
			return isValidation;
		};
		
	} );
	
	/**
	 * @module message
	 * */
	define( 'seller-message', function( require, exports, module ){
		
		exports.display = function( $el ){
			$el.closest('div.form-elem').addClass('error');
		};
		
		exports.hide = function( $el ){
			 
			$el.closest('div.form-elem').removeClass('error');
		};
		
		exports.set = function( $el, text ){
			$el.closest('div.form-elem').addClass('error').find('span.message').html( text );
		};
		
		exports.reset = function( $el ){
			var $c = $el.closest('div.form-elem'),
				  $m = $c.find('span.message');
			    $c.removeClass('error');
			    $m.html( $m.attr('data-default') );
		}
		
	} );
	
	/**
	 * @module remove message
	 * */

	define( 'seller-remove-message', function( require ){
		
		var message = require('seller-message');
		
		$('#cert-form').delegate( 'input[placeholder]', 'keyup.re', function(){
			message.hide( $(this) );
		} );
		
		$('#item-building').delegate( 'select', 'change.re', function(){
			message.hide( $(this) );
		} );
		
		$('#item-address').delegate( 'select', 'change.re', function(){
			message.hide( $(this) );
		} );
	} );
	
	define( 'collect-data', function(require, exports, module){
		
		exports.all = function(){
			var data = {};
		
			$('select:not(:hidden), input.input-text:not(:hidden), input.input-floor:not(:hidden), input[type=hidden]').each(function(i, el){
				if($(this).hasClass('placeholder')){
					$(this).val('');
				}
				data[$(this).attr("name")] = $(this).val();
			});
			return data;
		};
	});
	
	/**
	 * @module submit
	 * */
	define( 'seller-submit', function( require, exports, module ){
		
		var vertify = require('seller-vertify');
		var collectData = require('collect-data');
		$('#cert-form').bind( 'submit.submit', function(){
 			if ( vertify.all() ){
				var vurl = $('#new-content').data('url');
				$.ajax({
					type: 'POST',
					url: vurl,
					data: collectData.all(),
					success: function(o) {
						var jumpUrl = $('#new-content').data('jumpurl'),
						errorUrl = $('#new-content').data('errorurl'),
							data;
						if (!!o) {
							data = eval(o);
							if (data.status === "success") {
								FE.util.goTo(jumpUrl, '_self');
							} 
							if (data.status === "error") {
								FE.util.goTo(errorUrl, '_self');
							}
						}
					},
					error: function () {
						alert("页面超时，请重试");
					}	
				});
				
				
			} else {
				location.hash = "cert-form";
			}
			return false;
		} );
		
	} );

 register( [
		'init-page',
		'seller-placeholder',
		//'seller-pc', 暂时不注册获取省份等信息，先在页面上直接写明
		'uploader-init',
		'sw-area',
		'seller-valid',
		'seller-remove-message',
		'seller-submit'
	] );


})( jQuery, FE.operation.pitaya.define, FE.operation.pitaya.register );