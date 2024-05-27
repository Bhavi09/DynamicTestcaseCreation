import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const handleStyle = { left: 10 };
const options = [
  { value: 'Patient', label: 'Patient' },
  { value: 'Practitioner', label: 'Practitioner' }
];

function DeleteNode({ data, isConnectable }) {
  const [selectedOption, setSelectedOption] = useState(data.value['resourceType'] || options[0].value);
  const [textValue, setTextValue] = useState(data.value['text'] || '');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    data.value['resourceType'] = event.target.value;
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
    data.value['fhirResourceId'] = event.target.value;
  };

  return (
      <Card sx={{ padding: 2, display: 'flex', flexDirection: 'column',alignItems:'center', gap: 2,minWidth: 300, minHeight: 100 }}>    
      <Handle type="target" position={Position.Top} id='b' />
      <Typography gutterBottom variant="h6" component="div">
          Delete
        </Typography>
      <FormControl fullWidth>
          <InputLabel>Resource Type</InputLabel>
          <Select
            value={selectedOption}
            label="Resource Type"
            onChange={handleSelectChange}
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
          label="Fhir Resource Id"
          value={textValue}
          onChange={handleTextChange}
          fullWidth
        />
      <Button variant="contained" onClick={data.onDelete} sx={{ marginTop: 2 }}>Delete</Button>
      <Handle type="source" position={Position.Bottom} id='b' isConnectable={isConnectable} />
      </Card>
  );
}

export default DeleteNode;

