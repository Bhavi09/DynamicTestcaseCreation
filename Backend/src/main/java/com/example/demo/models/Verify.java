package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

import java.util.List;

public class Verify implements GenerationLogic {

    String nodeType;
    String handler;
    String expectedData;
    List<String> actualData;

    public Verify() {
    }

    public Verify(String nodeType, String handler, String expectedData, List<String> actualData) {
        this.nodeType = nodeType;
        this.handler = handler;
        this.expectedData = expectedData;
        this.actualData = actualData;
    }

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getHandler() {
        return handler;
    }

    public void setHandler(String handler) {
        this.handler = handler;
    }

    public String getExpectedData() {
        return expectedData;
    }

    public void setExpectedData(String expectedData) {
        this.expectedData = expectedData;
    }

    public List<String> getActualData() {
        return actualData;
    }

    public void setActualData(List<String> actualData) {
        this.actualData = actualData;
    }

    @Override
    public String generate() {
        StringBuilder xmlBuilder = new StringBuilder();

        xmlBuilder.append("<verify id=\"Verify").append(actualData.get(0)).append("\" handler=\"").append(handler)
                .append("\" desc=\"Check if ").append(actualData.get(0)).append(" has value ").append(expectedData).append("\">\n")
                .append("    <input name=\"actualstring\">$")
                .append(actualData.get(0)).append("{response}{body}");

        for (int i = 1; i < actualData.size(); i++) {
            xmlBuilder.append("{").append(actualData.get(i)).append("}");
        }
        if ("stringValidator".equals(handler)) {
            // If the handler is StringValidator, add double quotes around expectedData
            xmlBuilder.append("</input>\n")
                    .append("    <input name=\"expectedstring\">\"").append(expectedData).append("\"</input>\n")
                    .append("</verify>\n");
        } else {
            // For other handlers, just append the expectedData without quotes
            xmlBuilder.append("</input>\n")
                    .append("    <input name=\"expectedstring\">").append(expectedData).append("</input>\n")
                    .append("</verify>\n");
        }

        String xml = xmlBuilder.toString();
        return xml;
    }
}
