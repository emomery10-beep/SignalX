import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Static OpenAPI 3.0 spec for the real, live /api/v1/ask endpoint.
// Referenced by /ai-plugin.json (ChatGPT), and usable directly by any
// AI assistant/agent that can call an HTTP tool from an OpenAPI schema.
const SPEC = {
  openapi: '3.0.1',
  info: {
    title: 'AskBiz API',
    description: 'Ask plain-English business intelligence questions and get answers grounded in real sales, stock, and margin data.',
    version: '1.0.0',
  },
  servers: [{ url: 'https://askbiz.co' }],
  paths: {
    '/api/v1/ask': {
      post: {
        operationId: 'askBusinessQuestion',
        summary: 'Ask AskBiz a business intelligence question',
        description: 'Submit a plain-English question about sales, margins, stock, pricing, or revenue. Returns a direct answer plus optional charts, tables, and recommendations grounded in the caller\'s connected business data (or the context supplied in the request).',
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AskRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Answer generated successfully',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/AskResponse' } },
            },
          },
          '401': { description: 'Missing or invalid API key' },
          '429': { description: 'Rate limit or monthly quota exceeded' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
    },
    schemas: {
      AskRequest: {
        type: 'object',
        required: ['question'],
        properties: {
          question: { type: 'string', maxLength: 2000, example: 'Which product has the worst margin this month?' },
          context: {
            type: 'object',
            description: 'Optional business context, used when the API key is not linked to a connected account.',
            properties: {
              currency: { type: 'string', example: 'KES' },
              symbol: { type: 'string', example: 'KSh' },
              biz_type: { type: 'string', enum: ['retail', 'ecommerce', 'distributor', 'exporter'] },
              region: { type: 'string', example: 'Kenya' },
              revenue: { type: 'number' },
              margin: { type: 'number' },
              top_products: { type: 'array', items: { type: 'string' } },
            },
          },
          options: {
            type: 'object',
            properties: {
              cfo_mode: { type: 'boolean' },
              simulate_mode: { type: 'boolean' },
            },
          },
        },
      },
      AskResponse: {
        type: 'object',
        properties: {
          answer: { type: 'string' },
          insight_header: { type: 'string', nullable: true },
          verdict: { type: 'string', enum: ['act', 'watch', 'problem'], nullable: true },
          verdict_sentence: { type: 'string', nullable: true },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
          kpi_cards: { type: 'array', items: { type: 'object' } },
          recommendations: { type: 'array', items: { type: 'string' } },
          follow_up_questions: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(SPEC, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  })
}
