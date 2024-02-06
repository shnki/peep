import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
