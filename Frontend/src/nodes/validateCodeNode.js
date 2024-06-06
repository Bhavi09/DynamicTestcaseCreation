import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select,Box } from "@mui/material";
import { options } from '../constants/options';

function ValidateCodeNode({ data, isConnectable }) {

  const [selectedResource, setSelectedResource] = useState("");
  const [urlDataValue, setUrlDataValue] = useState("");
  const [systemDataValue, setSystemDataValue] = useState("");
  const [codeDataValue, setCodeDataValue] = useState("");
  const [operationIdValue, setOperationIdValue] = useState("");


  const handleResourceChange = (event) => {;
    setSelectedResource(event.target.value);
    data.value['resourceType'] = event.target.value;
  };
  const handleUrlDataChange = (event) =>
  {
    setUrlDataValue(event.target.value);
    data.value["url"] = event.target.value;
  }

  const handleSystemDataChange = (event) => {
    setSystemDataValue(event.target.value);
    data.value["system"] = event.target.value;
  };

  const handleCodeDataChange = (event) => {
    setCodeDataValue(event.target.value);
    data.value["code"] = event.target.value;
  };

  const handleOperationIdDataChange = (event) => {
    setOperationIdValue(event.target.value);
    data.value["operationId"] = event.target.value;
  }
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4 + 8, // 5 items * item height (48px) + padding (8px)
        width: 200,
      },
    },
  };

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
      <Handle type="target" position={Position.Top} id="b" />
      <Box sx={{ width: '100%', backgroundColor: '#1976d2', padding: 1, display: 'flex', justifyContent: 'center' }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ color: 'white' }}>
          ValidateCode
        </Typography>
      </Box>
      <FormControl fullWidth>
    <InputLabel>Resource Type</InputLabel>
    <Select
      value={selectedResource}
      label="Resource Type"
      onChange={handleResourceChange}
      className="nodrag"
      MenuProps={MenuProps}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
     <TextField
        id="textfilled-basic"
        label="Url"
        value={urlDataValue}
        onChange={handleUrlDataChange}
        fullWidth
      />
      <TextField
        id="textfilled-basic"
        label="System"
        value={systemDataValue}
        onChange={handleSystemDataChange}
        fullWidth
      />
      <TextField
        id="textfilled-basic"
        label="Code"
        value={codeDataValue}
        onChange={handleCodeDataChange}
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
        id="b"
        isConnectable={isConnectable}
      />
    </Card>
  );
}

export default ValidateCodeNode;
