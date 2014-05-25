jQuery(function($){
	// ͼ��
	$.use('ui-flash-chart', function(){    
		  var dateJson = JSON.parse($('#dateJson').val());
		  var valueJson = JSON.parse($('#valueJson').val());
		  
		  var data = {};
		  data.data = {};
		  data.data.indexAxis = {};
		  data.data.indexAxis.labels = dateJson;
		  data.data.dataSets = [];
		  var i = 0;
		  var colors = ['#00BFFF', '#008000', '#CD5C5C', '#808080', '#8FBC8F', '#9400D3', '#FFD700', '#4B0082', '#FFA07A', '#000000', '#A52A2A', '#D2691E', '#B8860B', '#8B0000', '#2F4F4F'];
		  for(var item in valueJson) {
		  	var map = {};
		  	map.name = item;
		  	map.values = valueJson[item];
		  	map.style = {};
		  	map.style.color = colors[i];
		  	data.data.dataSets.push(map);
		  	i++;
		  }
		  
	      var chart = $('#chart-container').flash({
	         module     : 'chart', 
	         type       : 'line', 
	         width      : 1200, 
	         height     : 450, 
	         flashvars  : {
	            cssUrl  : '/static/intra/css/dcms/page/dataanalysis/page-group-data-stat/chart.css',
	            data: JSON.stringify(data),
	            w : 1080
	         } 
	      }); 
	      chart.bind('data_parsed.flash',function(){ //��ݽ�����ɺ����غ�������
				var j;
				for(j = 3; j < i; j++){
					chart.flash('setDatasetVisibility', j, false); //5-11�������Ϊ���ɼ�
				}
		  }); 
	   });
    $.use('ui-datepicker, util-date', function(){
        //���ڿؼ�
        $('#date-input').datepicker({
            closable:true,
            maxDate: new Date(),
            select:function(e, ui){
                $(this).val(ui.date.format('yyyy-MM-dd'));
				$('#searchForm').submit();
            }
        });
    });
    //��ʾ\����ָ������
    $('.part-set .setting').on('click', function(e){
        e.preventDefault();
		var setEl = $(this).closest('.show-set');
        setEl.toggleClass('hide-items');
		$('#hideItems').val(setEl.hasClass('hide-items'	));
    });
    $('.part-items .close').on('click', function(e){
        $(this).closest('.show-set').addClass('hide-items');
    });
    
    //��ʾ\������ʽ���
    $('.fix-right .focus').click(function(e){
        var explainEl = $(this).next('.explain');
        if (explainEl.css('display')==='none'){
            explainEl.show(600);
        } else {
            explainEl.hide(600);
        }
    });
    
    //ѡ�еĲ�����ʾ�ڱ����
    var tableEl = $('table.t-data'),
        gItemEls = $('.part-items .group-items');
        
    resolveTableDate();

    $('.part-items').on('click', 'label', function(e){
        resolveTableDate();
        resoveCount();
    });
    
    function resolveTableDate(){
        var checkedData = getDate(gItemEls);
        resolveShowDate(checkedData, tableEl);
        resoveCount();
    }
    function getDate (gItemEls){
        var checkedData = [];
        //�ɼ���ʼ��ʱѡ�еĸ�ѡ�����
        gItemEls.each(function(){
            var itemChecked = [];
            $(this).find('input:checked').each(function(){
                itemChecked.push(this.id);
            });
            checkedData.push(itemChecked);
        });
        return checkedData;
    }
    function resolveShowDate(checkedDate, tableEl){
        var length = getLength(checkedDate),
            thEls = $('th', tableEl);
        
        //�޸�th ��colspan ���Ժ�width
        var unDateThLen = thEls.length - checkedDate.length,
            unitWidth = (100/(unDateThLen + length[0])).toFixed(2);
        
        thEls.each(function(i){
            var thEl = $(this);
            if (i<unDateThLen){
                thEl.attr('colspan', 1);
                thEl.width(unitWidth+'%');
            } else {
                var j = i-unDateThLen+1;
                thEl.attr('colspan', length[j]);
                thEl.width((unitWidth*length[j])+'%');
                if (length[j]===0){
                    thEl.css('display', 'none');
                } else {
                    thEl.css('display', '');
                }
            }
        });
        
        //��ʾ��Ӧtd
        $('td.show').removeClass('show');
        for (var i=0, l=checkedDate.length; i<l; i++){
            for (j=0, len=checkedDate[i].length; j<len; j++){
                $('.td-'+checkedDate[i][j]).addClass('show');
            }
        }
    }
    
    /* return [�����ӳ���֮��, �ӳ���1, �ӳ���2, ...]*/
    function getLength(checkedDate){
        var length = 0,
            subLength = [];
        for (var i=0, l=checkedDate.length; i<l; i++){
            var itemLen = checkedDate[i].length;
            length += itemLen;
            subLength.push(itemLen);
        }
        subLength.unshift(length);
        return subLength;
    }
    
    //��webkit�������֧��td width=0�� �ʸĳ����Ϸ���
    /*var checkedEls = $('.part-items input:checked');
    checkedEls.each(function(){
        var id = this.id,
            colEl = $('#col-'+id);
        colEl.removeClass('hidden');
        //�����Զ�����
        $('.td-'+id).addClass('show');
    });
    resoveCount();
    
    $('.part-items').on('click', 'label', function(e){
        var checkEl = $(this).find('input[type=checkbox]')[0],
            id = checkEl.id,
            colEl = $('#col-'+id);
        if (checkEl.checked){
            //colEl.removeClass('hidden');
            $('.td-'+id).addClass('show');
        } else {
            colEl.addClass('hidden');
            $('.td-'+id).removeClass('show');
        }
        
        resoveCount();
    });*/
    
    function resoveCount(){
         if ($('.part-items input:checked').length>=10){
            $('.part-items input[type=checkbox]:not(:checked)').prop('disabled', true);
        } else {
            $('.part-items input:disabled').prop('disabled', false);
        }
    }
});