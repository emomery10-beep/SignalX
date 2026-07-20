import { NextResponse } from 'next/server'
import { API_PRICE_CENTS } from '@/lib/api-pricing'

export const runtime = 'nodejs'

const IDEMPOTENCY_HEADER = {
  name: 'Idempotency-Key',
  in: 'header',
  required: false,
  description: 'Optional client-generated key. Retrying the same request with the same key returns the original response instead of re-running (and re-billing) it — same convention as Stripe.',
  schema: { type: 'string' },
} as const

// Static OpenAPI 3.0 spec for the 6 core /api/v1/* endpoints. Referenced by
// /ai-plugin.json (ChatGPT), and usable directly by any AI assistant/agent
// that can call an HTTP tool from an OpenAPI schema.
//
// This is hand-maintained, not generated from the route handlers — the docs
// used to (incorrectly) claim otherwise. It's reviewed alongside
// developer.askbiz.co's API reference pages on every endpoint change; if the
// two ever disagree, the reference pages are authoritative, not this file.
// Bump `info.version` and `x-last-reviewed` whenever this file is edited, so
// a reader has a concrete signal for how stale it might be.
const SPEC = {
  openapi: '3.0.1',
  info: {
    title: 'AskBiz API',
    description: 'Vision recognition, WhatsApp messaging, business-intelligence Q&A, and merchant billing for African SME commerce.',
    version: '1.1.0',
  },
  'x-last-reviewed': '2026-07-20',
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
    '/api/v1/scan': {
      post: {
        operationId: 'scanProductImage',
        summary: 'Identify a product from a photo',
        description: `Vision recognition (Groq Llama-4-Scout multimodal) for a product photo — brand, size, and type. Keys in "account" mode get results matched against the caller's own AskBiz inventory; "generic" keys get raw identification only. Costs ${API_PRICE_CENTS['/api/v1/scan']} credits (~$${(API_PRICE_CENTS['/api/v1/scan'] / 100).toFixed(2)}) per successful call — failed/rejected calls are never billed. See /api/v1/pricing for live pricing.`,
        security: [{ ApiKeyAuth: [] }],
        parameters: [IDEMPOTENCY_HEADER],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: { image: { type: 'string', description: 'Base64-encoded JPEG' } },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Product identified', content: { 'application/json': { schema: { $ref: '#/components/schemas/ScanResponse' } } } },
          '401': { description: 'Missing or invalid API key' },
          '402': { description: 'Insufficient API credits' },
          '422': { description: 'Could not identify a product in the image' },
          '429': { description: 'Rate limit or monthly quota exceeded' },
        },
      },
    },
    '/api/v1/whatsapp/send': {
      post: {
        operationId: 'sendWhatsAppMessage',
        summary: 'Send a receipt or purchase order over WhatsApp',
        description: `Sends a pre-approved Meta Business API template (receipt or purchase_order) to a phone number. Requires an "account" mode key. Costs ${API_PRICE_CENTS['/api/v1/whatsapp/send']} credits (~$${(API_PRICE_CENTS['/api/v1/whatsapp/send'] / 100).toFixed(2)}) per successful send — failed sends are never billed. See /api/v1/pricing for live pricing.`,
        security: [{ ApiKeyAuth: [] }],
        parameters: [IDEMPOTENCY_HEADER],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone', 'template', 'text'],
                properties: {
                  phone: { type: 'string', example: '+254712345678' },
                  template: { type: 'string', enum: ['receipt', 'purchase_order'] },
                  text: { type: 'string', maxLength: 1024 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Message sent', content: { 'application/json': { schema: { $ref: '#/components/schemas/WhatsappSendResponse' } } } },
          '401': { description: 'Missing or invalid API key' },
          '402': { description: 'Insufficient API credits' },
          '403': { description: 'Key is not in "account" mode' },
          '429': { description: 'Rate limit or monthly quota exceeded' },
          '502': { description: 'Meta WhatsApp API error' },
        },
      },
    },
    '/api/v1/connections': {
      post: {
        operationId: 'requestConnection',
        summary: 'Request scoped access to a merchant\'s account',
        description: 'Sends a merchant a consent link for the requested scopes (currently just read_inventory). The connection stays "pending" until the merchant approves it at the returned confirmation_url. Not available on a test key — a connection request reaches a real merchant\'s real inbox, and there\'s no safe way to simulate that.',
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['merchant_email'],
                properties: {
                  merchant_email: { type: 'string', format: 'email' },
                  scopes: { type: 'array', items: { type: 'string', enum: ['read_inventory'] }, description: 'Defaults to every allowed scope if omitted.' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Connection request created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ConnectionResponse' } } } },
          '400': { description: 'Invalid merchant_email or scopes' },
          '401': { description: 'Missing or invalid API key' },
          '403': { description: 'Sandbox connections aren\'t available yet — use a live key' },
          '409': { description: 'Already connected to this merchant' },
          '429': { description: 'Rate limit or monthly quota exceeded' },
        },
      },
      get: {
        operationId: 'listConnections',
        summary: 'List connections created by this key',
        security: [{ ApiKeyAuth: [] }],
        responses: {
          '200': {
            description: 'Up to the 200 most recent connections',
            content: { 'application/json': { schema: { type: 'object', properties: { connections: { type: 'array', items: { $ref: '#/components/schemas/Connection' } } } } } },
          },
          '401': { description: 'Missing or invalid API key' },
        },
      },
    },
    '/api/v1/charges': {
      post: {
        operationId: 'createCharge',
        summary: 'Bill a merchant on your behalf',
        description: 'Creates a charge request against a merchant, identified by email — a one-off authorization, not a persistent grant. The merchant approves at the returned confirmation_url. On a live key this opens a real Stripe Checkout session; on a test key the confirmation page shows a "Simulate approve/decline" control instead and never touches Stripe. Creating the charge itself never costs the caller anything — money only ever moves from the merchant, and only if they approve.',
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['merchant_email', 'amount_cents', 'description'],
                properties: {
                  merchant_email: { type: 'string', format: 'email' },
                  amount_cents: { type: 'integer', minimum: 100, maximum: 10000000, example: 5000 },
                  currency: { type: 'string', default: 'gbp', example: 'gbp' },
                  description: { type: 'string', maxLength: 500 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Charge request created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChargeResponse' } } } },
          '400': { description: 'Invalid merchant_email, amount_cents, or description' },
          '401': { description: 'Missing or invalid API key' },
          '429': { description: 'Rate limit or monthly quota exceeded' },
        },
      },
      get: {
        operationId: 'listCharges',
        summary: 'List charges created by this key',
        security: [{ ApiKeyAuth: [] }],
        responses: {
          '200': {
            description: 'Up to the 100 most recent charges',
            content: { 'application/json': { schema: { type: 'object', properties: { charges: { type: 'array', items: { $ref: '#/components/schemas/Charge' } } } } } },
          },
          '401': { description: 'Missing or invalid API key' },
        },
      },
    },
    '/api/v1/pricing': {
      get: {
        operationId: 'getPricing',
        summary: 'Live per-call prices and plan limits',
        description: 'Public, unauthenticated — no API key required. Single source of truth for what a successful call to each billed endpoint costs, and each plan\'s monthly/per-minute request limits.',
        responses: {
          '200': {
            description: 'Pricing and plan limits',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    endpoints: { type: 'array', items: { type: 'object', properties: { path: { type: 'string' }, price_cents: { type: 'number' } } } },
                    plans: { type: 'object' },
                    currency: { type: 'string', example: 'usd_cents' },
                    note: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Every key is either abz_test_… (sandbox — scan/whatsapp-send/charges return safe, canned responses and never touch a real wallet, phone, or Stripe account) or abz_live_… (real). Environment is fixed at key creation and cannot change afterward. See /docs/guides/sandbox-keys.',
      },
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
      ScanResponse: {
        type: 'object',
        properties: {
          found: { type: 'boolean', description: 'True if matched against the caller\'s own inventory (account mode only)' },
          inventory_id: { type: 'string', nullable: true },
          name: { type: 'string' },
          price: { type: 'number', nullable: true },
          cost_price: { type: 'number', nullable: true, description: 'Only present on a match — your own cost basis for margin math, never shown to the merchant\'s customer.' },
          stock_qty: { type: 'number', nullable: true },
          unit: { type: 'string', nullable: true },
          test_mode: { type: 'boolean', description: 'Present and true only on a test key — the vision model was never called, no wallet debit occurred, and this is always the same canned example match.' },
        },
      },
      WhatsappSendResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          test_mode: { type: 'boolean', description: 'Present and true only on a test key — no message reached Meta, no wallet debit occurred.' },
        },
      },
      Connection: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          merchant_email: { type: 'string' },
          merchant_user_id: { type: 'string', nullable: true },
          status: { type: 'string', enum: ['pending', 'active', 'revoked'] },
          scopes: { type: 'array', items: { type: 'string' } },
          app_id: { type: 'string', nullable: true },
          created_at: { type: 'string', format: 'date-time' },
          approved_at: { type: 'string', format: 'date-time', nullable: true },
          revoked_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      ConnectionResponse: {
        type: 'object',
        properties: {
          connection: { $ref: '#/components/schemas/Connection' },
          confirmation_url: { type: 'string', format: 'uri' },
        },
      },
      Charge: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          merchant_email: { type: 'string' },
          amount_cents: { type: 'integer' },
          currency: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'approved', 'declined', 'expired'] },
          key_env: { type: 'string', enum: ['live', 'test'], description: 'The environment of the key that created this charge — fixed at creation, never changes.' },
          created_at: { type: 'string', format: 'date-time' },
          approved_at: { type: 'string', format: 'date-time', nullable: true },
          expires_at: { type: 'string', format: 'date-time' },
        },
      },
      ChargeResponse: {
        type: 'object',
        properties: {
          charge: { $ref: '#/components/schemas/Charge' },
          confirmation_url: { type: 'string', format: 'uri', description: 'On a test-env charge, this page shows a "Simulate approve/decline" control and never redirects to Stripe.' },
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
