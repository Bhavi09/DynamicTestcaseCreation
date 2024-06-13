import React, {useState } from "react";
import { Handle, Position } from "reactflow";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {Box } from "@mui/material";


function LogNode({ data, isConnectable }) {

  const [logValue, setLogValue] = useState(data.value.log || '');
  


  const handleLogValueChange = (event) => {
    setLogValue(event.target.value);
    data.value["log"] = event.target.value;
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
          Log
        </Typography>
      </Box>
      <TextField
        id="textfilled-basic"
        label="Log"
        value={logValue}
        onChange={handleLogValueChange}
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

export default LogNode;
