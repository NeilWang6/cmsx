("parseDate" in Date)||(function(c){var a=c.type;Date.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];Date.abbrMonthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];Date.format="yyyy-MM-dd";function b(d){var e="0"+d;return e.substring(e.length-2)}c.extendIf(Date.prototype,{format:function(e){var d=e||Date.format;return d.split("yyyy").join(this.getFullYear()).split("yy").join((this.getFullYear()+"").substring(2)).split("MM").join(b(this.getMonth()+1)).split("dd").join(b(this.getDate())).split("hh").join(b(this.getHours())).split("mm").join(b(this.getMinutes())).split("ss").join(b(this.getSeconds()))}});Date.parseDate=function(q,o){if(!q.trim()){return false}var j=o||Date.format,m=new Date(1970,0,1),k=j.indexOf("yyyy"),g=j.indexOf("yy"),e=j.indexOf("MM"),i=j.indexOf("dd"),h=j.indexOf("hh"),n=j.indexOf("mm"),p=j.indexOf("ss");if(k>-1){m.setFullYear(Number(q.substr(k,4)))}else{if(g>-1){m.setFullYear(Number((m.getFullYear()+"").substr(0,2)+q.substr(g,2)))}}e>-1&&m.setMonth(Number(q.substr(e,2))-1);i>-1&&m.setDate(Number(q.substr(i,2)));h>-1&&m.setHours(Number(q.substr(h,2)));n>-1&&m.setMinutes(Number(q.substr(n,2)));p>-1&&m.setSeconds(Number(q.substr(p,2)));if(isNaN(m.getTime())){return false}return m};c.namespace("jQuery.util.date");c.extendIf(c.util.date,{compare:function(e,d){if(!e||!d){return null}var g=(typeof e=="string")?this.toDate(e):e;var f=(typeof d=="string")?this.toDate(d):d;return g-f},clearTime:function(d){d.setHours(0);d.setMinutes(0);d.setSeconds(0);d.setMilliseconds(0);return d},clone:function(d){return new Date(d.getTime())},today:function(){return this.clearTime(new Date())},now:function(){return new Date()},isLeapYear:function(d){return(((d%4===0)&&(d%100!==0))||(d%400===0))},getDaysInMonth:function(d,e){return[31,(this.isLeapYear(d)?29:28),31,30,31,30,31,31,30,31,30,31][e]},parse:function(x,n){if(typeof x==="string"){n=x}else{if(!n){return x}}n=n.replace(/^\s+|\s+$/g,"");var o=this;var u=/(?:((?:(today|now)|(?:^(\d{4})[-\/](0?[1-9]|1[0-2])[-\/]([0-2][0-9]|3[01]|[0-9])))\s*(?:(?:([01][0-9]|2[0-3]|[0-9])(?:[:]([0-5]?\d))?(?:[:](\d+))?)?)?)?\s*(?:([+-])\s*(\d|\d*.?\d+)\s*([smhDWMY])$)?)?/;var p=function(d){if(typeof d==="string"){return d.replace(/^0/,"")-0}return d};var i=function(d,A,s,z){s=(A==="+")?s:(0-s);switch(z){case"Y":return o.addYears(d,s);break;case"M":return o.addMonths(d,s);break;case"W":return o.addWeeks(d,s);break;case"D":return o.addDays(d,s);break;case"h":return o.addHours(d,s);break;case"m":return o.addMinutes(d,s);break;case"s":return o.addSeconds(d,s);break}};var t=u.exec(n),m=[];if(!u.test(n)||(a(x)!=="date"&&!t[1])){throw new Error("Format error!")}c.each(t,function(d,s){if(s===undefined){s=null}else{if(d>3&&d<9){s=p(s)}}m.push(s)});var j=m[2],k=m[3],q=m[4]?(m[4]-1):null,v=m[5],g=m[6],e=m[7],w=m[8],y=m[9],h=m[10],f=m[11];if(m[1]){if(j){var r=null;switch(j){case"now":r=this.now();break;case"today":r=this.today();break}return i(r,y,h,f)}else{if(y){return i(new Date(k,q,v,g,e,w),y,h,f)}else{return new Date(k,q,v,g,e,w)}}}else{return i(x,y,h,f)}},addMs:function(d,e){d.setMilliseconds(d.getMilliseconds()+e);return d},addSeconds:function(d,e){return this.addMs(d,e*1000)},addMinutes:function(d,e){return this.addMs(d,e*60000)},addHours:function(d,e){return this.addMs(d,e*3600000)},addDays:function(d,e){return this.addMs(d,e*86400000)},addWeeks:function(d,e){return this.addMs(d,e*604800000)},addMonths:function(d,e){var f=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+e);d.setDate(Math.min(f,this.getDaysInMonth(d.getFullYear(),d.getMonth())));return d},addYears:function(d,e){return this.addMonths(d,e*12)},getWeekDays:function(e){var d=e.getDay(),f=1;l=7,days=[];for(;f<=l;f++){days.push(this.addDays(this.clone(e),f-d))}return days},isWeekday:function(d){return d.getDay()<6},isBefore:function(d,e){return d.getTime()>e.getTime()},isAfter:function(d,e){return d.getTime()<e.getTime()},isEquals:function(e,d){return e.getTime()===d.getTime()},hasDate:function(g,f){var e=this,j=function(k,n,i){var m=k.getTime();n=n.getTime();if(i){i=i.getTime()}else{return m===n}return m>=n&&m<=i};if(Object.prototype.toString.apply(f[0])==="[object Array]"){var h=0,d=f.length;for(;h<d;h++){if(j(g,f[h][0],f[h][1])){return true}}return false}else{return j(g,f[0],f[1])}}});c.extendIf(Date.prototype,c.methodize(c.util.date,null,["isLeapYear","now","today,getDaysInMonth"]));c.add("util-date")})(jQuery);