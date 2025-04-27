export interface Payload {
    sub: number;
    email: string;
}

export interface UserResponse {
    name: string;
    email: string;  
    password?: string;
    companyId: number; 
}

export interface TokenResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface AuthResponse {
    user: UserResponse;
    token: TokenResponse;
}

export interface Login {    
    email: string;
    password: string;
}