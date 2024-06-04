package com.example.demo.models;

import com.example.demo.service.GenerationFactory;
import com.example.demo.service.GenerationLogic;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class Loop implements GenerationLogic {

    String index;

    String start;

    String end;

    String nodeJson;

    GenerationFactory generationFactory;

    @Autowired
    public void setGenerationFactory(GenerationFactory generationFactory){
        this.generationFactory = generationFactory;
    }

    public Loop() {
    }

    public Loop(String index, String start, String end, String nodeJson) {
        this.index = index;
        this.start = start;
        this.end = end;
        this.nodeJson = nodeJson;
    }

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

    public String getNodeJson() {
        return nodeJson;
    }

    public void setNodeJson(String nodeJson) {
        this.nodeJson = nodeJson;
    }

    public String generate() throws Exception {
        StringBuilder xml = new StringBuilder();

        xml.append("\t<foreach desc=\"IterateList\" counter=\"" + getIndex() + "\" start=\"" + getStart() + "\" end=\"" + getEnd() + "\">\n" +
                "\t\t<do>\n");

        JsonArray loopNodesArray =  JsonParser.parseString(getNodeJson()).getAsJsonArray();

        List<GenerationLogic> loopNodes = generationFactory.getAllGenerationLogicInSequence(loopNodesArray);

        for(GenerationLogic loopNode : loopNodes){
            xml.append(loopNode.generate());
        }

        xml.append("\t\t</do>\n" +
                "\t</foreach>\n");

        return xml.toString();
    }

}
