/**
 * ����ģ��Ի���
 * @author : arcthur.cheny
 * @createTime : 2011-04-08
 */
(function ($, D) {
    var tools = D.tools,
        ET = D.ElementTemplate;
    ET.addOther('radio', function () {
        var el = ET.get('input').cloneNode(false);
        el.setAttribute('type', 'radio');
        el.setAttribute('name', 'relatedRuleId');
        return el;
    }());
    D.RuleDialog = function (dialogElement, dialogConfig, config) {
        this.init(dialogElement, dialogConfig, config);
    };
    D.RuleDialog.prototype = {
        currentPage: 1,
        selectedTemplateId: null,
        //���棬Ϊ��ȡ��������ʹ��
        cache: {
            o: {},
            clear: function () {
                this.o = {};
            },
            add: function (key, value) {
                this.o[key] = value;
            },
            get: function (key) {
                var ret;
                if (this.o.hasOwnProperty(key)) {
                    ret = this.o[key];
                }
                return ret;
            }
        },
        //��ʼ��
        init: function (dialogElement, dialogConfig, config) {
            var that = this,
            newRuleId, newRuleIndex;
            that.dialog = dialogElement; //�Ի���DOMԪ��
            that.dialogConfig = dialogConfig; //�Ի������ò���
            that.container = config.container; //ģ����Ϣ��������
            that.previousBtn = config.previousBtn; //��һҳ��ť
            that.nextBtn = config.nextBtn; //��һҳ��ť
            that.firstPageBtn = config.firstPageBtn; //��ҳ��ť
            that.cmsdomain = config.cmsdomain; //����
            that.openBtn = config.openBtn; //�򿪶Ի���ť
            that.closeBtns = config.closeBtns; //�رնԻ���ť��ȡ�������Ͻǹرհ�ť��
            that.submitBtn = config.submitBtn; //ȷ�ϱ��ְ�ť
            that.searchBtn = config.searchBtn; //������ť
            that.templateName = config.templateName; //ѡ������ģ�������
            that.keywordElement = config.keywordElement; //�����ؼ��������
            that.categoryTwoElement = config.categoryTwoElement; //����������Ŀ������
            that.category = config.category; //��Ŀ������������
            //that.validator = config.validator;
            that.relatedRulesQueue = config.relatedRulesQueue;
            that.isDefault = config.isDefault;

            //��Ͷ�Ź���Ի���
            that.openBtn.click(function (e) {
                e.preventDefault();
                that.dialog.dialog(that.dialogConfig);
            });
            //�ر�ѡ��Ͷ�Ź���Ի���
            that.closeBtns.click(function (e) {
                that.dialog.dialog('close');
                e.preventDefault();
            });
            that.searchBtn.click(function (e) {
                that.search(1);
            });
            //ѡ��Ͷ�Ź���Ի����ڣ���ҳ����һҳ�¼�
            that.dialog.delegate(".dcms-next-btn", "click", function () {
                that.search(that.currentPage + 1);
            });
            //ѡ��Ͷ�Ź���Ի����ڣ���ҳ����һҳ�¼�
            that.dialog.delegate(".dcms-previous-btn", "click", function () {
                that.search(that.currentPage - 1);
            });
            //ѡ��Ͷ�Ź���Ի����ڣ���ҳ����ҳ�¼�
            that.dialog.delegate(".dcms-first-page-btn", "click", function () {
                that.search(1);
            });
            that.submitBtn.click(function () {
                if (!newRuleId){ return; }
                if (that.isDefault === '' && newRuleId) {
                    that.buildRelatedRulesTr(newRuleIndex);
                    that.relatedRulesQueue.splice(0, 0, newRuleId);
                    if (that.relatedRulesQueue.length === 100) {
                        that.openBtn.hide();
                    }
                } else {
                    var o = searchedRules[newRuleIndex];
                    $('#defaultRuleName').attr('value', o.name).trigger('focus');
                    $('#templateId').attr('value', o.templateId);
                    //console.log(o);
                    $('#ruleId').val(o.id);
                }
                that.dialog.dialog('close');
                newRuleId = '';
            });
            that.container.delegate("tr", "click", function () {
                var currentRadio = $(this).closest('tr'),
                    trs = $('tbody tr', that.dialog);
                newRuleRadio = $('input[type="radio"]', this);
                newRuleId = newRuleRadio.val();
                newRuleIndex = $(trs).index(currentRadio);
                newRuleRadio.attr('checked', 'checked');
            });
        },
        //���öԻ���
        reset: function () {
            this.category.reset();
            this.keywordElement.val('');
            this.search(1);
        },
        //�����������
        clear: function () {
            this.container.empty();
        },
        statusMap: {
            modify: '�޸�',
            online: '������',
            disable: '������'
        },
        createTd: function (content, attr, attrName, isTitle, cutNum) {
            var newTd = ET.get('td').cloneNode(false);
            if (cutNum){
                newTd.innerHTML = tools.truncateStr(content, cutNum, true);
            } else {
                newTd.innerHTML = content;
            }
            if (attr && attrName){
                newTd.setAttribute(attr, attrName);
            }
            if (isTitle===true){
                newTd.setAttribute('title', content);
            }
            return newTd;
        },
        //ѡ��Ͷ�Ź������Ĺ��������б�
        buildRelatedRulesTr: function (index) {
            var o = searchedRules[index],
                id = o['id'],
                name = o['name'],
                endTime = o['endTime'],
                templateId = o['templateId'],
                status = o['status'],
                modifyTime = o['modifyTime'],
                category = o['selCategoryNames'],
                statusMap = this.statusMap,
                tr = ET.get('tr'),
                td = ET.get('td'),
                a = ET.get('a'),
                time = ET.get('time'),
                em = ET.get('em'),
                input = ET.get('input'),
                newTr = tr.cloneNode(false),
                createTd = function (content) {
                    var newTd = td.cloneNode(false);
                    newTd.appendChild(content);
                    return newTd;
                },
                buildStatusElement = function (s) {
                    var el = em.cloneNode(false);
                    el.setAttribute('class', 'rule-status-' + s);
                    el.innerHTML = statusMap[s];
                    return el;
                },
                nameAnchor = a.cloneNode(false),
                categoryTd = td.cloneNode(false),
                endTimeEl = time.cloneNode(false),
                modifyTimeEl = time.cloneNode(false),
                statusEl = buildStatusElement(status),
                statusTd = createTd(statusEl),
                templateIdContainer = input.cloneNode(false);
            nameAnchor.setAttribute('title', name);
            nameAnchor.setAttribute('href', $('#editRuleUrl').val() + id);
            //nameAnchor.setAttribute('target', '_blank');
            nameAnchor.innerHTML = tools.truncateStr(name, 30, true);
            newTr.appendChild(createTd(nameAnchor));
            categoryTd.innerHTML = tools.truncateStr(category, 30, true);
            $(categoryTd).addClass('dcms-name');
            newTr.appendChild(categoryTd);
            endTimeEl.innerHTML = endTime;
            newTr.appendChild(createTd(endTimeEl));
            modifyTimeEl.innerHTML = modifyTime;
            newTr.appendChild(createTd(modifyTimeEl));
            templateIdContainer.className = 'template-id';
            templateIdContainer.setAttribute('type', 'hidden');
            templateIdContainer.setAttribute('value', templateId);
            statusTd.className = 'last-col';
            statusTd.appendChild(templateIdContainer);
            newTr.appendChild(statusTd);
            $('.dcms-operational-grid tbody').prepend(newTr);
        },
        //�����ҳ����Ĺ������ݹ����ɹ����б�
        buildNewTr: function (o) {
            var tr = ET.get('tr'),
                td = ET.get('td'),
                radio = ET.get('radio'),
                span = ET.get('span'),
                id = o['id'],
                name = o['name'],
                period = o['endTime'],
                selCategoryNames = o['selCategoryNames'],
                newTr = tr.cloneNode(false),
                radioTd = td.cloneNode(false),
                newRadio = radio.cloneNode(false),
                nameWrap = span.cloneNode(false),
                nameTd = td.cloneNode(false);
            newRadio.setAttribute('value', id);
            radioTd.appendChild(newRadio);
            newTr.appendChild(radioTd);
            nameWrap.setAttribute('title', name);
            nameWrap.innerHTML = tools.truncateStr(name, 38, true);
            nameTd.appendChild(nameWrap);
            newTr.appendChild(nameTd);
            newTr.appendChild(this.createTd(period));
            newTr.appendChild(this.createTd(selCategoryNames, 'class', 'td-directory', true, 32));
            return newTr;
        },
        //�����������Ⱦ�������Ի�����
        render: function (dataList) {
            var fragment = ET.get('fragment').cloneNode(false);
            if (dataList && $.isArray(dataList)) {
                for (var i = 0, l = dataList.length; i < l; i++) {
                    fragment.appendChild(this.buildNewTr(dataList[i]));
                }
            }
            this.container.append(fragment);
        },
        //������ҳģ��
        buildPaging: function (count, currentPageNum) {
            var totalPageNum = Math.ceil(count / 10);
            this.currentPage = currentPageNum;
            if (currentPageNum === 1) {
                if (totalPageNum > currentPageNum) {
                    this.nextBtn.addClass('dcms-next-btn');
                } else {
                    this.nextBtn.removeClass('dcms-next-btn');
                }
                this.previousBtn.removeClass('dcms-previous-btn');
                this.firstPageBtn.removeClass('dcms-first-page-btn');
            } else if (currentPageNum === totalPageNum) {
                this.nextBtn.removeClass('dcms-next-btn');
                this.previousBtn.addClass('dcms-previous-btn');
                this.firstPageBtn.addClass('dcms-first-page-btn');
            } else {
                this.nextBtn.addClass('dcms-next-btn');
                this.previousBtn.addClass('dcms-previous-btn');
                this.firstPageBtn.addClass('dcms-first-page-btn');
            }
        },
        //������������
        search: function (pageNum) {
            var that = this,
                url = that.cmsdomain + '/position/selectRule.html';
            $.ajax(url, {
                dataType: "jsonp",
                data: {
                    currentPage: pageNum,
                    catalogId: that.categoryTwoElement.val(),
                    name: encodeURIComponent(that.keywordElement.val()),
                    ruleIds: that.relatedRulesQueue.join(','),
                    defaultRule: that.isDefault
                },
                success: function (o) {
                    var count = o['count'],
                        currentPageNum = o['currentPage'];
                    searchedRules = o['dataList'];
                    that.clear();
                    that.render(searchedRules);
                    that.buildPaging(count, currentPageNum);
                }
            });
        }
    };
})(dcms, FE.dcms);