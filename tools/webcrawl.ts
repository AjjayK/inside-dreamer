import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "webcrawl",
   serverVersion: "1.2.0",
   description: "Enables your sidekick to read any web page",
} as const;

/**
 * The type of the input parameter for crawlUrl tool.
 */
export type crawlUrlParams = {
  // The URL to crawl and extract content from
  url: string
}

/**
 * The type of the output of the crawlUrl tool.
 */
export type crawlUrlOutput = {
  // The URL that was crawled
  url?: string,
  error?: {
    type: string,
    message: string
  },
  // The page title
  title?: string,
  // The article author or byline, if detected
  byline?: string,
  // Whether the crawl succeeded
  success: boolean,
  // ISO 8601 timestamp of when the page was fetched
  fetchedAt?: string,
  openGraph?: {
    // The URL that was crawled
  url?: string,
    type?: string,
    audio?: string,
    image?: string,
    // The page title
  title?: string,
    video?: string,
    locale?: string,
    imageAlt?: string,
    siteName?: string,
    imageWidth?: string,
    description?: string,
    imageHeight?: string
  },
  // Length of the extracted text content in characters
  textLength?: number,
  // The page content extracted by Readability as clean HTML
  readableHtml?: string
}

/**
 * Fetch a web page and extract the main article content using Readability.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function crawlUrl(
  sdk: ServerSdk,
  params: crawlUrlParams
): Promise<crawlUrlOutput> {
  return await sdk.callTool("webcrawl/1.2.0/crawlUrl", params) as crawlUrlOutput;
}

/**
 * The type of the input parameter for crawlUrlMarkdown tool.
 */
export type crawlUrlMarkdownParams = {
  // The URL to crawl and extract content from as Markdown
  url: string
}

/**
 * The type of the output of the crawlUrlMarkdown tool.
 */
export type crawlUrlMarkdownOutput = {
  // The URL that was crawled
  url?: string,
  error?: {
    type: string,
    message: string
  },
  // The page title from the <title> tag
  title?: string,
  // Whether the crawl succeeded
  success: boolean,
  // Page content as Markdown
  markdown?: string,
  metadata?: {

  },
  // ISO 8601 timestamp of when the page was fetched
  fetchedAt?: string,
  // Length of the markdown content in characters (includes markdown syntax)
  textLength?: number
}

/**
 * Fetch a web page and convert its full content to clean Markdown, with page metadata (title, description, Open Graph tags, etc.) in a structured format. Produces concise, LLM-friendly output.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function crawlUrlMarkdown(
  sdk: ServerSdk,
  params: crawlUrlMarkdownParams
): Promise<crawlUrlMarkdownOutput> {
  return await sdk.callTool("webcrawl/1.2.0/crawlUrlMarkdown", params) as crawlUrlMarkdownOutput;
}

/**
 * The type of the input parameter for crawlUrlRaw tool.
 */
export type crawlUrlRawParams = {
  // The URL to fetch raw content from
  url: string
}

/**
 * The type of the output of the crawlUrlRaw tool.
 */
export type crawlUrlRawOutput = {
  // The URL that was crawled
  url?: string,
  error?: {
    type: string,
    message: string
  },
  // The complete unprocessed content as received from the server
  rawHtml?: string,
  // Whether the crawl succeeded
  success: boolean,
  // ISO 8601 timestamp of when the page was fetched
  fetchedAt?: string,
  // The Content-Type header from the response (e.g. text/html, application/json)
  contentType?: string,
  // Length of the raw content in characters
  contentLength?: number
}

/**
 * Fetch a URL and return the raw content without any processing. Supports HTML, JSON, XML, plain text, and other text-based content types. Unlike crawlUrl, this tool does NOT extract readable content using Readability - it returns the complete, unprocessed response body as received from the server. Use this when you need the full page structure, raw API responses, or when Readability extraction is not desired.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function crawlUrlRaw(
  sdk: ServerSdk,
  params: crawlUrlRawParams
): Promise<crawlUrlRawOutput> {
  return await sdk.callTool("webcrawl/1.2.0/crawlUrlRaw", params) as crawlUrlRawOutput;
}

/**
 * The type of the input parameter for renderUrlGrabContent tool.
 */
export type renderUrlGrabContentParams = {
  // The URL to render with a browser and extract content from
  url: string
}

/**
 * The type of the output of the renderUrlGrabContent tool.
 */
export type renderUrlGrabContentOutput = {
  // The URL that was crawled
  url?: string,
  error?: {
    type: string,
    message: string
  },
  // The page title
  title?: string,
  // The article author or byline, if detected
  byline?: string,
  // Whether the crawl succeeded
  success: boolean,
  // ISO 8601 timestamp of when the page was fetched
  fetchedAt?: string,
  openGraph?: {
    // The URL that was crawled
  url?: string,
    type?: string,
    audio?: string,
    image?: string,
    // The page title
  title?: string,
    video?: string,
    locale?: string,
    imageAlt?: string,
    siteName?: string,
    imageWidth?: string,
    description?: string,
    imageHeight?: string
  },
  // Length of the extracted text content in characters
  textLength?: number,
  // The page content extracted by Readability as clean HTML
  readableHtml?: string
}

/**
 * Render a web page using a headless browser (browserless.io) and extract the main article content using Readability. This tool ALWAYS uses a full Chrome browser to render JavaScript, handle dynamic content, and bypass bot detection. It then extracts readable content. Use this for JavaScript-heavy sites, sites with bot protection, or when you need guaranteed browser rendering with clean article extraction. This tool costs $0.012 per request.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function renderUrlGrabContent(
  sdk: ServerSdk,
  params: renderUrlGrabContentParams
): Promise<renderUrlGrabContentOutput> {
  return await sdk.callTool("webcrawl/1.2.0/renderUrlGrabContent", params) as renderUrlGrabContentOutput;
}

/**
 * The type of the input parameter for renderUrlGrabAllContent tool.
 */
export type renderUrlGrabAllContentParams = {
  // The URL to render with a browser and return complete HTML from
  url: string
}

/**
 * The type of the output of the renderUrlGrabAllContent tool.
 */
export type renderUrlGrabAllContentOutput = {
  // The URL that was crawled
  url?: string,
  error?: {
    type: string,
    message: string
  },
  // The complete unprocessed content as received from the server
  rawHtml?: string,
  // Whether the crawl succeeded
  success: boolean,
  // ISO 8601 timestamp of when the page was fetched
  fetchedAt?: string,
  // The Content-Type header from the response (e.g. text/html, application/json)
  contentType?: string,
  // Length of the raw content in characters
  contentLength?: number
}

/**
 * Render a web page using a headless browser (browserless.io) and return the complete raw HTML without any processing. This tool ALWAYS uses a full Chrome browser to render JavaScript, handle dynamic content, and bypass bot detection. Unlike renderUrlGrabContent, it does NOT run Readability - it returns the full rendered HTML including all scripts, styles, and page structure. Use this for JavaScript-heavy sites where you need the complete rendered page structure. This tool costs $0.012 per request.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function renderUrlGrabAllContent(
  sdk: ServerSdk,
  params: renderUrlGrabAllContentParams
): Promise<renderUrlGrabAllContentOutput> {
  return await sdk.callTool("webcrawl/1.2.0/renderUrlGrabAllContent", params) as renderUrlGrabAllContentOutput;
}


