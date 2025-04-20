package com.example.Rental.controller;


import com.example.Rental.DTO.IssueCred;
import com.example.Rental.DTO.TenantRequestCred;
import com.example.Rental.model.Issues;
import com.example.Rental.repository.IssuesRepo;
import com.example.Rental.service.TenantRequestService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Tenant")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TenantController {
    @Autowired
    TenantRequestService tenantRequestService;
    @Autowired
    IssuesRepo issuesRepo;
    @PostMapping("/Owner-Request")
    public ResponseEntity<?> RequestOwner(@RequestBody TenantRequestCred tenantRequestCred) {
        System.out.println("Entered");
        return tenantRequestService.createRequest(tenantRequestCred.getId(), tenantRequestCred.getEmail(), tenantRequestCred.getMessage(),tenantRequestCred.getAddress(),tenantRequestCred.getLocation());
    }

    @PostMapping("/Raise-issue")
    public ResponseEntity<?> PostIssue(@RequestBody IssueCred issueCred){
        System.out.println("Entered");
        System.out.println(issueCred.getOwner_id()+ issueCred.getTenant_id()+issueCred.getStatement()+issueCred.getType()+issueCred.getPosted()+issueCred.getEstimated_Days());
        return tenantRequestService.raiseIssue(issueCred.getOwner_id(), issueCred.getTenant_id(),issueCred.getStatement(),issueCred.getType(),issueCred.getPosted(),issueCred.getEstimated_Days());
    }
    @GetMapping("/Issue-status/{tenantId}")
    public  ResponseEntity<?> PostedIssue(@PathVariable String tenantId){
        ObjectId TOid=new ObjectId(tenantId);
        List<Issues> issue=  issuesRepo.findByAssignedIssueByTenantId(TOid);
        return ResponseEntity.ok(issue);
    }
}
