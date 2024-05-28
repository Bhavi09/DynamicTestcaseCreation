import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
} from "reactflow";
import Button from "@mui/material/Button";
import CreateNode from "./nodes/createNode.js";
import DeleteNode from "./nodes/deleteNode.js";
import "./text-updater-node.css";
import "reactflow/dist/style.css";
import "./dropdown-menu.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import "./App.css";
import SearchNode from "./nodes/searchNode.js";
import VerifyNode from "./nodes/verifyNode.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addValueId,
  setBodyValue,
  updateBodyValue,
  deleteBodyValue,
} from "./store/reducers.js";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";
import Paper from "@mui/material/Paper";

import {
  EditTwoTone,
  DeleteTwoTone,
  SaveTwoTone
} from '@ant-design/icons';

const initialNodes = [];
const initialEdges = [];

const testcaseDescription = {
  componentName: "Client Registry",
  specificationName: "CRF1",
  testcaseName: "Check patient creation and deletion",
  description: "Check patient creation and deletion",
  testCaseNumber: "1",
};

const nodesName = ["Create", "Delete", "Verify", "Search"];

const nodeTypes = {
  CreateNode: CreateNode,
  DeleteNode: DeleteNode,
  SearchNode: SearchNode,
  VerifyNode: VerifyNode,
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
  const dispatch = useDispatch();
  const valueIds = useSelector((state) => state.valueIdReducer.valueIds);
  const bodyValuesFromStore = useSelector(
    (state) => state.valueIdReducer.bodyValues
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [submittedData, setSubmittedData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [open, setOpen] = useState(false);
  const [jsonError, setJsonError] = useState(false);
  const [jsonContent, setJsonContent] = useState("");
  const [duplicateResourceIdError, setDuplicateResourceIdError] =
    useState(false);
  const [selectedNodeType, setSelectedNodeType] = useState("");
  const [editResourceDialogOpen, setEditResourceDialogOpen] = useState(false);
  const [editResourceId, setEditResourceId] = useState(null);
  const [editedResourceValue, setEditedResourceValue] = useState({});
  const [editedResourceValueError, setEditedResourceValueError] =
    useState(false);
  const edgeUpdateSuccessful = useRef(true);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
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

    const jsonBody = {
      testcaseDescription,
      bodies: bodies,
      connectedNodes,
    };

    setSubmittedData(jsonBody);
  };

  const handleResourceIdChange = (event) => {
    if (valueIds.includes(event.target.value)) {
      setDuplicateResourceIdError(true);
    } else {
      setDuplicateResourceIdError(false);
    }
  };

  const handleResourceJsonChange = (event) => {
    setJsonContent(event.target.value);
  };

  const handleBodySubmit = (event) => {
    event.preventDefault();
    try {
      JSON.parse(jsonContent);
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries(formData.entries());
      const resourceId = formJson.resourceId;
      dispatch(addValueId(resourceId));
      dispatch(setBodyValue({ resourceId, formJson }));
      setJsonError(false);
      setDuplicateResourceIdError(false);
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

  const handleEditResourceDialogOpen = () => {
    setEditResourceDialogOpen(true);
  };

  const handleEditResourceDialogClose = () => setEditResourceDialogOpen(false);

  const handleResourceChange = (event, resourceId) => {
    const { name, value } = event.target;
    dispatch(
      updateBodyValue({
        resourceId,
        formJson: {
          ...bodyValuesFromStore[resourceId],
          [name]: value,
        },
      })
    );
  };

  const handleEditResource = (resourceId) => {
    setEditResourceId(resourceId);
    setEditedResourceValue(bodyValuesFromStore[resourceId]["resource"]);
  };

  const handleDeleteResource = (resourceId) => {
    dispatch(deleteBodyValue(resourceId));
  };

  const handleSaveResource = () => {
    try {
      JSON.parse(editedResourceValue);
      dispatch(
        updateBodyValue({
          resourceId: editResourceId,
          resource: editedResourceValue,
        })
      );
      setEditedResourceValueError(false);
      setEditResourceId(null);
    } catch (error) {
      setEditedResourceValueError(true);
    }
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
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          style={{ padding: "10px 20px", fontSize: "16px" }}
          onClick={handleClickOpen}
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
            <InputLabel>Select Node</InputLabel>
            <Select
              id="demo-simple-select"
              style={{ padding: "10px 20px", fontSize: "16px" }}
              value={selectedNodeType}
              label="Select Nodes"
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
          style={{ padding: "10px 20px", fontSize: "16px" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
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
            onChange={handleResourceIdChange}
            error={duplicateResourceIdError}
            helperText={
              duplicateResourceIdError ? "Resource Id already exists" : ""
            }
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
            onChange={handleResourceJsonChange}
            error={jsonError}
            helperText={jsonError ? "Invalid JSON content" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            disabled={jsonError || duplicateResourceIdError}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen
        open={editResourceDialogOpen}
        onClose={handleEditResourceDialogClose}
        PaperComponent={DraggablePaper}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleEditResourceDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Resource
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleEditResourceDialogClose}
            >
              Done
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {Object.keys(bodyValuesFromStore).map((resourceId) => (
            <div key={resourceId}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 10px",
                }}
              >
                <ListItemText secondary={resourceId} style={{ flex: 1 }} />
                <Button
                  variant="outlined"
                  style={{ margin: "10px" }}
                  onClick={() => handleEditResource(resourceId)}
                >
                  <EditTwoTone />
                </Button>
                <Button
                  variant="outlined"
                  style={{ margin: "10px" }}
                  onClick={() => handleDeleteResource(resourceId)}
                >
                <DeleteTwoTone />
                </Button>
                {editResourceId === resourceId && (
                  <Button
                    variant="outlined"
                    onClick={handleSaveResource}
                    style={{ margin: "10px" }}
                  >
                    <SaveTwoTone />
                  </Button>
                )}
              </div>
              {editResourceId === resourceId && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "10px 10px",
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    value={editedResourceValue}
                    onChange={(e) => setEditedResourceValue(e.target.value)}
                    label="Resource Value"
                    multiline
                    rows={Math.min(20)}
                    error={editedResourceValueError}
                    helperText={
                      editedResourceValueError ? "Invalid Json format" : ""
                    }
                    style={{ marginTop: "10px" }}
                  />
                </div>
              )}
              <Divider />
            </div>
          ))}
        </List>
      </Dialog>
    </div>
  );
}
