import { UserResponseDto } from "../dto";

export interface LoginResponse {
    accessToken: string;
    user: UserResponseDto;
}