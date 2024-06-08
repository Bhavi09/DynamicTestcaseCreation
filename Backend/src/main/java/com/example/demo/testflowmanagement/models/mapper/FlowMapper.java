package com.example.demo.testflowmanagement.models.mapper;

import com.example.demo.testflowmanagement.models.dto.FlowInfo;
import com.example.demo.testflowmanagement.models.dto.NodeInfo;
import com.example.demo.testflowmanagement.models.entity.Flow;
import com.example.demo.testflowmanagement.models.entity.Node;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class FlowMapper {
    public Flow dtoToModel(FlowInfo flowInfo) throws JsonProcessingException {

        Flow flow = new Flow();

        flow.setId(flowInfo.getId());
        flow.setComponentName(flowInfo.getComponentName());
        flow.setSpecificationName(flowInfo.getSpecificationName());
        flow.setTestcaseName(flowInfo.getTestcaseName());
        flow.setDescription(flowInfo.getDescription());
        flow.setTestCaseNumber(flowInfo.getTestCaseNumber());
        flow.setEdges(flowInfo.getEdges());

        List<Node> nodes = new ArrayList<>();

        for(NodeInfo nodeInfo : flowInfo.getNodes()){

            ObjectMapper objectMapper = new ObjectMapper();

            String data = objectMapper.writeValueAsString(nodeInfo.getData());

            Node node = new Node();

            node.setId(nodeInfo.getId());
            node.setNodeId(nodeInfo.getNodeId());
            node.setNodeType(nodeInfo.getNodeType());
            node.setPositionX(nodeInfo.getPositionX());
            node.setPositionY(nodeInfo.getPositionY());
            node.setData(data);

            nodes.add(node);

        }

        flow.setNodes(nodes);

        return flow;

    }

    public FlowInfo modelToDto(Flow flow) throws JsonProcessingException {

        FlowInfo flowInfo = new FlowInfo();

        flowInfo.setId(flow.getId());
        flowInfo.setComponentName(flow.getComponentName());
        flowInfo.setSpecificationName(flow.getSpecificationName());
        flowInfo.setTestcaseName(flow.getTestcaseName());
        flowInfo.setDescription(flow.getDescription());
        flowInfo.setTestCaseNumber(flow.getTestCaseNumber());
        flowInfo.setEdges(flow.getEdges());

        List<NodeInfo> nodeInfos = new ArrayList<>();

        for(Node node : flow.getNodes()){

            ObjectMapper objectMapper = new ObjectMapper();

            List<Object> nodes = Arrays.asList(objectMapper.readValue(node.getData(), Object[].class));


            NodeInfo nodeInfo = new NodeInfo();

            nodeInfo.setId(node.getId());
            nodeInfo.setNodeId(node.getNodeId());
            nodeInfo.setNodeType(node.getNodeType());
            nodeInfo.setPositionX(node.getPositionX());
            nodeInfo.setPositionY(node.getPositionY());
            nodeInfo.setData(nodes);

            nodeInfos.add(nodeInfo);

        }

        flowInfo.setNodes(nodeInfos);

        return flowInfo;

    }
}
