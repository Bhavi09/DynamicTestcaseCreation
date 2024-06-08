import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';
import { options } from '../constants/options';

function SearchNode({ data, isConnectable }) {
  const [selectedResource, setSelectedResource] = useState(data.value.resourceType || '');
  const [parameterValue, setParameterValue] = useState(data.value.parameters || '');
  const [operationIdValue, setOperationIdValue] = useState(data.value.operationId || '');

  useEffect(() => {
    data.value['resourceType'] = selectedResource;
    data.value['parameters'] = parameterValue;
    data.value['operationId'] = operationIdValue;
  }, [selectedResource, parameterValue, operationIdValue]);

  const handleResourceChange = (event) => {
    setSelectedResource(event.target.value);
  };

  const handleOperationIdDataChange = (event) => {
    setOperationIdValue(event.target.value);
  }

  const handleParameterValueChange = (event) => {
    setParameterValue(event.target.value);
  };

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
          Search
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
