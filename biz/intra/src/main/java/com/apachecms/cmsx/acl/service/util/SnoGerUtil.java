package com.apachecms.cmsx.acl.service.util;

import java.util.UUID;

public abstract class SnoGerUtil {

	/**
	 * <pre>uuid</pre>
	 * @return
	 */
	public static String getUUID() {
		StringBuffer result = new StringBuffer(32);
		UUID uuid = UUID.randomUUID();
		// 替换uuid中的'-',保证长度为32为
		result = result.append(uuid.toString().replaceAll("-", ""));
		return result.toString();
	}
	
	public static void main(String[] args) {
		System.out.println(getUUID());
	}
}