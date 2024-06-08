package com.example.demo.testflowmanagement.services;

import com.example.demo.testflowmanagement.models.dto.FlowInfo;
import com.example.demo.testflowmanagement.models.entity.Flow;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface FlowService {
    public FlowInfo saveFlow(FlowInfo flowInfo) throws JsonProcessingException;

    public FlowInfo getFlow(String id) throws JsonProcessingException;
}
