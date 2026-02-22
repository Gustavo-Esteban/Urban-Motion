import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WooCommerceService {
  private readonly logger = new Logger(WooCommerceService.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor(private readonly config: ConfigService) {
    const url = config.get<string>('WC_URL', '').replace(/\/$/, '');
    const key = config.get<string>('WC_CONSUMER_KEY', '');
    const secret = config.get<string>('WC_CONSUMER_SECRET', '');
    this.baseUrl = `${url}/wp-json/wc/v3`;
    this.authHeader = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64');
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    this.logger.debug(`GET ${url}`);
    const res = await fetch(url, {
      headers: { Authorization: this.authHeader },
    });
    if (res.status === 404) throw new NotFoundException('Recurso não encontrado no WooCommerce');
    if (!res.ok) throw new Error(`WooCommerce API error ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    this.logger.debug(`POST ${url}`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: this.authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`WooCommerce API error ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: this.authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`WooCommerce API error ${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  }
}
