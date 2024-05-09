package com.example.demo.restcontroller;


import com.example.demo.service.TestcaseCreationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestcaseCreationController {

    TestcaseCreationService testcaseCreationService;

    @Autowired
    public void setTestcaseCreationService(TestcaseCreationService testcaseCreationService){
        this.testcaseCreationService = testcaseCreationService;
    }

    @PostMapping("/generateTestcase")
    public String generateTestcaseInXML(@RequestParam(value = "testcaseNodes") String testcaseNodes) throws Exception {
        return testcaseCreationService.testcaseInXML(testcaseNodes);
    }

}
