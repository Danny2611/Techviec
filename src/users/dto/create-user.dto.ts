import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email : string;

    @IsNotEmpty({ message: "Mat khau khong duoc de trong"})
    password : string;
    name : string;
    address: string;

}
