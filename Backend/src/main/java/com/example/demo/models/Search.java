package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Search implements GenerationLogic {
    String nodeType;
    String parameters;
    String resourceType;

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

    @Override
    public String generate()
    {
        String xml = "        <send id=\"search"+resourceType+"\" desc=\"Search for "+resourceType+" from FHIR server\" from=\"ITB\" to=\"FhirHandler\" handler=\"$DOMAIN{fhirContextServiceAddress}\">\n" +
                "            <input name=\"fhirServerBaseUrl\">$componentURI</input>\n" +
                "            <input name=\"username\">$username</input>\n" +
                "            <input name=\"password\">$password</input>\n" +
                "            <input name=\"operationType\">\"search\"</input>\n" +
                "            <input name=\"fhirResourceType\">\""+resourceType+"\"</input>\n" +
                "            <input name=\"parameters\">"+parameters+"</input>\n" +
                "        </send>";
        return xml;
    }
}
