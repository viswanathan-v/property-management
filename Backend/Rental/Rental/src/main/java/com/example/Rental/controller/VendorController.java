package com.example.Rental.controller;


import com.example.Rental.model.Issues;
import com.example.Rental.repository.IssuesRepo;
import com.example.Rental.service.VendorService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Vendor")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VendorController {
    @Autowired
    VendorService vendorService;
    @Autowired
    IssuesRepo issuesRepo;
    // API for a vendor to accept an issue


    @PostMapping("/{issueId}/complete/{vendorId}")
    public ResponseEntity<?> MarkAsCompleted(@PathVariable String issueId,@PathVariable String vendorId){
        vendorService.completeIssue(issueId,vendorId);
        return ResponseEntity.ok("Marked as completed");
    }
    @PostMapping("/{issueId}/accept/{vendorId}")
    public ResponseEntity<?> acceptIssue(@PathVariable String issueId, @PathVariable String vendorId) {
        vendorService.acceptIssue(issueId, vendorId);
        return ResponseEntity.ok("Vendor accepted the issue!");
    }

    // API for a vendor to reject an issue
    @PostMapping("/{issueId}/reject/{vendorId}")
    public ResponseEntity<?> rejectIssue(@PathVariable String issueId, @PathVariable String vendorId) {
        vendorService.rejectIssue(issueId, vendorId);
        return ResponseEntity.ok("Vendor rejected the issue!");
    }

    @GetMapping("/Issue-list/{vendorId}")
    public ResponseEntity<?> IssueList(@PathVariable String vendorId){
        List<Issues> issues=issuesRepo.findByActiveRequestsVendorId(vendorId);
        return ResponseEntity.ok(issues);
    }


    @GetMapping("/Assigned-Issue/{vendorId}")
    public ResponseEntity<?> AssignedList(@PathVariable String vendorId){
        ObjectId vendorObjectId = new ObjectId(vendorId);  // Convert String to ObjectId
        List<Issues> issues = issuesRepo.findByAssignedIssueByVendorId(vendorObjectId);

        if (issues.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No assigned issues found.");
        }

        return ResponseEntity.ok(issues);}

}
