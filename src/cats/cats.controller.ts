import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('cats')
export class CatsController {

    @Get()
    async findAll(){
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

}