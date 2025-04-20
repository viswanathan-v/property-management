package com.example.Rental.model;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "Tenants")
public class Tenants {
    @Id
    String tenant_id;
    String tenant_name;
    String email;
    Long mobile_number;
    int family_count;
    Long aadhar_no;
    String password;
    @DBRef
    Owners matched_owner;

    String address;

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    String location;

    public Owners getMatched_owner() {
        return matched_owner;
    }

    public void setMatched_owner(Owners matched_owner) {
        this.matched_owner = matched_owner;
    }

    public int getFamily_count() {
        return family_count;
    }

    public void setFamily_count(int family_count) {
        this.family_count = family_count;
    }

    public String getTenant_id() {
        return tenant_id;
    }

    public void setTenant_id(String tenant_id) {
        this.tenant_id = tenant_id;
    }

    public String getTenant_name() {
        return tenant_name;
    }

    public void setTenant_name(String tenant_name) {
        this.tenant_name = tenant_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getMobile_number() {
        return mobile_number;
    }

    public void setMobile_number(Long mobile_number) {
        this.mobile_number = mobile_number;
    }

    public Long getAadhar_no() {
        return aadhar_no;
    }

    public void setAadhar_no(Long aadhar_no) {
        this.aadhar_no = aadhar_no;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
