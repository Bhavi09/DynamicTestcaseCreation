import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import TextUpdaterNode from './TextUpdaterNode.js';
import './text-updater-node.css';
import 'reactflow/dist/style.css';
const initialNodes = [];
const initialEdges = [];
const nodeTypes = { textUpdater: TextUpdaterNode };
export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [submittedData, setSubmittedData] = useState(null);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  const handleAddNode = () => {
    const newNodeId = String(nodes.length + 1);
    const newNode = {
      id: newNodeId,
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
      data: { label: newNodeId }
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };
  const createNode = () => {
    const newNodeId = String(nodes.length + 1);
    const newNode = {
      id:newNodeId,
      type:'textUpdater',
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
      data: {
        value:{
          nodeType:"Create"
        }
      }
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    console.log(nodes)
    }
  const handleSubmit = () => {
    console.log(nodes)
    const nodeLabels = nodes.map(node => {
      if(node.type === 'textUpdater')
      {
        return node.data.value;
      }
      return node.data.label;
    });
    const jsonData = {
      NodeData:nodeLabels
    };
    setSubmittedData(jsonData);
  };
  return (
    <div style={{ width: '100vw', height: '75vh' }}>
      <button onClick={handleAddNode}>Add node</button>
      <button onClick={createNode}>Create</button>
      <button onClick={handleSubmit}>Submit</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      {submittedData && (
        <div>
          <h2>Submitted Data</h2>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}