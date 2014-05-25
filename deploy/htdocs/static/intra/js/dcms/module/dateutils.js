/**
 *
 * @author springyu
 */

(function($) {
    $.extend({
        //--------------------------------------------------------------------
        //作用：构造日期对象
        //用法：
        //参数：无
        //--------------------------------------------------------------------
        convertDate : function(dateStr) {
            //dateStr的格式最少为“2002-09-12"
            var theYear = dateStr.substring(0, 4);
            //sAlert(theYear);
            var theMonth = dateStr.substring(5, 7);
            //sAlert(theMonth);
            var theDate = dateStr.substring(8, 10);
            //sAlert(theDate);
            var theHour = "";
            var theMinutes = "";
            var theSeconds = "";

            if(dateStr.length > 11)//说明有时间参数了
            {
                theHour = dateStr.substring(11, 13);
                theMinutes = dateStr.substring(14, 16);
                theSeconds = dateStr.substring(17, 19);

            }
            var dateObj = new Date(theYear, theMonth - 1, theDate, theHour, theMinutes, theSeconds);
            return dateObj;
        },
        //--------------------------------------------------------------------
        //作用：日期对象求差
        //用法：
        //参数：无
        //--------------------------------------------------------------------

        dateMinus : function(dateStr1, dateStr2) {
            var date1 = this.convertDate(dateStr1);
            var date2 = this.convertDate(dateStr2);
            return Math.round((date1 - date2) / (1000 * 3600 * 24));
        },
        /**
         * 输入日期格式为：yyyy-MM-dd
         * months 月数
         * 有第三个参数则返回输入相同日期格式
         * 返回 Date
         */
        addMonth : function(dateStr, months) {
            var date1 = this.convertDate(dateStr);
            var month = date1.getMonth() + 3;
            date1.setMonth(month);
            var length = arguments.length;
            if(length == 3) {
                var theMonth = (date1.getMonth() + 1) + "";
                if(theMonth.length == 1) {
                    theMonth = "0" + theMonth;
                }
                var theDate = date1.getDate() + "";
                if(theDate.length == 1) {
                    theDate = "0" + theDate;
                }
                return date1.getFullYear() + "-" + theMonth + "-" + theDate;
            }
            return date1;
        },
        /**
         * 输入日期格式为：yyyy-MM-dd
         *  date 天数
         * 有第三个参数则返回输入相同日期格式
         * 返回 Date
         */
        addDate : function(dateStr, date) {
            var date1 = this.convertDate(dateStr);
            date1.setDate(date1.getDate() + date);
            var length = arguments.length;
            if(length == 3) {
                var theMonth = (date1.getMonth() + 1) + "";
                if(theMonth.length == 1) {
                    theMonth = "0" + theMonth;
                }
                var theDate = date1.getDate() + "";
                if(theDate.length == 1) {
                    theDate = "0" + theDate;
                }
                return date1.getFullYear() + "-" + theMonth + "-" + theDate;
            }
            return date1;
        }
    });
})(dcms);
