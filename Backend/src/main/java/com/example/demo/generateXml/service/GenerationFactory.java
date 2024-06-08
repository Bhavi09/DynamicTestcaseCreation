package com.example.demo.generateXml.service;

import com.example.demo.generateXml.models.*;
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
                case "GetById" -> {
                    yield objectmapper.readValue(jsonString, GetById.class);
                }
                case "Output" -> {
                    yield objectmapper.readValue(jsonString, Output.class);
                }
                case "GetHistoryById" -> {
                    yield objectmapper.readValue(jsonString, GetHistoryById.class);
                }
                case "Lookup" -> {
                    yield objectmapper.readValue(jsonString, Lookup.class);
                }
                case "Translate" -> {
                    yield objectmapper.readValue(jsonString, Translate.class);
                }
                case "ValidateCode" -> {
                    yield objectmapper.readValue(jsonString, ValidateCode.class);
                }
                case "Expand" -> {
                    yield objectmapper.readValue(jsonString, Expand.class);
                }
                case "Loop" -> {
                    yield objectmapper.readValue(jsonString, Loop.class);
                }
                default -> {
                    yield null;
                }
            };
        }
        else return null;
    }
}
