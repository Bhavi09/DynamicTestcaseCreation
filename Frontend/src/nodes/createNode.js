import React, { useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import App from '../App';

const options = [
  { value: 'Patient', label: 'Patient' },
  { value: 'Practitioner', label: 'Practitioner' }
];

function CreateNode({ data, isConnectable }) {

  const valueIds = useSelector(state => state.valueIdReducer.valueIds);

  const [selectedResource, setSelectedResource] = useState('');
  const [selectedValueId, setSelectedValueId] = useState('');

  const handleResourceChange = (event) => {;
    setSelectedResource(event.target.value);
    data.value['resourceType'] = event.target.value;
    console.log(data)
  };

  const handleValueIdChange = (event) => {
    setSelectedValueId(event.target.value);
    data.value['valueId'] = event.target.value;
    data.value['operationId'] = event.target.value +"ToCreate";
  };


  return (
<Card sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 300, minHeight: 100 }}>
  <Handle type="target" position={Position.Top} id='b' />
  <Typography gutterBottom variant="h6" component="div">
    Create
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
  <FormControl fullWidth>
    <InputLabel>Resource Id</InputLabel>
    <Select
      value={selectedValueId}
      label="Resource Id"
      onChange={handleValueIdChange}
      className="nodrag"
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
        value={`${selectedValueId}ToCreate`}
        label="Operation Id"
        InputProps={{
          readOnly: true,
        }}
        variant='standard'
      />
  <Button variant="contained" onClick={data.onDelete} sx={{ marginTop: 2 }}>Delete</Button>
  <Handle type="source" position={Position.Bottom} id='b' isConnectable={isConnectable} />
</Card>

  );
}

export default CreateNode;
