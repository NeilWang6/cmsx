function aliclick(b,c){var a="http://stat.1688.com/tracelog/click.html";return baseClick(a,c);}function etcclick(b,c){var a="http://stat.1688.com/etclistquery.html";return baseClick(a,c);}function eeclick(b,c){var a="http://stat.1688.com/ee.html";return baseClick(a,c);}function aliclickType(a,b){var d=window.location.href;if(d){var c=d.substring(d.lastIndexOf("/")+1,d.lastIndexOf("."));}aliclick(a,b+"_"+c);}function baseClick(a,c){if(typeof window.dmtrack!="undefined"){dmtrack.clickstat(a,c);}else{var b=new Date();if(document.images){(new Image).src=a+c+"&time="+b.getTime();}}return true;}