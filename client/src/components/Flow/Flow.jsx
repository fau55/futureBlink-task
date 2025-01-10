import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

function CustomNode({ data }) {
  return <div style={{ padding: '10px', border: '1px solid #777', borderRadius: '5px' }}>{data.label}</div>;
}

const nodeTypes = { custom: CustomNode };

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (label) => {
    setNodes((nds) => [
      ...nds,
      { id: `${nds.length + 1}`, type: 'custom', position: { x: Math.random() * 250, y: Math.random() * 250 }, data: { label } }
    ]);
  };

  useEffect(() => {
    console.log("Saving flowchart data", { nodes, edges });
  }, [nodes, edges]);

  return (
    <div>
      <div>
        <button onClick={() => addNode('Cold Email')}>Add Cold Email</button>
        <button onClick={() => addNode('Wait/Delay')}>Add Wait/Delay</button>
        <button onClick={() => addNode('Lead Source')}>Add Lead Source</button>
      </div>
      <div style={{ width: "100vw", height: "70vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
