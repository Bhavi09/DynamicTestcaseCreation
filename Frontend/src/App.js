import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  removeElements,
} from 'reactflow';
import CreateNode from './nodes/createNode.js';
import DeleteNode from './nodes/deleteNode.js';
import Modal from 'react-modal';
import './text-updater-node.css';
import 'reactflow/dist/style.css';

Modal.setAppElement('#root');

const initialNodes = [];
const initialEdges = [];
const nodeTypes = { CreateNode: CreateNode, DeleteNode: DeleteNode };

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [submittedData, setSubmittedData] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [bodyId, setBodyId] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddBody = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    const newNodeId = String(nodes.length + 1);
    const lastNode = nodes[nodes.length - 1];
    const newNode = {
      id: newNodeId,
      type: 'CreateNode',
      position: {
        x: lastNode ? lastNode.position.x : window.innerWidth / 2,
        y: lastNode ? lastNode.position.y + 140 : window.innerHeight / 2
      },
      data: {
        value: {
          nodeType: "Create",
          bodyId,
          bodyValue
        },
        onDelete: () => handleDeleteNode(newNodeId)
      }
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsOpen(false);
    setBodyId('');
    setBodyValue('');
  };

  const AddNode = (type) => {
    const newNodeId = String(nodes.length + 1);
    const lastNode = nodes[nodes.length - 1];
    const newNode = {
      id: newNodeId,
      type:`${type}Node`,
      position: {
        x: lastNode ? lastNode.position.x : window.innerWidth / 2,
        y: lastNode ? lastNode.position.y + 100 : window.innerHeight / 2
      },
      data: {
        value: {
          nodeType: type
        },
        onDelete: () => handleDeleteNode(newNodeId)
      }
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsDropdownOpen(false);
  };


 

  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges],
  );

  const topologicalSort = (nodes, edges) => {
    const adjList = new Map();
    const inDegree = new Map();

    nodes.forEach((node) => {
      adjList.set(node.id, []);
      inDegree.set(node.id, 0);
    });
    console.log(inDegree);

    edges.forEach((edge) => {
      adjList.get(edge.source).push(edge.target);
      inDegree.set(edge.target, inDegree.get(edge.target) + 1);
    });

    const queue = [];
    inDegree.forEach((value, key) => {
      console.log({key,value});
      if (value === 0) {
        queue.push(key);
      }
    });

    const sortedNodes = [];
    while (queue.length > 0) {
      const node = queue.shift();
      sortedNodes.push(node);

      adjList.get(node).forEach((neighbor) => {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }

    return sortedNodes.map((nodeId) => nodes.find((node) => node.id === nodeId));
  };

  const handleSubmit = () => {
    const connectedNodes = topologicalSort(nodes, edges);
    const nodeLabels = connectedNodes.map((node) => {
      return node.data.value;
    });

    const jsonData = {
      NodeData: nodeLabels,
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
        <div style={{ position: 'relative' }}>
          <button
            style={{ padding: '10px 20px', fontSize: '16px' }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Add Node
          </button>
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '0',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              zIndex: 10
            }}>
              <button onClick={() => AddNode('Create')} style={{ display: 'block', margin: '5px 0' }}>Create</button>
              <button onClick={() => AddNode('Delete')} style={{ display: 'block', margin: '5px 0' }}>Delete</button>
            </div>
          )}
        </div>
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
            transform: 'translate(-50%, -50%)',
            width: '400px',
            padding: '20px',
          },
        }}
      >
        <h2>Add Body</h2>
        <form>
          <label>
            Value Id:
            <input
              type="text"
              value={bodyId}
              onChange={(e) => setBodyId(e.target.value)}
              style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
            />
          </label>
          <label>
            Value:
            <textarea
              value={bodyValue}
              onChange={(e) => setBodyValue(e.target.value)}
              rows="10"
              style={{ width: '100%', padding: '5px' }}
            />
          </label>
        </form>
        <button onClick={handleSave} style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}>Save</button>
        <button onClick={closeModal} style={{ marginTop: '10px', marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}>Close</button>
      </Modal>
    </div>
  );
}
