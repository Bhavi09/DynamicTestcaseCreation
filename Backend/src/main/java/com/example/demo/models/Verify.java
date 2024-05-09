package com.example.demo.models;

import com.example.demo.service.GenerationLogic;

public class Verify implements GenerationLogic {

    String actualData;

    String expectedData;

    public Verify() {
    }

    public Verify(String actualData, String expectedData) {
        this.actualData = actualData;
        this.expectedData = expectedData;
    }

    public String getActualData() {
        return actualData;
    }

    public void setActualData(String actualData) {
        this.actualData = actualData;
    }

    public String getExpectedData() {
        return expectedData;
    }

    public void setExpectedData(String expectedData) {
        this.expectedData = expectedData;
    }

    @Override
    public String generate() {
        return "Verification Logic \n";
    }
}
