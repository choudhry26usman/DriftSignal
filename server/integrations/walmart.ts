/**
 * Walmart integration using Axesso Walmart Data Service via RapidAPI
 * Fetches product details and reviews from Walmart
 */

const AXESSO_API_KEY = process.env.AXESSO_API_KEY;
const AXESSO_WALMART_HOST = "axesso-axesso-walmart-data-service.p.rapidapi.com";

interface WalmartReview {
  reviewText?: string;
  rating?: number;
  reviewerName?: string;
  reviewDate?: string;
  title?: string;
}

interface WalmartProductResponse {
  productTitle?: string;
  productDescription?: string;
  manufacturer?: string;
  reviews?: WalmartReview[];
  numberOfReviews?: number;
  averageRating?: number;
  responseStatus?: string;
  responseMessage?: string;
}

export interface WalmartReviewData {
  reviewerName: string;
  rating: number;
  title: string;
  text: string;
  date: string;
}

export interface WalmartProductData {
  productName: string;
  productId: string;
  reviews: WalmartReviewData[];
  totalReviews: number;
  averageRating: number;
}

/**
 * Check if Walmart/Axesso API is configured
 */
export function isWalmartConfigured(): boolean {
  return !!AXESSO_API_KEY;
}

/**
 * Fetch Walmart product details and reviews by product URL
 * @param productUrl - Full Walmart product URL (e.g., https://www.walmart.com/ip/...")
 */
export async function fetchWalmartProduct(productUrl: string): Promise<WalmartProductData> {
  if (!AXESSO_API_KEY) {
    throw new Error("AXESSO_API_KEY is not configured. Please add it to your environment variables.");
  }

  if (!productUrl.includes('walmart.com')) {
    throw new Error("Invalid Walmart URL. Please provide a valid walmart.com product URL.");
  }

  try {
    const url = `https://${AXESSO_WALMART_HOST}/wlm/walmart-lookup-product`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': AXESSO_API_KEY,
        'x-rapidapi-host': AXESSO_WALMART_HOST
      },
      // Add the product URL as a query parameter
      // Note: Axesso expects the full URL
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Walmart] API error response:', errorText);
      
      if (response.status === 403) {
        throw new Error("API authentication failed. Please verify your AXESSO_API_KEY is correct.");
      } else if (response.status === 404) {
        throw new Error("Product not found. Please check the Walmart product URL.");
      } else {
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
    }

    const data: WalmartProductResponse = await response.json();
    console.log('[Walmart] API response:', JSON.stringify(data, null, 2));

    if (data.responseStatus === 'PRODUCT_NOT_FOUND') {
      throw new Error(`Product not found: ${data.responseMessage || 'The product may not be indexed in Axesso database'}`);
    }

    // Extract product ID from URL
    const productIdMatch = productUrl.match(/\/ip\/[^/]+\/(\d+)/);
    const productId = productIdMatch ? productIdMatch[1] : productUrl;

    // Parse reviews
    const reviews: WalmartReviewData[] = (data.reviews || []).map(review => ({
      reviewerName: review.reviewerName || 'Anonymous',
      rating: review.rating || 0,
      title: review.title || '',
      text: review.reviewText || '',
      date: review.reviewDate || new Date().toISOString()
    }));

    return {
      productName: data.productTitle || 'Unknown Product',
      productId,
      reviews,
      totalReviews: data.numberOfReviews || reviews.length,
      averageRating: data.averageRating || 0
    };

  } catch (error) {
    console.error('[Walmart] Error fetching product:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch Walmart product data');
  }
}

/**
 * Test Walmart API connection
 */
export async function testWalmartConnection(): Promise<{ success: boolean; message: string }> {
  if (!AXESSO_API_KEY) {
    return {
      success: false,
      message: 'AXESSO_API_KEY not configured'
    };
  }

  try {
    // Test with a sample Walmart product URL
    // This is just a connectivity test - we don't need actual data
    const testUrl = 'https://www.walmart.com/ip/test';
    const url = `https://${AXESSO_WALMART_HOST}/wlm/walmart-lookup-product`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': AXESSO_API_KEY,
        'x-rapidapi-host': AXESSO_WALMART_HOST
      }
    });

    // Even if the product doesn't exist, a proper API response means we're connected
    if (response.status === 403) {
      return {
        success: false,
        message: 'API key authentication failed'
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Axesso Walmart Data Service'
    };

  } catch (error) {
    console.error('[Walmart] Connection test error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection test failed'
    };
  }
}
