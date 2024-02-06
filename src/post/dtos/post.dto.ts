// Create a PostDTO.ts file
export class PostDTO {
    id: number;
    title: string;
    content: string;
    likesCount: number;
    createdAt: Date;
    user: {
        id: number;
        username: string;
        createdAt: Date;
    };
}
