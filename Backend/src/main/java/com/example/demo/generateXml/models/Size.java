package com.example.demo.generateXml.models;

import com.example.demo.generateXml.service.GenerationLogic;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Size implements GenerationLogic {
    String nodeType;
    String pathVariable;
    String operationId;

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getPathVariable() {
        return pathVariable;
    }

    public void setPathVariable(String pathVariable) {
        this.pathVariable = pathVariable;
    }

    public String getOperationId() {
        return operationId;
    }

    public void setOperationId(String operationId) {
        this.operationId = operationId;
    }

    @Override
    public String generate() throws Exception {
        String xml = "<process id=\""+getOperationId()+"\" handler=\"CollectionUtils\">\n" +
                "            <operation>size</operation>\n" +
                "            <input name=\"map\">"+getPathVariable()+"</input>\n" +
                "</process>\n";
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
