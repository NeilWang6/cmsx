/**
 * @author shanshan.hongss
 * @usefor VIP��������
 * @date   2012.09.23
 */
 
jQuery.namespace('FE.topic');
;(function($, T){
    var formValid,
        domain = $('#domain-url').val(),
        checkOffer = $('.check-offer'),
        readyFun = [
        //������
        function(){
            $.use('ui-dialog, ui-core', function(){
                //���������ʵ���Ϣ��ʾ��
                var dialogNopass = $('#dialog-no-pass').dialog({
                    center: true,
                    fixed: true,
                    shim: true
                });
                $('#dialog-no-pass .dpl-close, #dialog-no-pass .btn-know').click(function(e){
                    e.preventDefault();
                    dialogNopass.dialog('close');
                });
                
                //����offer�ɹ�����Ϣ��ʾ��
                var dialogSuccess = $('#dialog-success').dialog({
                    center: true,
                    fadeIn: 200,
                    fadeOut: 200,
                    timeout: 3000,
                    shim: true,
                    modal: false
                });
                
                //����offerʧ�ܵ���Ϣ��ʾ��
                var dialogFaile = $('#dialog-faile').dialog({
                    center: true,
                    fixed: true,
                    fadeIn: 200,
                    fadeOut: 200,
                    shim: true
                });
                $('#dialog-faile .dpl-close, #dialog-faile .btn-cancel').click(function(e){
                    e.preventDefault();
                    dialogFaile.dialog('close');
                });
            });
        },
        //��ҳ��ȷ������ť �¼�
        function(){
            $('.dpl-paging .mygod').click(function(e){
                e.preventDefault();
                var btn = $(this),
                    pageNum = parseInt(btn.closest('.dpl-paging').find('.dpl-number input').val()),
                    total = parseInt(btn.data('total')),
                    pageUrl = btn.data('pageurl');
                pageNum = (pageNum>total) ? total : pageNum ;
                location.href = pageUrl + pageNum;
            });
        },
        //��Ŀ����
        function(){
            var cateEl1 = $('.search .category-1st'),
                cateEl2 = $('.search .category-2nd'),
                cateEl3 = $('.search .category-3rd');
            
            $.use('util-json', function(){
                var cateTreeVal = $.parseJSON($('#cate-tree').val());
                cateEl1.html(getCateHtml(cateTreeVal['0']));
                cateEl2.html(getCateHtml(cateTreeVal[cateEl1.val()], '<option value="">ѡ��</option>'));
                
                cateEl1.change(function(e){
                    var val = $(this).val();
                    cateEl2.html('<option value="">ѡ��</option>').html(getCateHtml(cateTreeVal[val], '<option value="">ѡ��</option>'));
                    cateEl3.html('<option value="">ѡ��</option>');
                });
                
                cateEl2.change(function(e){
                    var val = $(this).val();
                    cateEl3.html(getCateHtml(cateTreeVal[val], '<option value="">ѡ��</option>'));
                });
                
                //��ʼ�����е���Ŀֵ
                var cateEl = $('#cates'),
                    cateVal = cateEl.val();
                if (cateEl.length>0 && cateVal){
                    cateVal = cateVal.split(',');
                    cateEl2.html(getCateHtml(cateTreeVal[cateVal[0]], '<option value="">ѡ��</option>'));
                    cateEl3.html(getCateHtml(cateTreeVal[cateVal[1]], '<option value="">ѡ��</option>'));
                    
                    setTimeout(function(){
                        cateEl1.val(cateVal[0]);
                        cateEl2.val(cateVal[1]);
                        cateEl3.val(cateVal[2]);
                    }, 0);
                    
                }
                
                //������Ŀ����
                var typeCon = $('#join-type dd');
                $('#submit-cate').click(function(e){
                    requestType(cateEl1, cateEl2, cateEl3, typeCon);
                });
                
                var tEl = $('#topic-id'),
                    tId = (tEl.length>0) ? $('#topic-id').val() : '';
                
                if (tId){
                    setTimeout(function(){
                        requestType(cateEl1, cateEl2, cateEl3, typeCon, tId);
                    }, 0);
                }
            });
        },
        //�����ύ��offer�����ֲ�
        function(){
            $('li[data-disabled=true]').each(function(i, el){
                var el = $(el),
                    td = el.closest('td.item-offer'),
                    elOffs = el.offset(),
                    tdOffs = td.offset(),
                    tdHeight = td.outerHeight(),
                    cover = el.find('.cover');
                
                td.find('li:not(.list-critical li)').add(td.find('.td-info')).css('zIndex', '1');
                
                if (cover.length===0){
                    cover = $('<div class="cover"><div class="cover-overlay"></div><span class="cover-txt">�������ύ</span></div>');
                    el.append(cover);
                }
                cover.css('top', (tdOffs['top']-elOffs['top'])+'px');
                //.css('left', (tdOffs['left']-elOffs['left'])+'px');
                cover.height(tdHeight);
                $('.cover-txt', cover).css('top', (tdHeight-32)/2 + 'px');
            });
        },
        //ȫѡ
        function(){
            $('.check-all').click(function(){
                var isChecked = this.checked;
                checkOffer.each(function(i, el){
                    if (!el.disabled){
                        var el = $(el);
                        el.prop('checked', isChecked);
                        
                        el.trigger('change');
                    }
                });
            });
        },
        //ѡ��󣬿ɲ�����������֤
        function(){
            checkOffer.change(function(e){
                var el = $(this),
                    //itemOffer = el.closest('td.item-offer'),
                    itemOffer = el.closest('tbody'),
                    issku = el.data('issku');
                
                //if (el.filter(':checked').length>0){
                if (this.checked){
                    if (issku===true){
                        var normsEls = itemOffer.find('.list-norms input'),
                            criticalEl = itemOffer.find('.critical');
                        //normsEls.prop('checked', true).prop('disabled', false).removeClass('disabled');
                        
                        //normsEls.prop('checked', true);
                        //��֤���Թ��
                        //checkNorms(normsEls);
                        
                        normsEls.each(function(i, el){
                            var $el = $(el);
                            //$el.prop('disabled', false).prop('checked', true).removeClass('disabled');
                            el.disabled = false;
                            el.checked = true;
                            $el.removeClass('disabled');
                            
                            $el.trigger('change');
                        });
                        
                        
                        criticalEl.removeAttr('disabled').removeClass('disabled');
                        //��֤����
                        formValid.active(criticalEl, true);
                        formValid.valid(criticalEl, {'required':true});
                        
                    } else {
                        var inputs = itemOffer.find('input:not(.check-offer)');
                        inputs.removeAttr('disabled').removeClass('disabled');
                        
                        //��֤����������Ϣ
                        inputs.each(function(i, el){
                            var el = $(this);
                            
                            formValid.active(el, true);
                            formValid.valid(el, {'required':true});
                        });
                    }
                } else {
                    var inputs = itemOffer.find('input:not(.check-offer)');
                    inputs.attr('disabled', 'disabled')
                        .addClass('disabled').removeClass('dpl-text-error');
                    itemOffer.find('.dpl-tip-simple').removeClass('tip-error');
                    if (issku===true){
                        var normsEls = itemOffer.find('.list-norms input:checked');
                        normsEls.removeAttr('checked');
                    }
                    
                    formValid.active(inputs.filter('input[data-valid]'), false);
                }
            });
            
            //��Ʒ���� change�¼���
            $('#tbody-offers').delegate('.list-norms input', 'change', function(e){
                var el = $(this),
                    itemSku = el.closest('tr'),
                    itemOffer = el.closest('tbody'),
                    priceEl = itemSku.find('ul.list-price input.dpl-text'),
                    totalEl = itemSku.find('ul.list-total input.dpl-text');
                    //i = normsEls.index(el),
                    //priceEl = priceEls.eq(i),
                    //totalEl = totalEls.eq(i);
                if (this.checked){
                    priceEl.removeAttr('disabled').removeClass('disabled');
                    totalEl.removeAttr('disabled').removeClass('disabled');
                    
                    //�Ƴ�����Ĵ�����ʾ
                    itemOffer.find('.td-info .dpl-tip-simple').removeClass('tip-error');
                    //��֤�����ۺ͹�����
                    formValid.active(priceEl, true);
                    formValid.valid(priceEl, {'required':true});
                    formValid.active(totalEl, true);
                    formValid.valid(totalEl, {'required':true});
                    
                } else {
                    var normsEls = itemOffer.find('ul.list-norms input');
                    priceEl.attr('disabled', 'disabled').addClass('disabled').removeClass('dpl-text-error');
                    totalEl.attr('disabled', 'disabled').addClass('disabled').removeClass('dpl-text-error');
                    
                    //�Ƴ�priceEl��totalEl�еĴ�����ʾ
                    priceEl.closest('li').find('.dpl-tip-simple').removeClass('tip-error');
                    totalEl.closest('li').find('.dpl-tip-simple').removeClass('tip-error');
                    
                    formValid.active(priceEl, false);
                    formValid.active(totalEl, false);
                    
                    //������֤���Թ��
                    checkNorms(normsEls, false);
                }
            });
            
            //$('.list-total input').change(function(e){
            $('#tbody-offers').delegate('.list-total input', 'change', function(e){
                var criticalEl = $(this).closest('tbody').find('.list-critical input.critical');
                formValid.valid(criticalEl);
            });
        },
        //�����޸�SKU�۸�
        function(){
            //�����������ļۡ������ָļ۸�����
            $('#tbody-offers').delegate('span.s-batch-price', 'click', function(e){
                e.preventDefault();
                var editPriceEl = $(this).next('.edit-batch-price');
                editPriceEl.parent().css('zIndex', 5);
                editPriceEl.show();
                editPriceEl.find('input.input-batch-price').focus();
            });
            
            //���޸ĵļ۸�Ӧ�õ�����sku��
            $('#tbody-offers').delegate('button.btn-batch-price', 'click', function(e){
                e.preventDefault();
                var inputPrice = $(this).siblings('input.input-batch-price'),
                    bPrice = $.trim(inputPrice.val()),
                    validPrice = T.checkPrice.call(inputPrice);
                
                if (validPrice===true){
                    var priceEls = inputPrice.closest('.table-sub-info').find('ul.list-price input.dpl-text'),
                        editPriceEl = inputPrice.closest('.edit-batch-price');
                    priceEls.val(bPrice);
                    hideBatchPricePlane(editPriceEl, inputPrice);
                } else {
                    var tip = inputPrice.siblings('.dpl-tip-simple');
                    $('.dpl-txt', tip).text(validPrice);
                    tip.addClass('tip-error');
                    inputPrice.addClass('dpl-text-error');
                }
            });
            
            //���document�������ط�ʹ�����޸ļ۸��������
            $(document).bind('mousedown', function(e){
                var target = $(e.target);
                if (target.closest('.edit-batch-price').length===0){
                    hideBatchPricePlane($('div.edit-batch-price:visible', '#tbody-offers'));
                }
            });
        },
        //��Ԫ����֤
        function(){
            var validEls = $('input[data-valid]');
            $.use('web-valid', function(){
                formValid = new FE.ui.Valid(validEls, {
                    onValid: function(res, o){
                        var el = $(this),
                            tip = el.closest('li').find('.dpl-tip-simple'), 
                            msg;
                        if (tip.length>1){
                            for (var i=0, l=tip.length-1; i<l; i++){
                                tip.eq(i).remove();
                            }
                        }
                        if (res==='pass' || res==='default') {
                            tip.removeClass('tip-error');
                            el.removeClass('dpl-text-error');
                        } else {
                            switch (res){
                                case 'required':
                                    msg = o.key+'����';
                                    break;
                                case 'float' :
                                case 'int' :
                                    msg = '��������ȷ������';
                                    break;
                                case 'min' :
                                    msg = '���������0������';
                                    break;
                                case 'fun' :
                                    msg = o.msg;
                                    break;
                                /*default:
                                    msg = '����д��ȷ������';
                                    break;*/
                            }
                            $('.dpl-txt', tip).text(msg);
                            tip.addClass('tip-error');
                            el.addClass('dpl-text-error');
                        }
                    }
                });
            });
        },
        //�ύ��
        function(){
            var formOffer = $('#form-offer-info'),
                inputOffer = $('#content-offer-info'),
                dialogPrompt;
            
            //������룬��ʾ��ʾ�Ի���
            $('.btn-join').click(function(e){
                //formOffer.trigger('submit');
                var isValid = submitValid(inputOffer);
                if (isValid===true){
                    dialogPrompt = $('#dialog-prompt').dialog({
                        center: true,
                        fixed: true,
                        shim: true
                    });
                }
            });
            //��ȡ�����򡰹رա���ʾ�Ի���
            $('#dialog-prompt .dpl-close, #dialog-prompt .btn-cancel').click(function(e){
                e.preventDefault();
                dialogPrompt.dialog('close');
            });
            //��ȷ������ʾ�Ի���
            $('#dialog-prompt').delegate('.btn-submit', 'click', function(e){
				$(this).removeClass('dpl-btn-action btn-submit').addClass('dpl-btn-disabled');
                formOffer.trigger('submit');
            });
            
            //�Ƿ�ѡ����ͬ�⡱��ѡ��
            var radio = $('#dialog-prompt .radio-agree'),
                btn = $('#dialog-prompt .dpl-btn-action');
            setBtnStatus(radio, btn);
            radio.change(function(e){
                setBtnStatus($(this), btn);
            });
            
        }
    ];
    
    //���������޸ļ۸����
    function hideBatchPricePlane(plane, inputPrice){
        if (plane[0]){
            inputPrice = inputPrice || plane.find('.input-batch-price');
            plane.find('.dpl-tip-simple').removeClass('tip-error');
            inputPrice.val('');
            inputPrice.removeClass('dpl-text-error');
            plane.parent().css('zIndex', 0);
            plane.hide();
        }
    }
    
    function setBtnStatus(radio, btn){
        if (radio.filter(':checked').length>0){
            btn.removeClass('dpl-btn-disabled').addClass('dpl-btn-action btn-submit');
        } else {
            btn.removeClass('dpl-btn-action btn-submit').addClass('dpl-btn-disabled');
        }
    }
    
    //�ύ��ǰ�Ա���ͳһ��֤,������json����
    function submitValid(inputOffer){
        var isValid = formValid.valid();
        if (isValid){
            var data = [];
            $('.check-offer:checked').each(function(i, checkbox){
                var checkbox = $(checkbox),
                    issku = checkbox.data('issku'),
                    //tr = checkbox.closest('tr'),
                    itemOffer = checkbox.closest('tbody'),
                    offer = {};
                if (issku===true){
                    var normsEls = itemOffer.find('.list-norms input:checked');
                    if (checkNorms(normsEls, false)===true){
                        var skuInfo = [];
                        normsEls.each(function(i, el){
                            var el = $(el),
                                skuItem = {},
                                itemSkuEl = el.closest('tr');
                            skuItem['specId'] = el.val();
                            skuItem['price'] = itemSkuEl.find('.list-price input.dpl-text').val();
                            skuItem['quantity'] = itemSkuEl.find('.list-total input.dpl-text').val();
                            skuInfo.push(skuItem);
                        });
                        offer['skuInfo'] = skuInfo;
                    } else {
                        isValid = false;
                        return;
                    }
                } else {
                    offer['price'] = itemOffer.find('.list-price input').val();
                    offer['quantity'] = itemOffer.find('.list-total input').val();
                }
                offer['offerId'] = checkbox.val();
                offer['isSKU'] = issku;
                offer['quantityBegin'] = itemOffer.find('.critical').val();
                data.push(offer);
            });
            if (data.length>0){
                inputOffer.val(JSON.stringify({'data':data}));
            } else {
                isValid = false;
            }
        }
        return isValid;
    }
    //ƴװ��Ŀѡ���HTML����
    function getCateHtml(cateData, prefix){
        var html = prefix || '';
        if (!cateData){ return html; }
        for (var i=0, l=cateData.length; i<l; i++){
            html += '<option value="'+cateData[i]['id']+'">'+cateData[i]['name']+'</option>';
        }
        return html;
    }
    
    function requestType(cateEl1, cateEl2, cateEl3, typeCon, tid){
        var url = domain+'/vip_auto_rule_name.json',
            data = {};
        data['c1'] = cateEl1.val();
        data['c2'] = cateEl2.val();
        data['c3'] = cateEl3.val();
        $.ajax(url, {
            data: data,
            dataType: 'jsonp',
            success: function(o){
                var rules = o['rules'],
                    html = '', current='';
                
                if (o.success===true && rules){
                    for (var i=0,l=rules.length; i<l; i++){
                        if (tid && tid==rules[i]['id']){
                            current = ' current';
                        } else {
                            current = '';
                        }
                        html += ' <a href="'+rules[i]['url']+'" class="btn-type'+current+'">'+rules[i]['name']+'</a>';
                    }
                    typeCon.html(html);
                } else {
                    typeCon.html('');
                }
            }
        });
    }
    
    //��֤���Թ��
    function checkNorms(normsEls, isTrigger){
        var isChecked = false;
        isTrigger = (typeof isTrigger==='undefined') ? true : isTrigger;
        normsEls.each(function(i, el){
            var el = $(this);
            if (this.checked){
                isChecked = true;
                if (isTrigger===true){
                    el.trigger('click');
                }
            }
        });
        
        if (isChecked===false){
            var el = normsEls.eq(0),
                tip = el.closest('td').find('.dpl-tip-simple');
            tip.addClass('tip-error');
            $('.dpl-txt', tip).text('����ѡ��һ�����Թ��');
            
            return isChecked;
        } else {
            var el = normsEls.eq(0);
            el.closest('td').find('.dpl-tip-simple').removeClass('tip-error');
            
            return isChecked;
        }
    }
    
    //��֤������
    T.checkPrice = function (){
        var el = $(this),
            isFloat = /^\d+(\.\d{1,2})?$/,
            val = el.val(),
            //tr = el.closest('tr'),
            //itemOffer = el.closest('td.item-offer'),
            price = parseFloat(val),
            thrPrice = parseFloat(el.siblings('.threshold-price').eq(0).val());
            //low = parseFloat(itemOffer.find('.price-low').text()),
            //hight = parseFloat(itemOffer.find('.price-hight').text());
            
        if (val){
            if (!isFloat.test(val)){
                return '��������ౣ����λС��';
            }
            if (price>thrPrice){
                return '�����۲��ܴ���'+thrPrice+'Ԫ';
            }
            if (price<=0){
                return '�����۱������0';
            }
            /*if (price>low){
                return '�����۲��ܴ�����Ʒ����ͱ���';
            }
            if (price>hight){
                return '�����۲��ܸ�����Ʒ����߱���';
            }*/
        } else {
            return '�����۱���';
        }
        
        return true;
    }
    //��֤������
    T.checkTotal = function (){
        var el = $(this),
            val = el.val(),
            isInt = /^\d{1,9}$/,
            threshold = parseInt(el.siblings('.threshold').eq(0).val());
        
        if (val){
            if (!isInt.test(val)){
                return '������������������';
            }
            if (parseInt(val)<threshold){
                return '��������������'+threshold;
            }
        }
        return true;
    }
    //��֤������
    T.checkCritical = function (){
        var el = $(this),
            val = el.val(),
            isInt = /^\d{1,9}$/,
			threshold = parseInt(el.siblings('.threshold-qb').eq(0).val()),
            totalEls = el.closest('tbody').find('.list-total input.dpl-text:not(:disabled)');
		
        if (val){
            if (!isInt.test(val)){
                return '������������������';
            }
            var intVal = parseInt(val);
            if (intVal<threshold){
                return '��������������'+threshold;
            }
            //���������ܴ��ڹ�����
            for (var i=0,l=totalEls.length; i<l; i++){
                var totalVal = parseInt(totalEls.eq(i).val());
                if (intVal>totalVal){
                    return '���������ܴ��ڹ�����';
                }
            }
        }
        return true;
    }
    
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(jQuery, FE.topic);
