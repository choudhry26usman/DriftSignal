import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  Upload, 
  LayoutDashboard, 
  Workflow, 
  BarChart3, 
  Settings,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Mail,
  Filter,
  RefreshCw,
  Trash2,
  Play,
  Search,
  LineChart,
  PieChart,
  Grid3X3,
  Download,
  MessageSquare,
  Bot
} from "lucide-react";
import { SiAmazon, SiShopify } from "react-icons/si";
import { WalmartLogo } from "@/components/WalmartLogo";
import { useTour } from "@/hooks/use-tour";

const gettingStartedSteps = [
  {
    step: 1,
    title: "Sign In",
    description: "Click 'Get Started' on the landing page to sign in with your Replit account. Your data is private and only visible to you."
  },
  {
    step: 2,
    title: "Import Your First Product",
    description: "Click 'Import Reviews' in the sidebar, select a marketplace (Amazon, Walmart, Shopify, or upload a file), and enter your product URL or ID."
  },
  {
    step: 3,
    title: "Review AI Analysis",
    description: "Each imported review is automatically analyzed by Grok AI for sentiment (positive/neutral/negative), category (12 standardized types), severity level, and an AI-suggested reply."
  },
  {
    step: 4,
    title: "Explore Dashboard Insights",
    description: "View sentiment trends, source distribution, and the severity/status matrix on your Dashboard. Use the collapsible products section to track all imported products."
  },
  {
    step: 5,
    title: "Manage Workflow",
    description: "Use the Workflow Board to drag reviews between 'Open', 'In Progress', and 'Resolved' columns. Search instantly and use collapsible product swimlanes for large volumes."
  },
  {
    step: 6,
    title: "Analyze & Export",
    description: "View the Analytics page for detailed charts and metrics. Export filtered summaries or complete raw data for offline analysis."
  }
];

const faqItems = [
  {
    category: "Importing Reviews",
    questions: [
      {
        q: "How do I import Amazon reviews?",
        a: "Click 'Import Reviews' in the sidebar, select 'Amazon', then paste the product URL (e.g., https://amazon.com/dp/B0XXXXXXXX) or just the ASIN code. Click 'Import' and wait for the reviews to be fetched and analyzed by AI."
      },
      {
        q: "How many reviews can I import?",
        a: "Amazon imports typically fetch 8-10 reviews per product. Walmart fetches up to 10 reviews per page. Email imports can process up to 500 messages. You can refresh products periodically to capture new reviews."
      },
      {
        q: "Can I import reviews from a CSV or JSON file?",
        a: "Yes! Click 'Import Reviews', select 'File Upload', then drag and drop your CSV or JSON file. Each review will be processed through Grok AI for sentiment, category, severity analysis, and an AI-suggested reply."
      },
      {
        q: "What is the Mailbox option?",
        a: "Mailbox connects to your Outlook email to import customer feedback and complaints. The AI automatically extracts product names from emails and categorizes them. This requires connecting your Microsoft account in Settings first."
      },
      {
        q: "How do I refresh reviews for an existing product?",
        a: "On the Dashboard, expand the 'Tracked Products' section, find your product card and click the refresh icon. This will fetch any new reviews posted since your last import, with automatic duplicate detection."
      }
    ]
  },
  {
    category: "Understanding AI Analysis",
    questions: [
      {
        q: "What AI powers the analysis?",
        a: "DriftSignal uses Grok 4.1 Fast via OpenRouter for all AI features including sentiment analysis, category classification, severity assessment, AI-suggested replies, and product extraction from emails."
      },
      {
        q: "What does the AI analyze in each review?",
        a: "The AI analyzes four key aspects: Sentiment (positive, neutral, or negative), Category (one of 12 standardized product issue categories), Severity (low, medium, high, or critical), and generates an AI-Suggested Reply tailored to the review."
      },
      {
        q: "What are the 12 product categories?",
        a: "The categories are: Product Quality, Shipping & Delivery, Customer Service, Pricing & Value, Product Features, Packaging, Sizing & Fit, Compatibility, Documentation, Returns & Refunds, Safety Concerns, and General Feedback."
      },
      {
        q: "How is severity determined?",
        a: "Severity is based on urgency and impact: Low (minor observations), Medium (standard complaints), High (significant issues requiring attention), and Critical (safety concerns or major problems requiring immediate action)."
      },
      {
        q: "Does the AI suggest replies?",
        a: "Yes! Each review includes an AI-suggested reply generated by Grok AI based on the review content, sentiment, and severity. You can edit the reply before using it. For emails, you can send directly via Outlook."
      },
      {
        q: "How does AI product extraction work for emails?",
        a: "When importing from Outlook Mailbox, the AI automatically scans email subject lines and content to extract product names and categorize customer inquiries. Products are automatically added to your tracking list."
      }
    ]
  },
  {
    category: "Dashboard Features",
    questions: [
      {
        q: "What infographics are on the Dashboard?",
        a: "The Dashboard includes: Sentiment Trend chart (weekly positive/neutral/negative patterns), Source Distribution donut chart (reviews by marketplace), Severity & Status Matrix (priority heatmap), and Response Metrics (average time to action, 48-hour resolution rate)."
      },
      {
        q: "What do the stat cards show?",
        a: "The stat cards show: Total Reviews (all imported), Average Rating (mean star rating), Negative Reviews (count of negative sentiment), and Open Issues (reviews not yet resolved). Stats update based on your active filters."
      },
      {
        q: "What is the Tracked Products section?",
        a: "This collapsible section shows all products you've imported reviews for. Each card displays the product name, marketplace, review count, last import date, and buttons to refresh reviews or delete the product."
      },
      {
        q: "How do I filter reviews?",
        a: "Use the sidebar marketplace buttons for quick filtering, or click 'Filters' for advanced options including date range, sentiment, status, severity, rating, and specific products."
      },
      {
        q: "How do I view review details?",
        a: "Click on any review card to open the detail modal. Here you can see the full review, AI analysis breakdown, suggested reply, update status, and for emails, send a reply directly via Outlook."
      },
      {
        q: "How do I delete a product and its reviews?",
        a: "Expand the Tracked Products section, find your product card and click the trash icon. You'll be asked whether to delete just the product tracking or also all associated reviews."
      }
    ]
  },
  {
    category: "Workflow Management",
    questions: [
      {
        q: "What is the Workflow Board?",
        a: "The Workflow Board is a Kanban-style interface where reviews are organized into three columns: Open (new reviews needing attention), In Progress (currently being handled), and Resolved (completed). Each column shows a count badge."
      },
      {
        q: "What is the search bar for?",
        a: "The search bar at the top of the Workflow page lets you instantly filter reviews by customer name, product name, or review title. Results update in real-time as you type."
      },
      {
        q: "What are product swimlanes?",
        a: "When you have reviews from multiple products, they're automatically grouped into collapsible 'swimlanes' within each column. This keeps the board organized when managing large volumes. Groups with more than 5 reviews collapse by default."
      },
      {
        q: "How do I move a review between columns?",
        a: "Simply drag and drop a review card from one column to another. The status will be automatically updated. You can also change status from within the review detail modal."
      },
      {
        q: "Can I filter the Workflow Board?",
        a: "Yes! Click the 'Filter' button to access the same advanced filters as the Dashboard: date range, product, marketplace, sentiment, severity, and rating."
      }
    ]
  },
  {
    category: "Analytics & Export",
    questions: [
      {
        q: "What charts are available in Analytics?",
        a: "Analytics includes: Sentiment Trend (weekly line/area chart), Category Distribution (donut chart with legend), Marketplace Breakdown (pie chart), Rating Distribution (bar chart 1-5 stars), Status Distribution (pie chart), and Response Metrics card."
      },
      {
        q: "What are Response Metrics?",
        a: "Response Metrics show team performance: Average Time to In-Progress (how quickly reviews move from Open to In Progress) and Resolved within 48h rate (percentage of reviews resolved within 48 hours)."
      },
      {
        q: "Can I filter analytics data?",
        a: "Yes! All analytics respect filters applied via the 'Filter' button, including marketplace, date range, sentiment, severity, status, product, and rating."
      },
      {
        q: "What export options are available?",
        a: "Click 'Export' to access two tabs: 'Filtered Data' exports summary statistics and distributions based on current filters (great for reports), 'All Data' exports complete raw review data with all fields (great for offline analysis)."
      },
      {
        q: "What fields are included in the All Data export?",
        a: "The full export includes: ID, Product ID, Product Name, Marketplace, Customer Name, Rating, Review Title, Review Content, Sentiment, Category, Severity, Status, AI Suggested Reply, Review Date, and Created At timestamp."
      }
    ]
  },
  {
    category: "Settings & Integrations",
    questions: [
      {
        q: "How do I check if my integrations are working?",
        a: "Go to Settings to see the status of all connected services: AI (Grok via OpenRouter), Amazon (Axesso API), Walmart (SerpAPI), and Outlook email. Green checkmarks indicate active connections."
      },
      {
        q: "How do I connect my Outlook email?",
        a: "In Settings, click 'Connect Outlook' to authorize access to your Microsoft account. Once connected, you can import customer emails from the Mailbox option and send AI-generated replies directly."
      },
      {
        q: "What is the AI Chatbot?",
        a: "The AI Chatbot (powered by Grok) is available via the chat button in the bottom-right corner. It can help with navigation, explain features, answer common questions, and provide quick tips about using DriftSignal."
      },
      {
        q: "Can I use dark mode?",
        a: "Yes! Click the theme toggle button in the top-right corner of the header to switch between light and dark modes. Your preference is saved automatically."
      }
    ]
  }
];

const troubleshootingItems = [
  {
    issue: "Reviews not importing",
    solution: "Make sure you're using a valid product URL or ASIN. For Amazon, the URL should contain '/dp/' followed by a 10-character code. Check Settings to verify your API integrations are active (green checkmarks)."
  },
  {
    issue: "No reviews found for product",
    solution: "Some products may not have reviews yet, or the reviews may not have text content (rating-only reviews are not imported). Try a different product or wait for more reviews to be posted."
  },
  {
    issue: "AI analysis seems incorrect",
    solution: "AI analysis is based on the review text content. Very short or ambiguous reviews may result in less accurate categorization. The system uses standardized categories for consistency across all reviews."
  },
  {
    issue: "Can't connect Outlook",
    solution: "Ensure you're using a valid Microsoft account. Check that pop-up blockers aren't preventing the authorization window. Try signing out and back in to refresh your session."
  },
  {
    issue: "Workflow Board is cluttered with many reviews",
    solution: "Use the search bar to filter by customer, product, or title. Reviews are automatically grouped into collapsible product swimlanes - click on a product header to expand/collapse its reviews."
  },
  {
    issue: "Charts not showing data",
    solution: "Make sure you have imported reviews first. Check if filters are applied that might be hiding data. Try clearing all filters and refreshing the page."
  }
];

export default function FAQ() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { startTour } = useTour();

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Help & FAQ
          </h1>
          <p className="text-sm text-muted-foreground">
            Learn how to use DriftSignal to manage your marketplace reviews effectively
          </p>
        </div>
        <Button 
          onClick={startTour}
          className="flex items-center gap-2 whitespace-nowrap"
          data-testid="button-start-tour"
        >
          <Play className="h-4 w-4" />
          Start Tour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Follow these steps to start managing your reviews in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gettingStartedSteps.map((item, index) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 pb-4 border-b last:border-0">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            Supported Marketplaces
          </CardTitle>
          <CardDescription>
            Import reviews from these platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
              <SiAmazon className="h-8 w-8" style={{ color: "#FF9900" }} />
              <span className="font-medium">Amazon</span>
              <span className="text-xs text-muted-foreground text-center">Product URL or ASIN</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
              <WalmartLogo className="h-8 w-8" />
              <span className="font-medium">Walmart</span>
              <span className="text-xs text-muted-foreground text-center">Product URL or ID</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
              <SiShopify className="h-8 w-8" style={{ color: "#7AB55C" }} />
              <span className="font-medium">Shopify</span>
              <span className="text-xs text-muted-foreground text-center">Store URL + Product</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
              <Mail className="h-8 w-8" style={{ color: "#0078D4" }} />
              <span className="font-medium">Mailbox</span>
              <span className="text-xs text-muted-foreground text-center">Outlook emails + AI extraction</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              AI Analysis Categories
            </CardTitle>
            <CardDescription>
              12 standardized product issue categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "Product Quality",
                "Shipping & Delivery", 
                "Customer Service",
                "Pricing & Value",
                "Product Features",
                "Packaging",
                "Sizing & Fit",
                "Compatibility",
                "Documentation",
                "Returns & Refunds",
                "Safety Concerns",
                "General Feedback"
              ].map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              AI-Powered Features
            </CardTitle>
            <CardDescription>
              Grok 4.1 Fast via OpenRouter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Sentiment analysis (positive/neutral/negative)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Category classification (12 types)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Severity assessment (low to critical)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>AI-suggested professional replies</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Product extraction from emails</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Chatbot assistant for quick help</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-cyan-500" />
            Dashboard Infographics
          </CardTitle>
          <CardDescription>
            Visual analytics at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border text-center">
              <LineChart className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm">Sentiment Trend</span>
              <span className="text-xs text-muted-foreground">Weekly patterns</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border text-center">
              <PieChart className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm">Source Distribution</span>
              <span className="text-xs text-muted-foreground">By marketplace</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border text-center">
              <Grid3X3 className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm">Severity Matrix</span>
              <span className="text-xs text-muted-foreground">Priority heatmap</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border text-center">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm">Response Metrics</span>
              <span className="text-xs text-muted-foreground">Team performance</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        
        {faqItems.map((section) => (
          <Card key={section.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{section.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.questions.map((item, index) => (
                  <AccordionItem key={index} value={`${section.category}-${index}`}>
                    <AccordionTrigger className="text-left text-sm hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Troubleshooting
          </CardTitle>
          <CardDescription>
            Common issues and how to resolve them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {troubleshootingItems.map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-destructive">{item.issue}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.solution}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Use the marketplace filter in the sidebar to quickly focus on reviews from a specific platform</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Regularly refresh your products to capture new reviews as customers post them</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Use the Workflow search bar to quickly find specific reviews by customer or product name</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Collapse product swimlanes to focus on specific products in the Workflow Board</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Check the Severity & Status Matrix to prioritize critical open issues first</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Export 'All Data' for complete offline analysis in spreadsheet tools</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Use the AI Chatbot in the bottom-right corner for quick help without leaving your workflow</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Check Analytics weekly to spot trends in customer sentiment and common issues</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
