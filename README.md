## Exception Filters

```bash
# create filter
$ nest g filter filters/http-exception
```

![](/public/Img/exceptionfilterfolder.png)


```bash
# http-exeption.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message
    });
  }
}
```


```bash
# create controller
$ nest g controller exception
```

![](/public/Img/exceptionfolder.png)


```bash
# exception.controller.ts
import { Controller, Get, Param, ParseIntPipe, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception/http-exception.filter';

@Controller('exception')
@UseFilters(HttpExceptionFilter)
export class ExceptionController {

    @Get('hello/:id')
    getHello(@Param('id', ParseIntPipe) id: number){
        return { message: `Your ID is ${id}` }
    }

}
```

##### Note: id must be number dite hobe
![](/public/Img/exceptionfilteroutput.png)

##### Note: string dile id show hobe na
![](/public/Img/exceptionerror.png)