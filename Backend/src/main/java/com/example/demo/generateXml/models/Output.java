package com.example.demo.generateXml.models;

import com.example.demo.generateXml.service.GenerationLogic;

public class Output implements GenerationLogic {

    String nodeType;
    String successMessage;
    String failureMessage;

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getSuccessMessage() {
        return successMessage;
    }

    public void setSuccessMessage(String successMessage) {
        this.successMessage = successMessage;
    }

    public String getFailureMessage() {
        return failureMessage;
    }

    public void setFailureMessage(String failMessage) {
        this.failureMessage = failMessage;
    }

    @Override
    public String generate() {
        String xml = "\n\t<output>\n" +
                "        <success>\n" +
                "            <default>\""+getSuccessMessage()+"\"</default>\n" +
                "        </success>\n" +
                "        <failure>\n" +
                "            <default>\""+getFailureMessage()+"\"</default>\n" +
                "        </failure>\n" +
                "      </output>\n";
        return xml;
    }
}
