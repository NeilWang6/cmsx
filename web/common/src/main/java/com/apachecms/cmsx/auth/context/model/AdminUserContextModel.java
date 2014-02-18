package com.apachecms.cmsx.auth.context.model;

import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.apachecms.cmsx.auth.context.UserContext;
import com.apachecms.cmsx.auth.context.UserContextModel;
import com.apachecms.cmsx.auth.member.MemberLevel;

/**
 * 类AdminUserContext.java的实现描述：主帐号session信息对应的threadLocal
 * 
 * @author zhengqinming
 *
 */
public class AdminUserContextModel extends UserContextModel implements UserContext {

    /**
     * 帐号id
     */
    private String accountId;

    /**
     * 会员等级
     */
    private String memberLevel;

    /**
     * 主帐户会员id
     */
    private String vaccountId;

    /**
     * 未知的COOKIE属性
     */
    @SuppressWarnings("unchecked")
    private Map    unmanaged         = null;

    /**
     * 会员multisign
     */
    private long   memberSpecialSign = 0;

    @Override
    // 主帐号session中不写入accountId,accountId默认等于memberId
    public String getAccountId() {
        if (StringUtils.isBlank(accountId)) {
            accountId = memberId;
        }
        return accountId;
    }

    @Override
    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    @Override
    public boolean isTP() {
        return StringUtils.equalsIgnoreCase(memberLevel, MemberLevel.getMemberLevelByIsTP(true).getValue());
    }

    /**
     * 设置memberLevel
     * 
     * @param memberLevel
     */
    public void setMemberLevel(String memberLevel) {
        this.memberLevel = memberLevel;
    }

    /**
     * 获取memberLevel
     * 
     * @param memberLevel
     */
    public String getMemberLevel() {
        return memberLevel;
    }

    @Override
    public boolean isSubAccount() {
        return false;
    }

    public String getVaccountId() {
        if (StringUtils.isBlank(vaccountId)) {
            vaccountId = memberId;
        }
        return vaccountId;
    }

    public void setVaccountId(String vaccountId) {
        this.vaccountId = vaccountId;

    }

    public Map getUnmanaged() {
        return unmanaged;
    }

    public void setUnmanaged(Map unmanaged) {
        this.unmanaged = unmanaged;
    }

    public long getMemberSpecialSign() {
        return memberSpecialSign;
    }

    public void setMemberSpecialSign(long memberSpecialSign) {
        this.memberSpecialSign = memberSpecialSign;
    }

}
