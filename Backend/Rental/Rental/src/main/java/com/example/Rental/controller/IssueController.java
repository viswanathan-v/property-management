package com.example.Rental.controller;


import com.example.Rental.model.Vendors;
import com.example.Rental.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/Issues")
@CrossOrigin("*")
public class IssueController {
    @Autowired
    IssueService issueService;

    @PostMapping("/{issueId}/send-requests")
    public ResponseEntity<?> sendRequests(@PathVariable String issueId) {
//        ObjectId Issue_oId = new ObjectId(issueId);
        System.out.println("Initiating request");
        issueService.sendRequestToVendors(issueId);
        return ResponseEntity.ok("Requests sent to vendors!");
    }


    @PutMapping("/Reject/{issueId}")
    public ResponseEntity<?> rejectIssue(@PathVariable String issueId){
        return issueService.rejectAnIssue(issueId);

    }
    @PostMapping("/{issueId}/assign/manual")
    public String assignManualVendor(@PathVariable String issueId, @RequestBody Vendors manualVendor) {
        issueService.assignManualVendor(issueId, manualVendor);
        return "Manual vendor assigned!";
    }
}
