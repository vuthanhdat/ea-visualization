export type LayerId = 'business' | 'application' | 'integration' | 'data' | 'technology';

export interface EaNode {
  id: string;
  label: string;
  subtitle: string;
  layer: LayerId;
  description: string;
  flowId?: string;
}

export interface EaEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

export interface FlowStep {
  id: string;
  order: number;
  title: string;
  lane: string;
  laneKind: 'actor' | 'system';
  actor: string;
  system: string;
  trigger: string;
  inputs: string[];
  transforms: string[];
  outputs: string[];
  mutations: string[];
  state?: string;
}

export interface FlowDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  steps: FlowStep[];
}

export const layerMeta: Record<LayerId, { label: string; description: string }> = {
  business: { label: 'Business Flow', description: 'Doanh nghiệp đang thực hiện luồng nghiệp vụ nào?' },
  application: { label: 'Systems', description: 'Những hệ thống nào tham gia hỗ trợ flow?' },
  integration: { label: 'Integration', description: 'API, event và message nào kết nối các hệ thống?' },
  data: { label: 'Data', description: 'Business data nào được đọc, sinh ra hoặc thay đổi?' },
  technology: { label: 'Technology', description: 'Các thành phần phần mềm chạy trên công nghệ nào?' },
};

export const eaNodes: EaNode[] = [
  { id: 'otc', label: 'Order-to-Cash', subtitle: 'BF-SALES-001', layer: 'business', flowId: 'otc', description: 'Từ nhu cầu mua hàng của khách đến giao hàng, lập hóa đơn và ghi nhận doanh thu.' },
  { id: 'p2p', label: 'Procure-to-Pay', subtitle: 'BF-P2P-001', layer: 'business', flowId: 'p2p', description: 'Từ nhu cầu mua sắm nội bộ đến nhận hàng, hóa đơn nhà cung cấp và công nợ phải trả.' },
  { id: 'r2r', label: 'Record-to-Report', subtitle: 'BF-FIN-001', layer: 'business', flowId: 'r2r', description: 'Thu thập bút toán, đối soát, khóa sổ và hình thành báo cáo tài chính.' },

  { id: 'crm', label: 'CRM', subtitle: 'Customer & opportunity', layer: 'application', description: 'Quản lý khách hàng và cơ hội bán hàng.' },
  { id: 'erp', label: 'ERP Core', subtitle: 'Sales / Purchase / Inventory', layer: 'application', description: 'Điều phối các transaction nghiệp vụ cốt lõi.' },
  { id: 'workflow', label: 'Workflow', subtitle: 'Approval engine', layer: 'application', description: 'Quản lý request, task và phê duyệt.' },
  { id: 'wms', label: 'WMS', subtitle: 'Warehouse execution', layer: 'application', description: 'Thực hiện nhập, xuất và giao nhận kho.' },
  { id: 'accounting', label: 'Accounting', subtitle: 'AR / AP / GL', layer: 'application', description: 'Ghi nhận nghiệp vụ kế toán, công nợ và sổ cái.' },

  { id: 'customer-api', label: 'Customer API', subtitle: 'REST', layer: 'integration', description: 'Contract truy vấn customer master.' },
  { id: 'order-api', label: 'Order API', subtitle: 'REST', layer: 'integration', description: 'Contract tạo và cập nhật sales/purchase order.' },
  { id: 'approval-event', label: 'Approval Event', subtitle: 'Async event', layer: 'integration', description: 'Thông báo kết quả approval tới hệ thống nguồn.' },
  { id: 'order-event', label: 'Order Confirmed', subtitle: 'Domain event', layer: 'integration', description: 'Event biểu diễn order đã đủ điều kiện thực thi downstream.' },
  { id: 'posting-event', label: 'Posting Event', subtitle: 'Domain event', layer: 'integration', description: 'Event yêu cầu/ghi nhận accounting posting.' },

  { id: 'customer', label: 'Customer', subtitle: 'Master data', layer: 'data', description: 'Khách hàng và thông tin định danh nghiệp vụ.' },
  { id: 'sales-order', label: 'SalesOrder', subtitle: 'Transaction', layer: 'data', description: 'Đơn bán hàng và các dòng hàng.' },
  { id: 'purchase-order', label: 'PurchaseOrder', subtitle: 'Transaction', layer: 'data', description: 'Đơn mua hàng và các dòng mua.' },
  { id: 'inventory', label: 'InventoryMovement', subtitle: 'Transaction', layer: 'data', description: 'Biến động số lượng hàng tồn theo nghiệp vụ.' },
  { id: 'journal', label: 'JournalEntry', subtitle: 'Accounting data', layer: 'data', description: 'Bút toán Nợ/Có được tạo từ sự kiện nghiệp vụ.' },

  { id: 'react', label: 'React', subtitle: 'Web UI', layer: 'technology', description: 'Frontend runtime cho các application UI.' },
  { id: 'dotnet', label: '.NET', subtitle: 'Application runtime', layer: 'technology', description: 'Backend application runtime.' },
  { id: 'postgres', label: 'PostgreSQL', subtitle: 'Relational database', layer: 'technology', description: 'Persistence cho transaction và master data.' },
  { id: 'rabbitmq', label: 'RabbitMQ', subtitle: 'Message broker', layer: 'technology', description: 'Truyền event/message bất đồng bộ giữa các systems.' },
  { id: 'docker', label: 'Docker', subtitle: 'Deployment unit', layer: 'technology', description: 'Đóng gói và chạy các application components.' },
];

export const eaEdges: EaEdge[] = [
  { id: 'e1', source: 'otc', target: 'crm', relation: 'starts in' },
  { id: 'e2', source: 'otc', target: 'erp', relation: 'orchestrated by' },
  { id: 'e3', source: 'otc', target: 'wms', relation: 'fulfilled by' },
  { id: 'e4', source: 'otc', target: 'accounting', relation: 'posted by' },
  { id: 'e5', source: 'p2p', target: 'erp', relation: 'orchestrated by' },
  { id: 'e6', source: 'p2p', target: 'workflow', relation: 'approved by' },
  { id: 'e7', source: 'p2p', target: 'wms', relation: 'received by' },
  { id: 'e8', source: 'p2p', target: 'accounting', relation: 'posted by' },
  { id: 'e9', source: 'r2r', target: 'accounting', relation: 'owned by' },

  { id: 'e10', source: 'crm', target: 'customer-api', relation: 'exposes' },
  { id: 'e11', source: 'erp', target: 'customer-api', relation: 'consumes' },
  { id: 'e12', source: 'erp', target: 'order-api', relation: 'exposes' },
  { id: 'e13', source: 'workflow', target: 'approval-event', relation: 'publishes' },
  { id: 'e14', source: 'erp', target: 'order-event', relation: 'publishes' },
  { id: 'e15', source: 'accounting', target: 'posting-event', relation: 'publishes' },

  { id: 'e16', source: 'customer-api', target: 'customer', relation: 'reads' },
  { id: 'e17', source: 'order-api', target: 'sales-order', relation: 'creates' },
  { id: 'e18', source: 'order-api', target: 'purchase-order', relation: 'creates' },
  { id: 'e19', source: 'order-event', target: 'inventory', relation: 'causes' },
  { id: 'e20', source: 'posting-event', target: 'journal', relation: 'creates' },
  { id: 'e21', source: 'approval-event', target: 'sales-order', relation: 'changes state' },
  { id: 'e22', source: 'approval-event', target: 'purchase-order', relation: 'changes state' },

  { id: 'e23', source: 'customer', target: 'postgres', relation: 'persisted in' },
  { id: 'e24', source: 'sales-order', target: 'postgres', relation: 'persisted in' },
  { id: 'e25', source: 'purchase-order', target: 'postgres', relation: 'persisted in' },
  { id: 'e26', source: 'inventory', target: 'postgres', relation: 'persisted in' },
  { id: 'e27', source: 'journal', target: 'postgres', relation: 'persisted in' },
  { id: 'e28', source: 'order-event', target: 'rabbitmq', relation: 'transported by' },
  { id: 'e29', source: 'posting-event', target: 'rabbitmq', relation: 'transported by' },
  { id: 'e30', source: 'erp', target: 'dotnet', relation: 'implemented with' },
  { id: 'e31', source: 'accounting', target: 'dotnet', relation: 'implemented with' },
  { id: 'e32', source: 'crm', target: 'react', relation: 'UI implemented with' },
  { id: 'e33', source: 'erp', target: 'docker', relation: 'deployed as' },
  { id: 'e34', source: 'accounting', target: 'docker', relation: 'deployed as' },
];

export const flows: Record<string, FlowDefinition> = {
  otc: {
    id: 'otc', code: 'BF-SALES-001', name: 'Order-to-Cash',
    description: 'Theo dõi một đơn bán hàng từ nhu cầu khách hàng tới accounting posting.',
    steps: [
      { id: 'otc-1', order: 1, title: 'Request order', lane: 'Customer', laneKind: 'actor', actor: 'Customer', system: 'CRM / Portal', trigger: 'Customer sends order request', inputs: ['Product', 'Quantity', 'Delivery need'], transforms: ['Normalize request context'], outputs: ['Order request'], mutations: ['No enterprise transaction yet'], state: 'Request: New' },
      { id: 'otc-2', order: 2, title: 'Create sales order', lane: 'Sales Staff', laneKind: 'actor', actor: 'Sales Staff', system: 'ERP Core', trigger: 'Manual entry on Sales Order screen', inputs: ['Customer code', 'Product', 'Quantity', 'Unit price'], transforms: ['Resolve master data', 'Calculate line amount', 'Calculate tax', 'Generate order number'], outputs: ['SalesOrder', 'SalesOrderLine'], mutations: ['INSERT sales_order', 'INSERT sales_order_line'], state: 'SalesOrder: Draft → PendingApproval' },
      { id: 'otc-3', order: 3, title: 'Approve order', lane: 'Sales Manager', laneKind: 'actor', actor: 'Sales Manager', system: 'Workflow + ERP Core', trigger: 'Approval task', inputs: ['SalesOrder', 'Approval policy'], transforms: ['Check authority', 'Evaluate approval decision'], outputs: ['ApprovalRecord', 'SalesOrderApproved'], mutations: ['UPDATE approval_record', 'UPDATE sales_order.status'], state: 'PendingApproval → Approved' },
      { id: 'otc-4', order: 4, title: 'Confirm order', lane: 'ERP Core', laneKind: 'system', actor: 'System', system: 'ERP Core', trigger: 'Approved order becomes executable', inputs: ['Approved SalesOrder', 'Customer status', 'Inventory availability'], transforms: ['Validate executable conditions', 'Reserve inventory'], outputs: ['SalesOrderConfirmed event'], mutations: ['UPDATE sales_order.status', 'CREATE inventory reservation'], state: 'Approved → Confirmed' },
      { id: 'otc-5', order: 5, title: 'Ship goods', lane: 'Warehouse Staff', laneKind: 'actor', actor: 'Warehouse Staff', system: 'WMS', trigger: 'Confirmed order / picking task', inputs: ['SalesOrderConfirmed', 'Reserved inventory'], transforms: ['Pick', 'Pack', 'Post goods issue'], outputs: ['Shipment', 'InventoryMovement'], mutations: ['INSERT shipment', 'INSERT inventory_movement'], state: 'Confirmed → Delivered' },
      { id: 'otc-6', order: 6, title: 'Post invoice', lane: 'Accounting', laneKind: 'system', actor: 'System / Accountant', system: 'Accounting', trigger: 'Delivery completed', inputs: ['Shipment', 'SalesOrder', 'Customer'], transforms: ['Create invoice', 'Calculate AR', 'Generate debit/credit lines'], outputs: ['Invoice', 'JournalEntry'], mutations: ['INSERT invoice', 'INSERT journal_entry'], state: 'Delivered → Invoiced' },
    ],
  },
  p2p: {
    id: 'p2p', code: 'BF-P2P-001', name: 'Procure-to-Pay',
    description: 'Theo dõi nhu cầu mua hàng tới nhận hàng và ghi nhận công nợ nhà cung cấp.',
    steps: [
      { id: 'p2p-1', order: 1, title: 'Create purchase request', lane: 'Requester', laneKind: 'actor', actor: 'Employee', system: 'ERP Core', trigger: 'Business need', inputs: ['Material', 'Quantity', 'Required date'], transforms: ['Validate request', 'Estimate amount'], outputs: ['PurchaseRequest'], mutations: ['INSERT purchase_request'], state: 'Request: Draft → Submitted' },
      { id: 'p2p-2', order: 2, title: 'Approve request', lane: 'Manager', laneKind: 'actor', actor: 'Manager', system: 'Workflow', trigger: 'Approval task', inputs: ['PurchaseRequest', 'Budget policy'], transforms: ['Check authority', 'Check policy'], outputs: ['ApprovalRecord'], mutations: ['UPDATE purchase_request.status'], state: 'Submitted → Approved' },
      { id: 'p2p-3', order: 3, title: 'Create purchase order', lane: 'Buyer', laneKind: 'actor', actor: 'Purchasing Staff', system: 'ERP Core', trigger: 'Approved request', inputs: ['Approved request', 'Supplier', 'Price'], transforms: ['Select supplier', 'Generate PO number'], outputs: ['PurchaseOrder'], mutations: ['INSERT purchase_order', 'INSERT purchase_order_line'], state: 'PO: Draft → Released' },
      { id: 'p2p-4', order: 4, title: 'Receive goods', lane: 'Warehouse Staff', laneKind: 'actor', actor: 'Warehouse Staff', system: 'WMS', trigger: 'Supplier delivery', inputs: ['PurchaseOrder', 'Received quantity'], transforms: ['Match PO', 'Post goods receipt'], outputs: ['GoodsReceipt', 'InventoryMovement'], mutations: ['INSERT goods_receipt', 'INSERT inventory_movement'], state: 'PO: Released → Received' },
      { id: 'p2p-5', order: 5, title: 'Post vendor invoice', lane: 'Accounting', laneKind: 'system', actor: 'Accountant / System', system: 'Accounting', trigger: 'Vendor invoice received', inputs: ['PurchaseOrder', 'GoodsReceipt', 'Vendor invoice'], transforms: ['3-way match', 'Create AP', 'Generate journal lines'], outputs: ['VendorInvoice', 'JournalEntry'], mutations: ['INSERT vendor_invoice', 'INSERT journal_entry'], state: 'Invoice: Received → Posted' },
    ],
  },
  r2r: {
    id: 'r2r', code: 'BF-FIN-001', name: 'Record-to-Report',
    description: 'Từ các accounting transactions đến khóa sổ và báo cáo tài chính.',
    steps: [
      { id: 'r2r-1', order: 1, title: 'Collect postings', lane: 'Accounting', laneKind: 'system', actor: 'System', system: 'Accounting', trigger: 'Operational events', inputs: ['AR postings', 'AP postings', 'Inventory postings'], transforms: ['Validate journal rules', 'Post to ledgers'], outputs: ['JournalEntry', 'Ledger balances'], mutations: ['INSERT journal_entry', 'UPDATE ledger_balance'], state: 'Period: Open' },
      { id: 'r2r-2', order: 2, title: 'Reconcile', lane: 'Accountant', laneKind: 'actor', actor: 'Accountant', system: 'Accounting', trigger: 'Month-end checklist', inputs: ['Ledger balances', 'Sub-ledger balances'], transforms: ['Compare balances', 'Investigate differences'], outputs: ['Reconciliation result'], mutations: ['Adjustment journals when required'], state: 'Period: Open → Reconciling' },
      { id: 'r2r-3', order: 3, title: 'Close period', lane: 'Chief Accountant', laneKind: 'actor', actor: 'Chief Accountant', system: 'Accounting', trigger: 'All close checks passed', inputs: ['Reconciliation result', 'Close checklist'], transforms: ['Lock posting period', 'Calculate closing balances'], outputs: ['Closed period snapshot'], mutations: ['UPDATE accounting_period'], state: 'Reconciling → Closed' },
      { id: 'r2r-4', order: 4, title: 'Generate reports', lane: 'Accounting', laneKind: 'system', actor: 'System', system: 'Accounting / BI', trigger: 'Period closed', inputs: ['Closed ledger balances'], transforms: ['Aggregate by account', 'Map financial statement lines'], outputs: ['Balance Sheet', 'Income Statement'], mutations: ['CREATE report snapshot'], state: 'Report: Generated' },
    ],
  },
};
