package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Create implements GenerationLogic {

    String nodeType;
    String resourceType;
    String valueId;
    String operationId;

    public Create() {
    }

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getValueId() {
        return valueId;
    }

    public void setValueId(String valueId) {
        this.valueId = valueId;
    }

    public String getresourceType() {
        return resourceType;
    }

    public void setresourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getOperationId() {
        return operationId;
    }

    public void setOperationId(String operationId) {
        this.operationId = operationId;
    }

    @Override
    public String generate() {
        String xml =
                "\n<send id=\""+getValueId()+"ToCreate\" desc=\"Convert "+getresourceType()+"ToCreate jsonString => anyContent\" from=\"ITB\" to=\"FhirHandler\" handler=\"$DOMAIN{jsonStringConverterServiceAddress}\">\n" +
                        "    <input name=\"fhirServerBaseUrl\">$componentURI</input>\n" +
                        "    <input name=\"username\">$username</input>\n" +
                        "    <input name=\"password\">$password</input>\n" +
                        "    <input name=\"operationType\">\"create\"</input>\n" +
                        "    <input name=\"body\">$"+valueId+"ToCreateInJsonString</input>\n" +
                        "    <input name=\"bodyType\">\"jsonString\"</input>\n" +
                        "</send>\n" +

                "\n<send id=\""+getOperationId()+"\" desc=\"Create "+this.resourceType+"in FHIR server\" from=\"ITB\" to=\"FhirHandler\" handler=\"$DOMAIN{fhirContextServiceAddress}\">\n" +
                "    <input name=\"fhirServerBaseUrl\">$componentURI</input>\n" +
                "    <input name=\"username\">$username</input>\n" +
                "    <input name=\"password\">$password</input>\n" +
                "    <input name=\"operationType\">create</input>\n" +
                "    <input name=\"body\">$"+getValueId()+"ToCreate{convertedBody}</input>\n" +
                "</send>\n";
        return xml;
    }

    @Override
    public String toString() {
        return "Create{" +
                "nodeType='" + nodeType + '\'' +
                ", valueId='" + valueId + '\'' +
                ", resourceType='" + resourceType + '\'' +
                '}';
    }
}
