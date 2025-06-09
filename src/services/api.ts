const BASE_URL = 'https://frontend-take-home-service.fetch.com';

interface LoginResponse {
    success: boolean;
}

interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

interface SearchResponse {
    resultIds: string[];
    total: number;
    next: string | null;
    prev: string | null;
}

interface Location {
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
}

interface SearchFilters {
    breeds?: string[];
    ageMin?: number;
    ageMax?: number;
    zipCodes?: string[];
    sort?: string;
    size?: number;
    from?: number;
}

interface LocationSearchParams {
    city?: string;
    states?: string[];
    geoBoundingBox?: {
        top?: number;
        left?: number;
        bottom?: number;
        right?: number;
        bottom_left?: {
            lat: number;
            lon: number;
        };
        top_right?: {
            lat: number;
            lon: number;
        };
        bottom_right?: {
            lat: number;
            lon: number;
        };
        top_left?: {
            lat: number;
            lon: number;
        };
    };
    size?: number;
    from?: number;
}

interface LocationSearchResponse {
    results: Location[];
    total: number;
}

export const api = {
    login: async (name: string, email: string): Promise<LoginResponse> => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, email }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return { success: true };
    },

    logout: async (): Promise<void> => {
        await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    },

    searchDogs: async (filters: SearchFilters): Promise<SearchResponse> => {
        const params = new URLSearchParams();
        
        if (filters.breeds?.length) {
            filters.breeds.forEach(breed => params.append('breeds', breed));
        }
        if (filters.zipCodes?.length) {
            filters.zipCodes.forEach(zipCode => params.append('zipCodes', zipCode));
        }
        if (filters.ageMin !== undefined) params.append('ageMin', filters.ageMin.toString());
        if (filters.ageMax !== undefined) params.append('ageMax', filters.ageMax.toString());
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.size) params.append('size', filters.size.toString());
        if (filters.from) params.append('from', filters.from.toString());

        const response = await fetch(`${BASE_URL}/dogs/search?${params.toString()}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to search dogs');
        }

        return response.json();
    },

    getDogs: async (dogIds: string[]): Promise<Dog[]> => {
        const response = await fetch(`${BASE_URL}/dogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(dogIds),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dogs');
        }

        return response.json();
    },

    getBreeds: async (): Promise<string[]> => {
        const response = await fetch(`${BASE_URL}/dogs/breeds`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch breeds');
        }

        return response.json();
    },

    getLocations: async (zipCodes: string[]): Promise<Location[]> => {
        const response = await fetch(`${BASE_URL}/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(zipCodes),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch locations');
        }

        return response.json();
    },

    async getMatch(favoriteIds: string[]): Promise<string> {
        const response = await fetch(`${BASE_URL}/dogs/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(favoriteIds),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to get match');
        }

        const data = await response.json();
        return data.match;
    },

    searchLocations: async (params: LocationSearchParams): Promise<LocationSearchResponse> => {
        const response = await fetch(`${BASE_URL}/locations/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error('Failed to search locations');
        }

        return response.json();
    },
};

export type { Dog, SearchFilters, Location, SearchResponse }; 