package com.example.Rental.controller;

import com.example.Rental.DTO.LoginCred;
import com.example.Rental.config.JwtUtils;
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
@RequestMapping("/SignIn")
public class SignInController {
    @Autowired
    TenantRepo tenantRepo;
    @Autowired
    OwnerRepo ownerRepo;
    @Autowired
    VendorRepo vendorRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    JwtUtils jwtUtils;
    private ResponseEntity<?> authenticateUser(String email, String password, Object user, String role) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sign Up Required!!!");
        }


        String storedPassword = "";
        if (user instanceof Owners) {
            storedPassword = ((Owners) user).getPassword();
        } else if (user instanceof Tenants) {
            storedPassword = ((Tenants) user).getPassword();
        } else if (user instanceof Vendors) {
            storedPassword = ((Vendors) user).getPassword();
        }

        if (!passwordEncoder.matches(password, storedPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }

        // Generate JWT Token
        String token = jwtUtils.generateToken(email,role);

        // Create response object
        Map<String, Object> response = new HashMap<>();
        response.put("User",user);
        response.put("token", token);
        response.put("role", role);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/owner")
    public ResponseEntity<?> signInOwner(@RequestBody LoginCred loginCred) {
        Owners existingOwner = ownerRepo.findByEmail(loginCred.getEmail());
        return authenticateUser(loginCred.getEmail(), loginCred.getPassword(), existingOwner, "OWNER");
    }

    @PostMapping("/tenant")
    public ResponseEntity<?> signInTenant(@RequestBody LoginCred loginCred) {
        Tenants existingTenant = tenantRepo.findByEmail(loginCred.getEmail());
        return authenticateUser(loginCred.getEmail(), loginCred.getPassword(), existingTenant, "TENANT");
    }

    @PostMapping("/vendor")
    public ResponseEntity<?> signInVendor(@RequestBody LoginCred loginCred) {
        Vendors existingVendor = vendorRepo.findByEmail(loginCred.getEmail());
        return authenticateUser(loginCred.getEmail(), loginCred.getPassword(), existingVendor, "VENDOR");
    }
}
