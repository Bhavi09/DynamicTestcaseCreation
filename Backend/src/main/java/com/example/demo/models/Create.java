package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Create implements GenerationLogic {

    String dataJson;

    String resourceType;

    public Create() {
    }

    public Create(String dataJson, String resourceType) {
        this.dataJson = dataJson;
        this.resourceType = resourceType;
    }

    public String getDataJson() {
        return dataJson;
    }

    public void setDataJson(String dataJson) {
        this.dataJson = dataJson;
    }

    public String getresourceType() {
        return resourceType;
    }

    public void setresourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    @Override
    public String generate() {
        return "creation Logic \n";
    }
}
