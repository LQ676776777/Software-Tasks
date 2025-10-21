package com.se.hustcar.domain.pojo;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class CarPoolTest {

    @Test
    void shouldSetAndGetAllProperties_WhenUsingCarPoolEntity() {
        // Arrange
        Long id = 1L;
        LocalDateTime dateTime = LocalDateTime.now();
        Integer userId = 123;
        String startPlace = "Location A";
        String destination = "Location B";
        Integer state = 1;

        // Act
        CarPool carPool = new CarPool();
        carPool.setId(id);
        carPool.setDateTime(dateTime);
        carPool.setUserId(userId);
        carPool.setStartPlace(startPlace);
        carPool.setDestination(destination);
        carPool.setState(state);

        // Assert
        assertEquals(id, carPool.getId());
        assertEquals(dateTime, carPool.getDateTime());
        assertEquals(userId, carPool.getUserId());
        assertEquals(startPlace, carPool.getStartPlace());
        assertEquals(destination, carPool.getDestination());
        assertEquals(state, carPool.getState());
    }
}