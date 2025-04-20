package com.example.Rental.controller;


import com.example.Rental.model.Owners;
import com.example.Rental.model.Tenants;
import com.example.Rental.model.Vendors;
import com.example.Rental.repository.OwnerRepo;
import com.example.Rental.repository.TenantRepo;
import com.example.Rental.repository.VendorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/SignUp")
public class SignUpController {
    @Autowired
    private TenantRepo tenantRepo;
    @Autowired
    private OwnerRepo ownerRepo;
    @Autowired
    VendorRepo vendorRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/Owners")
    public ResponseEntity<?> signUpOwner(@RequestBody Owners owner) {
        return registerUser(owner, ownerRepo, "OWNER");
    }

    @PostMapping("/Tenants")
    public ResponseEntity<?> signUpTenant(@RequestBody Tenants tenant) {
        return registerUser(tenant, tenantRepo, "TENANT");
    }

    @PostMapping("/Vendors")
    public ResponseEntity<?> signUpVendor(@RequestBody Vendors vendor) {
        return registerUser(vendor, vendorRepo, "VENDOR");
    }
    private ResponseEntity<?> registerUser(Object user, Object repo, String role) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request!");
        }
        Map<String, Object> response = new HashMap<>();
        String email = "";
        if (user instanceof Owners) {
            email = ((Owners) user).getEmail();
        } else if (user instanceof Tenants) {
            email = ((Tenants) user).getEmail();
        } else if (user instanceof Vendors) {
            email = ((Vendors) user).getEmail();
        }

        // Check if user already exists
        if (repo instanceof OwnerRepo && ((OwnerRepo) repo).findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Owner already exists!");
        } else if (repo instanceof TenantRepo && ((TenantRepo) repo).findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tenant already exists!");
        } else if (repo instanceof VendorRepo && ((VendorRepo) repo).findByEmail(email) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Vendor already exists!");
        }

        // Encrypt password
        if (user instanceof Owners) {
            ((Owners) user).setPassword(passwordEncoder.encode(((Owners) user).getPassword()));
            response.put("User",((OwnerRepo) repo).save((Owners) user));
        } else if (user instanceof Tenants) {
            ((Tenants) user).setPassword(passwordEncoder.encode(((Tenants) user).getPassword()));
            response.put("User",((TenantRepo) repo).save((Tenants) user));
        } else if (user instanceof Vendors) {
            ((Vendors) user).setPassword(passwordEncoder.encode(((Vendors) user).getPassword()));
            response.put("User",((VendorRepo) repo).save((Vendors) user));
        }

        // Create response object

        response.put("message", "User registered successfully!");
        response.put("role", role);


        return ResponseEntity.ok(response);
    }

}