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
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface AuthResponse {
    user: UserResponse;
    token: TokenResponse;
}

export interface Login {    
    email: string;
    password: string;
}