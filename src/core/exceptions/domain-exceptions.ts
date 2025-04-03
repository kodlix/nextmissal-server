import { HttpException, HttpStatus } from '@nestjs/common';

// Base domain exception class
export class DomainException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
    this.name = this.constructor.name;
  }
}

// Entity not found
export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id?: string) {
    const message = id ? `${entityName} with ID ${id} not found` : `${entityName} not found`;
    super(message, HttpStatus.NOT_FOUND);
  }
}

// Entity already exists
export class EntityAlreadyExistsException extends DomainException {
  constructor(entityName: string, identifier?: string) {
    const message = identifier
      ? `${entityName} with this ${identifier} already exists`
      : `${entityName} already exists`;
    super(message, HttpStatus.CONFLICT);
  }
}

// Invalid input
export class InvalidInputException extends DomainException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

// Authentication exceptions
export class AuthenticationException extends DomainException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

// OTP exceptions
export class OtpExpiredException extends DomainException {
  constructor() {
    super('OTP has expired', HttpStatus.BAD_REQUEST);
  }
}

export class OtpInvalidException extends DomainException {
  constructor() {
    super('Invalid OTP', HttpStatus.BAD_REQUEST);
  }
}

// Forbidden action
export class ForbiddenActionException extends DomainException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

// Value object exceptions
export class InvalidValueObjectException extends DomainException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
