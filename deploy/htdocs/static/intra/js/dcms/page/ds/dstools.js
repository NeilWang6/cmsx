function openDialog(urlPath,width,height)
{
    var theUrl = ""+urlPath+"";
	var _width ;
	if (width){
		_width = width ;
	}else{
		_width = 800;
	}

	var _height ;
	if (height){
    	_height = height;
	}else{
    	_height = window.screen.height-200;
	}

	var left = (window.screen.width - _width )/2;
	var _top = 50;
	window.open(theUrl, "newwindow", "height="+_height+", width="+_width+", toolbar =no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no,screenX="+left+",screenY="+_top);
}
