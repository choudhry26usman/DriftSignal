/**
 * Shopify Admin API Integration
 * Fetches products and reviews from Shopify stores
 * Documentation: https://shopify.dev/docs/api/admin-graphql
 */

interface ShopifyConfig {
  shop: string; // e.g., "your-store.myshopify.com"
  accessToken: string;
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  totalReviews: number;
}

interface ShopifyReview {
  rating: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  productId: string;
  verified?: boolean;
}

/**
 * Check if Shopify is configured
 */
export function isShopifyConfigured(): boolean {
  return !!(process.env.SHOPIFY_SHOP && process.env.SHOPIFY_ACCESS_TOKEN);
}

/**
 * Get Shopify configuration
 */
function getConfig(): ShopifyConfig {
  const shop = process.env.SHOPIFY_SHOP;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  
  if (!shop || !accessToken) {
    throw new Error('Shopify not configured. Add SHOPIFY_SHOP and SHOPIFY_ACCESS_TOKEN to environment variables.');
  }
  
  return { shop, accessToken };
}

/**
 * Make a GraphQL request to Shopify Admin API
 */
async function shopifyGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const config = getConfig();
  const apiVersion = '2025-10';
  const url = `https://${config.shop}/admin/api/${apiVersion}/graphql.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': config.accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(result.errors)}`);
  }
  
  return result.data;
}

/**
 * Test the Shopify connection
 */
export async function testShopifyConnection(): Promise<{ connected: boolean; details: string }> {
  try {
    if (!isShopifyConfigured()) {
      return {
        connected: false,
        details: 'Shop domain and access token not configured'
      };
    }

    // Simple query to test connection
    const query = `
      query {
        shop {
          name
          email
          myshopifyDomain
        }
      }
    `;
    
    const data: any = await shopifyGraphQL(query);
    
    return {
      connected: true,
      details: `Connected to ${data.shop.name} (${data.shop.myshopifyDomain})`
    };
  } catch (error) {
    return {
      connected: false,
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get products from Shopify with review counts
 */
export async function getShopifyProducts(limit: number = 10): Promise<ShopifyProduct[]> {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            reviewsMetafield: metafield(namespace: "spr", key: "reviews") {
              value
            }
          }
        }
      }
    }
  `;
  
  const data: any = await shopifyGraphQL(query, { first: limit });
  
  return data.products.edges.map((edge: any) => {
    const node = edge.node;
    // Try to parse review count from metafield
    let totalReviews = 0;
    if (node.reviewsMetafield?.value) {
      try {
        // Reviews metafield might contain HTML or JSON with review data
        // This is a simple count - actual parsing would be more complex
        const matches = node.reviewsMetafield.value.match(/spr-review/g);
        totalReviews = matches ? matches.length : 0;
      } catch {
        totalReviews = 0;
      }
    }
    
    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      totalReviews,
    };
  });
}

/**
 * Get product reviews from Shopify metafields
 */
export async function getProductReviews(productId: string): Promise<{ reviews: ShopifyReview[] }> {
  const query = `
    query GetProductReviews($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        reviewsMetafield: metafield(namespace: "spr", key: "reviews") {
          value
        }
      }
    }
  `;
  
  const data: any = await shopifyGraphQL(query, { id: productId });
  
  if (!data.product || !data.product.reviewsMetafield) {
    return { reviews: [] };
  }
  
  // Parse reviews from metafield HTML/data
  const reviews = parseReviewsFromMetafield(data.product.reviewsMetafield.value, productId);
  
  return { reviews };
}

/**
 * Parse reviews from Shopify Product Reviews app metafield HTML
 * The metafield contains HTML with review data
 */
function parseReviewsFromMetafield(metafieldValue: string, productId: string): ShopifyReview[] {
  if (!metafieldValue) return [];
  
  const reviews: ShopifyReview[] = [];
  
  try {
    // Split by review divs to extract individual reviews
    const reviewBlocks = metafieldValue.split('<div class="spr-review">');
    
    for (let i = 1; i < reviewBlocks.length; i++) {
      const reviewHtml = reviewBlocks[i].split('</div>')[0];
      
      // Extract rating (e.g., aria-label="5 out of 5 stars")
      const ratingMatch = reviewHtml.match(/aria-label="(\d+) out of 5 stars"/);
      const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;
      
      // Extract title
      const titleRegex = /<h3 class="spr-review-header-title">([\s\S]*?)<\/h3>/;
      const titleMatch = reviewHtml.match(titleRegex);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      // Extract content
      const contentRegex = /<div class="spr-review-content-body">([\s\S]*?)<\/div>/;
      const contentMatch = reviewHtml.match(contentRegex);
      const content = contentMatch ? contentMatch[1].trim().replace(/<[^>]*>/g, '') : '';
      
      // Extract author
      const authorRegex = /<strong class="spr-review-header-byline">([\s\S]*?)<\/strong>/;
      const authorMatch = reviewHtml.match(authorRegex);
      const author = authorMatch ? authorMatch[1].trim() : 'Anonymous';
      
      // Extract date
      const dateRegex = /<span class="spr-review-header-date">([\s\S]*?)<\/span>/;
      const dateMatch = reviewHtml.match(dateRegex);
      const createdAt = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
      
      // Extract verification badge
      const verified = reviewHtml.includes('spr-badge-caption-verified');
      
      if (content) {
        reviews.push({
          rating,
          title,
          content,
          author,
          createdAt,
          productId,
          verified,
        });
      }
    }
  } catch (error) {
    console.error('Error parsing Shopify reviews:', error);
  }
  
  return reviews;
}

/**
 * Get product by handle (URL-friendly product identifier)
 */
export async function getProductByHandle(handle: string): Promise<any> {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        reviewsMetafield: metafield(namespace: "spr", key: "reviews") {
          value
        }
      }
    }
  `;
  
  const data: any = await shopifyGraphQL(query, { handle });
  return data.productByHandle;
}
