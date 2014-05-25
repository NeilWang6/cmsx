/**
 * @author shanshan.hongss
 * @userfor  ���زĿ�ѡ��
 * @date  2013-08-26
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

(function($, D) {
    $(function(){
        $(document).delegate('.lib-material', 'click', function(){
            var input = $(this),
                popTreeEl = input.nextAll('#dgPopTree'),
                idInputEl = input.nextAll('.lib-ids'),
                mCheckBoxEls = popTreeEl.find('[name=material]'),
                ids = idInputEl.val();
            
            ids = idInputEl.val().split(',');
            mCheckBoxEls.prop('checked', false);
            for (var i=0, l=ids.length; i<l; i++){
                
                mCheckBoxEls.each(function(){
                    var el = $(this);
                    if (el.val()==ids[i]){
                        el.prop('checked', true);
                    }
                });
            }
            popTreeEl.show();
        });
        
        $(document).delegate('#dgPopTree .close-btn, #dgPopTree .cancel-btn', 'click', function(){
            var popTreeEl = $(this).closest('#dgPopTree');
            popTreeEl.hide();
        });
        
        $(document).delegate('#dgPopTree .submit-btn', 'click', function(){
            var submitBtn = $(this),
                popTreeEl = submitBtn.closest('#dgPopTree'),
                mCheckBoxEls = popTreeEl.find('[name=material]'),
                idInputEl = popTreeEl.prevAll('.lib-ids'),
                mInputEl = popTreeEl.prevAll('.lib-material'),
                ids = [],
                names = [];;
            
            mCheckBoxEls.each(function(){
                if (this.checked){
                    var input = $(this);
                    ids.push(input.val());
                    names.push(input.next('.m-name').text());
                }
            });
            idInputEl.val(ids.join());
            mInputEl.val(names.join());
            popTreeEl.hide();
        });
    })
})(dcms, FE.dcms);

