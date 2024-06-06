import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormControl, InputLabel, MenuItem, Select,Box } from '@mui/material';
import { options } from '../constants/options';

function GetByIdNode({ data, isConnectable }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [fhirResourceIdValue, setFhirResourceId] = useState("");
  const [operationIdValue, setOperationIdValue] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    data.value['resourceType'] = event.target.value;
  };

  const handlfhirResourceIdChange = (event) => {
    setFhirResourceId(event.target.value);
    data.value['fhirResourceId'] = event.target.value;
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
      <Card sx={{ padding: 2, display: 'flex', flexDirection: 'column',alignItems:'center', gap: 2,minWidth: 300, minHeight: 100 }}>    
      <Handle type="target" position={Position.Top} id='b' />
      <Box sx={{ width: '100%', backgroundColor: '#1976d2', padding: 1, display: 'flex', justifyContent: 'center' }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ color: 'white' }}>
          GetById
        </Typography>
      </Box>
      <FormControl fullWidth>
          <InputLabel>Resource Type</InputLabel>
          <Select
            value={selectedOption}
            label="Resource Type"
            onChange={handleSelectChange}
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
          label="Fhir Resource Id"
          value={fhirResourceIdValue}
          onChange={handlfhirResourceIdChange}
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
      <Button variant="contained" onClick={data.onDelete} sx={{ marginTop: 2 }}>Delete</Button>
      <Handle type="source" position={Position.Bottom} id='b' isConnectable={isConnectable} />
      </Card>
  );
}

export default GetByIdNode;

