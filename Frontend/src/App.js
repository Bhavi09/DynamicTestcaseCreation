import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  Background,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSelector } from "react-redux";

import Button from "@mui/material/Button";
import { FormControl, InputLabel, MenuItem, Select,Autocomplete, TextField } from "@mui/material";
import "./App.css";
import { notification } from "antd";
import axios from "axios";
import { saveAs } from "file-saver";

import CreateNode from "./nodes/createNode.js";
import DeleteNode from "./nodes/deleteNode.js";
import OutputNode from "./nodes/outputNode.js";
import SearchNode from "./nodes/searchNode.js";
import VerifyNode from "./nodes/verifyNode.js";
import GetByIdNode from "./nodes/getByIdNode";
import LookupNode from "./nodes/lookupNode";
import GetHistoryByIdNode from "./nodes/getHistoryById";
import TranslateNode from "./nodes/translateNode";
import ValidateCodeNode from "./nodes/validateCodeNode";
import UpdateNode from "./nodes/updateNode";
import LoopNode from "./nodes/loopNode";

import AddResources from "./components/AddResources.js";
import EditResources from "./components/editResources.js";


const initialNodes = [];
const initialEdges = [];

const testcaseDescription = {
  componentName: "Client Registry",
  specificationName: "CRF1",
  testcaseName: "Check patient creation and deletion",
  description: "Check patient creation and deletion",
  testCaseNumber: "1",
};


const nodeTypes = {
  CreateNode: CreateNode,
  DeleteNode: DeleteNode,
  SearchNode: SearchNode,
  VerifyNode: VerifyNode,
  GetByIdNode: GetByIdNode,
  OutputNode: OutputNode,
  LookupNode: LookupNode,
  GetHistoryByIdNode: GetHistoryByIdNode,
  TranslateNode: TranslateNode,
  ValidateCodeNode: ValidateCodeNode,
  UpdateNode: UpdateNode,
  LoopNode: LoopNode
};

export default function App() {
  const bodyValuesFromStore = useSelector(
    (state) => state.valueIdReducer.bodyValues
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef(null);
  const [selectedNodeType, setSelectedNodeType] = useState("");
  const [editResourceDialogOpen, setEditResourceDialogOpen] = useState(false);
  const edgeUpdateSuccessful = useRef(true);
  const [openDialogBox, setOpenDialogBox] = useState(false);

  // Managed Edge

  const edgeArrowSize = 10;

  const CustomEdge = (edgeProps) => (
    <g className="react-flow__edge">
      <path className="react-flow__edge-path" d={edgeProps.path} />
      <marker
        id="arrowhead"
        markerWidth={edgeArrowSize}
        markerHeight={edgeArrowSize}
        refX={edgeArrowSize / 2}
        refY={edgeArrowSize / 2}
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path
          d={`M0,0 L${edgeArrowSize},${
            edgeArrowSize / 2
          } L0,${edgeArrowSize} L${edgeArrowSize / 2},${edgeArrowSize / 2} Z`}
          fill="black"
        />
      </marker>
    </g>
  );

  const edgeTypes = {
    custom: CustomEdge,
  };

  const onConnect = useCallback(
    (params) => {
      const { source, sourceHandle, target, targetHandle } = params;

      // Custom logic to allow only specific handle connections
      if (
        (sourceHandle === 'bottom' && targetHandle === 'right-bottom') ||
        (sourceHandle === 'bottom' && targetHandle === 'top') ||
        // Add other allowed connections here if needed
        true
      ) {
        setEdges((eds) =>
          addEdge({ ...params, markerEnd: 'url(#arrowhead)' }, eds)
        );
      }
    },
    [setEdges]
  );  

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) =>
      updateEdge(
        oldEdge,
        { ...newConnection, markerEnd: "url(#arrowhead)" },
        els
      )
    );
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
      ? { x: previousNode.position.x, y: previousNode.position.y + 500 }
      : {
          x: reactFlowBounds.width / 2 - 75,
          y: reactFlowBounds.height / 2 - 50,
        };

    const newNode = {
      id: newNodeId,
      type: type,
      position: newPosition,
      data: {
        value: {
          nodeType: String(type).replace(/Node$/,''),
        },
        onDelete: () => handleDeleteNode(newNodeId),
      },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setSelectedNodeType("");
  };

const handleNodeSelect = (event, newValue) => {
  if (newValue) {
    const selectedType = newValue;
    setSelectedNodeType(selectedType);
    AddNode(selectedType);
  }
};

  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  // Submit data

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

    return sortedNodes.map((nodeId) =>
      nodes.find((node) => node.id === nodeId)
    );
  };

  let listOfValueIds = useSelector((state) => state.valueIdReducer.valueIds);

  const buildNodeJson = (nodeId, visited) => {
    visited.add(nodeId);
  
    let connectedEdge = edges.find((edge) => edge.source === nodeId && edge.sourceHandle === 'right-center');
    const nodeJson = [];

    while(connectedEdge)
    {
      const targetId = connectedEdge.target;
        if (!visited.has(targetId)) {
        const node = nodes.find((n) => n.id === targetId);
        const nodeData = {
          nodeType: node.data.label,
          ...node.data.value,
        };
        const childNodeJson = buildNodeJson(targetId, visited);
        if (childNodeJson.length > 0) {
          nodeData.nodeJson = childNodeJson;
        }
        nodeJson.push(nodeData);
        connectedEdge = edges.find((edge) => edge.source === node.id && !visited.has(edge.target));

    }
  }
    return nodeJson;
  };
  

  const handleSubmit = () => {
    const visited = new Set();
  
    const connectedNodes = topologicalSort(nodes, edges).map((node) => {
      return {
        id: node.id,
        nodeType: node.data.label,
        ...node.data.value,
      };
    });
  
    const bodies = [];
    for (let i = 0; i < listOfValueIds.length; i++) {
      bodies.push({
        valueId: listOfValueIds[i],
        value: JSON.parse(bodyValuesFromStore[listOfValueIds[i]].resource),
      });
    }
  
    const jsonBody = [testcaseDescription, { bodies: bodies }];
  
    connectedNodes.forEach((node) => {
      if (!visited.has(node.id)) {
        if (node.nodeType === 'Loop') {
          const loopNode = {
            ...node,
            nodeJson: buildNodeJson(node.id, visited),
          };
          delete loopNode.id;
          jsonBody.push(loopNode);
        } else {
          delete node.id;
          jsonBody.push(node);
        }
        visited.add(node.id);
      }
    });
    console.log("Nodes....");
    console.log(nodes);
    console.log("Edges...");
    console.log(edges);
    // console.log(jsonBody);
    postData(jsonBody);
  };
  


  const postData = async (jsonBody) => {

  
    const url = "http://localhost:8080/generateTestcase";
    const urlEncodedBody = encodeURIComponent(JSON.stringify(jsonBody));
    const payload = { testcaseNodes: urlEncodedBody };
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/zip" });
      saveAs(blob, "testcase.zip");
      notification.success({
        message: "Success",
        description: "Zip file has been created and downloaded successfully",
        placement: "top",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to create the zip file",
        placement: "top",
      });
    }
  };

  const handleSave = ()=>
  {
    const flow = {
      id:testcaseDescription.specificationName+"-"+testcaseDescription.testCaseNumber,
      componentName: testcaseDescription.componentName,
      specificationName: testcaseDescription.specificationName,
      testcaseName: testcaseDescription.testcaseName,
      description: testcaseDescription.description,
      testCaseNumber: testcaseDescription.testCaseNumber,
      nodes: nodes.map(node => ({
        nodeId: node.id,
        nodeType: node.type,
        positionX: node.position.x,
        positionY: node.position.y,
        data: node.data ? Object.values(node.data) : [],
      })),
      edges: edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
    };
    console.log(flow);
    saveFlow(flow);
  }

  const saveFlow = async (flow) => {
    try {
      const response = await axios.post('http://localhost:8080/api/flows', flow, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      notification.success({
        message: 'Success',
        description: 'Flow has been saved successfully',
        placement: 'top',
      });
      return response.data;
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to save the flow',
        placement: 'top',
      });
    }
  };

  const fetchFlow = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/flows/CRF1-1');
      const flow = response.data;
      console.log("Fetched flow");
      console.log(flow);
      // Transform fetched flow to nodes and edges format
      const fetchedNodes = flow.nodes.map((node) => ({
        id: node.nodeId,
        type: node.nodeType,
        position: { x: node.positionX, y: node.positionY },
        data: {
          value: {
            ...node.data[0]
          },

          onDelete: () => handleDeleteNode(node.nodeId),
        },
      }));

      const fetchedEdges = flow.edges.map((edge) => ({
        id: `reactflow__edge-${edge.source}-${edge.sourceHandle}-${edge.target}-${edge.targetHandle}`,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        markerEnd: 'url(#arrowhead)',
      }));

      setNodes(fetchedNodes);
      setEdges(fetchedEdges);
    } catch (error) {
      console.error('Failed to fetch flow', error);
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  };

  useEffect(() => {
    fetchFlow();
  }, []);


  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 7 + 8, // 5 items * item height (48px) + padding (8px)
        width: 250,
      },
    },
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div ref={reactFlowWrapper} style={{ width: "75vw", height: "100vh" }}>

        {/* Viewport */}
        <ReactFlow
          className="reactflow-wrapper"
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          snapToGrid
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Background color="#1976d2" variant={BackgroundVariant.Dots} />
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>


     {/* sidebar */}
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          position: "relative",
        }}
      >
        <Button
          variant="contained"
          style={{ padding: "10px 20px", fontSize: "16px" }}
          onClick={() => {
            setOpenDialogBox(true);
          }}
        >
          Add Resource
        </Button>

        <Button
          variant="contained"
          style={{ padding: "10px 20px", fontSize: "16px" }}
          onClick={() => {
            setEditResourceDialogOpen(true);
          }}
        >
          Edit Resources
        </Button>

        <div style={{ position: "relative", margin: "20px 0" }}>
  <Autocomplete
    id="operation-select"
    options={Object.keys(nodeTypes)}
    getOptionLabel={(option) => option.replace(/Node$/, '')}
    value={selectedNodeType}
    onChange={(event, newValue) => {
      setSelectedNodeType(newValue);
      if (newValue) {
        AddNode(newValue);
      }
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Select Operation"
        variant="filled"
        style={{ width: 200 }}
      />
    )}
    renderOption={(props, option) => (
      <MenuItem {...props} value={option} style={{ display: "block", margin: "5px 0" }}>
        {option.replace(/Node$/, '')}
      </MenuItem>
    )}
    sx={{ minWidth: 200 }}
  />
</div>

<Button
    variant="contained"
    style={{
      padding: "10px 20px",
      fontSize: "16px",
      marginTop: "auto",
    }}
    onClick={handleSave}
  >
    Save
  </Button>
  <Button
    variant="contained"
    style={{
      padding: "10px 20px",
      fontSize: "16px",
      marginTop: "10px",
      marginBottom: "30px"
    }}
    onClick={handleSubmit}
  >
    Submit
  </Button>
      </div>

      {/* Dialog box */}

      <AddResources
        openDialogBox={openDialogBox}
        setOpenDialogBox={setOpenDialogBox}
      />
      <EditResources
        editResourceDialogOpen={editResourceDialogOpen}
        setEditResourceDialogOpen={setEditResourceDialogOpen}
      />
    </div>
  );
}
