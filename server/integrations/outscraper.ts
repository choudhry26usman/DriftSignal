/**
 * Outscraper API Integration
 * Amazon Reviews Scraper with pagination support
 * Free tier: 500 reviews/month
 * Documentation: https://outscraper.com/amazon-reviews-scraper/
 */

const OUTSCRAPER_BASE_URL = 'https://api.app.outscraper.com';

interface OutscraperReview {
  id: string;
  author_title: string;
  author_link: string;
  review_text: string;
  review_link: string;
  review_rating: number;
  review_timestamp: number;
  review_datetime_utc: string;
  review_likes: number;
  is_verified: boolean;
  is_local_guide: boolean;
  review_questions: string[];
  review_photo_ids: string[];
  review_photo_urls: string[];
  review_response_id: string | null;
  review_response_text: string | null;
  review_response_timestamp: number | null;
  review_response_datetime_utc: string | null;
}

interface OutscraperAmazonReview {
  id: string;
  asin: string;
  author_name: string;
  author_url: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified_purchase: boolean;
  helpful_votes: number;
  images: string[];
  url: string;
}

interface OutscraperResponse {
  id: string;
  status: string;
  results: OutscraperAmazonReview[][] | null;
}

/**
 * Check if Outscraper is configured
 */
export function isOutscraperConfigured(): boolean {
  return !!process.env.OUTSCRAPER_API_KEY;
}

/**
 * Get API key for Outscraper
 */
function getApiKey(): string {
  const apiKey = process.env.OUTSCRAPER_API_KEY;
  if (!apiKey) {
    throw new Error('Outscraper API key not configured. Add OUTSCRAPER_API_KEY to secrets.');
  }
  return apiKey;
}

/**
 * Make a request to Outscraper API
 */
async function outscraperRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const apiKey = getApiKey();
  
  const url = new URL(endpoint, OUTSCRAPER_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  console.log(`Outscraper request: ${endpoint}`);
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-API-KEY': apiKey,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Outscraper API error: ${response.status} - ${errorText}`);
    throw new Error(`Outscraper API error (${response.status}): ${errorText}`);
  }
  
  return response.json();
}

/**
 * Extract ASIN from Amazon URL
 */
function extractAsin(urlOrAsin: string): string {
  if (!urlOrAsin.includes('/')) {
    return urlOrAsin;
  }
  
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/ASIN\/([A-Z0-9]{10})/i
  ];
  
  for (const pattern of patterns) {
    const match = urlOrAsin.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return urlOrAsin;
}

/**
 * Get Amazon product reviews using Outscraper
 * @param asinOrUrl - Amazon ASIN or product URL
 * @param reviewsLimit - Number of reviews to fetch (default 100)
 * @param sort - Sort order: 'most_recent' or 'top_reviews'
 */
export async function getAmazonReviews(
  asinOrUrl: string, 
  reviewsLimit: number = 100,
  sort: 'most_recent' | 'top_reviews' = 'most_recent'
): Promise<{ reviews: OutscraperAmazonReview[], asin: string }> {
  const asin = extractAsin(asinOrUrl);
  
  console.log(`Outscraper: Fetching up to ${reviewsLimit} reviews for ASIN ${asin}...`);
  
  const result = await outscraperRequest<OutscraperResponse>('/amazon-reviews', {
    query: asin,
    limit: reviewsLimit.toString(),
    sort: sort,
    async: 'false'
  });
  
  if (!result.results || result.results.length === 0 || !result.results[0]) {
    console.log('Outscraper: No reviews found');
    return { reviews: [], asin };
  }
  
  const reviews = result.results[0];
  console.log(`Outscraper: Fetched ${reviews.length} reviews for ASIN ${asin}`);
  
  return { reviews, asin };
}

/**
 * Convert Outscraper review to standard format compatible with our system
 */
export function convertOutscraperReview(review: OutscraperAmazonReview): {
  externalReviewId: string;
  marketplace: 'amazon';
  customerName: string;
  rating: number;
  title: string;
  content: string;
  reviewDate: Date;
  verified: boolean;
  productAsin?: string;
} {
  return {
    externalReviewId: review.id || `outscraper-${Date.now()}-${Math.random()}`,
    marketplace: 'amazon',
    customerName: review.author_name || 'Amazon Customer',
    rating: Math.round(review.rating),
    title: review.title || '',
    content: review.body || '',
    reviewDate: new Date(review.date || Date.now()),
    verified: review.verified_purchase || false,
    productAsin: review.asin
  };
}
