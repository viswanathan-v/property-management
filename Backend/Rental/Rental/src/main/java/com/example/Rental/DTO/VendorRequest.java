package com.example.Rental.DTO;


public class VendorRequest {
    private String vendorId;
    private String name;
    private Long contact;
    private String email;
    private String status; // "Pending", "Accepted", "Rejected"

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getContact() {
        return contact;
    }

    public void setContact(Long contact) {
        this.contact = contact;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Constructor
    public VendorRequest(String vendorId, String name, Long contact, String email, String status) {
        this.vendorId = vendorId;
        this.name = name;
        this.contact = contact;
        this.email = email;
        this.status = status;
    }

    // Getters and Setters
}

