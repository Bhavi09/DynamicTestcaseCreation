package com.example.demo.generateXml.models;

import com.example.demo.generateXml.service.GenerationLogic;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidateCode implements GenerationLogic {

    String nodeType;
    String resourceType;
    String url;
    String code;
    String system;
    String operationId;

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getOperationId() {
        return operationId;
    }

    public void setOperationId(String operationId) {
        this.operationId = operationId;
    }

    @Override
    public String generate() {
        String xml = "\n        <send id=\""+getOperationId()+"\" desc=\"Perform validate-code operation on valueSet\" from=\"ITB\" to=\"FhirHandler\" handler=\"$DOMAIN{fhirContextServiceAddress}\">\n" +
                "            <input name=\"fhirServerBaseUrl\">$componentURI</input>\n" +
                "            <input name=\"username\">$username</input>\n" +
                "            <input name=\"password\">$password</input>\n" +
                "            <input name=\"fhirResourceType\">"+getResourceType()+"</input>\n" +
                "            <input name=\"operationType\">\"validate-code\"</input>\n" +
                "            <input name=\"parameters.url\">"+addQuotesToExpression(getUrl())+"</input>\n" +
                "            <input name=\"parameters.system\">"+addQuotesToExpression(getSystem())+"</input>\n" +
                "            <input name=\"parameters.code\">"+addQuotesToExpression(getCode())+"</input>\n" +
                "        </send>\n";
        return xml;
    }

    private String addQuotesToExpression(String expression) {
        // Regular expression to match static parts and leave dynamic parts intact
        String regex = "(\\w+[=:][^\\|\\|]*)|([\\|\\|\\s]+)|(\\$[^\\s\\|\\|]+\\{[^}]+\\})";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(expression);

        StringBuilder result = new StringBuilder();
        boolean found = false;

        while (matcher.find()) {
            found = true;
            String staticPart = matcher.group(1) != null ? matcher.group(1) : "";
            String separator = matcher.group(2) != null ? matcher.group(2) : "";
            String dynamicPart = matcher.group(3) != null ? matcher.group(3) : "";

            if (!staticPart.isEmpty()) {
                result.append("\"").append(staticPart).append("\"");
            }
            result.append(separator).append(dynamicPart);
        }

        // If no matches were found, return the original expression with quotes around it
        if (!found) {
            return "\"" + expression + "\"";
        }

        return result.toString();
    }
}
