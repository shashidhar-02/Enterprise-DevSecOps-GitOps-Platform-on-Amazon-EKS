package com.company.exceptions;

import lombok.Getter;

@Getter
public class BaseException extends RuntimeException {
    private final int statusCode;
    private final String errorCode;

    public BaseException(String message, int statusCode, String errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}
