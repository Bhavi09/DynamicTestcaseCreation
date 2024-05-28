import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import App from '../App';

const handleStyle = { left: 10 };
const options = [
  { value: "Patient", label: "Patient" },
  { value: "Practitioner", label: "Practitioner" },
];

function SearchNode({ data, isConnectable }) {
  const [selectedResource, setSelectedResource] = useState("");
  const [parameterValue, setParameterValue] = useState("");
  const [operationIdValue, setOperationIdValue] = useState("");

  const handleResourceChange = (event) => {
    setSelectedResource(event.target.value);
    data.value["resourceType"] = event.target.value;
    console.log(data);
  };

  const handleOperationIdDataChange = (event) => {
    setOperationIdValue(event.target.value);
    data.value["operationId"] = event.target.value;
  }

  const handleParameterValueChange = (event) => {
    setParameterValue(event.target.value);
    data.value['parameters'] = event.target.value;
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
      <Typography gutterBottom variant="h6" component="div">
        Search
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Resource Type</InputLabel>
        <Select
          value={selectedResource}
          label="Resource Type"
          onChange={handleResourceChange}
          className="nodrag"
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
          label="Parameter"
          value={parameterValue}
          onChange={handleParameterValueChange}
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

export default SearchNode;
