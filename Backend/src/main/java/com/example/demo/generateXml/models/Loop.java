package com.example.demo.generateXml.models;

import com.example.demo.generateXml.service.GenerationFactory;
import com.example.demo.generateXml.service.GenerationLogic;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

import java.util.List;

public class Loop implements GenerationLogic {

    String nodeType;

    String index;

    String start;

    String end;

    List<Object> nodeJson;

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getEnd() {
        return end;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public List<Object> getNodeJson() {
        return nodeJson;
    }

    public void setNodeJson(List<Object> nodeJson) {
        this.nodeJson = nodeJson;
    }

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String generate() throws Exception {        StringBuilder xml = new StringBuilder();

        xml.append("\t<foreach desc=\"IterateList\" counter=\"" + getIndex() + "\" start=\"" + getStart() + "\" end=\"" + getEnd() + "\">\n" +
                "\t\t<do>\n");

        ObjectMapper objectMapper = new ObjectMapper();

        String nodes = objectMapper.writeValueAsString(getNodeJson());

        JsonArray loopNodesArray =  JsonParser.parseString(nodes==null?"[]":nodes).getAsJsonArray();

        GenerationFactory generationFactory = new GenerationFactory();

        List<GenerationLogic> loopNodes = generationFactory.getAllGenerationLogicInSequence(loopNodesArray);

        for(GenerationLogic loopNode : loopNodes){
            xml.append(loopNode.generate());
        }

        xml.append("\t\t</do>\n" +
                "\t</foreach>\n");

        return xml.toString();
    }

}
