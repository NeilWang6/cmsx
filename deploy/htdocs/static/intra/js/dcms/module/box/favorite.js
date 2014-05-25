/**
 * @package FD.app.cms.box.favorite
 * @author zhaoyang.maozy
 * @date: 2012-01-14
 */
(function($, D){
    var confirmEl = $('#dcms-message-confirm'),
        buttons= [
         {
           name: 'cancel', 
           value:'确定', 
           className: 'dcms-btn submit-btn', 
           close: true
         }
       ];

    var readyFun = [
        function() {
            var delCustomMade = $('.on-made'),
                addCustomMade = $('.off-made');
            
            $(document).on('click', '.off-made', function(e) {
                e.preventDefault();
                setFavorite.add($(this));
            });
            
            $(document).on('click', '.on-made', function(e){
                e.preventDefault();
                setFavorite.del($(this));
            });
        }
    ];
    
    var setFavorite = {
        add: function(_this){
            var customId = _this.data('custom-id'),
                type = _this.data('type') || 'BP',
                text = "页面";
            
            // 已经收藏
            if(_this.hasClass('dcms-box-btn-disable')) return;
            
            if (type === "BT") {
                text = "模板";
            } else if(type == "BC") {
                text = "控件";
            }
            else if(type == "BM") {
                text = "组件";
            }
            else if(type == "BL") {
                text = "布局";
            }
            $.ajax({
                url: D.domain + "/page/favorite/favorite_add_page_screen.html",
                data: {
                    "numId" : customId,
                    "type" : type
                },
                type: "POST"
            })
            .done(function(o) {
                if (!!o) {
                    var data = $.parseJSON(o),
                        content = '';
                    
                    if ( data.requestStatus === "pageExist" ) {
                        content = "对不起,这个"+ text +"你已经收藏了!";
                    } else if ( data.requestStatus === "sucess" ) {
                        var btnText = _this.data('text');
                        _this.removeClass('off-made').addClass('on-made');
                        if (_this.hasClass('untext')){
                            _this.removeClass('off-made').addClass('on-made');
                        } else if (_this.hasClass('btn-yellow')===true){
                            _this.removeClass('off-made').addClass('on-made');
                            _this.text('取消收藏');
                        } else {
                            _this.addClass('dcms-box-btn-disable').removeClass('dcms-box-btn');
                        }
                         return;
                    } else if ( data.requestStatus === "error" ) {
                        content = "收藏失败，重试!";
                    }
                    
                    alert(content);
                }
            })
            .fail(function() {
                alert(text + '收藏失败!');
            });
        },
        del: function(_this){
            var customId = _this.data('custom-id'),
                type = _this.data('type') || 'BP';
            
            $.ajax({
                url: D.domain + D.box.editor.config.AJAX_JSONP_URL,
                data: {
                    'action' : 'BoxFavoritAction',
                    'event_submit_do_ajaxDeleteFavorit' : true,
                    'favoritId' : customId,
                    'favoritType' : type
                },
                type: 'POST',
                dataType:'json'
            }).done(function(o){
                if (o.status==='success'){
                    _this.removeClass('on-made').addClass('off-made');
                    if (_this.hasClass('untext')===false){
                        _this.text('收藏');
                    }
                } else {
                    alert('取消收藏失败!');
                }
            }).fail(function(e){
                alert('取消收藏失败!');
            });
        }
    }
    
    D.setFavorite = setFavorite;
    
    $(function(){
    	$.each(readyFun, function(i, fn){
            try {
            	fn();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }   		
    	})
     });
})(dcms, FE.dcms);
