package com.apachecms.cmsx.auth.member;


public enum MemberLevel {

    /** "PM.PENDING" */
    MEMBER_LEVEL_PENDING("PM.PENDING"),
    /** "PM.PENDING.OLD" */
    MEMBER_LEVEL_PENDING_OLD("PM.PENDING.OLD"),
    /** "PM.PENDING.NEW" */
    MEMBER_LEVEL_PENDING_NEW("PM.PENDING.NEW"),
    /** "PM" */
    MEMBER_LEVEL_PM("PM"),
    /** "PM.BUYER" */
    MEMBER_LEVEL_PM_BUYER("PM.BUYER");

    private String value;

    private MemberLevel(String value){
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }
 
    public boolean isTP() {
        return this == MemberLevel.MEMBER_LEVEL_PM;
    }
 
    public boolean isPayMember() {
        return isTP() || this == MemberLevel.MEMBER_LEVEL_PM_BUYER;
    }

    public static MemberLevel getMemberLevel(String value) {
        for (MemberLevel elem : MemberLevel.values()) {
            if (elem.getValue().equals(value)) {
                return elem;
            }
        }
        return null;
    }
 
    public static MemberLevel getMemberLevelByIsTP(boolean isTP) {
        if (isTP) {
            return MemberLevel.MEMBER_LEVEL_PM;
        } else {
            return MemberLevel.MEMBER_LEVEL_PENDING;
        }
    }

}