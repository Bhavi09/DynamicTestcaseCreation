package com.example.demo.service;

import com.example.demo.models.Create;
import com.example.demo.models.Delete;
import com.example.demo.models.Update;
import com.example.demo.models.Verify;
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
            list.add(getClassOfGenerationLogic(j.getAsJsonObject()));
        }
        return list;
    }
    GenerationLogic getClassOfGenerationLogic(JsonObject jsonObject) throws Exception {

        JsonElement valuePart = jsonObject.get("value");
        Gson gson = new Gson();
        String jsonString = gson.toJson(valuePart);

        // with using jackson
        ObjectMapper objectmapper = new ObjectMapper();

        if(jsonObject.has("nodeType")) {
            switch (jsonObject.get("nodeType").getAsString()) {
                case "Create":

                    Create create = objectmapper.readValue(jsonString, Create.class);

                    //GenerationLogic createLogic = create.generate();

                    return create;

                case "Update":

                    return objectmapper.readValue(jsonString, Update.class);

                case "Verify":

                    return objectmapper.readValue(jsonString, Verify.class);

                case "Delete":

                    return objectmapper.readValue(jsonString, Delete.class);

                default:

                    System.out.println("Incorrect Node --------------------------------------------------------------- ");
                    return null;

            }
        }
        else
            System.out.println("No nodeType --------------------------------------------------------------- ");
            return null;
    }
}
