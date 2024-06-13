package com.example.demo.generateXml.models;

import com.example.demo.generateXml.service.GenerationFactory;
import com.example.demo.generateXml.service.GenerationLogic;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

import java.util.List;

public class Condition implements GenerationLogic {

    String nodeType;
    String condition;
    String desc;
    List<Object> thenNodeJson;
    List<Object> elseNodeJson;

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<Object> getElseNodeJson() {
        return elseNodeJson;
    }

    public void setElseNodeJson(List<Object> elseNodeJson) {
        this.elseNodeJson = elseNodeJson;
    }

    public List<Object> getThenNodeJson() {
        return thenNodeJson;
    }

    public void setThenNodeJson(List<Object> thenNodeJson) {
        this.thenNodeJson = thenNodeJson;
    }

    @Override
    public String generate() throws Exception {

        StringBuilder xml = new StringBuilder();
        ObjectMapper objectMapper = new ObjectMapper();
        String thenNodes = objectMapper.writeValueAsString(getThenNodeJson());
        String elseNodes = objectMapper.writeValueAsString(getElseNodeJson());
        JsonArray thenNodesArray = JsonParser.parseString(thenNodes==null?"[]":thenNodes).getAsJsonArray();
        JsonArray elseNodesArray = JsonParser.parseString(elseNodes==null?"[]":elseNodes).getAsJsonArray();
        GenerationFactory generationFactory = new GenerationFactory();

        List<GenerationLogic> thenNodesGenerate = generationFactory.getAllGenerationLogicInSequence(thenNodesArray);
        List<GenerationLogic> elseNodesGenerate = generationFactory.getAllGenerationLogicInSequence(elseNodesArray);


        xml.append("<if desc=\""+getDesc()+"\">\n");
        xml.append("\t<cond>"+getCondition()+"</cond>\n");
        xml.append("\t<then>\n");
        for(GenerationLogic thenNodeGenerate: thenNodesGenerate)
        {
            xml.append("\t");
            xml.append(thenNodeGenerate.generate());
        }
        xml.append("\t</then>\n");
        xml.append("\t<else>\n");
        for(GenerationLogic elseNodeGenerate : elseNodesGenerate)
        {
            xml.append("\t");
            xml.append(elseNodeGenerate.generate());
        }
        xml.append("\t<else>\n");
        xml.append("</if>");

        return xml.toString();
    }

}
