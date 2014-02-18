package com.apachecms.cmsx.auth.context;


public class AuthSecureContextHolder {

    private static ThreadLocal<UserAuthenticationContext> contextHolder = new ThreadLocal<UserAuthenticationContext>();

    public static void setContext(UserAuthenticationContext context) {
        contextHolder.set(context);
    }

    public static UserAuthenticationContext getContext() {
        if (contextHolder.get() == null) {
            contextHolder.set(new UserAuthenticationContext());
        }

        return (UserAuthenticationContext) contextHolder.get();
    }
}
