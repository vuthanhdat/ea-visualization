# EA Visualization

Interactive demo để minh họa Enterprise Architecture cho lập trình viên.

Mục tiêu của project không phải tạo các ảnh kiến trúc tĩnh. Toàn bộ UI được render từ một EA metadata model, sau đó tạo ra các góc nhìn khác nhau:

- **Layered EA Graph**: Business Flow → Systems → Integration → Data → Technology.
- **Timeline + actor/system lanes**: xem một business flow theo trục thời gian và người/hệ thống thực hiện.
- **Data Journey**: xem input → transformation → generated output theo từng step.
- **Step Inspector**: xem actor, system, trigger, DB mutation và state transition.

## Demo flows

- `BF-SALES-001` — Order-to-Cash
- `BF-P2P-001` — Procure-to-Pay
- `BF-FIN-001` — Record-to-Report

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

## Kiến trúc hiện tại

Project hiện tại là **frontend-only**:

```text
EA metadata (TypeScript)
        ↓
React view model
        ↓
Layered graph / Timeline / Data journey
        ↓
Static build (Vite)
```

Metadata mẫu nằm tại:

```text
src/data/eaModel.ts
```

UI không hard-code từng ảnh. Node, relation và flow step được sinh từ metadata.

## Vì sao MVP chưa cần backend?

Với mục tiêu learning/demo, backend chưa tạo thêm nhiều giá trị. Toàn bộ EA model có thể version-control cùng source code và deploy dưới dạng static site (Vercel, GitHub Pages, Cloudflare Pages...).

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

1. Tách metadata sang JSON/YAML schema để content và UI độc lập hoàn toàn.
2. Bổ sung semantic zoom: System → Module → API/Event → Entity → Table/Field.
3. Thêm filter theo domain, system, data owner và integration type.
4. Thêm data lineage xuyên nhiều flow.
5. Import metadata từ OpenAPI, AsyncAPI và database schema.
6. Export snapshot thành SVG/PNG/PDF khi cần tài liệu tĩnh.

## Tech stack

- React
- TypeScript
- Vite
- SVG + CSS cho visualization

Không có backend và không có database trong demo hiện tại.
