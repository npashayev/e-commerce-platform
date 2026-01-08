export interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string; // ISO-like date string
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: Hair;
    ip: string;
    address: Address;
    macAddress: string;
    university: string;
    bank: Bank;
    company: Company;
    ein: string;
    ssn: string;
    userAgent: string;
    crypto: Crypto;
    role: 'admin' | 'user' | 'moderator';
}

export interface Hair {
    color: string;
    type: string;
}

export interface Address {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: Coordinates;
    country: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Bank {
    cardExpire: string; // MM/YY
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
}

export interface Company {
    department: string;
    name: string;
    title: string;
    address: Address;
}

export interface Crypto {
    coin: string;
    wallet: string;
    network: string;
}
