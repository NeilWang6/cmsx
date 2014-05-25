function aliclick(u,param)
{
	var url = "http://stat.1688.com/tracelog/click.html";
	return baseClick(url,param);
}
function etcclick(u, param) {
	var url = "http://stat.1688.com/etclistquery.html";
	return baseClick(url,param);
}
function eeclick(u, param) {
	var url ="http://stat.1688.com/ee.html";
	return baseClick(url,param);
}
function aliclickType(u, param){
	var urlTxt = window.location.href;
	if(urlTxt){
		var urlType = urlTxt.substring(urlTxt.lastIndexOf('/')+1,urlTxt.lastIndexOf('.'));
	}
	aliclick(u, param+'_'+urlType);
}
function baseClick(url,param)
{
	if (typeof window.dmtrack != "undefined") {
        dmtrack.clickstat(url, param);
    } else {
        var d = new Date();
        if (document.images) {
            (new Image).src = url + param+'&time='+d.getTime();
        }
    }
    return true;
}
