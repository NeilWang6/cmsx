/*
 * @Author      changbin.wangcb
 * @Date        2013-12-28
 * @Description 动画工具
 */	

(function($, Design){
	function pageOpen(){
		var search = decodeURIComponent(location.search),
			domain = $('input[name=dcmsDomain]'),
			$form = $('#js-search-page'),
			animateName = $('input[name=animationName]', $form),
			animateID = $('input[name=boxAnimationId]', $form),
			animateContent = $('textarea[name=content]', $form),
			animateModel = $('textarea[name=jsonContent]', $form),
			$setting = $('#settingDiv'),
			$animateName = $('input[type=text]:eq(0)', $setting),
			status = 'new',
			screenGrid = 'design-990';

		if( search && search.toUpperCase().indexOf('ANIMATE_ID') > -1 ){
			status = 'edit';
			dialog();
		}else{
			status = 'new';
			dialog();
		}

		function dialog(){
			if( status !== 'new' ){
				$setting.find('section div.grid-box').hide();

				if( status === 'edit' ){
					$setting.find('header h5').text('修改');
					$setting.find('input').prop('disabled', true);
					$setting.find('section div.pageid').show();
				}else{
					$setting.find('header h5').text('属性');
					$setting.find('input').prop('disabled', false);
				}
			}

			$.use('ui-dialog', function(){
			    $setting.dialog({
			    	fixed: true,
			    	center: true
			    });
			});
		}

		$setting.find('div.grid-box').on('click', 'span', function(){
			$(this).siblings('span').removeClass('current').end().addClass('current');

			screenGrid = $(this).data('grid');
		});

		$animateName.on('change', function(){
			if( $animateName.val().trim() !== '' ){
				$animateName.next('span').hide();
			}else{
				$animateName.next('span').show();
			}
		});

		$('footer button.btn-submit', $setting).click(function(e){
			var name = $animateName.val().trim(),
				dtd = null;

			// 新建 or 修改
			if( status === 'edit' ){
				Design.edit(animateModel.val());

				animateName.val(name);
			}else{
				if( !name.length ){
					$animateName.val(name).focus();
					$animateName.next('span').show();

					return;
				}

				animateName.val(name);

				status === 'new' && Design.add(screenGrid);
			}

			$setting.dialog('close');
		});

		$('div.nav a.bar-a-property').click(function(e){
			e.preventDefault();

			status = 'property';

			dialog();
		});

		$('div.nav a.bar-a-submit').click(function(e){
			e.preventDefault();

			$form.submit();
		});

		$form.on('submit', function(){
			try{
				animateContent.val(Design.getHTML());
				animateModel.val(Design.getModel());

				return true;
			}catch(e){
				return false;
			}
		});
	}	

	// 代码
	function snippet(){
		var $snippet = $('#snippet'),
			snippetCode = null;

		$('div.nav a.bar-a-code').one('click.codemirror', function(){
			var textarea = $('section textarea', $snippet);

			textarea.val(Design.getHTML());

			snippetCode = CodeMirror.fromTextArea(textarea[0], {
				lineNumbers  : true,
				lineWrapping : true,
				mode         : "xml",
				theme        : 'rubyblue'
	        });

	        $.use('ui-flash-clipboard', function() {
                var styleObj = 'clipboard{text:拷贝代码;color:#ffffff;fontWeight:700;fontSize:13;font-weight:bold;font: 12px/1.5 Tahoma,Arial,"宋体b8b\4f53",sans-serif;}';
                
                $snippet.find('header a.submit').flash({
                    module : 'clipboard',
                    width: 164,
                    height: 50,
                    flashvars : {
                        style : encodeURIComponent(styleObj)
                    }
                }).on("swfReady.flash", function() {
                }).on("mouseDown.flash", function() {
                    $(this).flash("setText", snippetCode.getValue());
                }).on("complete.flash", function(e, data) {
                	$snippet.find('div.msg').text('复制成功！').slideDown(300).delay(3000).slideUp(300);
                });
            });
		}).click(function(e){
			e.preventDefault();

			$snippet.addClass('md-show');
			snippetCode.setValue(Design.getHTML());
		});

		$('a.close', $snippet).click(function(e){
			e.preventDefault();

			$snippet.removeClass('md-show');
		});
	}

	var toolbox = {
		init: function(){
			var key, item = null;

			this.container = $('#toolbox');

			for( key in this ){
				item = this[key];

				if( typeof item === 'function' && key !== 'init' ){
					this[key]();
				}
			}
		},
		tab: function(){
			var self = this;

			$.use('ui-tabs', function(){
            	self.container.tabs({
                    isAutoPlay:false, 
                    event:'click'
                });
            });  
		},
		bindEvent: function(){
			var self = this;

			Design.upload($('div.background div.btnUpadte', self.container));
		}
	};

	$(function(){
		pageOpen();
		toolbox.init();
		snippet();
	});
})(jQuery, FE.tools.design);