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


## Throwing standard exceptions

Nest `@nestjs/common` প্যাকেজ থেকে সরাসরি ব্যবহারের জন্য একটি বিল্ট-ইন `HttpException` ক্লাস প্রদান করে। সাধারণ HTTP REST/GraphQL API ভিত্তিক অ্যাপ্লিকেশনের ক্ষেত্রে, কোনো নির্দিষ্ট ত্রুটি পরিস্থিতি ঘটলে স্ট্যান্ডার্ড HTTP response অবজেক্ট পাঠানোই সর্বোত্তম অনুশীলন।

উদাহরণস্বরূপ, `CatsController`-এ আমাদের একটি `findAll()` মেথড (একটি GET route handler) আছে। ধরুন কোনো কারণে এই route handler একটি exception ছুঁড়ে দেয়। এটি প্রদর্শনের জন্য আমরা এটিকে নিচের মতো করে hard-code করব:


```bash
# cats.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('cats')
export class CatsController {

    @Get()
    async findAll(){
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

}
```

#### Output view
![](/public/Img/forbidden.png)