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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const woocommerce_service_1 = require("../woocommerce/woocommerce.service");
let ProductsService = class ProductsService {
    wc;
    constructor(wc) {
        this.wc = wc;
    }
    async findAll() {
        const data = await this.wc.get('products?per_page=50&status=publish&orderby=date&order=desc');
        return data.map(this.mapProduct);
    }
    async findOne(id) {
        const data = await this.wc.get(`products/${id}`);
        if (!data?.id)
            throw new common_1.NotFoundException('Produto não encontrado');
        return this.mapProduct(data);
    }
    mapProduct(p) {
        const SIZE_NAMES = ['tamanho', 'size', 'sizes', 'tam', 'talla'];
        const sizeAttr = p.attributes?.find((a) => SIZE_NAMES.includes(a.name?.toLowerCase()));
        return {
            id: String(p.id),
            name: p.name,
            description: p.description || p.short_description,
            priceCents: Math.round(parseFloat(p.price || '0') * 100),
            imageUrl: p.images?.[0]?.src ?? null,
            sizes: sizeAttr?.options ?? [],
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [woocommerce_service_1.WooCommerceService])
], ProductsService);
//# sourceMappingURL=products.service.js.map