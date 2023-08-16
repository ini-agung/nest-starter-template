import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { createHash } from 'crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator

@Injectable()
export class VersionInterceptor implements NestInterceptor {
    constructor(private readonly version: string) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        if (this.version === 'v1') {
            // Handle URL without hashing
            // Example: Return the original URL directly
            return next.handle();
        } else if (this.version === 'v2') {
            // Handle URL with hashing
            // Example: Hash the URL and return the hashed value
            const originalUrl = request.url;
            const hashedUrl = createHash('sha256').update(originalUrl).digest('hex');
            return next.handle().pipe(map((data) => ({ ...data, url: hashedUrl })));
        }

        return next.handle();
    }
}
