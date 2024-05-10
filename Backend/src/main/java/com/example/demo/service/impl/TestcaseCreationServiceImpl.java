package com.example.demo.service.impl;

import com.example.demo.service.GenerationFactory;
import com.example.demo.service.GenerationLogic;
import com.example.demo.service.TestcaseCreationService;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class TestcaseCreationServiceImpl implements TestcaseCreationService {

    GenerationFactory generationFactory;

    @Autowired
    public void setGenerationFactory(GenerationFactory generationFactory){
        this.generationFactory = generationFactory;
    }

    @Override
    public ResponseEntity<Resource> testcaseInXML(String testcaseNodes) throws Exception {
        // Example JSON array string
        //String jsonArrayString = "[{\"nodeType\":\"Create\",\"value\":{\"dataJson\":\"John\",\"resourceType\":\"New York\"}}]";

        StringBuilder xml = new StringBuilder();

        // Parse the JSON array string into a JsonArray
        JsonArray jsonArray = JsonParser.parseString(testcaseNodes).getAsJsonArray();

        // First element in the array should have testcaseId
        JsonElement jsonElement = jsonArray.get(0);
        JsonObject jsonObject = jsonElement.getAsJsonObject();

        // Fetch all the resources in the json array
        Map<Integer, JsonObject> resources = getAllResources(jsonArray);

        String testcaseId = jsonObject.get("testcaseId").getAsString();

        Path testcaseDir = Files.createTempDirectory("testcase-" + testcaseId);

        // Create subdirectories inside the testcases directory
        Path testcasesDir = Files.createTempDirectory(testcaseDir, "testcases");
        Path resourcesDir = Files.createTempDirectory(testcaseDir, "resources");

        // Save the resources in the temporary directory
        for (Map.Entry entry : resources.entrySet()) {

            // Define the file path within the resources directory
            String filePath = resourcesDir.resolve("resource" + entry.getKey() + "ToCreate.json").toString();

            // Write JSON string to file
            FileWriter fileWriter = new FileWriter(filePath);
            fileWriter.write(entry.getValue().toString());
            fileWriter.close();
        }

        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<testcase id=\""+ testcaseId +"\" xmlns=\"http://www.gitb.com/tdl/v1/\" xmlns:gitb=\"http://www.gitb.com/core/v1/\">" +
        "\t<metadata>\n" +
        "\t\t<gitb:name>" + testcaseId + "</gitb:name>\n" +
        "\t\t<gitb:type>CONFORMANCE</gitb:type>\n" +
        "\t\t<gitb:version>1.0</gitb:version>\n" +
        "\t\t<gitb:description>Test case to " + testcaseId + "</gitb:description>\n" +
        "\t</metadata>" +
        "\t<imports>\n"
        );

        // Import saved resources
        for (Map.Entry entry : resources.entrySet()) {
            xml.append("\t\t<artifact type=\"binary\" encoding=\"UTF-8\" name=\"resource" + entry.getKey() + "ToCreateInJsonString\">/" + testcaseId + "/resources/resource" + entry.getKey() + "ToCreate.json</artifact>\n");
        }

        xml.append(
        "\t</imports>\n" +
        "<actors>\n" +
        "\t\t<gitb:actor id=\"ITB\" name=\"ITB\" role=\"SUT\"/>\n" +
        "\t\t<gitb:actor id=\"FhirHandler\" name=\"FhirHandlers\" role=\"SIMULATED\"/>\n" +
        "\t</actors>" +
        "\t<steps stopOnError=\"true\">"
        );

        List<GenerationLogic> allGenerationLogic = generationFactory.getAllGenerationLogicInSequence(jsonArray);

        for (GenerationLogic generationLogic : allGenerationLogic) {
            if(generationLogic!=null) {
                xml.append(generationLogic.generate());
            }
        }

        xml.append("\t</steps>\n" +
                "</testcase>"
        );

        // Define the file path within the resources directory
        String filePath = testcasesDir.resolve("testcase" + testcaseId + ".xml").toString();

        // Write JSON string to file
        FileWriter fileWriter = new FileWriter(filePath);
        fileWriter.write(xml.toString());
        fileWriter.close();

        // Create the zip file in a different location
        Path zipFilePath = Files.createTempFile(testcaseDir.getParent(), "testcase", ".zip");
        createZipFile(testcaseDir, zipFilePath);

        // Prepare the zip file as a resource
        FileSystemResource zipFileSystemResource = new FileSystemResource(zipFilePath.toFile());
        Resource zipFileResource = zipFileSystemResource;

        // Set the headers for the response
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename("testcase.zip").build());
        // Return the zip file as a ResponseEntity
        return ResponseEntity.ok()
                .headers(headers)
                .body(zipFileResource);

    }

    Map<Integer, JsonObject> getAllResources(JsonArray jsonArray){
        Map<Integer,JsonObject> resources = new HashMap<>();

        int counter = 0;

        for(JsonElement jsonElement : jsonArray){

            JsonObject jsonObject = jsonElement.getAsJsonObject();

            JsonObject value = (JsonObject) jsonObject.get("value");

            if(value!=null && !resources.containsValue(value)){
                resources.put(counter, value);
            }

            counter++;

        }
        return resources;

    }

    public void createZipFile(Path sourceDir, Path zipFilePath) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(zipFilePath.toFile());
             ZipOutputStream zos = new ZipOutputStream(fos)) {

            // Add each file in the source directory and its subdirectories to the zip file
            Files.walk(sourceDir)
                    .filter(path -> !Files.isDirectory(path))
                    .forEach(path -> {
                        ZipEntry zipEntry = new ZipEntry(sourceDir.relativize(path).toString());
                        try {
                            zos.putNextEntry(zipEntry);
                            Files.copy(path, zos);
                            zos.closeEntry();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        }
    }


}
