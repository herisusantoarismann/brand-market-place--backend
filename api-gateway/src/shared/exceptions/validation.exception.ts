import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ValidationErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BadRequestException) {
          const validationErrors: any = error.getResponse();
          const formattedErrors = this.formatValidationErrors(
            validationErrors.message,
          );

          throw new BadRequestException({
            statusCode: 400,
            message: 'Validation Errors',
            errors: formattedErrors,
          });
        }
        return throwError(error);
      }),
    );
  }

  private formatValidationErrors(errors: any): { [key: string]: string[] } {
    const formattedErrors: { [key: string]: string[] } = {};
    if (Array.isArray(errors)) {
      errors.forEach((message: string) => {
        const [field] = message.split(' ');
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }
        formattedErrors[field].push(message);
      });
    }
    return formattedErrors;
  }
}
