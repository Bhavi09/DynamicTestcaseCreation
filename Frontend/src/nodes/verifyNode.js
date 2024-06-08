import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select,Box } from "@mui/material";

const validators = [
  { label: "String Validator", value: "StringValidator" },
  { label: "Number Validator", value: "NumberValidator" },
  { label: "Expression Validator", value: "ExpressionValidator" },
];
function VerifyNode({ data, isConnectable }) {

  const [selectedValidator, setSelectedValidator] = useState(data.value.handler || '');
  const [expectedDataValue, setExpectedDataValue] = useState(data.value.actualData || '');
  const [actualDataValue, setActualDataValue] = useState(data.value.expectedData || '');
  const [operationIdValue, setOperationIdValue] = useState(data.value.operationId  || '');

  const handleValidatorChange = (event) => {
    setSelectedValidator(event.target.value);
    data.value["handler"] = event.target.value;
  };

  const handleActualDataChange = (event) => {
    setActualDataValue(event.target.value);
    data.value["actualData"] = event.target.value;
  };

  const handleExpectedDataChange = (event) => {
    setExpectedDataValue(event.target.value);
    data.value["expectedData"] = event.target.value;
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
          Verify
        </Typography>
      </Box>
      <FormControl fullWidth>
        <InputLabel>Validators</InputLabel>
        <Select
          value={selectedValidator}
          label="Validators"
          onChange={handleValidatorChange}
          className="nodrag"
          MenuProps={MenuProps}
        >
          {validators.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        id="textfilled-basic"
        label="Actual Data"
        value={actualDataValue}
        onChange={handleActualDataChange}
        fullWidth
      />
      <TextField
        id="textfilled-basic"
        label="Expected Data"
        value={expectedDataValue}
        onChange={handleExpectedDataChange}
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

export default VerifyNode;
