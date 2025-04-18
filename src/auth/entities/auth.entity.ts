export interface Payload {
    sub: number;
    email: string;
}

export interface UserResponse {
    name: string;
    email: string;  
    companyId: number; 
}

export interface Login {    
    email: string;
    password: string;
}