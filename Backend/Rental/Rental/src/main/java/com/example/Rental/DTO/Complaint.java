package com.example.Rental.DTO;

public class Complaint {
    String severity;
    public Complaint(String text){
        this.severity =text;
    }
    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }
}
