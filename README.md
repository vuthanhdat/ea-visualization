# EA Visualization

Interactive demo để minh họa Enterprise Architecture cho lập trình viên.

Mục tiêu của project không phải tạo các ảnh kiến trúc tĩnh. Toàn bộ UI được render từ một EA metadata model, sau đó tạo ra các góc nhìn khác nhau và cho phép user đi từ business xuống tận physical data.

## Demo hiện tại

### 1. Layered EA Graph

Business Flow → Systems → Integration → Data → Technology.

User click một node để focus quan hệ trực tiếp. Business flow và system có thể drill-down sang view chuyên sâu.

### 2. Business Flow Explorer

Mỗi flow có hai cách nhìn:

- **Timeline + actor/system lanes**: trục ngang là thời gian, trục dọc là user/system.
- **Data Journey**: Input → Transformation → Generated Output theo từng step.

Step Inspector hiển thị actor, system, trigger, DB mutation và state transition.

Demo flows:

- `BF-SALES-001` — Order-to-Cash
- `BF-P2P-001` — Procure-to-Pay
- `BF-FIN-001` — Record-to-Report

### 3. Semantic System Drill-down

`ERP Core` hiện hỗ trợ semantic zoom:

```text
ERP Core
  ↓
Module
  ↓
Screen / API / Event
  ↓
Domain Entity
  ↓
Physical Table
  ↓
Runtime / Database / Message Broker
```

Ví dụ:

```text
ERP Core
  → Sales
  → POST /sales-orders
  → SalesOrder
  → erp.sales_order
  → PostgreSQL
```

Click node để inspect metadata. Double click node có children hoặc dùng nút **Đi sâu** để thay đổi semantic boundary. Breadcrumb cho phép quay lại các level trước.

## Chạy local

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

GitHub Actions chạy type-check + production build trên mỗi push vào `main`.

## Kiến trúc hiện tại

Project hiện tại là **frontend-only**:

```text
EA metadata
    ↓
View model / semantic scope
    ↓
React
    ↓
SVG + HTML visualization
    ↓
Static build (Vite)
```

Metadata chính:

```text
src/data/eaModel.ts
src/data/drilldownModel.ts
```

UI không hard-code từng ảnh. Node, relation, flow step và semantic hierarchy đều được sinh từ metadata.

## Vì sao MVP chưa cần backend?

Với mục tiêu learning/demo, backend chưa tạo thêm nhiều giá trị. Toàn bộ EA model có thể version-control cùng source code và deploy dưới dạng static site như Vercel, GitHub Pages hoặc Cloudflare Pages.

Backend chỉ nên được thêm khi có một trong các nhu cầu sau:

- nhiều người cùng chỉnh sửa EA model qua web;
- RBAC / authentication;
- workflow review/approve architecture changes;
- version history ngoài Git;
- query lượng metadata rất lớn;
- thu thập runtime topology / OpenTelemetry / metrics;
- đồng bộ metadata từ nhiều enterprise systems.

Trước thời điểm đó, Git + TypeScript/JSON metadata đóng vai trò như repository là đủ.

## Hướng phát triển tiếp theo

1. Chuẩn hóa metamodel và tách metadata sang JSON/YAML schema.
2. Bổ sung semantic drill-down cho Accounting, CRM, WMS, IAM và Workflow.
3. Liên kết Flow Step trực tiếp với Screen/API/Event/Entity/Table trong system drill-down.
4. Thêm data lineage xuyên nhiều flow và nhiều system.
5. Thêm filter theo domain, data owner, integration type và technology.
6. Import metadata từ OpenAPI, AsyncAPI và database schema.
7. Export snapshot thành SVG/PNG/PDF khi cần tài liệu tĩnh.

## Tech stack

- React
- TypeScript
- Vite
- SVG + CSS cho visualization

Không có backend và không có database trong demo hiện tại.
