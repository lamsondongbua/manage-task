package com.example.manage_task.custom_validation_annotation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneNumberValidator implements ConstraintValidator<ValidPhoneNumber, String> {

    @Override
    public void initialize(ValidPhoneNumber constraintAnnotation) {
    }

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext context) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return true; // Use @NotBlank if you want it to be mandatory
        }
        // Validate Vietnamese phone numbers (starts with 0, total 10 digits) or general international format (+...)
        String pattern = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$";
        return phoneNumber.matches(pattern);
    }
}
