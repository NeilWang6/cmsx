
/*ajax class*/
function HttpRequest() {
	this.handler = HttpRequest.exception;
}
/*this will be create an object*/
var http = new HttpRequest();
/*set debug initialize value*/
HttpRequest.debug_enable = false;
/*this is get method for request*/
HttpRequest.prototype.get = function (url, callback, data, asyn) {
	data = (data === undefined) ? null : data;
	asyn = (asyn === undefined) ? true : asyn;
	var self = this;
	var request_object = HttpRequest.createXML();
	if (asyn) {
		request_object.onreadystatechange = function () {
			HttpRequest.calls(request_object, callback, data, self);
		};
	}
	request_object.open("GET", url, asyn);
	if (HttpRequest.debug_enable) {
		HttpRequest.debug(callback);
	}
	request_object.send(null);
	if (asyn) {
		return request_object;
	} else {
		HttpRequest.calls(request_object, callback, data, self);
	}
};
/*defined get method*/
var get = http.get;
/*this is post method*/
HttpRequest.prototype.post = function (url, param, callback, data, asyn) {
	data = (data === undefined) ? null : data;
	asyn = (asyn === undefined) ? true : asyn;
	var self = this;
	var request_object = HttpRequest.createXML();
	if (asyn) {
		request_object.onreadystatechange = function () {
			HttpRequest.calls(request_object, callback, data, self);
		};
	}
	request_object.open("POST", url, asyn);
	if (HttpRequest.debug_enable) {
		HttpRequest.debug(callback);
	}
	request_object.setRequestHeader("Content-length", param.length);
	request_object.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request_object.send(param);
	if (asyn) {
		return request_object;
	} else {
		HttpRequest.calls(request_object, callback, data, self);
	}
};
/*defined post method*/
var post = http.post;
HttpRequest.prototype.e_handler = function (func) {
	if (func !== undefined) {
		this.handler = func;
	}
};
/*this method will be create http reqeust object and return*/
HttpRequest.createXML = function () {
	var http_request;
	var xmlhttp = new Array("Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP");
	for (var i = 0; i < xmlhttp.length; i++) {
		try {
			if (http_request = new ActiveXObject(xmlhttp[i])) {
				break;
			}
		}
		catch (e) {
			http_request = null;
		}
	}
	if (!http_request && typeof XMLHttpRequest != "undefined") {
		http_request = new XMLHttpRequest();
	}
	if (!http_request) {
		alert("Could not create connection object.");
	}
	return http_request;
};
/*this is callback method to deal with thing when return http request object*/
HttpRequest.calls = function (req, callback, data, obj) {
	if (req.readyState == 4) {
		if (req.status != 200) {
			if (obj.handler) {
				obj.s(req, callback);
			}
		} else {
			//alert(req);
			callback(req, data);
		}
	}
};
/*this is debug method*/
HttpRequest.debug = function (func) {
	alert("running: " + HttpRequest.fname(func));
};
/*this is exception*/
HttpRequest.exception = function (req, callback) {
	alert(req.statusText + "\nShould run: " + HttpRequest.fname(callback));
};
/*return array elements*/
HttpRequest.fname = function (func) {
	var s = func.toString();
	return s.slice(9, s.indexOf(")", 10)) + ")";
};



