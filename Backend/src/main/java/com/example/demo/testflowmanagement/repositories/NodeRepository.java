package com.example.demo.testflowmanagement.repositories;

import com.example.demo.testflowmanagement.models.entity.Node;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NodeRepository extends JpaRepository<Node,Long> {
}
