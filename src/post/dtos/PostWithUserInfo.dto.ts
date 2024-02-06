export class PostWithUserInfoDto {
  id: number;
  title: string;
  content: string;
  likesCount: number;
  user: {
    id: number;
    username: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    isActive: boolean;
  };
}