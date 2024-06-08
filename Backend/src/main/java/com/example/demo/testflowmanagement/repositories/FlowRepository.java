package com.example.demo.testflowmanagement.repositories;

import com.example.demo.testflowmanagement.models.entity.Flow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlowRepository extends JpaRepository<Flow,String> {
}
