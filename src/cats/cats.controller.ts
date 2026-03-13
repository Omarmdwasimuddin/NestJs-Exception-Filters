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