import { IsNotEmpty, IsString } from "class-validator"

export class authDto {
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}