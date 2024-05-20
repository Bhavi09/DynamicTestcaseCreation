import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import CreateNode from './nodes/createNode.js';
import Modal from 'react-modal';
import './text-updater-node.css';
import 'reactflow/dist/style.css';

Modal.setAppElement('#root'); // This is important for accessibility

const initialNodes = [];
const initialEdges = [];
const nodeTypes = { textUpdater: CreateNode };

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [submittedData, setSubmittedData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bodyId, setBodyId] = useState('');
  const [bodyValue, setBodyValue] = useState('{}');
  const [bodyData, setBodyData] = useState(new Map());

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSave = () => {
    try {
      const parsedValue = JSON.parse(bodyValue);
      setBodyData((prevData) => new Map(prevData).set(bodyId, parsedValue));
      closeModal();
    } catch (e) {
      alert('Invalid JSON');
    }
  };

  const handleAddBody = () => {
    openModal();
  };


  const createNode = () => {
    const newNodeId = String(nodes.length + 1);
    const newNode = {
      id: newNodeId,
      type: 'textUpdater',
      position: {
        x: window.innerWidth / 2 - 150, // Centering the node horizontally
        y: window.innerHeight / 2 - 50 // Centering the node vertically
      },
      data: {
        value: {
          nodeType: "Create"
        }
      }
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };


  const handleSubmit = () => {
    const nodeLabels = nodes.map(node => {
      if (node.type === 'textUpdater') {
        return node.data.value;
      }
      return node.data.label;
    });
    const jsonData = {
      NodeData: nodeLabels
    };
    setSubmittedData(jsonData);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '75vw', height: '75vh' }}>
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
      <div style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button style={{ padding: '10px 20px', fontSize: '16px' }} onClick={handleAddBody}>Add Body</button>
        <button style={{ padding: '10px 20px', fontSize: '16px' }} onClick={createNode}>Add Node</button>
        <button style={{ padding: '10px 20px', fontSize: '16px' }} onClick={handleSubmit}>Submit</button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Body"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <h2>Add Body</h2>
        <form>
          <div>
            <label htmlFor="bodyId">Value Id:</label>
            <input
              id="bodyId"
              type="text"
              value={bodyId}
              onChange={(e) => setBodyId(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bodyValue">Value:</label>
            <textarea
              id="bodyValue"
              value={bodyValue}
              onChange={(e) => setBodyValue(e.target.value)}
              style={{ width: '100%', height: '100px' }}
            />
          </div>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
}
