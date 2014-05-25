/**
 * ��֤�ַ����Ƿ�Ϊ������
 * @param number �����ַ���
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
 * ��֤�ַ����Ƿ������֣�ʮ���ƣ��˽��ƣ�ʮ�����ƣ�
 * @param argvalue �����ַ���
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
 * ���Email�Ƿ�Ϸ�
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
 * ����ַ����Ƿ�ΪNull
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
 * ��������Ƿ�Ϸ�
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
 * �ж�url�Ƿ�Ϸ�
 * @param url
 * @return
 */
function isUrlValidate(url){
    var regx = /^(\s)*(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(:(\d{1,4}))?(\/[\w-.\/?%&=]*)?(\s)*$/;
    return regx.test(url);
}

/**
 * �ж�email�Ƿ�Ϸ�
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
 * �жϵ绰�����Ƿ�Ϸ�
 * @param tel
 * @return
 */
function isPhoneValidate(tel){
    var regx = /^(\s)*((1[35]\d{9})|((0\d{2,3}\-){1}[1-9]{1}\d{6,7}(\-\d{1,4})?))(\s)*$/;
    return regx.test(tel);
}

/**
 * �ж��ֻ������Ƿ�Ϸ�
 * @param tel
 * @return
 */
function isMobileValidate(tel){
    var regx = /^(\s)*(1[35]\d{9})(\s)*$/;
    
    return regx.test(tel);
}

/**
 * Validator�ǻ���JavaScript������α��̬��Ͷ�����Զ������ԣ����Զ���ҳ�еı������������Ӧ����֤������ͬһҳ����ͬʱ��֤���������Ϥ�ӿ�֮��Ҳ���Զ��ض��ı�������������ĳ���ַ���������֤����Ϊ��α��̬�࣬�����ڵ���ʱ����Ҫʵ������ֱ����"����+.�﷨+���Ի򷽷���"�����á����⣬Validator���ṩ3�ֲ�ͬ�Ĵ�����ʾģʽ�������㲻ͬ����Ҫ��
 * ValidatorĿǰ��ʵ�ֵ���֤�����У�
 * <pre>
 * 1.�Ƿ�Ϊ�� 				:Require��
 * 2.����					:Number��
 * 3.����					:Integer��
 * 4.Email��ַ 				:Email��
 * 5.�绰���� 				:Phone��
 * 6.���� 					:Currency
 * 7.�ֻ����� 				:Mobile��
 * 8.�������룻			:Zip
 * 9.���֤���� 			:IdCard��
 * 10.����					:Date��
 * 11.���ϰ�ȫ���������		:SafeString��
 * 12.ĳ����ظ�ֵ			:Repeat��
 * 13.�����Ĺ�ϵ�Ƚ�		:Range��
 * 14.�ж�����ֵ�Ƿ���(n, m)����				:Range��
 * 15.�����ַ���������(�ɰ��ֽڱȽ�)			:Limit(LimitB)��
 * 16.���ھ�����ͬ���Ƶĵ�ѡ��ť��ѡ���ж�	:Group��
 * 17.���ƾ�����ͬ���ƵĶ�ѡ��ť��ѡ����Ŀ	:Group��
 * 18.�Զ����������ʽ��֤ 				:Custom��
 * 19.����������ȡ�ַ�������					:
 * 20.ʱ������								��Time
 * 21.���Ļ�Ӣ���ַ�         :CN_EN
 * 22.Float
 * 23.QQ
 * 24.Password
 * 25.MemberName
 * 26.UnitName
 * 27.URL
 * 28.Ӣ�Ļ�����:EN_NUM
 * 29.���ġ�Ӣ�ġ����֡��ո�
 * :CN_EN_NUM_SPACE:
 * </pre>
 * @class ͨ����֤�࣬�ṩ���ֲ��õ���֤��
 */
Validator = {
	/**
	 * ���Ļ���Ӣ��
	 */
    CN_EN: /^(\s)*([a-zA-Z\u4E00-\u9FFF])+(\s)*$/,
	/**
	 * ������
	 */
    Float: /^[-\+]?\d+(\\.\\d+)?$/,
	/**
	 * QQ����
	 */
    QQ: /^(\s)*[1-9]\d{4,11}(\s)*$/,
	/**
	 * ���룬��ĸ�������Լ�-��ɣ�������6-32
	 */
    Password: /^[a-zA-Z\-0-9]{6,32}$/,
	/**
	 * �����˺�
	 */
    BankAcct: /^\d{8,24}$/,
	/**
	 * ��Ա����
	 */
    MemberName: /^(\s)*([\u4E00-\u9FFF\u00B7]{1,50}|([a-zA-Z\s0-9]{1,100}))(\s)*$/,
	/**
	 * ���ġ�Ӣ�ġ����ֻ��߿ո�
	 */
    CN_EN_NUM_SPACE: /^(\s)*([a-zA-Z\u4E00-\u9FFF\s0-9])+(\s)*$/,
	/**
	 * ����Ӣ�Ŀո�
	 */
    UnitName: /^(\s)*([a-zA-Z\u4E00-\u9FFF\s])+(\s)*$/,
	/**
	 * Ӣ�����ֿո�
	 */
    EN_NUM: /^(\s)*([a-zA-Z0-9])+(\s)*$/,
	/**
	 * �����ַ��������벻Ϊ��
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
	 * �绰����
	 */
    Phone: /^[\s]*((1[35]\d{9})|(0\d{2,4}\-){1}[1-9]{1}\d{6,9}(\-\d{1,5})?)[\s]*$/,
	/**
	 * �ֻ�����
	 */
    Mobile: /^(\s)*(1[35]\d{9})(\s)*$/,
	/**
	 * ����
	 */
    Fax: /^[\s]*(0\d{2,4}\-){1}[1-9]{1}\d{6,9}[\s]*$/,
	/**
	 * ���֤
	 */
    IdCard: /^(\s)*(\d{15}|\d{18}|\d{7}x)(\s)*$/i,
	/**
	 * Currency
	 */
    Currency: /^(0(\.\d{0,2})?|([1-9]+[0]*)+(\.\d{0,2})?)$/,
	/**
	 * ����
	 */
    Number: /^\d+$/,
	/**
	 * ����
	 */
    Zip: /^(\s)*\d{6}(\s)*$/,
	/**
	 * ����
	 */
    Integer: /^[-\+]?\d+$/,
	/**
	 * ����ȫ�ַ�
	 */
    UnSafe: /^(\s)*(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
	/**
	 * �Ƿ�Ϊʱ��
	 */
    Time: /^(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23):[0-5]?[0-9]$/,
	/**
	 * �Ƿ�ȫ�ַ�
	 */
    IsSafe: function(str){
        return !this.UnSafe.test(str);
    },
    /**
     * ��ȫ�ַ���
     */
    SafeString: "this.IsSafe(value)",
    /**
     * �ַ������Ƿ�
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
	 * ��֤��������Ҫ����֤�������з��Ϲ涨��ʽ��Ԫ���Ƿ�����Ҫ��
	 * @param {Object} theForm ��Ԫ��
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
                    //�����������ʾ����Ĳ�
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
     * �ж������Ƿ�����Ҫ��
     * @param num ���жϵ�����
     * @param min ��С��
     * @param max �����
     */
    limit: function(num, min, max){
        min = min || 0;
        max = max || Number.MAX_VALUE;
        return min <= num && num <= max;
    },
    /**
     * �ַ����ֽڳ��ȣ����ĵ�ռ2λ
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
     * ����Ƚϣ�����Ϊ�ַ����������ֵ�
     * @param op1 �Ƚ϶���
     * @param operator �Ƚϲ�����
     * @param op2 ���Ƚ϶���
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
     * �ж�ѡ�����Ƿ�����Ҫ��
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
     * �����ַ����ĳ��ȣ���asciiռλΪ3λ��
     * @param str
     * @return long 
     */
    LenUTF8: function(str){
        return ("" + str).replace(/[^\u0000-\u007f]/g, "\u0061\u0061\u0061").length;
    },
    
    /**
     * �ж��ַ����Ƿ�Ϊָ����ʽ������
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
     * ��ȡ���չ����ж�֮�����Ϣ�����ڽ��ṩ��Validator.validateʹ��
     * @param type �����ж�����
     * @param obj �����ַ���
     * @param min
     * @param max
     * @param msg ��ʾ��Ϣǰ׺
     * @return String ������صĻ���ǰ׺�Ļ���˵����֤ͨ��
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
     * �ж������Ƿ�����жϹ��򣬷���true����false
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
     * �ж������Ƿ����Ҫ�󣬷��ش�����ʾ��Ϣ
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
            result = str + "����6λ����,���Ȳ�����32λ";
            return result;
        }
        if (r1.test(objValue) == false) {
            result = str + "ֻ������ĸ���»��ߺ��������";
            return result;
        }
        
        /*������ʹ���ظ��ַ�*/
        if (this.isRepetitive(objValue)) {
            result = str + "�����ϰ�ȫ�������������룡";
            return result;
        }
        /*������ʹ��˳������*/
        if (this.isOrder(objValue) || this.isReverseOrder(objValue)) {
            result = str + "�����ϰ�ȫ�������������룡";
            return result;
        }
        
        if (r2.test(objValue) || r3.test(objValue) || r4.test(objValue)) {
            if (window.confirm(str + "��������Ϊ���ֺ���ĸ�����")) {
                result = "�������" + str + "��ȫ���𲻸�,��������Ϊ���ֺ���ĸ�����,��Ҫ����������?";
                return result;
            };
            return result;
        }
        
        return result;
    },
    
    /**
     * �ж��Ƿ��ظ�
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
     * �ж��Ƿ������ַ��������򣩣����磺1234
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
     * �ж��Ƿ������ַ��������򣩣����磺dcba
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
     * �жϽ���Ƿ���ȷ�����ܴ���10��
     * @param objValue
     * @return ���ش�����ʾ��Ϣ
     */
    testCurrency: function(objValue, str){
        var r1 = /^(0|([1-9]+[0]*)+)$/;
        var result = str;
        if (!r1.test(objValue)) {
            result = str + "��ʽ����ȷ";
            return result;
        }
        if (objValue >= 1000000000000) {
            result = str + "���ܴ���1000000000";
            return result;
        }
        return result;
    }
};

var commonObject = {
	"string.empty":"{0}����Ϊ��",
	"string.style":"{0}�ĸ�ʽ����ȷ",
	"string.length":"{0}�ĳ��Ȳ�������{min}����󳤶Ȳ��ܳ���{max}",
	"date.empty":"{0}����Ϊ��",
	"date.dateStyle":"{0}�����ڸ�ʽ����ȷ",
	"date.timeStyle":"{0}��ʱ���ʽ����ȷ",
	"number.validatebit":"{0}�ĳ��Ȳ�������{min}����󳤶Ȳ��ܳ���{max}",
	"number.empty":"{0}����Ϊ��",
	"number.type":"{0}���������Ͳ���ȷ"
};


/**
 * @class
 */
StringUtils = function(){
}
/**
 * �ж��ַ����Ƿ�Ϊ��null
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