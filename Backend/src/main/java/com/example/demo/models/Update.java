package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Update implements GenerationLogic {

    String resourceType;

    String id;

    String jsonData;

    public Update() {
    }

    public Update(String resourceType, String id, String jsonData) {
        this.resourceType = resourceType;
        this.id = id;
        this.jsonData = jsonData;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getJsonData() {
        return jsonData;
    }

    public void setJsonData(String jsonData) {
        this.jsonData = jsonData;
    }

    @Override
    public String generate() {
        return "Updation Logic \n";
    }
}
