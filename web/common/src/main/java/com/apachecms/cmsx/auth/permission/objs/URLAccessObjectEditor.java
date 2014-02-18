package com.apachecms.cmsx.auth.permission.objs;

import java.beans.PropertyEditorSupport;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.Set;

import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

/**
 * 类URLAccessObjectEditor.java的实现描述：对配置文件进行转译
 * 
 * @author zhengqinming
 *
 */
public class URLAccessObjectEditor extends PropertyEditorSupport {

    private static final String WRONG_CONFIG = "wrong configuration for url security!";

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        if (StringUtils.hasText(text)) {
            URLAccessObject accessObject = new URLAccessObject();
            BufferedReader br = new BufferedReader(new StringReader(text));
            String line;
            while (true) {
                try {
                    line = br.readLine();
                } catch (IOException ioe) {
                    throw new IllegalArgumentException(ioe.getMessage());
                }
                if (line == null) {
                    break;
                }

                line = StringUtils.trimWhitespace(line);
                if (!StringUtils.hasText(line)) {
                    continue;
                }
                if (line.indexOf("=") > 0) {
                    String[] nameValue = StringUtils.delimitedListToStringArray(line, "=");
                    Assert.notNull(nameValue, WRONG_CONFIG);
                    Assert.state(nameValue.length >= 1, "wrong configuration for url security!");
                    String urlEscaped = nameValue[0];
                    Set<String> values = StringUtils.commaDelimitedListToSet(nameValue[1]);
                    Assert.notNull(values, WRONG_CONFIG);
                    Assert.state(values.size() > 0, "wrong configuration for url security!");
                    accessObject.addUrlType(urlEscaped, values);
                } else {
                    accessObject.addUrlType(line, null);
                }
            }
            setValue(accessObject);
        }
    }

}
