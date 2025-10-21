package com.se.hustcar.controller;

import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.service.CarpoolService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarPoolControllerTest {

    @Mock
    private CarpoolService carpoolService;

    @InjectMocks
    private CarPoolController carPoolController;

    private CarPool testCarPool;

    @BeforeEach
    void setUp() {
        testCarPool = new CarPool();
        testCarPool.setId(1L);
        testCarPool.setDateTime(LocalDateTime.now());
        testCarPool.setUserId(123);
        testCarPool.setStartPlace("Location A");
        testCarPool.setDestination("Location B");
        testCarPool.setState(1);
    }

    @Test
    void shouldReturnHelloMessage_WhenQueryTest() {
        // Act
        Result result = carPoolController.queryTest();

        // Assert
        assertNotNull(result);
        assertTrue(result.getSuccess());
        assertEquals("hello", result.getData());
        assertNull(result.getErrorMsg());
    }

    @Test
    void shouldCallService_WhenQueryCarpool() {
        // Arrange
        Result expectedResult = Result.ok("test carpool data");
        when(carpoolService.queryCarpool()).thenReturn(expectedResult);

        // Act
        Result actualResult = carPoolController.queryCarpool();

        // Assert
        assertNotNull(actualResult);
        assertEquals(expectedResult, actualResult);
        verify(carpoolService, times(1)).queryCarpool();
    }

    @Test
    void shouldCallServiceWithId_WhenQueryCarpoolById() {
        // Arrange
        Integer id = 1;
        Result expectedResult = Result.ok("carpool by id data");
        when(carpoolService.queryCarpoolById(id)).thenReturn(expectedResult);

        // Act
        Result actualResult = carPoolController.queryCarpoolById(id);

        // Assert
        assertNotNull(actualResult);
        assertEquals(expectedResult, actualResult);
        verify(carpoolService, times(1)).queryCarpoolById(id);
    }

    @Test
    void shouldCallServiceWithCarPool_WhenAddCarpool() {
        // Arrange
        Result expectedResult = Result.ok("added successfully");
        when(carpoolService.addCarpool(testCarPool)).thenReturn(expectedResult);

        // Act
        Result actualResult = carPoolController.addCarpool(testCarPool);

        // Assert
        assertNotNull(actualResult);
        assertEquals(expectedResult, actualResult);
        verify(carpoolService, times(1)).addCarpool(testCarPool);
    }
}