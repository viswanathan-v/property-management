package com.example.Rental.service;

import com.example.Rental.DTO.VendorRequest;
import com.example.Rental.model.Issues;
import com.example.Rental.model.Vendors;
import com.example.Rental.repository.IssuesRepo;
import com.example.Rental.repository.VendorRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IssueService {

    @Autowired
    IssuesRepo issuesRepo;
    @Autowired
    VendorRepo vendorRepo;

    private final Logger log = LoggerFactory.getLogger(IssueService.class);
    @Transactional
    public void sendRequestToVendors(String issueId) {

        Optional<Issues> issue=issuesRepo.findById(issueId);
        Issues issues=issue.get();
        List<Vendors> vendors = vendorRepo.findByJob(issues.getIssue_type());

        if (vendors.isEmpty()) {
            log.warn("No vendors found for issue type: {}", issues.getIssue_type());
            throw new RuntimeException("No vendors available for the issue type: " + issues.getIssue_type());
        }

        List<VendorRequest> vendorRequests = vendors.stream()
                .map(v -> new VendorRequest(v.getVendor_id(), v.getVendor_name(), v.getMobile_number(), v.getEmail(), "Pending"))
                .collect(Collectors.toList());

        issues.setActiveRequests(vendorRequests);
        issues.setStatus("Waiting for Vendor Response");

        issuesRepo.save(issues);

        log.info("Vendor requests sent successfully for issue: {}", issueId);
    }


    public void assignManualVendor(String issueId, Vendors manualVendor) {
        Issues issue = issuesRepo.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setAssignedVendor(manualVendor);
        issue.setManuallyAssigned(true); // Mark as manually assigned
        issue.setStatus("Assigned");
        issue.setActiveRequests(null); // Clear other requests

        issuesRepo.save(issue);
    }



    public ResponseEntity<?> rejectAnIssue(String issueId) {
        Optional<Issues> issues=issuesRepo.findById(issueId);
        Issues issue= issues.get();
        if(issue.getStatus().equals("Pending")){
            issue.setStatus("Rejected");
            issuesRepo.save(issue);
        }else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("It already forwarded to further process");
        }
        return ResponseEntity.ok("Rejected sucessfully");
    }
}
