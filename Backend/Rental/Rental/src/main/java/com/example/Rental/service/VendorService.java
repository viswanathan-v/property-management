package com.example.Rental.service;

import com.example.Rental.DTO.VendorRequest;
import com.example.Rental.model.Issues;
import com.example.Rental.model.Vendors;
import com.example.Rental.repository.IssuesRepo;
import com.example.Rental.repository.VendorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class VendorService {

    @Autowired
    IssuesRepo issuesRepo;
    @Autowired
    VendorRepo vendorRepo;

    public void completeIssue(String issueId, String vendorId) {
        Issues issue = issuesRepo.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        Vendors acceptedVendor = issue.getAssignedVendor();

        Optional<Vendors> ven=vendorRepo.findById(acceptedVendor.getVendor_id());
        if(ven.isPresent()){
            Vendors vendor=ven.get();
            issue.setAssignedVendor(vendor);
            issue.setStatus("Completed");
            issue.setActiveRequests(null);
            issue.setManuallyAssigned(false);
        }
        issuesRepo.save(issue);
    }

    public void acceptIssue(String issueId, String vendorId) {
        Issues issue = issuesRepo.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        VendorRequest acceptedVendor = issue.getActiveRequests().stream()
                .filter(v -> v.getVendorId().equals(vendorId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Vendor request not found"));


        Optional<Vendors> vendors=vendorRepo.findById(acceptedVendor.getVendorId());
        if(vendors.isPresent()){
            Vendors vendor=vendors.get();
            issue.setAssignedVendor(vendor);
            issue.setStatus("Assigned");
            issue.setActiveRequests(null);
            issue.setManuallyAssigned(false);
        }
        // Remove all pending vendor requests

        issuesRepo.save(issue);
    }

    public void rejectIssue(String issueId, String vendorId) {
        Issues issue = issuesRepo.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.getActiveRequests().stream()
                .filter(v -> v.getVendorId().equals(vendorId))
                .findFirst()
                .ifPresent(v -> v.setStatus("Rejected"));

        // If all vendors have rejected, mark as Unresolved
        boolean allRejected = issue.getActiveRequests().stream()
                .allMatch(v -> v.getStatus().equals("Rejected"));

        if (allRejected) {
            issue.setStatus("Unresolved");
        }

        issuesRepo.save(issue);
    }

}
