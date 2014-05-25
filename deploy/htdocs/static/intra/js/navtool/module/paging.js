/*Paging����
 * url:���������ַ
 * Result_Deal_FuncName���������ص�����
 * @Author:Lenny
 */

function Paging(url,Result_Deal_FuncName,object){
	this.url = url;
	this.object = object;
	this.Result_Deal = Result_Deal_FuncName;
	this.num_per_page = 10;    //ÿҳ��ʾ�ļ�¼��
	this.totalRecordNum = 0;    //ÿҳ��ʾ�ļ�¼��
	this.cur_page = 1;         //��ǰҳ,��ʼΪ1
	this.sendReq = sendReq;         
	this.go_last_page = go_last_page;   
	this.go_next_page = go_next_page;  
	this.go_first_page = go_first_page;        

}
    function sendReq(page_num,callback){
		var self=this;
		self.cur_page = page_num;
		var Result_Deal=this.Result_Deal;
		//�������ַ�м���ƫ�ƺ���ʼ������);
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
								alertInfo({type:"error",content:"��ѯCMSҳ��ʧ�ܣ�"},function(){});
							}
						});	
	}
	function go_last_page(){
		if(this.cur_page>1){
			this.sendReq(this.cur_page-1)
		}else{
			alertInfo({type:"info",content:"��ǰҳ��Ϊ��һҳ"},function(){});
		}
	}
	function go_next_page(){
		if(this.cur_page<=parseInt(this.totalRecordNum/this.num_per_page)){
			this.sendReq(this.cur_page+1)
		}else{
			alertInfo({type:"info",content:"��ǰҳ��Ϊ���һҳ"},function(){});
		}
	}
	function go_first_page(){
		this.sendReq(1)
	}

