"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WooCommerceService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WooCommerceService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let WooCommerceService = WooCommerceService_1 = class WooCommerceService {
    config;
    logger = new common_1.Logger(WooCommerceService_1.name);
    baseUrl;
    authHeader;
    constructor(config) {
        this.config = config;
        const url = config.get('WC_URL', '').replace(/\/$/, '');
        const key = config.get('WC_CONSUMER_KEY', '');
        const secret = config.get('WC_CONSUMER_SECRET', '');
        this.baseUrl = `${url}/wp-json/wc/v3`;
        this.authHeader = 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64');
    }
    async get(endpoint) {
        const url = `${this.baseUrl}/${endpoint}`;
        this.logger.debug(`GET ${url}`);
        const res = await fetch(url, {
            headers: { Authorization: this.authHeader },
        });
        if (res.status === 404)
            throw new common_1.NotFoundException('Recurso não encontrado no WooCommerce');
        if (!res.ok)
            throw new Error(`WooCommerce API error ${res.status}: ${await res.text()}`);
        return res.json();
    }
    async post(endpoint, body) {
        const url = `${this.baseUrl}/${endpoint}`;
        this.logger.debug(`POST ${url}`);
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: this.authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!res.ok)
            throw new Error(`WooCommerce API error ${res.status}: ${await res.text()}`);
        return res.json();
    }
    async put(endpoint, body) {
        const url = `${this.baseUrl}/${endpoint}`;
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                Authorization: this.authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!res.ok)
            throw new Error(`WooCommerce API error ${res.status}: ${await res.text()}`);
        return res.json();
    }
};
exports.WooCommerceService = WooCommerceService;
exports.WooCommerceService = WooCommerceService = WooCommerceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], WooCommerceService);
//# sourceMappingURL=woocommerce.service.js.map