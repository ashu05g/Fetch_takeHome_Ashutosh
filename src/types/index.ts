export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

export interface Location {
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    county: string;
}

export interface SearchFilters {
    breeds?: string[];
    ageMin?: number;
    ageMax?: number;
    zipCodes?: string[];
    size?: number;
    from?: number;
    sort?: string;
}

export interface SearchResponse {
    resultIds: string[];
    total: number;
    next?: string;
    prev?: string;
}

export interface Match {
    match: string;
} 