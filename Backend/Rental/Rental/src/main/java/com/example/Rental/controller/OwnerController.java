package com.example.Rental.controller;


import com.example.Rental.model.Issues;
import com.example.Rental.model.TenantRequest;
import com.example.Rental.repository.IssuesRepo;
import com.example.Rental.repository.TenantRequestRepo;
import com.example.Rental.service.OwnerDashboardService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Owner")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class OwnerController {
    @Autowired
    TenantRequestRepo tenantRequestRepo;

    @Autowired
    OwnerDashboardService ownerDashboardService;

    @Autowired
    IssuesRepo issuesRepo;

    @GetMapping("/Pending-Request/{ownerId}")
    public List<TenantRequest> PendingList(@PathVariable String ownerId){
        ObjectId objectId = new ObjectId(ownerId);

        System.out.println("called pending one");
        return tenantRequestRepo.findPendingRequest(objectId);
    }

    @GetMapping("/Accepted-Request/{ownerId}")
    public  ResponseEntity<?> AcceptedList(@PathVariable String ownerId){
        ObjectId objectId = new ObjectId(ownerId);
        System.out.println("called accepted one");
       List<TenantRequest> tenantRequests= tenantRequestRepo.findAcceptedRequest(objectId);
       return ResponseEntity.ok(tenantRequests);
    }

    @PutMapping("/{requestId}/update-status")
    public ResponseEntity<?> updateStatus(@PathVariable String requestId, @RequestParam String status) {
        System.out.println("Called to update");

        return ownerDashboardService.UpdateRequest(requestId, status);



    }

    @GetMapping("/All-Issues/{ownerId}")
    public List<Issues> AllIssues(@PathVariable String ownerId ){
        ObjectId objectId=new ObjectId(ownerId);
        List<Issues> issues= issuesRepo.findAllIssueById(objectId);
        return SortIssue(issues);
    }

    @GetMapping("/PendingIssue/{ownerId}")
    public List<Issues> PendingIssue(@PathVariable String ownerId){
        ObjectId objectId=new ObjectId(ownerId);
        List<Issues> issues= issuesRepo.findPendingIssueById(objectId);
        return SortIssue(issues);
    }
    public List<Issues> SortIssue(List<Issues> issues){
        Map<String, Integer> severityOrder = Map.of(
                "High", 3,
                "Medium", 2,
                "Low", 1
        );

// Sort in Java
        issues.sort(Comparator.comparing((Issues issue) -> severityOrder.get(issue.getSeverity())).reversed()
                .thenComparing(Issues::getPosted_on, Comparator.reverseOrder()));
        return issues;
    }
}
