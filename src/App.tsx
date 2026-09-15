import { useEffect, useMemo, useState } from 'react';
import {
  eaEdges,
  eaNodes,
  flows,
  layerMeta,
  type EaNode,
  type FlowDefinition,
  type FlowStep,
  type LayerId,
} from './data/eaModel';

const layerOrder: LayerId[] = ['business', 'application', 'integration', 'data', 'technology'];

type Position = { x: number; y: number };
type FlowMode = 'timeline' | 'data';

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('otc');
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);

  const positions = useMemo(() => {
    const map = new Map<string, Position>();
    const left = 200;
    const width = 930;

    layerOrder.forEach((layer, layerIndex) => {
      const nodes = eaNodes.filter((node) => node.layer === layer);
      nodes.forEach((node, index) => {
        const slot = width / nodes.length;
        map.set(node.id, {
          x: left + slot * index + slot / 2,
          y: 82 + layerIndex * 138,
        });
      });
    });

    return map;
  }, []);

  const selectedNode = eaNodes.find((node) => node.id === selectedNodeId) ?? eaNodes[0];
  const relatedEdges = eaEdges.filter(
    (edge) => edge.source === selectedNodeId || edge.target === selectedNodeId,
  );
  const relatedNodeIds = new Set(
    relatedEdges.flatMap((edge) => [edge.source, edge.target]),
  );

  if (activeFlowId) {
    return (
      <FlowExplorer
        flow={flows[activeFlowId]}
        onBack={() => setActiveFlowId(null)}
        onChangeFlow={setActiveFlowId}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">ENTERPRISE ATLAS / DEMO</div>
          <h1>Enterprise Architecture Explorer</h1>
          <p>
            Một EA model duy nhất, được nhìn xuyên từ business flow xuống system, integration,
            data và technology.
          </p>
        </div>
        <div className="topbar-badge">Frontend-only metadata demo</div>
      </header>

      <main className="overview-layout">
        <section className="canvas-panel">
          <div className="panel-toolbar">
            <div>
              <strong>Layered EA Graph</strong>
              <span>Click node để focus quan hệ. Business flow có thể drill-down.</span>
            </div>
            <button className="secondary-button" onClick={() => setSelectedNodeId('otc')}>
              Reset focus
            </button>
          </div>

          <div className="graph-scroll">
            <svg
              className="ea-graph"
              viewBox="0 0 1180 720"
              role="img"
              aria-label="Layered enterprise architecture graph"
            >
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" className="arrow-head" />
                </marker>
              </defs>

              {layerOrder.map((layer, index) => {
                const y = 24 + index * 138;
                return (
                  <g key={layer}>
                    <rect className={`layer-band layer-${layer}`} x="12" y={y} width="1150" height="112" rx="18" />
                    <text className="layer-title" x="32" y={y + 34}>{layerMeta[layer].label}</text>
                    <text className="layer-description" x="32" y={y + 54}>{layerMeta[layer].description}</text>
                  </g>
                );
              })}

              <g className="edge-layer">
                {eaEdges.map((edge) => {
                  const source = positions.get(edge.source)!;
                  const target = positions.get(edge.target)!;
                  const active = edge.source === selectedNodeId || edge.target === selectedNodeId;
                  const muted = !active && selectedNodeId.length > 0;
                  const sourceNode = eaNodes.find((node) => node.id === edge.source)!;
                  const targetNode = eaNodes.find((node) => node.id === edge.target)!;
                  const sourceYOffset = sourceNode.layer === targetNode.layer ? 0 : 27;
                  const targetYOffset = sourceNode.layer === targetNode.layer ? 0 : -27;
                  const midY = (source.y + target.y) / 2;
                  const path = sourceNode.layer === targetNode.layer
                    ? `M ${source.x + 74} ${source.y} C ${(source.x + target.x) / 2} ${source.y - 28}, ${(source.x + target.x) / 2} ${target.y - 28}, ${target.x - 74} ${target.y}`
                    : `M ${source.x} ${source.y + sourceYOffset} C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y + targetYOffset}`;

                  return (
                    <path
                      key={edge.id}
                      d={path}
                      className={`graph-edge ${active ? 'active' : ''} ${muted ? 'muted' : ''}`}
                      markerEnd="url(#arrow)"
                    >
                      <title>{edge.relation}</title>
                    </path>
                  );
                })}
              </g>

              <g className="node-layer">
                {eaNodes.map((node) => {
                  const position = positions.get(node.id)!;
                  const selected = node.id === selectedNodeId;
                  const muted = !selected && !relatedNodeIds.has(node.id);
                  return (
                    <g
                      key={node.id}
                      className={`graph-node node-${node.layer} ${selected ? 'selected' : ''} ${muted ? 'muted' : ''}`}
                      transform={`translate(${position.x}, ${position.y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${node.label}, ${node.subtitle}`}
                      onClick={() => setSelectedNodeId(node.id)}
                      onDoubleClick={() => node.flowId && setActiveFlowId(node.flowId)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedNodeId(node.id);
                        }
                      }}
                    >
                      <rect x="-74" y="-28" width="148" height="56" rx="12" />
                      <text className="node-label" textAnchor="middle" y="-3">{node.label}</text>
                      <text className="node-subtitle" textAnchor="middle" y="15">{node.subtitle}</text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </section>

        <Inspector
          node={selectedNode}
          relatedEdges={relatedEdges.map((edge) => ({
            relation: edge.relation,
            node: eaNodes.find((candidate) => candidate.id === (edge.source === selectedNodeId ? edge.target : edge.source))!,
          }))}
          onSelectNode={setSelectedNodeId}
          onOpenFlow={(flowId) => setActiveFlowId(flowId)}
        />
      </main>
    </div>
  );
}

function Inspector({
  node,
  relatedEdges,
  onSelectNode,
  onOpenFlow,
}: {
  node: EaNode;
  relatedEdges: { relation: string; node: EaNode }[];
  onSelectNode: (id: string) => void;
  onOpenFlow: (flowId: string) => void;
}) {
  return (
    <aside className="inspector-panel">
      <div className={`layer-pill pill-${node.layer}`}>{layerMeta[node.layer].label}</div>
      <h2>{node.label}</h2>
      <div className="mono-code">{node.subtitle}</div>
      <p>{node.description}</p>

      {node.flowId && (
        <button className="primary-button full-width" onClick={() => onOpenFlow(node.flowId!)}>
          Khám phá flow theo thời gian →
        </button>
      )}

      <div className="inspector-section">
        <h3>Quan hệ trực tiếp</h3>
        <div className="relation-list">
          {relatedEdges.map(({ relation, node: relatedNode }) => (
            <button key={`${relation}-${relatedNode.id}`} onClick={() => onSelectNode(relatedNode.id)}>
              <span>{relation}</span>
              <strong>{relatedNode.label}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="inspector-note">
        <strong>Ý tưởng demo</strong>
        <span>
          Sơ đồ không phải ảnh tĩnh. Node và relation được sinh từ metadata; chọn một node sẽ làm nổi bật dependency liên quan.
        </span>
      </div>
    </aside>
  );
}

function FlowExplorer({
  flow,
  onBack,
  onChangeFlow,
}: {
  flow: FlowDefinition;
  onBack: () => void;
  onChangeFlow: (flowId: string) => void;
}) {
  const [mode, setMode] = useState<FlowMode>('timeline');
  const [activeStepId, setActiveStepId] = useState(flow.steps[0].id);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setActiveStepId(flow.steps[0].id);
    setPlaying(false);
  }, [flow]);

  const activeStep = flow.steps.find((step) => step.id === activeStepId) ?? flow.steps[0];
  const currentIndex = flow.steps.findIndex((step) => step.id === activeStep.id);

  useEffect(() => {
    if (!playing) return;
    if (currentIndex >= flow.steps.length - 1) {
      setPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveStepId(flow.steps[currentIndex + 1].id);
    }, 1250);

    return () => window.clearTimeout(timer);
  }, [playing, currentIndex, flow.steps]);

  const lanes = Array.from(new Set(flow.steps.map((step) => step.lane)));

  const startPlayback = () => {
    if (currentIndex >= flow.steps.length - 1) {
      setActiveStepId(flow.steps[0].id);
    }
    setPlaying(true);
  };

  return (
    <div className="app-shell">
      <header className="flow-header">
        <div className="breadcrumb-row">
          <button className="text-button" onClick={onBack}>← Enterprise Map</button>
          <span>/</span>
          <span>{flow.code}</span>
        </div>
        <div className="flow-title-row">
          <div>
            <div className="eyebrow">BUSINESS FLOW EXPLORER</div>
            <h1>{flow.name}</h1>
            <p>{flow.description}</p>
          </div>
          <select value={flow.id} onChange={(event) => onChangeFlow(event.target.value)} aria-label="Chọn flow">
            {Object.values(flows).map((candidate) => (
              <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="flow-main">
        <div className="flow-toolbar">
          <div className="segmented-control" aria-label="Flow view mode">
            <button className={mode === 'timeline' ? 'active' : ''} onClick={() => setMode('timeline')}>Timeline + lanes</button>
            <button className={mode === 'data' ? 'active' : ''} onClick={() => setMode('data')}>Data journey</button>
          </div>
          <div className="play-controls">
            <button className="secondary-button" onClick={() => playing ? setPlaying(false) : startPlayback()}>
              {playing ? 'Pause' : '▶ Play flow'}
            </button>
            <span>Step {currentIndex + 1}/{flow.steps.length}</span>
          </div>
        </div>

        {mode === 'timeline' ? (
          <TimelineView flow={flow} lanes={lanes} activeStep={activeStep} onSelectStep={setActiveStepId} />
        ) : (
          <DataJourneyView flow={flow} activeStep={activeStep} onSelectStep={setActiveStepId} />
        )}

        <StepInspector step={activeStep} />
      </main>
    </div>
  );
}

function TimelineView({
  flow,
  lanes,
  activeStep,
  onSelectStep,
}: {
  flow: FlowDefinition;
  lanes: string[];
  activeStep: FlowStep;
  onSelectStep: (id: string) => void;
}) {
  const columns = `170px repeat(${flow.steps.length}, minmax(170px, 1fr))`;

  return (
    <section className="timeline-panel">
      <div className="timeline-scroll">
        <div className="timeline-grid" style={{ gridTemplateColumns: columns }}>
          <div className="timeline-corner">Actor / system ↓ &nbsp; Time →</div>
          {flow.steps.map((step) => (
            <div key={`header-${step.id}`} className={`timeline-step-header ${activeStep.id === step.id ? 'active' : ''}`}>
              <span>T{step.order}</span>
              <strong>{step.title}</strong>
            </div>
          ))}

          {lanes.map((lane) => {
            const laneKind = flow.steps.find((step) => step.lane === lane)?.laneKind ?? 'actor';
            return [
              <div key={`${lane}-label`} className="lane-label">
                <span>{laneKind === 'actor' ? 'USER' : 'SYSTEM'}</span>
                <strong>{lane}</strong>
              </div>,
              ...flow.steps.map((step) => (
                <div key={`${lane}-${step.id}`} className="timeline-cell">
                  {step.lane === lane && (
                    <button
                      className={`timeline-step-card ${activeStep.id === step.id ? 'active' : ''}`}
                      onClick={() => onSelectStep(step.id)}
                    >
                      <span>{step.system}</span>
                      <strong>{step.title}</strong>
                      <small>{step.state}</small>
                    </button>
                  )}
                </div>
              )),
            ];
          })}
        </div>
      </div>
    </section>
  );
}

function DataJourneyView({
  flow,
  activeStep,
  onSelectStep,
}: {
  flow: FlowDefinition;
  activeStep: FlowStep;
  onSelectStep: (id: string) => void;
}) {
  return (
    <section className="data-journey-panel">
      <div className="data-journey-scroll">
        {flow.steps.map((step, index) => (
          <div className="journey-segment" key={step.id}>
            <button
              className={`journey-card ${activeStep.id === step.id ? 'active' : ''}`}
              onClick={() => onSelectStep(step.id)}
            >
              <div className="journey-step-no">T{step.order}</div>
              <h3>{step.title}</h3>
              <div className="journey-stage input-stage">
                <span>INPUT</span>
                <p>{step.inputs.join(' · ')}</p>
              </div>
              <div className="journey-arrow">↓</div>
              <div className="journey-stage transform-stage">
                <span>TRANSFORM</span>
                <p>{step.transforms.join(' · ')}</p>
              </div>
              <div className="journey-arrow">↓</div>
              <div className="journey-stage output-stage">
                <span>OUTPUT</span>
                <p>{step.outputs.join(' · ')}</p>
              </div>
            </button>
            {index < flow.steps.length - 1 && <div className="journey-next">→</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function StepInspector({ step }: { step: FlowStep }) {
  return (
    <section className="step-inspector">
      <div className="step-summary">
        <div className="eyebrow">STEP {step.order}</div>
        <h2>{step.title}</h2>
        <div className="step-facts">
          <div><span>Actor</span><strong>{step.actor}</strong></div>
          <div><span>System</span><strong>{step.system}</strong></div>
          <div><span>Trigger</span><strong>{step.trigger}</strong></div>
        </div>
      </div>

      <div className="step-detail-grid">
        <DetailCard title="Input data" items={step.inputs} kind="input" />
        <DetailCard title="Transformation" items={step.transforms} kind="transform" />
        <DetailCard title="Generated output" items={step.outputs} kind="output" />
        <DetailCard title="Persistence / mutation" items={step.mutations} kind="mutation" />
      </div>

      {step.state && (
        <div className="state-strip">
          <span>STATE TRANSITION</span>
          <strong>{step.state}</strong>
        </div>
      )}
    </section>
  );
}

function DetailCard({ title, items, kind }: { title: string; items: string[]; kind: string }) {
  return (
    <div className={`detail-card detail-${kind}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export default App;
