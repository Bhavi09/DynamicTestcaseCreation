
// const initialNodes = [];
// const initialEdges = [];

// export default function Viewport()
// {
//     const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//     const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//     const [submittedData, setSubmittedData] = useState(null);

//     return(

//         <div ref={reactFlowWrapper} style={{ width: "75vw", height: "100vh" }}>
//         <ReactFlow
//           className="reactflow-wrapper"
//           nodes={nodes}
//           edges={edges}
//           edgeTypes={edgeTypes}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           snapToGrid
//           onEdgeUpdate={onEdgeUpdate}
//           onEdgeUpdateStart={onEdgeUpdateStart}
//           onEdgeUpdateEnd={onEdgeUpdateEnd}
//           onConnect={onConnect}
//           nodeTypes={nodeTypes}
//         >
//           <Background color="#1976d2" variant={BackgroundVariant.Dots} />
//           <Controls />
//           <MiniMap />
//           <Background variant="dots" gap={12} size={1} />
//         </ReactFlow>
//         {submittedData && (
//           <div>
//             <h2>Submitted Data</h2>
//             <pre>{JSON.stringify(submittedData, null, 2)}</pre>
//           </div>
//         )}
//       </div>
//     )

// }