package com.apachecms.cmsx.auth.valve;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.service.pipeline.PipelineContext;
import com.alibaba.citrus.service.pipeline.support.AbstractValve;
import com.alibaba.citrus.service.uribroker.URIBrokerService;
import com.alibaba.citrus.service.uribroker.uri.URIBroker;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.turbine.util.TurbineUtil;

public class ExceptionRedirectValve extends AbstractValve {
	
	private static final Log  logger   = LogFactory.getLog(ExceptionRedirectValve.class);
	
	@Autowired
    private HttpServletRequest  request;

    @Autowired
    private URIBrokerService    uriBrokerService;

    private static final String DEFAULT_ERROR_URL = "defaultExceptionLink";

    public void invoke(PipelineContext pipelineContext) throws Exception {
    	Exception exp = (Exception)pipelineContext.getAttribute("myexception");
    	logger.error(exp); 
        TurbineRunData rundata = TurbineUtil.getTurbineRunData(request);
        URIBroker uriBroker = uriBrokerService.getURIBroker(DEFAULT_ERROR_URL);
        rundata.setRedirectLocation(uriBroker.render());
        pipelineContext.invokeNext();
        return;
    }
}
