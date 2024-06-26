import React, {useState } from "react";
import { Handle, Position } from "reactflow";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {Box } from "@mui/material";


function OutputNode({ data, isConnectable }) {

  const [successMessageValue, setSuccessMessageValue] = useState(data.value.successMessage || '');
  const [failMessageValue, setFailureMessageValue] = useState(data.value.failureMessage || '');


  const handleSuccessMessageValueChange = (event) => {
    setSuccessMessageValue(event.target.value);
    data.value["successMessage"] = event.target.value;
  }

  const handleFailureMessageValueChange = (event) => {
    setFailureMessageValue(event.target.value);
    data.value["failureMessage"] = event.target.value;
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
          Output
        </Typography>
      </Box>
      <TextField
        id="textfilled-basic"
        label="Success Message"
        value={successMessageValue}
        onChange={handleSuccessMessageValueChange}
        fullWidth
      />
      <TextField
        id="textfilled-basic"
        label="Failure Message"
        value={failMessageValue}
        onChange={handleFailureMessageValueChange}
        fullWidth
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

export default OutputNode;
