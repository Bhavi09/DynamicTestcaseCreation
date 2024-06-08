package com.example.demo.generateXml.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

public interface TestcaseCreationService {
    ResponseEntity<Resource> testcaseInXML(String testcaseNodes) throws Exception;
}
