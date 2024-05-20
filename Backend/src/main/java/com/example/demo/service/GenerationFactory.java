package com.example.demo.service;

import com.example.demo.models.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class GenerationFactory {
    public List<GenerationLogic> getAllGenerationLogicInSequence(JsonArray jsonArray) throws Exception {
        List<GenerationLogic> list = new ArrayList();
        for(JsonElement j : jsonArray){
            list.add(getClassOfGenerationLogic(j));
        }
        return list;
    }
    GenerationLogic getClassOfGenerationLogic(JsonElement jsonElement) throws Exception {

        Gson gson = new Gson();

        String jsonString = gson.toJson(jsonElement);

        JsonObject jsonObject = jsonElement.getAsJsonObject();

        ObjectMapper objectmapper = new ObjectMapper();

        if(jsonObject.has("nodeType")) {
            return switch (jsonObject.get("nodeType").getAsString()) {
                case "Create" -> {
                    yield objectmapper.readValue(jsonString, Create.class);
                }
                case "Verify" -> {
                   yield objectmapper.readValue(jsonString, Verify.class);
                }
                case "Delete" -> {
                   yield  objectmapper.readValue(jsonString, Delete.class);
                }
                case "Search" -> {
                    yield objectmapper.readValue(jsonString, Search.class);
                }
                default -> {
                    yield null;
                }
            };
        }
        else return null;
    }
}
