# Rate Limiting with Throttler

This document describes how to use and configure the rate limiting functionality (throttling) in the application.

## Overview

Rate limiting restricts the number of requests that can be made within a specific time period. This helps prevent abuse, brute-force attacks, and ensures fair usage of resources.

## Configuration

Throttling is configured in the `.env` file with the following variables:

```env
# Rate limiting configuration
THROTTLER_TTL=60          # Time window in seconds
THROTTLER_LIMIT=10        # Maximum number of requests per window
THROTTLER_IGNORE_USER_AGENTS=Googlebot,Bingbot   # Comma-separated list of user agents to ignore
```

## Default Settings

- Default time window: 60 seconds
- Default request limit: 10 requests per window
- Default ignored user agents: None

## Usage

### Basic Usage

By default, all endpoints are protected by rate limiting. The throttler guard is applied globally to all routes.

### Custom Throttling for Specific Routes

You can customize throttling on specific controllers or route handlers:

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@shared/decorators/throttle.decorator';

@Controller('example')
export class ExampleController {
  // Apply custom throttling to a specific endpoint
  @Throttle(120, 20) // 20 requests per 120 seconds
  @Get()
  findAll() {
    // This endpoint has a custom rate limit
    return 'This endpoint allows 20 requests per 120 seconds';
  }

  // Skip throttling for a specific endpoint
  @SkipThrottle()
  @Post()
  create() {
    // This endpoint is not rate limited
    return 'This endpoint has no rate limiting';
  }
}
```

### Throttling an Entire Controller

To apply custom throttling to an entire controller:

```typescript
import { Controller } from '@nestjs/common';
import { Throttle } from '@shared/decorators/throttle.decorator';

// Custom throttling for all routes in this controller
@Throttle(300, 50) // 50 requests per 300 seconds
@Controller('api')
export class ApiController {
  // All endpoints in this controller have the same rate limit
}
```

## Response Headers

When a request is processed, the following headers are added to the response:

- `X-RateLimit-Limit`: The maximum number of requests allowed in the time window
- `X-RateLimit-Remaining`: The number of requests remaining in the current time window
- `X-RateLimit-Reset`: The time at which the rate limit resets, in Unix timestamp format

## Error Responses

When a client exceeds the rate limit, the API responds with:

- Status code: `429 Too Many Requests`
- Response body: JSON with an error message indicating the wait time before more requests can be made

Example:

```json
{
  "statusCode": 429,
  "message": "Too many requests, please try again after 45 seconds",
  "error": "Too Many Requests"
}
```

## Implementation Details

The throttler implementation uses in-memory storage by default. This works well for single-instance deployments, but for distributed systems, consider implementing a distributed storage solution like Redis.

This feature provides:

1. **Core Domain Logic**: Throttling value objects and service interfaces
2. **Infrastructure Implementation**: In-memory throttling service
3. **Presentation Layer**: Guards and decorators for applying rate limits
4. **Global Configuration**: Environment-based configuration

## Security Considerations

- Rate limiting is an important security feature that helps protect against brute-force attacks and DoS attacks
- Always apply stricter rate limits to authentication endpoints
- Consider applying different rate limits for authenticated vs. unauthenticated users