/*
@Author hongss
@Date 2011-07-05
*/
(function($, D){
    var now = new Date(),
    lastDay = new Date(Date.parse(now)-24*3600*1000);
    
    /*注册时间控件*/
    D.setDatepicker = function(startEl, endEl){
        var startDateVal = startEl.val(),
        endDateVal = endEl.val(),
        beginDateObj = startEl.datepicker({
            triggerType: 'focus',
            maxDate: lastDay,
            select: function(e, ui){
                doSelect(this, e, ui);
                startDateVal = $(this).val();
                $(this).datepicker('hide');
            },
            beforeShow: function(){
                if (endDateVal){
                    beginDateObj.datepicker('setOption', 'maxDate', new Date.parseDate(endDateVal));
                }
            }
        }),
        endDateObj = endEl.datepicker({
            triggerType: 'focus',
            maxDate: lastDay,
            select: function(e, ui){
                doSelect(this, e, ui);
                endDateVal = $(this).val();
                $(this).datepicker('hide');
            },
            beforeShow: function(){
                if (startDateVal){
                    endDateObj.datepicker('setOption', 'minDate', new Date.parseDate(startDateVal));
                }
            }
        });
    }
    
    /*返回开始和结束时间*/
    D.getDate = function(startEl, endEl){
        var beginDateVal = startEl.val(),
        endDateVal = endEl.val();
        if (beginDateVal && endDateVal){
            var frontDate = coundDate(endDateVal, -14);
            if (new Date.parseDate(beginDateVal)<frontDate){
                beginDate = beginDateVal = frontDate.format();
                startEl.val(beginDateVal);
            } else {
                beginDate = beginDateVal;
            }
            endDate = endDateVal;
            return [beginDate, endDate];
        }
        if (!(beginDateVal || endDateVal)){
            beginDate = beginDateVal = new Date(Date.parse(now)-7*24*3600*1000).format();
            endDate = endDateVal = lastDay.format();
            startEl.val(beginDateVal);
            endEl.val(endDateVal);
            return [beginDate, endDate];
        }
        if (!beginDateVal && endDateVal){
            var frontDate = coundDate(endDateVal, -14);
            beginDate = beginDateVal = frontDate.format();
            startEl.val(beginDateVal);
            endDate = endDateVal;
            return [beginDate, endDate];
        }
        if (beginDateVal && !endDateVal){
            var lastDate = coundDate(beginDateVal, 14);
            if (lastDay < lastDate){
                endDate = endDateVal = lastDay.format();
            } else {
                endDate = endDateVal = lastDate.format();
            }
            endEl.val(endDateVal);
            return [beginDate, endDate];
        }
    }
    
    function doSelect(el, e, ui){
        $(el).val(ui.date.format());
    }
    //返回计算后的日期（可比较的）
    function coundDate(start, d){
        var startDate = new Date.parseDate(start);
        return new Date(Date.parse(startDate) + d*24*3600*1000);
    }
})(dcms, FE.dcms);