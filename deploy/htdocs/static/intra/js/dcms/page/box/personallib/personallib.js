/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-11-10
 */

;(function($, D) {
    var form = $('#js-search-page'), url = D.domain + '/page/box/json.html?_input_charset=UTF8';
    ;
    // �������
    function apply(personalId, callback) {
        if(personalId) {
            // �������
            var data = {
                "action" : "PersonalLibAction",
                'event_submit_do_apply' : true,
                "personalId" : personalId,
                "applyText" : ""
            };
            $.post(url, data, callback, 'json');
        }
    }

    // ɾ��
    function remove(personalId, callback) {
        if(personalId) {
            // �������
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
     * ��Ŀ����
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
     * ����
     */
    function() {
        //����
        $(".oper-bar .btn-apply").click(function(e) {
            e.preventDefault();
            var personalId = $(this).data("id");
             
            FE.dcms.Msg.confirm({
                'title' : '��ʾ',
                'body' : '<b>' + $(this).data("name") + '</b> �������Ϊ�زĿ�' + $(this).data("type") + '����ȷ���Ƿ�����!',
                success : function(evt) {
                    apply(personalId, function(o) {
                        if(o) {
                            if(o.success) {
                                location.reload();
                            } else if(o.errorcode) {
                                if('empty' == o.errorcode) {
                                    FE.dcms.Msg.alert({
                                        'title' : '�������ʧ��',
                                        'body' : '�������Ϊ��!'
                                    });
                                } else if('status' == o.errorcode) {
                                    FE.dcms.Msg.alert({
                                        'title' : '�������ʧ��',
                                        'body' : '�Ѿ��������!'
                                    });
                                }
                            }
                        }
                    });
                }
            });
     

        });

        //ɾ��
        $(".oper-bar .btn-delete").click(function(e) {
            e.preventDefault();
            var elm = $(this), personalId = elm.data("id");
            FE.dcms.Msg.confirm({
                'title' : '��ʾ',
                'body' : '<b>' + $(this).data("name") + '</b> ���Ƿ���Ҫɾ����',
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

        // �رվܾ�����
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
