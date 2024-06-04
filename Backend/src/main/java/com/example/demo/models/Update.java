package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Update implements GenerationLogic {

    String nodeType;
    String resourceType;
    String valueId;
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

    public String getValueId() {
        return valueId;
    }

    public void setValueId(String valueId) {
        this.valueId = valueId;
    }

    public String getOperationId() {
        return operationId;
    }

    public void setOperationId(String operationId) {
        this.operationId = operationId;
    }

    @Override
    public String generate() throws Exception {
        String xml = "\n<send id=\"" + getValueId() + "ToUpdate\" desc=\"Convert " + getResourceType() + "ToUpdate jsonString => anyContent\" from=\"ITB\" to=\"FhirHandler\" handler=\"$DOMAIN{jsonStringConverterServiceAddress}\">\n" +
                "    <input name=\"fhirServerBaseUrl\">$componentURI</input>\n" +
                "    <input name=\"username\">$username</input>\n" +
                "    <input name=\"password\">$password</input>\n" +
                "    <input name=\"operationType\">\"update\"</input>\n" +
                "    <input name=\"body\">$" + getValueId() + "InJsonString</input>\n" +
                "    <input name=\"bodyType\">\"jsonString\"</input>\n" +
                "</send>\n" +

                "\n<send id=\"" + getOperationId() + "\" desc=\"Update " + getResourceType() + "in FHIR server\" from=\"ITB\" to=\"FhirHandler\" handler=\"$DOMAIN{fhirContextServiceAddress}\">\n" +
                "    <input name=\"fhirServerBaseUrl\">$componentURI</input>\n" +
                "    <input name=\"username\">$username</input>\n" +
                "    <input name=\"password\">$password</input>\n" +
                "    <input name=\"operationType\">update</input>\n" +
                "    <input name=\"body\">$" + getValueId() + "ToCreate{convertedBody}</input>\n" +
                "</send>\n";
        ;
        return xml;
    }
}
