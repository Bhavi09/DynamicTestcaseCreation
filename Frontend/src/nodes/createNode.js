import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const options = [
  { value: 'Patient', label: 'Patient' },
  { value: 'Practitioner', label: 'Practitioner' },
  { value: 'Document', label: 'Document' },
];

function CreateNode({ data, isConnectable }) {
  const [selectedOption, setSelectedOption] = useState(data.value['resourceType'] || options[0].value);
  const [textValue, setTextValue] = useState(data.value['text'] || '');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    data.value['resourceType'] = event.target.value;
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
    data.value['valueId'] = event.target.value;
  };

  return (
    <Card sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Handle type="target" position={Position.Top} id='b' />
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
          label="Value Id"
          value={textValue}
          onChange={handleTextChange}
          fullWidth
        />
      <Button variant="contained" onClick={data.onDelete} sx={{ marginTop: 2 }}>Delete</Button>
      <Handle type="source" position={Position.Bottom} id='b' isConnectable={isConnectable} />
    </Card>
  );
}

export default CreateNode;
