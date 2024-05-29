package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Read implements GenerationLogic {

    String nodeType;
    String resourceType;
    String fhirResourceId;
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

    public String getFhirResourceId() {
        return fhirResourceId;
    }

    public void setFhirResourceId(String fhirResourceId) {
        this.fhirResourceId = fhirResourceId;
    }

    public String getOperationId() {
        return operationId;
    }

    public void setOperationId(String operationId) {
        this.operationId = operationId;
    }

    @Override
    public String generate() {
        String xml = "\n         <send id=\""+operationId+"\" desc=\"Read "+resourceType+" from the FHIR server\" from=\"ITB\" to=\"FhirHandler\"\n" +
                "                handler=\"$DOMAIN{fhirContextServiceAddress}\">\n" +
                "            <input name=\"fhirServerBaseUrl\">$componentURI</input>\n" +
                "            <input name=\"username\">$username</input>\n" +
                "            <input name=\"password\">$password</input>\n" +
                "            <input name=\"operationType\">\"getById\"</input>\n" +
                "            <input name=\"fhirResourceType\">"+resourceType+"</input>\n" +
                "            <input name=\"fhirResourceId\">'"+fhirResourceId+"'</input>\n" +
                "        </send>\n";
        return xml;
    }
}
