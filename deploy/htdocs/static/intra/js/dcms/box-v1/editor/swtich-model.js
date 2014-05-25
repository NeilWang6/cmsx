/**
 * @author hongss
 * @userfor �߼�/�򵥱༭ģʽ�л�
 * @date  2012.12.24
 * @rely /dropin-page.js
 * @modify  
 */

(function($, D) {
    var readyFun = [
        function(){
            $('.js-switch').click(function(e){
                e.preventDefault();
                var el = $(this),
                    toModel = el.data('tomodel'),
                    txtEl = el.find('.txt'),
                    iconEl = el.find('.icon-model'),
                    tabCurEl = $('#page');
                
                tabCurEl.data('val', toModel);
                //���¼��Ķ���д��dropin-page.js�� _levelListener ������
                tabCurEl.trigger('click'); 
                

                //����С�����༭�������žʹ����رա�����༭�����¼���
                //���¼��Ķ���д��init-menutab.js �� beforeClose �ص���
                $('#module .icon-close').trigger('click');
                
                iconEl.toggleClass('simple');
                var iframe = $('#dcms_box_main').contents();
                switch (toModel){
                    case 'module':
                        txtEl.text('��');
                        el.data('tomodel', 'label');
                        //�л����߼�ģʽ������SELECTAREA������
                        iframe.find('.chagenTarget').hide();
                        var select = new D.selectArea();
                        select.closeMao(iframe.find('.chagenTarget'),false);
                        // iframe.find('.position-conrainer').hide();
                        break;
                    case 'label':
                        el.data('tomodel', 'module');
                        txtEl.text('�߼�');
                        //�л�����ģʽ����ʾA��ǩ
                        //iframe.find('a.map-position-bg').show();

                        break;
                }
            });
        }
    ];
    
    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(dcms, FE.dcms);