const PM_BASE = 'https://api.parcelmonkey.co.uk'

const pmHeaders = () => ({
  'Content-Type': 'application/json',
  apiversion: '3.3',
  userid: process.env.PARCEL_MONKEY_USER_ID!,
  token: process.env.PARCEL_MONKEY_API_KEY!,
})

export interface PMBox {
  length: number  // cm
  width: number   // cm
  height: number  // cm
  weight: number  // kg
}

export interface PMAddress {
  name: string
  phone?: string
  email?: string
  address1: string
  address2?: string
  town: string
  county: string
  postcode: string
}

export interface PMQuoteParams {
  origin: string
  destination: string
  boxes: PMBox[]
  goods_value: number
  collection_date?: string
  sender: PMAddress
  recipient: PMAddress
}

export interface PMQuoteResult {
  service: string
  carrier: string
  service_name: string
  service_description: string
  customs_invoice_required: boolean
  shipping_price_net: string
  protection_price_net: number
  total_price_net: string
  total_price_gross: string
}

export interface PMShipmentResult {
  ShipmentId: number
  label_url: string
  tracking_url: string
}

export interface PMCustoms {
  doc_type: 'proforma' | 'commercial'
  reason: string
  sender_name: string
  sender_tax_reference: string
  recipient_name: string
  recipient_tax_reference: string
  country_of_manufacture: string
  items: {
    quantity: string
    description: string
    value_per_unit: number
  }[]
}

export interface PMShipmentParams extends PMQuoteParams {
  service: string
  goods_description: string
  delivery_notes?: string
  customs?: PMCustoms
}

export function getPlaceholderRecipient(destination: string): PMAddress {
  const map: Record<string, PMAddress> = {
    US: { name: 'Recipient', address1: '1 Example Ave', town: 'New York', county: 'NY', postcode: '10001' },
    FR: { name: 'Recipient', address1: '1 Rue Example', town: 'Paris', county: 'Ile-de-France', postcode: '75001' },
    DE: { name: 'Recipient', address1: '1 Beispielstr', town: 'Berlin', county: 'Berlin', postcode: '10115' },
    AE: { name: 'Recipient', address1: '1 Example Rd', town: 'Dubai', county: 'Dubai', postcode: '00000' },
    NG: { name: 'Recipient', address1: '1 Example St', town: 'Lagos', county: 'Lagos', postcode: '100001' },
    KE: { name: 'Recipient', address1: '1 Example Rd', town: 'Nairobi', county: 'Nairobi', postcode: '00100' },
    AU: { name: 'Recipient', address1: '1 Example St', town: 'Sydney', county: 'NSW', postcode: '2000' },
    CA: { name: 'Recipient', address1: '1 Example Ave', town: 'Toronto', county: 'ON', postcode: 'M5H 2N2' },
    NL: { name: 'Recipient', address1: '1 Voorbeeldstraat', town: 'Amsterdam', county: 'Noord-Holland', postcode: '1011 AB' },
  }
  return map[destination] || { name: 'Recipient', address1: '1 Example St', town: 'City', county: 'County', postcode: '00000' }
}

export async function testConnection(): Promise<boolean> {
  try {
    const res = await fetch(`${PM_BASE}/HelloWorld`, {
      method: 'POST',
      headers: pmHeaders(),
      body: JSON.stringify({ echo: 'askbiz' }),
    })
    const data = await res.json()
    return data.hello === 'Success!'
  } catch {
    return false
  }
}

export async function getQuotes(params: PMQuoteParams): Promise<PMQuoteResult[]> {
  const res = await fetch(`${PM_BASE}/GetQuote`, {
    method: 'POST',
    headers: pmHeaders(),
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Parcel Monkey GetQuote failed (${res.status}): ${err}`)
  }
  const data = await res.json()
  if (!Array.isArray(data)) {
    throw new Error(`Unexpected GetQuote response: ${JSON.stringify(data)}`)
  }
  return (data as PMQuoteResult[]).sort(
    (a, b) => parseFloat(a.total_price_gross) - parseFloat(b.total_price_gross)
  )
}

export async function createShipment(params: PMShipmentParams): Promise<PMShipmentResult> {
  const res = await fetch(`${PM_BASE}/CreateShipment`, {
    method: 'POST',
    headers: pmHeaders(),
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Parcel Monkey CreateShipment failed (${res.status}): ${err}`)
  }
  return res.json()
}

export async function getPaymentLink(shipmentIds: number[]): Promise<string> {
  const res = await fetch(`${PM_BASE}/GetPaymentLink`, {
    method: 'POST',
    headers: pmHeaders(),
    body: JSON.stringify(shipmentIds.map(String)),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Parcel Monkey GetPaymentLink failed (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.url
}

export async function cancelShipment(shipmentId: number): Promise<boolean> {
  const res = await fetch(`${PM_BASE}/CancelShipment`, {
    method: 'POST',
    headers: pmHeaders(),
    body: JSON.stringify({ ShipmentId: String(shipmentId) }),
  })
  if (!res.ok) return false
  const data = await res.json()
  return data.ShipmentCancelled === 'Y'
}

export async function getTrackingEvents(shipmentId: number) {
  const res = await fetch(`${PM_BASE}/GetTrackingEvents`, {
    method: 'POST',
    headers: pmHeaders(),
    body: JSON.stringify({ ShipmentId: String(shipmentId) }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GetTrackingEvents failed (${res.status}): ${err}`)
  }
  return res.json()
}
