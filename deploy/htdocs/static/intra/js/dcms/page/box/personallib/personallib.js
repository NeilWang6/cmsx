/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-11-10
 */

;(function($, D) {
    var form = $('#js-search-page'), url = D.domain + '/page/box/json.html?_input_charset=UTF8';
    ;
    // …Í«Î…Û∫À
    function apply(personalId, callback) {
        if(personalId) {
            // …Í«Î…Û∫À
            var data = {
                "action" : "PersonalLibAction",
                'event_submit_do_apply' : true,
                "personalId" : personalId,
                "applyText" : ""
            };
            $.post(url, data, callback, 'json');
        }
    }

    // …æ≥˝
    function remove(personalId, callback) {
        if(personalId) {
            // …Í«Î…Û∫À
            var data = {
                "action" : "PersonalLibAction",
                'event_submit_do_deletePersonalLib' : true,
                "personalId" : personalId
            };
            $.post(url, data, callback, 'json');
        }
    }

    var readyFun = [
    /**
     * ¿‡ƒøº”‘ÿ
     */
    function() {
        var resourceType = $('#resource_type').val();
        //console.log(resourceType);
        if(resourceType) {
            switch(resourceType) {
                case 'pl_cell':
                    resourceType = 'cell';
                    break;
                case 'pl_template':
                    resourceType = 'template';
                    break;
                case 'pl_module':
                    resourceType = 'module';
                    break;
                default:
                    resourceType = 'playout';
                    break;
            }
            var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
                params : {
                    type : resourceType,
                    catalogId : '0'
                },
                id:'catogoryId',
                name:'catogoryId',
                parentId:'firstSelect',
                parentName:'topCat',
                container : 'catalog_content'
            });
            cascade.init();
        }
    },

    /**
     * ≤Ÿ◊˜
     */
    function() {
        //…Í«Î
        $(".oper-bar .btn-apply").click(function(e) {
            e.preventDefault();
            var personalId = $(this).data("id");
             
            FE.dcms.Msg.confirm({
                'title' : 'Ã· æ',
                'body' : '<b>' + $(this).data("name") + '</b> Ω´…Í«Î≥…Œ™Àÿ≤ƒø‚' + $(this).data("type") + '£¨«Î»∑»œ «∑Ò…Í«Î!',
                success : function(evt) {
                    apply(personalId, function(o) {
                        if(o) {
                            if(o.success) {
                                location.reload();
                            } else if(o.errorcode) {
                                if('empty' == o.errorcode) {
                                    FE.dcms.Msg.alert({
                                        'title' : '…Í«Î»Îø‚ ß∞‹',
                                        'body' : '»Îø‚ƒ⁄»›Œ™ø’!'
                                    });
                                } else if('status' == o.errorcode) {
                                    FE.dcms.Msg.alert({
                                        'title' : '…Í«Î»Îø‚ ß∞‹',
                                        'body' : '“—æ≠…Í«Î»Îø‚!'
                                    });
                                }
                            }
                        }
                    });
                }
            });
     

        });

        //…æ≥˝
        $(".oper-bar .btn-delete").click(function(e) {
            e.preventDefault();
            var elm = $(this), personalId = elm.data("id");
            FE.dcms.Msg.confirm({
                'title' : 'Ã· æ',
                'body' : '<b>' + $(this).data("name") + '</b> ƒ„ «∑Ò–Ë“™…æ≥˝£ø',
                'noclose' : true,
                success : function(evt) {
                    remove(personalId, function(o) {
                        if(o && o.success) {
                            elm.parents("li").remove();
                            evt.data.dialog.dialog('close');
                        }
                    });
                }
            });
        });

        // πÿ±’æ‹æ¯¿Ì”…
        $(".refuse .close").click(function(e) {
            e.preventDefault();
            $(this).parents('.status').remove();
        })
    },
    function() {
		$("dl.js-template").hover(function(e) {
			var that = this, self = $(that);
			if(!self.hasClass('preview')) {
				self.addClass('preview');
			}

		}, function() {
			var self = $(this);
			self.removeClass('preview');
		});

	}];

    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });

})(dcms, FE.dcms);
