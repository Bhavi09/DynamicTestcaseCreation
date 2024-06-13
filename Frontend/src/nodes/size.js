import React, {useState } from "react";
import { Handle, Position } from "reactflow";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {Box } from "@mui/material";


function SizeNode({ data, isConnectable }) {

  const [pathVariableValue, setPathVariableValue] = useState(data.value.pathVariable || '');
  const [operationIdValue, setOperationIdValue] = useState(data.value.operationId || '');



  const handlePathVariableValueChange = (event) => {
    setPathVariableValue(event.target.value);
    data.value["pathVariable"] = event.target.value;
  }
  const handleOperationIdDataChange = (event) => {
    setOperationIdValue(event.target.value);
    data.value["operationId"] = event.target.value;
  }

  return (
    <Card
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        minWidth: 300,
        minHeight: 100,
      }}
    >
      <Handle type="target" position={Position.Top} id="top" />
      <Box sx={{ width: '100%', backgroundColor: '#1976d2', padding: 1, display: 'flex', justifyContent: 'center' }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ color: 'white' }}>
          GetSize
        </Typography>
      </Box>
      <TextField
        id="textfilled-basic"
        label="Variable"
        value={pathVariableValue}
        onChange={handlePathVariableValueChange}
        fullWidth
      />
      <TextField
        fullWidth
        id="standard-required"
        label="Operation Id"
        value={operationIdValue}
        onChange={handleOperationIdDataChange}
        variant="standard"
      />
      <Button variant="contained" onClick={data.onDelete} sx={{ marginTop: 2 }}>
        Delete
      </Button>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
      />
    </Card>
  );
}

export default SizeNode;
