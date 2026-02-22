import { ConfigService } from '@nestjs/config';
export declare class WooCommerceService {
    private config;
    private readonly logger;
    private readonly baseUrl;
    private readonly authHeader;
    constructor(config: ConfigService);
    get<T>(endpoint: string): Promise<T>;
    post<T>(endpoint: string, body: unknown): Promise<T>;
    put<T>(endpoint: string, body: unknown): Promise<T>;
}
