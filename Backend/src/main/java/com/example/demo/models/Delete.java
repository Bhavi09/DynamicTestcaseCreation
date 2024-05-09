package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Delete implements GenerationLogic {

    String parameterName;

    String parameterValue;

    String resourceType;

    public Delete() {
    }

    public Delete(String parameterValue, String parameterName, String resourceType) {
        this.parameterValue = parameterValue;
        this.parameterName = parameterName;
        this.resourceType = resourceType;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getParameterValue() {
        return parameterValue;
    }

    public void setParameterValue(String parameterValue) {
        this.parameterValue = parameterValue;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    @Override
    public String generate() {
        return "Deletion Logic \n";
    }
}
