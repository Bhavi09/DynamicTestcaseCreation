package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

import java.util.List;

public class Verify implements GenerationLogic {

    String nodeType;
    String handler;
    String actualData;
    String expectedData;
//    List<String> actualData;
    String operationId;

    public Verify() {
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

//    public List<String> getActualData() {
//        return actualData;
//    }
//
//    public void setActualData(List<String> actualData) {
//        this.actualData = actualData;
//    }


    public String getActualData() {
        return actualData;
    }

    public void setActualData(String actualData) {
        this.actualData = actualData;
    }

    public String getOperationId() {
        return operationId;
    }
    public void setOperationId(String operationId) {
        this.operationId = operationId;
    }

    @Override
    public String generate() {
        StringBuilder xmlBuilder = new StringBuilder();

        xmlBuilder.append("\n<verify id=\"").append(getOperationId()).append("\" handler=\"").append(handler)
                .append("\" desc=\"Check if ").append(getOperationId()).append(" has value ").append(expectedData).append("\">\n")
                .append("    <input name=\"actualstring\">$")
                .append(getActualData());
//                .append(actualData.get(0)).append("{response}{body}");

//        for (int i = 1; i < actualData.size(); i++) {
//            xmlBuilder.append("{").append(actualData.get(i)).append("}");
//        }


        if ("StringValidator".equals(handler)) {
            // If the handler is StringValidator, add double quotes around expectedData
            xmlBuilder.append("</input>\n")
                    .append("    <input name=\"expectedstring\">\'").append(expectedData).append("\'</input>\n")
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
