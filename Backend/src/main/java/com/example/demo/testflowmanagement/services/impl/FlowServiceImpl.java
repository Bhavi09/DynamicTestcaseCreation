package com.example.demo.testflowmanagement.services.impl;

import com.example.demo.testflowmanagement.models.dto.FlowInfo;
import com.example.demo.testflowmanagement.models.entity.Flow;
import com.example.demo.testflowmanagement.models.mapper.FlowMapper;
import com.example.demo.testflowmanagement.repositories.FlowRepository;
import com.example.demo.testflowmanagement.services.FlowService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FlowServiceImpl implements FlowService {

    private FlowRepository flowRepository;
    private FlowMapper flowMapper;
    @Autowired
    public void setFlowRepository(FlowRepository flowRepository)
    {
        this.flowRepository = flowRepository;
    }

    @Autowired
    public void setFlowMapper(FlowMapper flowMapper){
        this.flowMapper = flowMapper;
    }
    @Override
    public FlowInfo saveFlow(FlowInfo flowInfo) throws JsonProcessingException {

        Flow flow = flowMapper.dtoToModel(flowInfo);
        Optional<Flow> existingFlowOptional = flowRepository.findById(flow.getId());
        existingFlowOptional.ifPresent(existingFlow-> flowRepository.delete(existingFlow));
        return flowMapper.modelToDto(flowRepository.save(flow));
    }

    @Override
    public FlowInfo getFlow(String id) throws JsonProcessingException {

        return flowMapper.modelToDto(flowRepository.findById(id).orElse(null));
    }
}
