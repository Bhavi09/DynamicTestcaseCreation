package com.example.demo.testflowmanagement.controllers;

import com.example.demo.testflowmanagement.models.dto.FlowInfo;
import com.example.demo.testflowmanagement.models.entity.Flow;
import com.example.demo.testflowmanagement.services.FlowService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flows")
public class FlowController {
    private FlowService flowService;
    @Autowired
    public void setFlowService(FlowService flowService)
    {
        this.flowService = flowService;
    }

    @PostMapping
    public FlowInfo saveFlow(@RequestBody FlowInfo flow) throws JsonProcessingException {
        return flowService.saveFlow(flow);
    }
    @GetMapping("/{id}")
    public FlowInfo getFlow(@PathVariable String id) throws JsonProcessingException {
        return flowService.getFlow(id);
    }


}
