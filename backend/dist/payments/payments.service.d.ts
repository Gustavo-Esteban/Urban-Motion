import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
export declare class PaymentsService {
    private config;
    private supabase;
    private readonly logger;
    private mp;
    constructor(config: ConfigService, supabase: SupabaseService);
    handleWebhook(body: any): Promise<{
        received: boolean;
    }>;
}
