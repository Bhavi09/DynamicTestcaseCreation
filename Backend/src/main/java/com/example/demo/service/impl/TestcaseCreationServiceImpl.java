package com.example.demo.service.impl;

import com.example.demo.service.GenerationFactory;
import com.example.demo.service.GenerationLogic;
import com.example.demo.service.TestcaseCreationService;
import com.google.gson.*;
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
import java.util.*;
import java.util.regex.Pattern;
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

        Gson gson = new Gson();

        StringBuilder xml = new StringBuilder();

        // Parse the JSON array string into a JsonArray
        JsonArray jsonArray = JsonParser.parseString(testcaseNodes).getAsJsonArray();

        JsonElement jsonElement = jsonArray.get(0);
        JsonObject jsonObject = jsonElement.getAsJsonObject();

        JsonElement bodiesElement = jsonArray.get(1);
        JsonArray bodiesArray = bodiesElement.getAsJsonObject().get("bodies").getAsJsonArray();

        List<JsonObject> listOfBodies = getAllBodies(bodiesArray);


        String componentName = jsonObject.get("componentName").getAsString();
        String specificationName = jsonObject.get("specificationName").getAsString();
        String testcaseName = jsonObject.get("testcaseName").getAsString();
        String testCaseNumber = jsonObject.get("testCaseNumber").getAsString();
        String testcaseId = testcaseName.replaceAll("\\s","_")+"_operation";
        String directoryFileName = Pattern.compile("(?<=\\s)(\\w)").matcher(testcaseName).replaceAll(match -> match.group().toUpperCase());


        Path testcaseDir = Files.createTempDirectory("Testcase-"+testcaseId+ " ");

        // Creating subdirectories inside the testcases directory
        Path testcasesDir = Files.createTempDirectory(testcaseDir, "testcases");
        Path resourcesDir = Files.createTempDirectory(testcaseDir, "resources");



        String suiteFilePath = testcaseDir.resolve(testcaseId+".xml").toString();
        FileWriter suiteWriter = new FileWriter(suiteFilePath);
        String suiteXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<testsuite id=\""+specificationName+" "+testcaseName+"~test_suite\" xmlns=\"http://www.gitb.com/tdl/v1/\" xmlns:gitb=\"http://www.gitb.com/core/v1/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.gitb.com/tdl/v1/ ../gitb_tdl.xsd\">\n" +
                "\t<metadata>\n" +
                "\t\t<gitb:name>"+specificationName+"_Testcase"+testCaseNumber+"</gitb:name>\n" +
                "\t\t<gitb:type>CONFORMANCE</gitb:type>\n" +
                "\t\t<gitb:version>1.0</gitb:version>\n" +
                "\t</metadata>\n" +
                "\t<actors>\n" +
                "\t\t<gitb:actor id=\"ITB\">\n" +
                "\t\t\t<gitb:name>ITB</gitb:name>\n" +
                "\t\t\t<gitb:desc>The ITB system, which is testing application.</gitb:desc>\n" +
                "\t\t</gitb:actor>\n" +
                "\t\t<gitb:actor id=\"FhirHandler\">\n" +
                "\t\t\t<gitb:name>FhirHandler</gitb:name>\n" +
                "\t\t\t<gitb:desc>The FhirHandlers, which will receive ITB request and will give appropriate response to ITB.</gitb:desc>\n" +
                "\t\t</gitb:actor>\n" +
                "\t\n" +
                "\t</actors>\n" +
                "\t<testcase id=\""+testcaseId+"\"/>\n" +
                "</testsuite>\n";
        suiteWriter.write(suiteXml);
        suiteWriter.close();


        for(JsonObject body : listOfBodies)
        {
            String valueId = body.get("valueId").getAsString();
            String object = gson.toJson(body.getAsJsonObject("value"));
            String filePath = resourcesDir.resolve(valueId+".json").toString();
            FileWriter fileWriter = new FileWriter(filePath);
            fileWriter.write(object);
            fileWriter.close();
        }

        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<testcase id=\""+ testcaseId +"\" xmlns=\"http://www.gitb.com/tdl/v1/\" xmlns:gitb=\"http://www.gitb.com/core/v1/\">" +
        "\n\t<metadata>\n" +
        "\t\t<gitb:name>" + testcaseName + "</gitb:name>\n" +
        "\t\t<gitb:type>CONFORMANCE</gitb:type>\n" +
        "\t\t<gitb:version>1.0</gitb:version>\n" +
        "\t\t<gitb:description>Test case to " + testcaseName + "</gitb:description>\n" +
        "\t</metadata>\n" +
        "\n\t<imports>\n"
        );

        // Importing saved resources
        for (JsonObject body : listOfBodies) {
            String valueId = body.get("valueId").getAsString();
            xml.append("\t\t<artifact type=\"binary\" encoding=\"UTF-8\" name=\"" +valueId+ "InJsonString\">/" + testcaseId + "/resources/" +valueId+ ".json</artifact>\n");
        }

        xml.append(
        "\t</imports>\n" +
        "\t<actors>\n" +
        "\t\t<gitb:actor id=\"ITB\" name=\"ITB\" role=\"SUT\"/>\n" +
        "\t\t<gitb:actor id=\"FhirHandler\" name=\"FhirHandlers\" role=\"SIMULATED\"/>\n" +
        "\t</actors>" +
        "\n<steps stopOnError=\"true\">\n"
        );

        List<GenerationLogic> allGenerationLogic = generationFactory.getAllGenerationLogicInSequence(jsonArray);

        for (GenerationLogic generationLogic : allGenerationLogic) {
            if(generationLogic!=null) {
                xml.append(generationLogic.generate());
            }
        }

        xml.append("\n</steps>\n" +
                "\n</testcase>"
        );

        // Defining the file path within the resources directory
        String filePath = testcasesDir.resolve("testcase" + testcaseId + "Operation.xml").toString();

        // Writing JSON string to file
        FileWriter fileWriter = new FileWriter(filePath);
        fileWriter.write(xml.toString());
        fileWriter.close();

        // Creating the zip file in a different location
        Path zipFilePath = Files.createTempFile(testcaseDir.getParent(), "testcase", ".zip");
        createZipFile(testcaseDir, zipFilePath);

        // Preparing the zip file as a resource
        FileSystemResource zipFileSystemResource = new FileSystemResource(zipFilePath.toFile());
        Resource zipFileResource = zipFileSystemResource;

        // Setting the headers for the response
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename("testcase.zip").build());
        // Returning the zip file as a ResponseEntity
        return ResponseEntity.ok()
                .headers(headers)
                .body(zipFileResource);

    }

    List<JsonObject> getAllBodies(JsonArray bodiesArray)
    {
        List<JsonObject> bodies = new ArrayList<>();
        for(JsonElement jsonElement : bodiesArray)
        {
            JsonObject jsonObject = jsonElement.getAsJsonObject();
            bodies.add(jsonObject);
        }
        return bodies;
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
