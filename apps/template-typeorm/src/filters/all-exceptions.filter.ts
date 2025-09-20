import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import requestIp from 'request-ip';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 尝试提取更具体的错误信息
    let message: string = 'Internal Server Error';
    if (isHttpException) {
      const res = (exception as HttpException).getResponse() as
        | string
        | { message?: string | string[]; [key: string]: any };
      if (typeof res === 'string') {
        message = res;
      } else if (Array.isArray(res?.message)) {
        message = res.message.join('; ');
      } else if (typeof res?.message === 'string') {
        message = res.message;
      } else if ((exception as HttpException).message) {
        message = (exception as HttpException).message;
      }
    } else if (exception && typeof exception === 'object' && 'message' in (exception as any)) {
      message = String((exception as any).message ?? message);
    }

    const body = {
      code: status,
      message,
      error: {
        path: request?.url,
        timestamp: new Date().toISOString(),
        // 追加请求上下文字段
        headers: request?.headers,
        query: request?.query,
        body: request?.body,
        params: request?.params,
        ip: request ? requestIp.getClientIp(request) : undefined,
      },
    };

    response.status(status).json(body);
  }
}
