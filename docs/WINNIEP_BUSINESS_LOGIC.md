# WINNIEP — BUSINESS LOGIC & ORDER LIFECYCLE

## 1. Order State Machine
Orders are tracked via two independent paths: Fulfilment and Payment.

### Fulfilment State Machine
`Awaiting Availability` $\rightarrow$ `Awaiting Delivery Quotation` $\rightarrow$ `Awaiting Customer Approval` $\rightarrow$ `Awaiting Payment` $\rightarrow$ `Processing` $\rightarrow$ `Dispatched` $\rightarrow$ `Delivered`
(Optional: `Cancelled`)

### Payment State Machine
`Not Started` $\rightarrow$ `Pending` $\rightarrow$ `Successful` (or `Failed`/`Cancelled`/`Expired`)
(Optional: `Refunded`)

## 2. The "Review-First" Gate
Payment is strictly gated. An order enters the "Review-First" workflow if:
- Any item requires "Supplier Confirmation".
- The delivery fee cannot be automatically determined.

**Workflow for gated orders:**
1. Customer submits Order Request.
2. Status: `Awaiting availability confirmation` or `Awaiting delivery quotation`.
3. Admin reviews $\rightarrow$ Confirms items $\rightarrow$ Enters Delivery Fee.
4. Status $\rightarrow$ `Awaiting Customer Approval`.
5. Customer approves final total $\rightarrow$ Status $\rightarrow$ `Awaiting Payment`.
6. Payment initiated via M-PESA.

## 3. Delivery Architecture
Delivery is configurable and non-static.
- **Supported types**: Destination-based, Fixed, Product-specific, Manual Quotations.
- **Logic**: If no rule matches $\rightarrow$ status = `Awaiting delivery quotation`.
- **Updates**: If cost changes after request, the order must be re-approved by the customer before payment.

## 4. M-PESA Integration (Safaricom Daraja)
- **Method**: M-PESA Express / STK Push.
- **Security**: Credentials server-side; sandbox for dev; idempotent callbacks.
- **Verification**: Match verified callback result against Order ID and exact Final Total.
- **Gating**: STK Push is only triggered once the Order is in `Awaiting Payment` state.

## 5. Data Integrity
- **Order Snapshots**: Store purchase-time name, SKU, price, and quantity. Catalogue changes must not affect historical orders.
- **Currency**: Use exact integer representation (cents/minor units) to avoid floating point errors.
- **Auth**: Admin routes and privileged order changes require server-side authorization.
