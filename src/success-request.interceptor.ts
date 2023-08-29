import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

@Injectable()
export class SuccessRequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        return next.handle().pipe(
            tap(() => {
                const data = {
                    method: req.method,
                    url: req.originalUrl,
                    headers: req.headers,
                    body: req.body,
                };
                Sentry.captureMessage(req.method + " " + req.originalUrl)
                // Sentry.captureException({
                //     category: 'route-discovery',
                //     message: 'Successful request captured',
                //     data: {
                //         method: req.method,
                //         url: req.originalUrl,
                //         headers: req.headers,
                //         body: req.body,
                //     },
                // }, (scope) => {
                //     scope.setTransactionName(req.originalUrl);
                //     return scope;
                // });
            }),
        );
    }
}
