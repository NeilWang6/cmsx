/**
 * 验证字符串是否为纯数字
 * @param number 传入字符串
 * @return
 */
function isNumber(number){
    var regex = /^[0-9]*$/;
    if (!regex.test(number)) {
        return false;
    }
    return true;
}

/**
 * 验证字符串是否是数字（十进制，八进制，十六进制）
 * @param argvalue 传入字符串
 * @return
 */
function isAllDigits(argvalue){
    argvalue = argvalue.toString();
    var validChars = "0123456789";
    var startFrom = 0;
    if (argvalue.substring(0, 2) == "0x") {
        validChars = "0123456789abcdefABCDEF";
        startFrom = 2;
    }
    else 
        if (argvalue.charAt(0) == "0") {
            validChars = "01234567";
            startFrom = 1;
        }
        else 
            if (argvalue.charAt(0) == "-") {
                startFrom = 1;
            }
    
    for (var n = startFrom; n < argvalue.length; n++) {
        if (validChars.indexOf(argvalue.substring(n, n + 1)) == -1) 
            return false;
    }
    return true;
}

/**
 * 检查Email是否合法
 * @param s
 * @return
 */
function isEmail(s){
    if (s.length < 7 || s.length > 50) {
        return false;
    }
    var regu = "^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT)$"
    var re = new RegExp(regu);
    if (s.search(re) != -1) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 检查字符串是否为Null
 * @param s
 * @return
 */
function isNull(s){
    if (s == null || s == 'undefined' || s.length <= 0 || s.trim() == "") {
        return true;
    }
    return false;
}

/**
 * 检查日期是否合法
 * @param day
 * @param month
 * @param year
 * @return
 */
function isValidDate(day, month, year){
    if (month < 1 || month > 12) {
        return false;
    }
    if (day < 1 || day > 31) {
        return false;
    }
    if ((month == 4 || month == 6 || month == 9 || month == 11) &&
    (day == 31)) {
        return false;
    }
    if (month == 2) {
        var leap = (year % 4 == 0 &&
        (year % 100 != 0 || year % 400 == 0));
        if (day > 29 || (day == 29 && !leap)) {
            return false;
        }
    }
    return true;
}

/**
 * 判断url是否合法
 * @param url
 * @return
 */
function isUrlValidate(url){
    var regx = /^(\s)*(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(:(\d{1,4}))?(\/[\w-.\/?%&=]*)?(\s)*$/;
    return regx.test(url);
}

/**
 * 判断email是否合法
 * @param email
 * @return
 */
function isEmailValidate(email){
    //var regx = /^(\s)*([\w]+([-_.][\w]+)*@[\w]+([.][\w]+)*\.[\w]+([.][\w]+)*)(\s)*$/;
    //var regx = /^([a-z0-9a-z]+[-|\.]?)+[a-z0-9a-z]@([a-z0-9a-z]+(-[a-z0-9a-z]+)?\.)+[a-za-z]{2,}$/;
    var regx = /^([a-z0-9A-Z]+(-|_)*[\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-|_)*([a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
    return regx.test(email);
}

/**
 * 判断电话号码是否合法
 * @param tel
 * @return
 */
function isPhoneValidate(tel){
    var regx = /^(\s)*((1[35]\d{9})|((0\d{2,3}\-){1}[1-9]{1}\d{6,7}(\-\d{1,4})?))(\s)*$/;
    return regx.test(tel);
}

/**
 * 判断手机号码是否合法
 * @param tel
 * @return
 */
function isMobileValidate(tel){
    var regx = /^(\s)*(1[35]\d{9})(\s)*$/;
    
    return regx.test(tel);
}

/**
 * Validator是基于JavaScript技术的伪静态类和对象的自定义属性，可以对网页中的表单项输入进行相应的验证，允许同一页面中同时验证多个表单，熟悉接口之后也可以对特定的表单项甚至仅仅是某个字符串进行验证。因为是伪静态类，所以在调用时不需要实例化，直接以"类名+.语法+属性或方法名"来调用。此外，Validator还提供3种不同的错误提示模式，以满足不同的需要。
 * Validator目前可实现的验证类型有：
 * <pre>
 * 1.是否为空 				:Require；
 * 2.数字					:Number；
 * 3.整数					:Integer；
 * 4.Email地址 				:Email；
 * 5.电话号码 				:Phone；
 * 6.货币 					:Currency
 * 7.手机号码 				:Mobile；
 * 8.邮政编码；			:Zip
 * 9.身份证号码 			:IdCard；
 * 10.日期					:Date；
 * 11.符合安全规则的密码		:SafeString；
 * 12.某项的重复值			:Repeat；
 * 13.两数的关系比较		:Range；
 * 14.判断输入值是否在(n, m)区间				:Range；
 * 15.输入字符长度限制(可按字节比较)			:Limit(LimitB)；
 * 16.对于具有相同名称的单选按钮的选中判断	:Group；
 * 17.限制具有相同名称的多选按钮的选中数目	:Group；
 * 18.自定义的正则表达式验证 				:Custom；
 * 19.根据条件获取字符串长度					:
 * 20.时间类型								：Time
 * 21.中文或英文字符         :CN_EN
 * 22.Float
 * 23.QQ
 * 24.Password
 * 25.MemberName
 * 26.UnitName
 * 27.URL
 * 28.英文或数字:EN_NUM
 * 29.中文、英文、数字、空格
 * :CN_EN_NUM_SPACE:
 * </pre>
 * @class 通用验证类，提供各种不用的验证。
 */
Validator = {
	/**
	 * 中文或者英文
	 */
    CN_EN: /^(\s)*([a-zA-Z\u4E00-\u9FFF])+(\s)*$/,
	/**
	 * 浮点数
	 */
    Float: /^[-\+]?\d+(\\.\\d+)?$/,
	/**
	 * QQ号码
	 */
    QQ: /^(\s)*[1-9]\d{4,11}(\s)*$/,
	/**
	 * 密码，字母、数字以及-组成，长度在6-32
	 */
    Password: /^[a-zA-Z\-0-9]{6,32}$/,
	/**
	 * 银行账号
	 */
    BankAcct: /^\d{8,24}$/,
	/**
	 * 会员名称
	 */
    MemberName: /^(\s)*([\u4E00-\u9FFF\u00B7]{1,50}|([a-zA-Z\s0-9]{1,100}))(\s)*$/,
	/**
	 * 中文、英文、数字或者空格
	 */
    CN_EN_NUM_SPACE: /^(\s)*([a-zA-Z\u4E00-\u9FFF\s0-9])+(\s)*$/,
	/**
	 * 中文英文空格
	 */
    UnitName: /^(\s)*([a-zA-Z\u4E00-\u9FFF\s])+(\s)*$/,
	/**
	 * 英文数字空格
	 */
    EN_NUM: /^(\s)*([a-zA-Z0-9])+(\s)*$/,
	/**
	 * 任意字符，但必须不为空
	 */
    Require: /^(\s)*.+(\s)*/,
	/**
	 * URL
	 */
    URL: /^(\s)*(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(:(\d{1,4}))?(\/[\w-.\/?:%&=]*)?(\s)*$/,
	/**
	 * Email
	 */
    Email: /^([a-z0-9A-Z]+(-|_)*[\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-|_)*([a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
	/**
	 * 电话号码
	 */
    Phone: /^[\s]*((1[35]\d{9})|(0\d{2,4}\-){1}[1-9]{1}\d{6,9}(\-\d{1,5})?)[\s]*$/,
	/**
	 * 手机号码
	 */
    Mobile: /^(\s)*(1[35]\d{9})(\s)*$/,
	/**
	 * 传真
	 */
    Fax: /^[\s]*(0\d{2,4}\-){1}[1-9]{1}\d{6,9}[\s]*$/,
	/**
	 * 身份证
	 */
    IdCard: /^(\s)*(\d{15}|\d{18}|\d{7}x)(\s)*$/i,
	/**
	 * Currency
	 */
    Currency: /^(0(\.\d{0,2})?|([1-9]+[0]*)+(\.\d{0,2})?)$/,
	/**
	 * 数字
	 */
    Number: /^\d+$/,
	/**
	 * 区号
	 */
    Zip: /^(\s)*\d{6}(\s)*$/,
	/**
	 * 整数
	 */
    Integer: /^[-\+]?\d+$/,
	/**
	 * 不安全字符
	 */
    UnSafe: /^(\s)*(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
	/**
	 * 是否为时间
	 */
    Time: /^(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23):[0-5]?[0-9]$/,
	/**
	 * 是否安全字符
	 */
    IsSafe: function(str){
        return !this.UnSafe.test(str);
    },
    /**
     * 安全字符串
     */
    SafeString: "this.IsSafe(value)",
    /**
     * 字符长度是否
     */
    Limit: "this.limit(value.length,getAttribute('min'),getAttribute('max'))",
    LimitB: "this.limit(this.LenB(value),getAttribute('min'),getAttribute('max'))",
    LimitUTF8: "this.limit(this.LenUTF8(value), getAttribute('min'), getAttribute('max'))",
    Date: "this.IsDate(value, getAttribute('format'))",
    Repeat: "value == document.getElementsByName(getAttribute('to'))[0].value",
    Range: "getAttribute('min') < value && value < getAttribute('max')",
    Compare: "this.compare(value,getAttribute('operator'),getAttribute('to'))",
    Custom: "this.Exec(value, getAttribute('regexp'))",
    Group: "this.MustChecked(getAttribute('name'), getAttribute('min'),getAttribute('max'))",
    ErrorItem: [document.forms[0]],
    ErrorMessage: ["\u4ee5\u4e0b\u539f\u56e0\u5bfc\u81f4\u63d0\u4ea4\u5931\u8d25\uff1a\t\t\t\t"],
	/**
	 * 验证方法，主要是验证整个表单中符合规定格式的元素是否满足要求
	 * @param {Object} theForm 表单元素
	 * @param {Object} mode
	 * @param {Object} pageCode
	 * @param {Object} scenarioCode
	 */
    validate: function(theForm, mode, pageCode, scenarioCode){
        var obj = theForm;
        var count = obj.elements.length;
        this.ErrorMessage.length = 1;
        this.ErrorItem.length = 1;
        this.ErrorItem[0] = obj;
        var statusStr = "false";
        var mapobj = {};
		try{
			mapobj = eval(pageCode + "Object");
		}
		catch(e){
			mapobj = {};
		}
        for (var i = 0; i < count; i++) {
            with (obj.elements[i]) {
            
                var _dataType = getAttribute("dataType");
                
                if (typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined") {
                    continue;
                }
                this.ClearState(obj.elements[i]);
                //alert(getAttribute("name")+"=="+getAttribute("require"));
                if (getAttribute("require") == "false" && value == "") {
                    continue;
                }
                else {
                    if (obj.name == "type") {
                        continue;
                    }
                }
                switch (_dataType) {
                    case "Date":
                    case "Repeat":
                    case "Range":
                    case "Compare":
                    case "Custom":
                    case "Group":
                    case "Limit":
                    case "LimitB":
                    case "LimitUTF8":
                    case "SafeString":
                        var r1 = /^()$/;
                        if (!eval(this[_dataType])) {
                            var _msg = getAttribute("msg");
                            if (typeof(_msg) != "object" || typeof(this[_msg]) != "undefined") {
                                if (_msg != null || _msg.length != 0) {
                                    this.AddError(i, _msg);
                                    statusStr = "true";
                                    break;
                                }
                            }
                            var keyobj = scenarioCode + "." + obj.elements[i].getAttribute("name");
							var message = mapobj[keyobj] || obj.elements[i].getAttribute("name");
                            _msg = this.GetValidateResult(_dataType, obj.elements[i].value, obj.elements[i].getAttribute("min"), obj.elements[i].getAttribute("max"),message );
                            if (_msg == null) {
                                _msg = mapobj[keyobj];
                            }
                            this.AddError(i, _msg);
                            statusStr = "true";
                        }
                        break;
                    default:
                        if (!eval(this[_dataType].test(value))) {
                            var _msg = getAttribute("msg");
                            if (typeof(_msg) != "object" || typeof(this[_msg]) != "undefined") {
                                if (_msg != null || _msg.length != 0) {
                                    this.AddError(i, _msg);
                                    statusStr = "true";
                                    break;
                                }
                            }
                            if (pageCode != "") {
                                var keyobj = scenarioCode + "." + obj.elements[i].getAttribute("name");
                                _msg = this.GetValidateResult(_dataType, obj.elements[i].value, obj.elements[i].getAttribute("min"), obj.elements[i].getAttribute("max"), mapobj[keyobj] || obj.elements[i].getAttribute("name"));
//                                if (_msg == mapobj[keyobj]) {
//                                    break;
//                                }
                                if (_msg == null) {
                                    _msg = mapobj[keyobj];
                                }
                                this.AddError(i, _msg);
                                statusStr = "true";
                            }
                        }
                        else {
                            if (pageCode != "") {
                                var keyobj = scenarioCode + "." + obj.elements[i].getAttribute("name");
								var message = mapobj[keyobj] || obj.elements[i].getAttribute("name");
                                _msg = this.GetValidateResult(_dataType, obj.elements[i].value, obj.elements[i].getAttribute("min"), obj.elements[i].getAttribute("max"), message);
                                if (_msg == message) {
                                    break;
                                }
                                this.AddError(i, _msg);
                                statusStr = "true";
                            }
                        }
                        break;
                }
            }
            //alert("status:"+(statusStr=="true"));
            if (statusStr == "true") {
                break;
            }
        }
        
        if (this.ErrorMessage.length > 1) {
            mode = mode || 1;
            var errCount = this.ErrorItem.length;
            switch (mode) {
                case 2:
                    for (var i = 1; i < errCount; i++) {
                        this.ErrorItem[i].style.color = "red";
                    }
                case 1:
                    var errMsg = document.getElementById("wrongWhole1");
                    errMsg.style.display = "block";
                    errMsg.innerHTML = this.ErrorMessage + "<br/>";
                    //alert(this.ErrorMessage.join("\n"));
                    this.ErrorItem[1].focus();
                    break;
                case 3:
                    for (var i = 1; i < errCount; i++) {
                        try {
                            var span = document.createElement("SPAN");
                            span.id = "__ErrorMessagePanel";
                            span.style.color = "red";
                            this.ErrorItem[i].parentNode.appendChild(span);
                            span.innerHTML = this.ErrorMessage[i].replace(/\d+:/, "*");
                        } 
                        catch (e) {
                            alert(e.description);
                        }
                    }
                    this.ErrorItem[1].focus();
                    break;
                case 4:
                    //alert(this.ErrorMessage[0] + "\n" + this.ErrorMessage[1]);
                    var err_div_id = this.ErrorItem[1].getAttribute('name') + '_error';
                    var err_div = document.getElementById(err_div_id);
                    //如果定义了显示错误的层
                    if (err_div != "undefined" && err_div != null) {
                        err_div.innerHTML = this.ErrorMessage[1];
                    }
                    else {
                        var errMsg = document.getElementById("wrongWhole1");
                        errMsg.style.display = "block";
                        errMsg.innerHTML = this.ErrorMessage[1];
                    }
                    if (this.ErrorItem[1].getAttribute("type") != "hidden") {
                        this.ErrorItem[1].focus();
                    }
                    break;
                default:
                    alert(this.ErrorMessage.join("\n"));
                    break;
            }
            return false;
        }
        
        return true;
    },
    /**
     * 判断数字是否满足要求
     * @param num 待判断的数字
     * @param min 最小数
     * @param max 最大数
     */
    limit: function(num, min, max){
        min = min || 0;
        max = max || Number.MAX_VALUE;
        return min <= num && num <= max;
    },
    /**
     * 字符串字节长度，中文等占2位
     * @param str
     */
    LenB: function(str){
        return str.replace(/[^\x00-\xff]/g, "**").length;
    },
    ClearState: function(elem){
        with (elem) {
            if (style.color == "red") {
                style.color = "";
            }
            var lastNode = parentNode.childNodes[parentNode.childNodes.length - 1];
            if (lastNode.id == "__ErrorMessagePanel") {
                parentNode.removeChild(lastNode);
            }
        }
    },
    AddError: function(index, str){
        this.ErrorItem[this.ErrorItem.length] = this.ErrorItem[0].elements[index];
        this.ErrorMessage[this.ErrorMessage.length] = "  " + str;
    },
    Exec: function(op, reg){
        return new RegExp(reg, "g").test(op);
    },
    /**
     * 对象比较，可以为字符串或者数字等
     * @param op1 比较对象
     * @param operator 比较操作符
     * @param op2 被比较对象
     */
    compare: function(op1, operator, op2){
        switch (operator) {
            case "NotEqual":
                return (op1 != op2);
            case "GreaterThan":
                return (op1 > op2);
            case "GreaterThanEqual":
                return (op1 >= op2);
            case "LessThan":
                return (op1 < op2);
            case "LessThanEqual":
                return (op1 <= op2);
            default:
                return (op1 == op2);
        }
    },
    /**
     * 判断选中数是否满足要求
     * @param name
     * @param min
     * @param max
     */
    MustChecked: function(name, min, max){
        var groups = document.getElementsByName(name);
        var hasChecked = 0;
        min = min || 1;
        max = max || groups.length;
        for (var i = groups.length - 1; i >= 0; i--) {
            if (groups[i].checked) {
                hasChecked++;
            }
        }
        return min <= hasChecked && hasChecked <= max;
    },
    /**
     * 返回字符串的长度，非ascii占位为3位。
     * @param str
     * @return long 
     */
    LenUTF8: function(str){
        return ("" + str).replace(/[^\u0000-\u007f]/g, "\u0061\u0061\u0061").length;
    },
    
    /**
     * 判断字符串是否为指定格式的日期
     * @param op
     * @param formatString
     * @return boolean
     */
    IsDate: function(op, formatString){
        formatString = formatString || "ymd";
        if (formatString == "%Y-%m-%d" || formatString == "%Y%m%d") {
            formatString = "ymd";
        }
        if (formatString == "%d-%m-%Y" || formatString == "%d/%m/%Y") {
            formatString = "dmy";
        }
        var m, year, month, day;
        switch (formatString) {
            case "ymd":
                m = op.match(new RegExp("^(\\d{4})([-]?)(\\d{1,2})([-]?)(\\d{1,2})$"));
                if (m == null) {
                    return false;
                }
                day = m[6];
                month = m[5]--;
                year = (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
                break;
            case "dmy":
                m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
                if (m == null) {
                    return false;
                }
                day = m[1];
                month = m[3]--;
                year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
                break;
            default:
                break;
        }
        if (!parseInt(month)) {
            return false;
        }
        month = month == 12 ? 0 : month;
        var date = new Date(year, month, day);
        return (typeof(date) == "object" && year == date.getFullYear() && month == date.getMonth() && day == date.getDate());
        function GetFullYear(y){
            return ((y < 30 ? "20" : "19") + y) | 0;
        }
    },
    /**
     * 获取按照规则判断之后的信息，现在仅提供给Validator.validate使用
     * @param type 数据判断类型
     * @param obj 输入字符串
     * @param min
     * @param max
     * @param msg 提示信息前缀
     * @return String 如果返回的还是前缀的话，说明验证通过
     */
    GetValidateResult: function(type, obj, min, max, msg){
        //alert(obj);
        var map = eval("commonObject");
        var result = msg;
        var _length = this.LenUTF8(obj);
        switch (type) {
            case "Require":
                if (StringUtils.isEmpty(obj)) {
                    return map["string.empty"].replace("{0}", msg);
                }
                break;
                
            case "Password":
                return this.testPwd(obj, msg);
            case "IdCard":
            case "Zip":
            case "QQ":
            case "Phone":
            case "Fax":
            case "Mobile":
                if (StringUtils.isEmpty(obj)) {
                    return map["string.empty"].replace("{0}", msg);
                }
                if (eval(this[type].test(obj))) {
                    break;
                }
                else {
                    return map["string.style"].replace("{0}", msg);
                }
            case "MemberName":
            case "UnitName":
            case "Email":
            case "URL":
            case "CN_EN":
            case "EN_NUM":
            case "CN_EN_NUM_SPACE":
                min = min || 1;
                max = max || _length;
                //alert("I'm here!");
                if (StringUtils.isEmpty(obj)) {
                    return map["string.empty"].replace("{0}", msg);
                }
                else {
                    if (_length < 1 || _length > max) {
                        result = map["string.length"].replace("{0}", msg);
                        result = result.replace("{min}", min);
                        result = result.replace("{max}", max);
                    }
                    else {
                        if (!eval(this[type].test(obj))) {
                            return map["string.style"].replace("{0}", msg);
                        }
                    }
                }
                break;
            case "Limit":
            case "LimitB":
            case "LimitUTF8":
            case "SafeString":
            case "Custom":
                min = min || 1;
                max = max || _length;
                
                if (StringUtils.isEmpty(obj)) {
                    return map["string.empty"].replace("{0}", msg);
                }
                else {
                    if (_length < 1 || _length > max) {
                        result = map["string.length"].replace("{0}", msg);
                        result = result.replace("{min}", min);
                        result = result.replace("{max}", max);
                    }
                    else {
                        return map["string.style"].replace("{0}", msg);
                    }
                }
                break;
            case "Date":
                if (StringUtils.isEmpty(obj)) {
                    return map["date.empty"].replace("{0}", msg);
                }
                else {
                    if (!eval(this[type].test(obj))) {
                        return map["date.dateStyle"].replace("{0}", msg);
                    }
                }
                break;
            case "Time":
                
                if (StringUtils.isEmpty(obj)) {
                    return map["date.empty"].replace("{0}", msg);
                }
                else {
                    if (!eval(this[type].test(obj))) {
                        return map["date.timeStyle"].replace("{0}", msg);
                    }
                }
                break;
            case "Currency":
                min = min || 1;
                max = max || _length;
                return this.testCurrency(obj, msg);
                
            case "Number":
            case "Integer":
            case "QQ":
                min = min || 1;
                max = max || _length;
                if (obj.length < 1 || obj.length > max) {
                    result = map["number.validatebit"].replace("{0}", msg);
                    result = result.replace("{min}", min);
                    return result.replace("{max}", max);
                    break;
                }
                if (eval(this[type].test(obj))) {
                    break;
                    
                }
            case "Range":
                
                //alert(max);
                min = min || 1;
                max = max || _length;
                if (StringUtils.isEmpty(obj)) {
                    return map["number.empty"].replace("{0}", msg);
                }
                else {
                    if (obj.length < 1 || obj.length > max) {
                        result = map["number.validatebit"].replace("{0}", msg);
                    	result = result.replace("{min}", min);
                        return result.replace("{max}", max);
                    }
                    else {
                        return map["number.type"].replace("{0}", msg);
                    }
                }
                break;
        }
        
        return result;
    },
    /**
     * 判断密码是否符合判断规则，返回true或者false
     * @param objValue
     * @return
     */
    isPwdValidate: function(objValue){
        var r1 = /^([a-zA-Z0-9_])*$/;
        var r2 = /^([a-zA-Z])*$/;
        var r3 = /^([0-9])*$/;
        var r4 = /^([_])*$/;
        
        if (objValue.length < 6 || objValue.length > 32) {
            return false;
        }
        
        if (r1.test(objValue) == false) {
            return false;
        }
        
        if (this.isRepetitive(objValue)) {
            return false;
        }
        
        if (this.isOrder(objValue) || this.isReverseOrder(objValue)) {
            return false;
        }
        
        return true;
    },
    /**
     * 判断密码是否符合要求，返回错误提示信息
     * @param objValue
     * @return
     */
    testPwd: function(objValue, str){
        var r1 = /^([a-zA-Z0-9_])*$/;
        var r2 = /^([a-zA-Z])*$/;
        var r3 = /^([0-9])*$/;
        var r4 = /^([_])*$/;
        var result = str;
        if (objValue.length < 6 || objValue.length > 32) {
            result = str + "至少6位以上,长度不超过32位";
            return result;
        }
        if (r1.test(objValue) == false) {
            result = str + "只能由字母，下划线和数字组成";
            return result;
        }
        
        /*不允许使用重复字符*/
        if (this.isRepetitive(objValue)) {
            result = str + "不符合安全规则，请重新输入！";
            return result;
        }
        /*不允许使用顺序序列*/
        if (this.isOrder(objValue) || this.isReverseOrder(objValue)) {
            result = str + "不符合安全规则，请重新输入！";
            return result;
        }
        
        if (r2.test(objValue) || r3.test(objValue) || r4.test(objValue)) {
            if (window.confirm(str + "建议设置为数字和字母的组合")) {
                result = "您输入的" + str + "安全级别不高,建议设置为数字和字母的组合,您要重新输入吗?";
                return result;
            };
            return result;
        }
        
        return result;
    },
    
    /**
     * 判断是否重复
     * @param objValue
     * @return
     */
    isRepetitive: function(objValue){
        var temp = objValue.charAt(0);
        for (var i = 0; i < objValue.length; i++) {
            if (temp != objValue.charAt(i)) {
                return false;
            }
        }
        return true;
    },
    
    /**
     * 判断是否连续字符串（升序），例如：1234
     * @param objValue
     * @return
     */
    isOrder: function(objValue){
    
        for (var i = 1; i < objValue.length; i++) {
            if (objValue.charCodeAt(i - 1) + 1 != objValue.charCodeAt(i)) {
                return false;
            }
        }
        return true;
    },
    
    /**
     * 判断是否连续字符串（降序），例如：dcba
     * @param objValue
     * @return
     */
    isReverseOrder: function(objValue){
        for (var i = 1; i < objValue.length; i++) {
            if (objValue.charCodeAt(i - 1) - 1 != objValue.charCodeAt(i)) {
                return false;
            }
        }
        return true;
    },
    
    /**
     * 判断金额是否正确，不能大于10亿
     * @param objValue
     * @return 返回错误提示信息
     */
    testCurrency: function(objValue, str){
        var r1 = /^(0|([1-9]+[0]*)+)$/;
        var result = str;
        if (!r1.test(objValue)) {
            result = str + "格式不正确";
            return result;
        }
        if (objValue >= 1000000000000) {
            result = str + "不能大于1000000000";
            return result;
        }
        return result;
    }
};

var commonObject = {
	"string.empty":"{0}不能为空",
	"string.style":"{0}的格式不正确",
	"string.length":"{0}的长度不能少于{min}，最大长度不能超过{max}",
	"date.empty":"{0}不能为空",
	"date.dateStyle":"{0}的日期格式不正确",
	"date.timeStyle":"{0}的时间格式不正确",
	"number.validatebit":"{0}的长度不能少于{min}，最大长度不能超过{max}",
	"number.empty":"{0}不能为空",
	"number.type":"{0}的数据类型不正确"
};


/**
 * @class
 */
StringUtils = function(){
}
/**
 * 判断字符串是否为空null
 * @param {String} str
 */
StringUtils.isEmpty = function(str){
	if(typeof str=='undefined' || str=='undefined' || str==null){
		return false;
	}
	var val =str.replace(/^\s*|\s*$/ig,"");
	if( val=="" ){
		return true;
	}
	return false;
}