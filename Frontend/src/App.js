import React, { useCallback, useRef, useState } from "react";
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
import Button from "@mui/material/Button";
import { notification } from "antd";
import axios from "axios";
import CreateNode from "./nodes/createNode.js";
import DeleteNode from "./nodes/deleteNode.js";
import OutputNode from "./nodes/outputNode.js";
import "./text-updater-node.css";
import "reactflow/dist/style.css";
import "./dropdown-menu.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import "./App.css";
import SearchNode from "./nodes/searchNode.js";
import VerifyNode from "./nodes/verifyNode.js";
import ReadNode from "./nodes/readNode.js";
import { useDispatch, useSelector } from "react-redux";
import Slide from "@mui/material/Slide";
import Draggable from "react-draggable";
import Paper from "@mui/material/Paper";
import { saveAs } from "file-saver";
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

const nodesName = ["Create", "Read", "Delete", "Verify", "Search", "Output"];

const nodeTypes = {
  CreateNode: CreateNode,
  DeleteNode: DeleteNode,
  SearchNode: SearchNode,
  VerifyNode: VerifyNode,
  ReadNode: ReadNode,
  OutputNode: OutputNode,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DraggablePaper = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

export default function App() {
  
  const bodyValuesFromStore = useSelector(
    (state) => state.valueIdReducer.bodyValues
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [submittedData, setSubmittedData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, markerEnd: "url(#arrowhead)" }, eds)
      ),
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
      type: `${type}Node`,
      position: newPosition,
      data: {
        value: {
          nodeType: type,
        },
        onDelete: () => handleDeleteNode(newNodeId),
      },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsDropdownOpen(false);
    setSelectedNodeType("");
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

  const handleSubmit = () => {
    const connectedNodes = topologicalSort(nodes, edges).map((node) => {
      console.log(node.data);
      return node.data.value;
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
      jsonBody.push(node);
    });

    // setSubmittedData(jsonBody);
    postData(jsonBody);
  };

  const postData = async (jsonBody) => {
    const url = "http://localhost:8080/generateTestcase";
    const urlEncodedBody = encodeURIComponent(JSON.stringify(jsonBody));
    const payload = `testcaseNodes=${urlEncodedBody}`;
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
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

  const handleNodeSelect = (event) => {
    const selectedType = event.target.value;
    setSelectedNodeType(selectedType);
    AddNode(selectedType);
  };

  const handleEditResourceDialogOpen = () => {
    setEditResourceDialogOpen(true);
  };


  const showAllOperationIds = () => {
    const operationIdsArray = [];
    topologicalSort(nodes, edges).forEach((node) => {
      if (!!node.data.value.operationId) {
        operationIdsArray.push(node.data.value.operationId);
      }
    });
    return operationIdsArray;
  };

  App.showAllOperationIds = showAllOperationIds;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div ref={reactFlowWrapper} style={{ width: "75vw", height: "100vh" }}>
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
        {submittedData && (
          <div>
            <h2>Submitted Data</h2>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
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
          onClick={handleEditResourceDialogOpen}
        >
          Edit Resources
        </Button>

        <div style={{ position: "relative" }}>
          <FormControl variant="filled" style={{ minWidth: 200 }}>
            <InputLabel>Select Operation</InputLabel>
            <Select
              id="demo-simple-select"
              style={{ padding: "10px 20px", fontSize: "16px" }}
              value={selectedNodeType}
              label="Select Operation"
              onChange={handleNodeSelect}
            >
              {nodesName.map((element) => (
                <MenuItem
                  value={element}
                  key={element}
                  style={{ display: "block", margin: "5px 0" }}
                >
                  {element}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button
          variant="contained"
          style={{
            position: "absolute",
            padding: "10px 20px",
            fontSize: "16px",
            bottom: "40px",
            left: "30px",
            width: "150px",
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>

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
