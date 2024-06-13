package com.example.demo.generateXml.models;

import com.example.demo.generateXml.service.GenerationLogic;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Log implements GenerationLogic {

    String nodeType;
    String log;

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getLog() {
        return log;
    }

    public void setLog(String log) {
        this.log = log;
    }

    @Override
    public String generate() throws Exception {
        String xml="<log>"+getLog()+"</log>\n";
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
