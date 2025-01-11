import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import "./Flow.css"; // Custom styles
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import axios from "axios";
import { baseUrl } from "../../constants/constants";
function CustomNode({ data }) {
  return (
    <div
      style={{
        padding: "10px",
        border: "1px solid #777",
        borderRadius: "5px",
        backgroundColor: "#f4f4f4",
        textAlign: "center",
      }}
    >
      {data.label}
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

export default function Flow() {
  const handleLeadSourceClick = () => setShowLeadSourcePopup(true);
  const handleAddBlockClick = () => setAddBlockPopup(true);
  const handleColdEmailClick = () => setShowColdEmailPopup(true);
  const handleDelayClick = () => setShowDelayPopup(true);

  const handleLeadSourceSelection = (option) => {
    if (option === "Leads from List") {
      setShowListPopup(true);
    } else {
      addNode(`Lead Source: ${option}`);
    }
    setShowLeadSourcePopup(false);
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "custom",
      position: { x: 50, y: 50 },
      data: {
        label: (
          <div onClick={handleLeadSourceClick}>
            <h5>+</h5>
            <h6>Add Lead Source</h6>
            <p>Add the lead source from List Or CRM</p>
          </div>
        ),
      },
    },

    {
      id: "2",
      type: "custom",
      position: { x: 50, y: 200 },
      data: { label: "Sequence Start Point" },
    },
    {
      id: "3",
      type: "custom",
      position: { x: 100, y: 300 },
      data: {
        label: (
          <div onClick={handleAddBlockClick}>
            <h5>+</h5>
          </div>
        ),
      },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showLeadSourcePopup, setShowLeadSourcePopup] = useState(false);
  const [showAddBlockPopup, setAddBlockPopup] = useState(false);
  const [showListPopup, setShowListPopup] = useState(false);
  const [showColdEmailPopup, setShowColdEmailPopup] = useState(false);
  const [coldEmailSelected, setColdEmailSelected] = useState(false);
  const [showDelayPopup, setShowDelayPopup] = useState(false);
  const listOptions = ["Test List", "Test List Samples"];
  const [templatedOptions, setTemplateOptions] = useState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (label) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: "custom",
      position: { x: 250 + Math.random() * 150, y: 150 + Math.random() * 150 },
      data: { label },
    };
    setNodes((nds) => [...nds, newNode]);
    connectToStartPoint(newNode.id);
  };

  const connectToStartPoint = (newNodeId) => {
    setEdges((eds) => [
      ...eds,
      { id: `e${newNodeId}-2`, source: newNodeId, target: "2" },
    ]);
  };

  const handleListSelection = (list) => {
    const newNodeId = `${nodes.length + 1}`;
    const newEdgeId = `${nodes.length + 1}el`;

    const newNode = {
      id: newNodeId,
      type: "custom",
      position: { x: 300, y: 200 },
      data: { label: `Lead from ${list}` },
    };

    const newEdge = {
      id: newEdgeId,
      source: newNodeId,
      target: 2,
      animated: true,
      style: { stroke: "#ff0000", strokeWidth: 2 },
      markerEnd: {
        type: "arrowclosed",
        color: "#ff0000",
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setShowListPopup(false);
  };

  const handleTemplateSelection = (list) => {
    const newNodeId = `${nodes.length + 1}`;
    const newEdgeId = `${nodes.length + 1}el`;

    const newNode = {
      id: newNodeId,
      type: "custom",
      position: { x: 50, y: 400 },
      data: {
        label: (
          <div onClick={handleAddBlockClick}>
            <h4>cold Email</h4>
            <p>{list}</p>
          </div>
        ),
      },
    };

    const newEdge = {
      id: newEdgeId,
      source: "2",
      target: newNodeId,
      animated: true,
      style: { stroke: "#ff0000", strokeWidth: 2 },
      markerEnd: {
        type: "arrowclosed",
        color: "#ff0000",
      },
    };
    setColdEmailSelected(true);

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    console.log("edegs :", edges);
    console.log("nodes :", nodes);
    setShowColdEmailPopup(false);
    setAddBlockPopup(false);
  };

  const handleDelay = () => {
    let delayNumber = document.getElementById("delayNumber").value;
    let delayBy = document.getElementById("delayBy").value;
    const newNodeId = `${nodes.length + 1}`;
    const newEdgeId = `${nodes.length + 1}el`;

    const newNode = {
      id: newNodeId,
      type: "custom",
      position: { x: 50, y: 550 },
      data: {
        label: (
          <div onClick={handleAddBlockClick}>
            <h4>Delay</h4>
            <p>
              {delayNumber}-{delayBy}
            </p>
          </div>
        ),
      },
    };

    const newEdge = {
      id: newEdgeId,
      source: "2",
      target: newNodeId,
      animated: true,
      style: { stroke: "#ff0000", strokeWidth: 2 },
      markerEnd: {
        type: "arrowclosed",
        color: "#ff0000",
      },
    };
    setColdEmailSelected(true);

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setAddBlockPopup(false);
    setShowDelayPopup(false);
  };

  const closePopups = () => {
    setShowLeadSourcePopup(false);
    setShowListPopup(false);
    setAddBlockPopup(false);
    setShowColdEmailPopup(false);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(`${baseUrl}/template/get-all`);
        console.log("Template response:", response.data);
        setTemplateOptions(response.data.templates);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates(); // Call the async function

    console.log("Flowchart data", { nodes, edges });
  }, [nodes, edges]);

  return (
    <div className="flow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {/* Lead Source Popup */}
      <Modal show={showLeadSourcePopup} onHide={closePopups}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h5>Add a Lead Source</h5>
          <p>
            Pick a Source & any configuration, any new leads that match rules
            will be added to sequence automatically
          </p>
          <div className="buttons-body">
            <h4>Source</h4>
            <div className="row">
              <div className="col">
                <div
                  className="card"
                  onClick={() => handleLeadSourceSelection("Leads from List")}
                >
                  <div className="row">
                    <div className="col-3">
                      <div className="svg-div">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="currentColor"
                          class="bi bi-person-fill-add"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                          <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                        </svg>
                      </div>
                    </div>
                    <div className="col">
                      <div className="source-block">
                        <h6>Leads From List(s)</h6>
                        <p>connect multiple lists as source or this sequence</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div
                  className="card"
                  onClick={() => handleLeadSourceSelection("Leads from List")}
                >
                  <div className="row">
                    <div className="col-3">
                      <div className="svg-div">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="currentColor"
                          class="bi bi-person-check-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"
                          />
                          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                      </div>
                    </div>
                    <div className="col">
                      <div className="source-block">
                        <h6>Segment By Events</h6>
                        <p>
                          Create a segment of leads who have engaged with emails
                          previously.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div
                  className="card"
                  onClick={() => handleLeadSourceSelection("Leads from List")}
                >
                  <div className="row">
                    <div className="col-3">
                      <div className="svg-div">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="currentColor"
                          class="bi bi-people"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                        </svg>
                      </div>
                    </div>
                    <div className="col">
                      <div className="source-block">
                        <h6>Segment Of List</h6>
                        <p>
                          Create a segment of leads which match SalesBlink
                          Variable
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div
                  className="card"
                  onClick={() => handleLeadSourceSelection("Leads from List")}
                >
                  <div className="row">
                    <div className="col-3">
                      <div className="svg-div">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%"
                          height="100%"
                          fill="currentColor"
                          class="bi bi-lightning-charge-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
                        </svg>
                      </div>
                    </div>
                    <div className="col">
                      <div className="source-block">
                        <h6>Lead From CRM Integration</h6>
                        <p>Pulls Leads From Your CRM integration</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* List Selection Popup */}
      <Modal show={showListPopup} onHide={closePopups}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h5>Leads From List(s)</h5>
          <p>Connect multiple lists as source for this sequence</p>
          <hr />
          <div className="list-body">
            <div className="row mb-3">
              <div className="col">Select your List(s)</div>
              <div className="col text-end">
                <button className="btn btn-outline-primary">New List +</button>
              </div>
            </div>
            <select
              className="form-control"
              aria-placeholder="Search For lists"
              onChange={(e) => handleListSelection(e.target.value)}
            >
              <option value="" disabled selected>
                Search for lists
              </option>
              {listOptions.map((list) => (
                <option key={list} value={list}>
                  {list}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
      </Modal>
      {/*  addBlock Popup */}
      <Modal show={showAddBlockPopup} onHide={closePopups}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={{ minHeight: "400px" }}>
          <h5>Add Blocks</h5>
          <p>Click On A Block To Congifure and add it in Sequence</p>
          <hr />
          <h5>Outreach</h5>
          <div className="row mt-3">
            <div className="col">
              <div className="card" onClick={handleColdEmailClick}>
                <div className="row">
                  <div className="col-3">
                    <div className="svg-div">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        fill="currentColor"
                        class="bi bi-envelope-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                      </svg>
                    </div>
                  </div>
                  <div className="col">
                    <h5>Cold Email</h5>
                    <p>Send an Email to a lead</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="row">
                  <div className="col-3">
                    <div className="svg-div">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        fill="currentColor"
                        class="bi bi-check-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                      </svg>
                    </div>
                  </div>
                  <div className="col">
                    <h5>Task</h5>
                    <p>Schedule a manual task</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {coldEmailSelected ? (
            <>
              <h5>Condition</h5>
              <div className="row mt-3">
                <div className="col">
                  <div className="card" onClick={handleDelayClick}>
                    <div className="row">
                      <div className="col-3">
                        <div className="svg-div">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="currentColor"
                            class="bi bi-hourglass-split"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
                          </svg>
                        </div>
                      </div>
                      <div className="col">
                        <h5>Wait</h5>
                        <p>Add a delay between Blocks</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card">
                    <div className="row">
                      <div className="col-3">
                        <div className="svg-div">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="currentColor"
                            class="bi bi-funnel-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="col">
                        <h5>If/ Else (Rules)</h5>
                        <p>Route leads through the sequence based on event</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </Modal.Body>
      </Modal>
      {/*  cold email */}
      <Modal show={showColdEmailPopup} onHide={closePopups}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h5>Cold Email</h5>
          <p>Send an email to a lead</p>
          <hr />
          <div className="list-body">
            <div className="row mb-3">
              <div className="col">Email Template</div>
              <div className="col text-end">
                <button className="btn btn-outline-primary">
                  New Template +
                </button>
              </div>
            </div>
            <select
              className="form-control"
              aria-placeholder="Search For lists"
              onChange={(e) => handleTemplateSelection(e.target.value)}
            >
              <option value="" disabled selected>
                Search for lists
              </option>
              {templatedOptions.map((list) => (
                <option key={list._id} value={list.title}>
                  {list.title}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delay Popup */}
      <Modal show={showDelayPopup} onHide={closePopups}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={{ height: "500px" }}>
          <h5>Add Delay</h5>
          <input
            type="number"
            name=""
            id="delayNumber"
            className="form-control mt-3"
          />
          <select name="" id="delayBy" className="form-control mt-3">
            <option value="day" selected>
              Day
            </option>
            <option value="min">Min</option>
            <option value="hour">Hour</option>
            <option value="month">Month</option>
          </select>
          <button className="btn btn-primary mt-3" onClick={handleDelay}>
            Save
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
