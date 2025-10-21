package com.se.hustcar.domain.pojo;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ResultTest {

    @Test
    void shouldCreateSuccessResult_WhenOkNoArgs() {
        // Act
        Result result = Result.ok();

        // Assert
        assertTrue(result.getSuccess());
        assertNull(result.getErrorMsg());
        assertNull(result.getData());
        assertNull(result.getTotal());
    }

    @Test
    void shouldCreateSuccessResultWithData_WhenOkWithData() {
        // Arrange
        String testData = "test data";

        // Act
        Result result = Result.ok(testData);

        // Assert
        assertTrue(result.getSuccess());
        assertNull(result.getErrorMsg());
        assertEquals(testData, result.getData());
        assertNull(result.getTotal());
    }

    @Test
    void shouldCreateSuccessResultWithListAndTotal_WhenOkWithList() {
        // Arrange
        List<String> dataList = Arrays.asList("item1", "item2", "item3");
        Long total = 3L;

        // Act
        Result result = Result.ok(dataList, total);

        // Assert
        assertTrue(result.getSuccess());
        assertNull(result.getErrorMsg());
        assertEquals(dataList, result.getData());
        assertEquals(total, result.getTotal());
    }

    @Test
    void shouldCreateFailResult_WhenFailWithErrorMessage() {
        // Arrange
        String errorMessage = "Error occurred";

        // Act
        Result result = Result.fail(errorMessage);

        // Assert
        assertFalse(result.getSuccess());
        assertEquals(errorMessage, result.getErrorMsg());
        assertNull(result.getData());
        assertNull(result.getTotal());
    }

    @Test
    void shouldCreateResultWithAllFields_WhenUsingAllArgsConstructor() {
        // Arrange
        Boolean success = true;
        String errorMsg = null;
        Object data = "test data";
        Long total = 1L;

        // Act
        Result result = new Result(success, errorMsg, data, total);

        // Assert
        assertEquals(success, result.getSuccess());
        assertEquals(errorMsg, result.getErrorMsg());
        assertEquals(data, result.getData());
        assertEquals(total, result.getTotal());
    }
}