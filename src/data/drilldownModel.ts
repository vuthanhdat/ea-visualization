export type DrillLayer = 'module' | 'surface' | 'domain' | 'physical' | 'platform';

export interface DrillNode {
  id: string;
  label: string;
  subtitle: string;
  layer: DrillLayer;
  description: string;
  parentId?: string;
  details?: string[];
}

export interface DrillEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

export interface SystemDrilldownDefinition {
  id: string;
  label: string;
  description: string;
  nodes: DrillNode[];
  edges: DrillEdge[];
}

export const drillLayerMeta: Record<DrillLayer, { label: string; description: string }> = {
  module: { label: 'Modules', description: 'Functional boundaries inside the system' },
  surface: { label: 'UI / API / Event', description: 'Interaction and integration surface' },
  domain: { label: 'Domain model', description: 'Business objects owned by the module' },
  physical: { label: 'Physical data', description: 'Tables and persistence representation' },
  platform: { label: 'Platform', description: 'Runtime, database and messaging technology' },
};

const erpNodes: DrillNode[] = [
  { id: 'sales-module', label: 'Sales', subtitle: 'ERP.SALES', layer: 'module', description: 'Sales order lifecycle from draft to confirmed.', parentId: 'erp', details: ['Order entry', 'Pricing', 'Approval integration', 'Order confirmation'] },
  { id: 'purchase-module', label: 'Purchase', subtitle: 'ERP.PURCHASE', layer: 'module', description: 'Purchase request and purchase order lifecycle.', parentId: 'erp', details: ['Purchase request', 'Supplier selection', 'Purchase order', 'Approval integration'] },
  { id: 'inventory-module', label: 'Inventory', subtitle: 'ERP.INVENTORY', layer: 'module', description: 'Inventory reservation and movement coordination.', parentId: 'erp', details: ['Reservation', 'Availability', 'Inventory movement'] },

  { id: 'sales-screen', label: 'Sales Order Entry', subtitle: 'SO-001 · Screen', layer: 'surface', description: 'UI used by Sales Staff to create and edit sales orders.', parentId: 'sales-module', details: ['Customer selection', 'Order lines', 'Pricing preview', 'Submit for approval'] },
  { id: 'order-api-detail', label: 'Order API', subtitle: 'POST /sales-orders', layer: 'surface', description: 'REST contract used to create SalesOrder aggregate.', parentId: 'sales-module', details: ['Validate request', 'Resolve master data', 'Persist aggregate', 'Return order number'] },
  { id: 'sales-confirmed-event', label: 'SalesOrderConfirmed', subtitle: 'Domain event', layer: 'surface', description: 'Published when an approved sales order becomes executable.', parentId: 'sales-module', details: ['Producer: ERP Core', 'Consumers: WMS, Accounting', 'Async transport'] },

  { id: 'purchase-screen', label: 'Purchase Order Entry', subtitle: 'PO-001 · Screen', layer: 'surface', description: 'UI used by purchasing staff to create purchase orders.', parentId: 'purchase-module' },
  { id: 'purchase-api-detail', label: 'Purchase API', subtitle: 'POST /purchase-orders', layer: 'surface', description: 'REST contract for purchase order creation.', parentId: 'purchase-module' },
  { id: 'purchase-released-event', label: 'PurchaseOrderReleased', subtitle: 'Domain event', layer: 'surface', description: 'Signals that a PO can be fulfilled by the supplier.', parentId: 'purchase-module' },

  { id: 'inventory-api', label: 'Availability API', subtitle: 'GET /inventory/availability', layer: 'surface', description: 'Checks available-to-promise quantity.', parentId: 'inventory-module' },
  { id: 'inventory-event', label: 'InventoryReserved', subtitle: 'Domain event', layer: 'surface', description: 'Signals that stock has been reserved for an order.', parentId: 'inventory-module' },

  { id: 'sales-order-entity', label: 'SalesOrder', subtitle: 'Aggregate root', layer: 'domain', description: 'Sales transaction aggregate owned by ERP Sales.', parentId: 'sales-module', details: ['OrderNo', 'CustomerId', 'OrderDate', 'Status', 'TotalAmount'] },
  { id: 'sales-line-entity', label: 'SalesOrderLine', subtitle: 'Entity', layer: 'domain', description: 'Product and quantity lines inside a sales order.', parentId: 'sales-order-entity', details: ['ProductId', 'Quantity', 'UnitPrice', 'TaxAmount', 'LineTotal'] },
  { id: 'purchase-order-entity', label: 'PurchaseOrder', subtitle: 'Aggregate root', layer: 'domain', description: 'Purchase transaction aggregate owned by ERP Purchase.', parentId: 'purchase-module' },
  { id: 'inventory-reservation-entity', label: 'InventoryReservation', subtitle: 'Entity', layer: 'domain', description: 'Reservation of stock against a business demand.', parentId: 'inventory-module' },

  { id: 'sales-order-table', label: 'sales_order', subtitle: 'erp.sales_order', layer: 'physical', description: 'Physical header table for SalesOrder.', parentId: 'sales-order-entity', details: ['id uuid PK', 'order_no varchar', 'customer_id uuid', 'status varchar', 'total_amount numeric'] },
  { id: 'sales-line-table', label: 'sales_order_line', subtitle: 'erp.sales_order_line', layer: 'physical', description: 'Physical line table for SalesOrderLine.', parentId: 'sales-line-entity', details: ['id uuid PK', 'sales_order_id uuid FK', 'product_id uuid', 'quantity numeric', 'unit_price numeric'] },
  { id: 'purchase-order-table', label: 'purchase_order', subtitle: 'erp.purchase_order', layer: 'physical', description: 'Physical table for PurchaseOrder.', parentId: 'purchase-order-entity' },
  { id: 'inventory-reservation-table', label: 'inventory_reservation', subtitle: 'erp.inventory_reservation', layer: 'physical', description: 'Physical table for inventory reservations.', parentId: 'inventory-reservation-entity' },

  { id: 'erp-dotnet', label: '.NET', subtitle: 'Application runtime', layer: 'platform', description: 'Backend runtime for ERP Core.' },
  { id: 'erp-postgres', label: 'PostgreSQL', subtitle: 'ERP database', layer: 'platform', description: 'Relational persistence owned by ERP Core.' },
  { id: 'erp-rabbitmq', label: 'RabbitMQ', subtitle: 'Message broker', layer: 'platform', description: 'Transport for asynchronous domain events.' },
];

const erpEdges: DrillEdge[] = [
  { id: 'd1', source: 'sales-module', target: 'sales-screen', relation: 'provides UI' },
  { id: 'd2', source: 'sales-module', target: 'order-api-detail', relation: 'exposes' },
  { id: 'd3', source: 'sales-module', target: 'sales-confirmed-event', relation: 'publishes' },
  { id: 'd4', source: 'order-api-detail', target: 'sales-order-entity', relation: 'creates' },
  { id: 'd5', source: 'sales-order-entity', target: 'sales-line-entity', relation: 'contains' },
  { id: 'd6', source: 'sales-order-entity', target: 'sales-order-table', relation: 'persisted as' },
  { id: 'd7', source: 'sales-line-entity', target: 'sales-line-table', relation: 'persisted as' },
  { id: 'd8', source: 'sales-confirmed-event', target: 'erp-rabbitmq', relation: 'transported by' },
  { id: 'd9', source: 'sales-module', target: 'erp-dotnet', relation: 'implemented with' },
  { id: 'd10', source: 'sales-order-table', target: 'erp-postgres', relation: 'stored in' },
  { id: 'd11', source: 'sales-line-table', target: 'erp-postgres', relation: 'stored in' },

  { id: 'd12', source: 'purchase-module', target: 'purchase-screen', relation: 'provides UI' },
  { id: 'd13', source: 'purchase-module', target: 'purchase-api-detail', relation: 'exposes' },
  { id: 'd14', source: 'purchase-module', target: 'purchase-released-event', relation: 'publishes' },
  { id: 'd15', source: 'purchase-api-detail', target: 'purchase-order-entity', relation: 'creates' },
  { id: 'd16', source: 'purchase-order-entity', target: 'purchase-order-table', relation: 'persisted as' },
  { id: 'd17', source: 'purchase-module', target: 'erp-dotnet', relation: 'implemented with' },
  { id: 'd18', source: 'purchase-order-table', target: 'erp-postgres', relation: 'stored in' },
  { id: 'd19', source: 'purchase-released-event', target: 'erp-rabbitmq', relation: 'transported by' },

  { id: 'd20', source: 'inventory-module', target: 'inventory-api', relation: 'exposes' },
  { id: 'd21', source: 'inventory-module', target: 'inventory-event', relation: 'publishes' },
  { id: 'd22', source: 'inventory-api', target: 'inventory-reservation-entity', relation: 'reads/writes' },
  { id: 'd23', source: 'inventory-reservation-entity', target: 'inventory-reservation-table', relation: 'persisted as' },
  { id: 'd24', source: 'inventory-module', target: 'erp-dotnet', relation: 'implemented with' },
  { id: 'd25', source: 'inventory-reservation-table', target: 'erp-postgres', relation: 'stored in' },
  { id: 'd26', source: 'inventory-event', target: 'erp-rabbitmq', relation: 'transported by' },
];

export const systemDrilldowns: Record<string, SystemDrilldownDefinition> = {
  erp: {
    id: 'erp',
    label: 'ERP Core',
    description: 'Semantic drill-down from application boundary to modules, contracts, domain model and physical persistence.',
    nodes: erpNodes,
    edges: erpEdges,
  },
};
