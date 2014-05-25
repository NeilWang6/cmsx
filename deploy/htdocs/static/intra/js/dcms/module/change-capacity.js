/**
 * @package FD.app.cms.changeCapacity
 * @author: hongss
 * @Date: 2011-08-10
 */

 ;(function($, D){
     D.changeCapacity = function(els, callback, time){
         if (!$.isFunction(callback)){ return; }
         time = parseInt(time) || 1000*5; //时间单位为毫秒
         var DELAY_TIME = 200,
         INTERVAL_ID_DATA_NAME = 'dcms-intervalid',
         times = Math.round(time/DELAY_TIME);
         
         els.each(function(i){
             var self = $(this),
             width = self.outerWidth(),
             height = self.outerHeight(), 
             n = 1, intervalId, 
             elIntervalId = self.data(INTERVAL_ID_DATA_NAME);
             if (elIntervalId){
                 window.clearInterval(elIntervalId);
             }
             
             intervalId = window.setInterval(function(){
                 if (n>=times){
                     window.clearInterval(intervalId);
                 }
                 var tempWidth = self.outerWidth(),
                 tempHeight = self.outerHeight();
                 if (width!==tempWidth || height!==tempHeight){
                     width = tempWidth;
                     height = tempHeight;
                     callback.call(this, els.eq(i));
                 }
                 n++;
             }, DELAY_TIME);
             $(this).data(INTERVAL_ID_DATA_NAME, intervalId);
         }); 
     }
 })(dcms, FE.dcms);