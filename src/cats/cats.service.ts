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