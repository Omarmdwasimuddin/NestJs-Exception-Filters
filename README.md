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


#### HttpException

```bash
# cats.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatsService {
    private users = [
        { id:1110, name:'Wasim', age:28 },
        { id:1111, name:'Ismail', age:28 }
    ];

    getAllUsers(){
        return this.users;
    }

    getUserById(id: number){
        const user =  this.users.find((u) => u.id === id);
        if(!user){
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }

    // Database connection error simulate
    simulateDatabaseError(){
        throw new Error('Database connection failed!')
    }

    // Validation error simulate
    validateUserAge(age: number){
        if(age < 18) {
            throw new Error('User must be at least 18 years old')
        }
        return { message: 'Age is valid' };
    }
}
```

```bash
# cats.controller.ts
import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
    constructor(private readonly catsService: CatsService){}

    
    @Get('simple-error')
    simpleError(){
        try {
            this.catsService.simulateDatabaseError();
        } catch (error) {
            // just message override
            throw new HttpException(
                'Database error occurred!',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('custom-error')
    async customError(){
        try {
            await this.catsService.simulateDatabaseError();
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'This is a custom message',
                timestamp: new Date().toISOString(),
                path: '/cats/custom-error'
            }, HttpStatus.FORBIDDEN, {
                cause: error
            })
        }
    }

    // If the user is not found, an error will be returned.
    @Get('user/:id')
    getUserById(@Param('id') id: string){
        try {
            const userId = parseInt(id);
            return this.catsService.getUserById(userId);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'User not found',
                message: error.message,
                requestedId: id
            },HttpStatus.FORBIDDEN,{
                cause: error
            })
        }
    }

    // validation error
    @Get('validation')
    validateUser(@Query('age') age: string){
        try {
            const userAge = parseInt(age);
            return this.catsService.validateUserAge(userAge);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Validation failed',
                message: error.message,
                providedAge: age
            }, HttpStatus.FORBIDDEN, {
                cause: error
            })
        }
    }


}
```

#### Test---

Hit these URLs in your browser or Postman:

simple-error: GET http://localhost:3000/cats/simple-error

![](/public/Img/simpleerror.png)

custom-error: GET http://localhost:3000/cats/custom-error

![](/public/Img/customerror.png)

Find User:

if real user: GET http://localhost:3000/cats/user/1111

![](/public/Img/useroutput.png)

error: GET http://localhost:3000/cats/user/999

![](/public/Img/usererroroutput.png)

Validation:

success: GET http://localhost:3000/cats/validate?age=20

![](/public/Img/validationsuccess.png)

error: GET http://localhost:3000/cats/validate?age=15

![](/public/Img/validationerror.png)