package com.apachecms.cmsx.acl.param;

import java.util.List;

/**
 * screen或action验权传递vo
 * @author qinming.zhengqm
 */
public class PermissionParam extends BaseParam {
	private static final long serialVersionUID = 9207501212265920761L;

	// 应用系统名
	private String appName;

	// 站点id
	private long siteID;

	// url
	private String url;

	// action.event
	private String action;
	
	// 非入参信息
	private List<String> urls;
	private List<String> actions;

	// 当资源不存于白名单,且不存在与普通资源时的操作
	private boolean retWhenResNotExist = true;
	
	public long getSiteID() {
		return siteID;
	}

	public void setSiteID(long siteID) {
		this.siteID = siteID;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public boolean isRetWhenResNotExist() {
		return retWhenResNotExist;
	}

	public void setRetWhenResNotExist(boolean retWhenResNotExist) {
		this.retWhenResNotExist = retWhenResNotExist;
	}

	public String getAppName() {
		return appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
	}

	@Override
	public String toString() {
		return new StringBuilder().append("appName:").append(appName)
				.append(", siteID:").append(siteID).append(", url:")
				.append(url).append(", action:").append(action)
				.append(", retWhenResNotExist:").append(retWhenResNotExist)
				.append(", userID:").append(getUserID()).toString();
	}

	public List<String> getUrls() {
		return urls;
	}

	public void setUrls(List<String> urls) {
		this.urls = urls;
	}

	public List<String> getActions() {
		return actions;
	}

	public void setActions(List<String> actions) {
		this.actions = actions;
	}
}