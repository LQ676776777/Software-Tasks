package com.se.hustcar.domain.pojo;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void shouldSetAndGetAllProperties_WhenUsingUserEntity() {
        // Arrange
        Long id = 1L;
        String schoolName = "Test University";
        String gender = "Male";
        String phoneNumber = "1234567890";

        // Act
        User user = new User();
        user.setId(id);
        user.setSchoolName(schoolName);
        user.setGender(gender);
        user.setPhoneNumber(phoneNumber);

        // Assert
        assertEquals(id, user.getId());
        assertEquals(schoolName, user.getSchoolName());
        assertEquals(gender, user.getGender());
        assertEquals(phoneNumber, user.getPhoneNumber());
    }
}