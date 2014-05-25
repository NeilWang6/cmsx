/*Paging对象
 * url:搜索请求地址
 * Result_Deal_FuncName：结果处理回调函数
 * @Author:Lenny
 */

function Paging(url,Result_Deal_FuncName,object){
	this.url = url;
	this.object = object;
	this.Result_Deal = Result_Deal_FuncName;
	this.num_per_page = 10;    //每页显示的记录数
	this.totalRecordNum = 0;    //每页显示的记录数
	this.cur_page = 1;         //当前页,初始为1
	this.sendReq = sendReq;         
	this.go_last_page = go_last_page;   
	this.go_next_page = go_next_page;  
	this.go_first_page = go_first_page;        

}
    function sendReq(page_num,callback){
		var self=this;
		self.cur_page = page_num;
		var Result_Deal=this.Result_Deal;
		//在请求地址中加入偏移和起始索引号);
		if(this.url.indexOf("?")==-1){
			reqURL = this.url + "?pageSize="+this.num_per_page+"&page=" + page_num;
		}else{
			reqURL = this.url + "&pageSize="+this.num_per_page+"&page=" + page_num;
		}
	        			jQuery.ajax({
							url:reqURL,
							dataType:"jsonp",
							beforeSend:function(){},
							success:function(data,textStatus){
									var myjson=data;
									self.totalRecordNum=myjson.total=="undefined"?self.totalRecordNum:myjson.total;
									Result_Deal.call(self.object,myjson);
									callback && callback();	
								},
							complete:function(){
							},
							error:function(e){ 
								alertInfo({type:"error",content:"查询CMS页面失败！"},function(){});
							}
						});	
	}
	function go_last_page(){
		if(this.cur_page>1){
			this.sendReq(this.cur_page-1)
		}else{
			alertInfo({type:"info",content:"当前页已为第一页"},function(){});
		}
	}
	function go_next_page(){
		if(this.cur_page<=parseInt(this.totalRecordNum/this.num_per_page)){
			this.sendReq(this.cur_page+1)
		}else{
			alertInfo({type:"info",content:"当前页已为最后一页"},function(){});
		}
	}
	function go_first_page(){
		this.sendReq(1)
	}

