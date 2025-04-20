package com.example.Rental.service;

import com.example.Rental.DTO.SeverityRequest;
import com.example.Rental.model.Issues;
import com.example.Rental.model.Owners;
import com.example.Rental.model.TenantRequest;
import com.example.Rental.model.Tenants;
import com.example.Rental.repository.IssuesRepo;
import com.example.Rental.repository.OwnerRepo;
import com.example.Rental.repository.TenantRepo;
import com.example.Rental.repository.TenantRequestRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TenantRequestService {
    @Autowired
    TenantRepo tenantRepo;
    @Autowired
    OwnerRepo ownerRepo;

    @Autowired
    IssuesRepo issuesRepo;
    @Autowired
    TenantRequestRepo tenantRequestRepo;
    WebClient webClient;

    public TenantRequestService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
    }

    public ResponseEntity<?> createRequest(String tid, String email, String msg, String address, String location){
        Tenants tenant = tenantRepo.findById(tid).orElseThrow(()->new RuntimeException("Tenant Not Found"));
        Owners owner=ownerRepo.findByEmail(email);
        //Resolve multiple request to owner
        ObjectId T_objectId = new ObjectId(tid);

//        System.out.println(tenantRequestRepo.findRequestExistByTId(T_objectId));
        if(!tenantRequestRepo.findRequestExistByTId(T_objectId).isEmpty()){
            System.out.println("Already had a request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Already made an request!!...Try Again later");
        }
        if( owner==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Credentials");
        }
        TenantRequest req=new TenantRequest();
        req.setTenants(tenant);
        req.setRequest_message(msg);
        req.setOwners(owner);
        req.setRequested_address(address);
        req.setReq_location(location);
        req.setStatus("Pending");
        tenantRequestRepo.save(req);
        return ResponseEntity.ok("Request has been sent!!"+req);
    }

    public ResponseEntity<?> raiseIssue(String oid, String tId, String statement, String type, LocalDateTime posted, int estimatedDays) {
        Issues issue=new Issues();
        issue.setIssue_type(type);
        SeverityRequest severityRequest =new SeverityRequest();
        severityRequest.setText(statement);
        issue.setEstimated_day(estimatedDays);
        issue.setPosted_on(posted);
        System.out.println("Entered");
        String severity=getSeverity(severityRequest);
        System.out.println("Severity :"+severity);
        System.out.println("Entered");
        issue.setDescription(statement);
        issue.setSeverity(severity);
        Optional<Tenants> tenant=tenantRepo.findById(tId);
        Optional<Owners> owners=ownerRepo.findById(oid);
        if(tenant.isPresent() && owners.isPresent()){
            Tenants t=tenant.get();
            Owners owner=owners.get();
            issue.setTenants(t);
            issue.setOwners(owner);
            issue.setStatus("Pending");
        }
        issuesRepo.save(issue);
        return ResponseEntity.ok(issue);
    }
    public String  getSeverity(SeverityRequest complaintText) {
        String severity = webClient.post()
                .uri("/predict/")
                .bodyValue(complaintText)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        if (severity != null) {
            try {
                // Parse JSON response
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(severity);

//                System.out.println("Payload: " + mapper.writeValueAsString(complaintText));
                System.out.println(jsonNode.get("severity").asText());
                int severityCode = jsonNode.get("severity").asInt();
                switch (severityCode) {
                    case 0:
                        return "Low";
                    case 1:
                        return "Medium";
                    case 2:
                        return "High";
                    default:
                        return "Unknown";
                } // Extract only the severity value
            } catch (Exception e) {
                e.printStackTrace();  // Handle JSON parsing errors
                return "Unknown";
            }
        }
        return "Unknown";
    }
}
