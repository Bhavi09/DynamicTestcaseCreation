package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Create implements GenerationLogic {

    String jsonData;

    String resourceType;

    public Create() {
    }

    public Create(String jsonData, String resourceType) {
        this.jsonData = jsonData;
        this.resourceType = resourceType;
    }

    public String getjsonData() {
        return jsonData;
    }

    public void setjsonData(String jsonData) {
        this.jsonData = jsonData;
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
