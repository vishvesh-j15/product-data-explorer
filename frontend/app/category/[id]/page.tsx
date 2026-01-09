import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScrapingService } from '../scraping/scraping.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(
    private scraper: ScrapingService,
    private prisma: PrismaService
  ) {}

  @Get(':categoryId')
  async getProducts(@Param('categoryId') id: string) {
    const categoryId = parseInt(id);
    
    [span_15](start_span)// 1. Check DB for cached products[span_15](end_span)
    const cachedProducts = await this.prisma.product.findMany({
      where: { categoryId },
    });

    // 2. Check if data is stale (e.g., older than 24 hours)
    const isStale = cachedProducts.length === 0 || 
      (new Date().getTime() - cachedProducts[0].lastScrapedAt.getTime() > 86400000);

    [span_16](start_span)// 3. Trigger background scrape if stale (On-demand)[span_16](end_span)
    if (isStale) {
      // Find category URL from DB
      const category = await this.prisma.category.findUnique({ where: { id: categoryId }});
      if (category) {
        [span_17](start_span)// Run scrape in background (don't block response)[span_17](end_span)
        this.scraper.scrapeCategory(`https://www.worldofbooks.com${category.slug}`, categoryId);
      }
    }

    // 4. Return existing data immediately (Optimistic UI)
    return cachedProducts;
  }
}
