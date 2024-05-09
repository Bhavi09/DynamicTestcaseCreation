package com.example.demo.service.impl;

import com.example.demo.service.GenerationFactory;
import com.example.demo.service.GenerationLogic;
import com.example.demo.service.TestcaseCreationService;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestcaseCreationServiceImpl implements TestcaseCreationService {

    GenerationFactory generationFactory;

    @Autowired
    public void setGenerationFactory(GenerationFactory generationFactory){
        this.generationFactory = generationFactory;
    }

    @Override
    public String testcaseInXML(String testcaseNodes) throws Exception {
        // Example JSON array string
        //String jsonArrayString = "[{\"nodeType\":\"Create\",\"value\":{\"dataJson\":\"John\",\"resourceType\":\"New York\"}}]";

        StringBuilder xml = new StringBuilder();

        // Parse the JSON array string into a JsonArray
        JsonArray jsonArray = JsonParser.parseString(testcaseNodes).getAsJsonArray();

        List<GenerationLogic> allGenerationLogic = generationFactory.getAllGenerationLogicInSequence(jsonArray);

        for (GenerationLogic generationLogic : allGenerationLogic) {
            xml.append(generationLogic.generate());
        }

        return xml.toString();
    }

}
