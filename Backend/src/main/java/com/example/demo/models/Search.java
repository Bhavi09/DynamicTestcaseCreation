package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Search implements GenerationLogic {
    String nodeType;
    String resourceType;
    String parameters;
    String operationId;


    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getParameters() {
        return parameters;
    }

    public void setParameters(String parameters) {
        this.parameters = parameters;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getOperationId() {
        return operationId;
    }

    public void setOperationId(String operationId) {
        this.operationId = operationId;
    }

    @Override
    public String generate()
    {
        String xml = "\n        <send id=\""+getOperationId()+"\" desc=\"Search for "+resourceType+" from FHIR server\" from=\"ITB\" to=\"FhirHandler\" handler=\"$DOMAIN{fhirContextServiceAddress}\">\n" +
                "            <input name=\"fhirServerBaseUrl\">$componentURI</input>\n" +
                "            <input name=\"username\">$username</input>\n" +
                "            <input name=\"password\">$password</input>\n" +
                "            <input name=\"operationType\">\"search\"</input>\n" +
                "            <input name=\"fhirResourceType\">\""+resourceType+"\"</input>\n" +
                "            <input name=\"parameters\">"+parameters+"</input>\n" +
                "        </send>\n";
        return xml;
    }
}
