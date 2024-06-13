import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import { deleteBodyValue,updateBodyValue } from "../store/reducers";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";  
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { EditTwoTone, DeleteTwoTone, SaveTwoTone } from "@ant-design/icons";



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const DraggablePaper = (props) => {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  };
export default function EditResources({editResourceDialogOpen,setEditResourceDialogOpen})
{

    const dispatch = useDispatch(); 
    const bodyValuesFromStore = useSelector(
        (state) => state.valueIdReducer.bodyValues
      );

    const [editResourceId, setEditResourceId] = useState(null);
    const [deleteResourceId, setDeleteResourceId] = useState(null);
    const [editedResourceValue, setEditedResourceValue] = useState({});
    const [editedResourceValueError, setEditedResourceValueError] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleEditResource = (resourceId) => {
        setEditResourceId(resourceId);
        setEditedResourceValue(bodyValuesFromStore[resourceId]["resource"]);
      };

      const handleDeleteResource = () => {
        setIsDeleteModalOpen(false);
        dispatch(deleteBodyValue(deleteResourceId));
      };

      const handleSaveResource = () => {
        try {
          JSON.parse(editedResourceValue);
          dispatch(
            updateBodyValue({
              resourceId: editResourceId,
              resource: editedResourceValue,
            })
          );
          setEditedResourceValueError(false);
          setEditResourceId(null);
        } catch (error) {
          setEditedResourceValueError(true);
        }
      };

      const handleEditResourceDialogClose = () => setEditResourceDialogOpen(false);
      
      const handleDeleteClick = (resourceId) => {
        console.log(resourceId);
        setDeleteResourceId(resourceId);
        setIsDeleteModalOpen(true);
      };    
    

    return(
<Dialog
        fullScreen
        open={editResourceDialogOpen}
        onClose={handleEditResourceDialogClose}
        PaperComponent={DraggablePaper}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleEditResourceDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Resources
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleEditResourceDialogClose}
            >
              Done
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {Object.keys(bodyValuesFromStore).map((resourceId) => (
            <div key={resourceId}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 10px",
                }}
              >
                <ListItemText
                  secondary={resourceId}
                  style={{ flex: 1 }}
                  secondaryTypographyProps={{
                    style: { fontSize: "0.95rem", color: "black" },
                  }}
                />
                <Button
                  variant="outlined"
                  style={{ margin: "10px" }}
                  onClick={() => handleEditResource(resourceId)}
                >
                  <EditTwoTone />
                </Button>
                <Button
                  variant="outlined"
                  style={{ margin: "10px" }}
                  onClick={()=>handleDeleteClick(resourceId)}
                >
                  <DeleteTwoTone />
                </Button>
                {editResourceId === resourceId && (
                  <Button
                    variant="outlined"
                    onClick={handleSaveResource}
                    style={{ margin: "10px" }}
                  >
                    <SaveTwoTone />
                  </Button>
                )}
              </div>
              {editResourceId === resourceId && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "10px 10px",
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    value={editedResourceValue}
                    onChange={(e) => setEditedResourceValue(e.target.value)}
                    label="Resource Value"
                    multiline
                    rows={Math.min(20)}
                    error={editedResourceValueError}
                    helperText={
                      editedResourceValueError ? "Invalid Json format" : ""
                    }
                    style={{ marginTop: "10px" }}
                  />
                </div>
              )}
              <Divider />
            </div>
          ))}
        </List>
        <Dialog
        open={isDeleteModalOpen}
        onClose={handleDeleteClick}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Node"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this resource
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setIsDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteResource} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      </Dialog>
    );
}