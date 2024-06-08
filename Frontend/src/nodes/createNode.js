import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { options } from '../constants/options';

function CreateNode({ data, isConnectable }) {
  const valueIds = useSelector(state => state.valueIdReducer.valueIds);

  const [selectedResource, setSelectedResource] = useState(data.value.resourceType || '');
  const [selectedValueId, setSelectedValueId] = useState(data.value.valueId || '');

  useEffect(() => {
    data.value['resourceType'] = selectedResource;
    data.value['valueId'] = selectedValueId;
    data.value['operationId'] = `created${selectedValueId}`;
  }, [selectedResource, selectedValueId]);

  const handleResourceChange = (event) => {
    setSelectedResource(event.target.value);
  };

  const handleValueIdChange = (event) => {
    setSelectedValueId(event.target.value);
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
    <Card sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 300, minHeight: 100 }}>
      <Handle type="target" position={Position.Top} id='top' />
      <Box sx={{ width: '100%', backgroundColor: '#1976d2', padding: 1, display: 'flex', justifyContent: 'center' }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ color: 'white' }}>
          Create
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
      <FormControl fullWidth>
        <InputLabel>Resource Id</InputLabel>
        <Select
          value={selectedValueId}
          label="Resource Id"
          onChange={handleValueIdChange}
          className="nodrag"
          MenuProps={MenuProps}
        >
          {valueIds.length === 0 ? (
            <MenuItem disabled>No record found</MenuItem>
          ) : (
            valueIds.map((values) => (
              <MenuItem key={values} value={values}>
                {values}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        id="standard-read-only-input"
        value={`created${selectedValueId}`}
        label="Operation Id"
        InputProps={{
          readOnly: true,
        }}
        variant='standard'
      />
      <Button variant="contained" onClick={data.onDelete} sx={{ marginTop: 2 }}>Delete</Button>
      <Handle type="source" position={Position.Bottom} id='bottom' isConnectable={isConnectable} />
    </Card>
  );
}

export default CreateNode;
