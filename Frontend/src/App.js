import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
 updateEdge
} from 'reactflow';
import Button from '@mui/material/Button';
import CreateNode from './nodes/createNode.js';
import DeleteNode from './nodes/deleteNode.js';
import Modal from 'react-modal';
import './text-updater-node.css';
import 'reactflow/dist/style.css';
import './dropdown-menu.css';
import { ButtonGroup, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import "./App.css";
import SearchNode from './nodes/searchNode.js';
import VerifyNode from './nodes/verifyNode.js';
import { useDispatch, useSelector } from 'react-redux';
import {addValueId} from "./store/reducers.js"

Modal.setAppElement('#root');

const initialNodes = [];
const initialEdges = [];
let bodyValues = new Map([]);
const testcaseDescription = {
  componentName : '',
  specificationName : "",
    testcaseName: "",
    description: "",
    testCaseNumber: ""
};
const nodeTypes = { CreateNode: CreateNode, DeleteNode: DeleteNode, SearchNode:SearchNode, VerifyNode:VerifyNode };

export default function App() {
  const dispatch = useDispatch();
  const valueIds = useSelector(state => state.valueIds);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [submittedData, setSubmittedData] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [bodyId, setBodyId] = useState('');
  const [bodyValue, setBodyValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [open, setOpen] = useState(false);
  const [jsonError, setJsonError] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState('');
  const edgeUpdateSuccessful = useRef(true);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );


  // Managed Edge
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);




// Manage Node
  const AddNode = (type) => {
    const newNodeId = String(nodes.length + 1);
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const previousNode = nodes[nodes.length - 1];

    const newPosition = previousNode
      ? { x: previousNode.position.x, y: previousNode.position.y + 150 }
      : {
        x: reactFlowBounds.width / 2 - 75,
        y: reactFlowBounds.height / 2 - 50,
      };

    const newNode = {
      id: newNodeId,
      type: `${type}Node`,
      position: newPosition,
      data: {
        value: {
          nodeType: type
        },
        onDelete: () => handleDeleteNode(newNodeId)
      }
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsDropdownOpen(false);
    setSelectedNodeType('');
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


    edges.forEach((edge) => {
      adjList.get(edge.source).push(edge.target);
      inDegree.set(edge.target, inDegree.get(edge.target) + 1);
    });

    const queue = [];
    inDegree.forEach((value, key) => {
      console.log({key, value});
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

  let listOfValueIds = useSelector(state => state.valueIds);

  const handleSubmit = () => {
    const connectedNodes = topologicalSort(nodes, edges);

    const bodies = [];

    for (let i = 0; i < bodyValues.size; i++) {
      bodies.push({
        valueId: listOfValueIds[i],
        value: bodyValues.get(listOfValueIds[i])
      });
    }




    const body = {
      testcaseDescription,
      data: {
        bodies: bodies
      },
      connectedNodes
    };

    const jsonData = connectedNodes.map((node) => {
      return node.data.value;
    });

    setSubmittedData(jsonData);
  };

  const handleJsonChange = (event) => {
    setJsonContent(event.target.value);
  };

  const handleBodySubmit = (event) => {
    event.preventDefault();

    try {
      JSON.parse(jsonContent);
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(formData.entries());
      const resourceId = formJson.resourceId;
      bodyValues.set(resourceId, formJson);
      dispatch(addValueId(resourceId));
      console.log(formJson);
      console.log(resourceId);
      setJsonError(false);
      handleClose();
    } catch (error) {
      setJsonError(true);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setJsonError(false);
  };

  const handleNodeSelect = (event) => {
    const selectedType = event.target.value;
    setSelectedNodeType(selectedType);
    AddNode(selectedType);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div ref={reactFlowWrapper} style={{ width: '75vw', height: '100vh' }}>
        <ReactFlow
          className='reactflow-wrapper'
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          snapToGrid
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
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
        <Button variant="contained" style={{ padding: '10px 20px', fontSize: '16px' }} onClick={handleClickOpen}>Add Body</Button>

        <div style={{ position: 'relative' }}>
          <FormControl variant="filled" style={{ minWidth: 200 }}>
            <InputLabel>Select Node</InputLabel>
            <Select
              id="demo-simple-select"
              style={{ padding: '10px 20px', fontSize: '16px' }}
              value={selectedNodeType}
              label="Select Nodes"
              onChange={handleNodeSelect}
            >
              <MenuItem value="Create" style={{ display: 'block', margin: '5px 0' }}>Create</MenuItem>
              <MenuItem value="Delete" style={{ display: 'block', margin: '5px 0' }}>Delete</MenuItem>
              <MenuItem value="Search" style={{ display: 'block', margin: '5px 0' }}>Search</MenuItem>
              <MenuItem value="Verify" style={{ display: 'block', margin: '5px 0' }}>Verify</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Button variant="contained" style={{ padding: '10px 20px', fontSize: '16px' }} onClick={handleSubmit}>Submit</Button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleBodySubmit,
        }}
      >
        <DialogTitle>Add Resource</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="resourceId"
            name="resourceId"
            label="Resource Id"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="resource"
            name="resource"
            label="Resource"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            onChange={handleJsonChange}
            error={jsonError}
            helperText={jsonError ? "Invalid JSON content" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
