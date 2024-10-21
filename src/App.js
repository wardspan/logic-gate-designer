import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import TruthTable from './TruthTable';


const GATE_TYPES = ['INPUT', 'OUTPUT', 'AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

const GATE_SHAPES = {
  INPUT: (ctx, x, y, width, height, state) => {
    ctx.fillStyle = state ? 'green' : 'red';
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state ? '1' : '0', x + width / 2, y + height / 2);
  },
  OUTPUT: (ctx, x, y, width, height, state) => {
    ctx.fillStyle = state ? 'green' : 'red';
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state ? '1' : '0', x + width / 2, y + height / 2);
  },
  AND: (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y);
    ctx.arc(x + width / 2, y + height / 2, height / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.stroke();
  },
  OR: (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + width / 2, y, x + width, y + height / 2);
    ctx.quadraticCurveTo(x + width / 2, y + height, x, y + height);
    ctx.quadraticCurveTo(x + width / 4, y + height / 2, x, y);
    ctx.stroke();
  },
  NOT: (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width - height / 4, y + height / 2);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + width, y + height / 2, height / 4, 0, 2 * Math.PI);
    ctx.stroke();
  },
  NAND: (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y);
    ctx.arc(x + width / 2, y + height / 2, height / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + width + height / 4, y + height / 2, height / 4, 0, 2 * Math.PI);
    ctx.stroke();
  },
  NOR: (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + width / 2, y, x + width - height / 4, y + height / 2);
    ctx.quadraticCurveTo(x + width / 2, y + height, x, y + height);
    ctx.quadraticCurveTo(x + width / 4, y + height / 2, x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + width, y + height / 2, height / 4, 0, 2 * Math.PI);
    ctx.stroke();
  },
  XOR: (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.moveTo(x + width / 6, y);
    ctx.quadraticCurveTo(x + 2 * width / 3, y, x + width, y + height / 2);
    ctx.quadraticCurveTo(x + 2 * width / 3, y + height, x + width / 6, y + height);
    ctx.quadraticCurveTo(x + width / 3, y + height / 2, x + width / 6, y);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + width / 4, y + height / 2, x, y + height);
    ctx.stroke();
  },
  XNOR: (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.moveTo(x + width / 6, y);
    ctx.quadraticCurveTo(x + 2 * width / 3, y, x + width - height / 4, y + height / 2);
    ctx.quadraticCurveTo(x + 2 * width / 3, y + height, x + width / 6, y + height);
    ctx.quadraticCurveTo(x + width / 3, y + height / 2, x + width / 6, y);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + width / 4, y + height / 2, x, y + height);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + width, y + height / 2, height / 4, 0, 2 * Math.PI);
    ctx.stroke();
  },
};

const TRUTH_TABLES = {
  AND: [
    { inputs: [0, 0], output: 0 },
    { inputs: [0, 1], output: 0 },
    { inputs: [1, 0], output: 0 },
    { inputs: [1, 1], output: 1 },
  ],
  OR: [
    { inputs: [0, 0], output: 0 },
    { inputs: [0, 1], output: 1 },
    { inputs: [1, 0], output: 1 },
    { inputs: [1, 1], output: 1 },
  ],
  NOT: [
    { inputs: [0], output: 1 },
    { inputs: [1], output: 0 },
  ],
  NAND: [
    { inputs: [0, 0], output: 1 },
    { inputs: [0, 1], output: 1 },
    { inputs: [1, 0], output: 1 },
    { inputs: [1, 1], output: 0 },
  ],
  NOR: [
    { inputs: [0, 0], output: 1 },
    { inputs: [0, 1], output: 0 },
    { inputs: [1, 0], output: 0 },
    { inputs: [1, 1], output: 0 },
  ],
  XOR: [
    { inputs: [0, 0], output: 0 },
    { inputs: [0, 1], output: 1 },
    { inputs: [1, 0], output: 1 },
    { inputs: [1, 1], output: 0 },
  ],
  XNOR: [
    { inputs: [0, 0], output: 1 },
    { inputs: [0, 1], output: 0 },
    { inputs: [1, 0], output: 0 },
    { inputs: [1, 1], output: 1 },
  ],
};

function App() {
  const [components, setComponents] = useState([]);
  const [connectionStart, setConnectionStart] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;
        const ctx = canvasRef.current.getContext('2d');
        ctx.scale(dpr, dpr);
        drawComponents(ctx);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [components, connectionStart, mousePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawComponents(ctx);
  }, [components, connectionStart, mousePosition, canvasSize]);

  useEffect(() => {
    simulateCircuit();
  }, [components]);

  const addComponent = (type) => {
    const newComponent = {
      id: Date.now(),
      type,
      x: 50,
      y: 50,
      width: type === 'INPUT' || type === 'OUTPUT' ? 40 : 60,
      height: type === 'INPUT' || type === 'OUTPUT' ? 40 : 40,
      state: false,
      inputs: [],
      outputs: []
    };
    setComponents([...components, newComponent]);
  };

  const getFirstAvailableInputPin = (component) => {
    if (component.type === 'INPUT') return null;
    if (component.type === 'OUTPUT' || component.type === 'NOT') {
      return component.inputs.length === 0 ? 0 : null;
    }
    if (component.inputs.length < 2) {
      return component.inputs.length;
    }
    return null;
  };

  const handleCanvasClick = (event) => {
    event.preventDefault();
    if (draggingComponent) {
      return;
    }

    const { x, y } = getCanvasCoordinates(event.touches ? event.touches[0] : event);

    // Check if clicked on a component
    const clickedComponent = components.find(component =>
      x >= component.x && x <= component.x + component.width &&
      y >= component.y && y <= component.y + component.height
    );

    if (clickedComponent) {
      if (connectionStart) {
        // Complete the connection
        if (connectionStart !== clickedComponent) {
          const availablePin = getFirstAvailableInputPin(clickedComponent);
          if (availablePin !== null && connectionStart.type !== 'OUTPUT' && clickedComponent.type !== 'INPUT') {
            setComponents(prevComponents => prevComponents.map(component => {
              if (component.id === connectionStart.id) {
                return { ...component, outputs: [...component.outputs, clickedComponent.id] };
              }
              if (component.id === clickedComponent.id) {
                const newInputs = [...component.inputs];
                newInputs[availablePin] = connectionStart.id;
                return { ...component, inputs: newInputs };
              }
              return component;
            }));
          }
          setConnectionStart(null);
        } else {
          // Clicked on the same component, cancel connection
          setConnectionStart(null);
        }
      } else {
        // Start a new connection
        if (clickedComponent.type !== 'OUTPUT') {
          setConnectionStart(clickedComponent);
        }
      }
    } else {
      // Clicked on empty space, cancel any ongoing connection
      setConnectionStart(null);
    }
  };

  const drawComponents = (ctx) => {
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    components.forEach(component => {
      // Draw the component
      if (GATE_SHAPES[component.type]) {
        GATE_SHAPES[component.type](ctx, component.x, component.y, component.width, component.height, component.state);
      } else {
        ctx.strokeRect(component.x, component.y, component.width, component.height);
      }

      // Draw component label
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(component.type, component.x + component.width / 2, component.y - 5);

      // Draw output point (except for OUTPUT components)
      if (component.type !== 'OUTPUT') {
        ctx.beginPath();
        ctx.arc(component.x + component.width, component.y + component.height / 2, 5, 0, 2 * Math.PI);
        ctx.fillStyle = component.outputs.length > 0 ? 'red' : 'blue';
        ctx.fill();
      }

      // Draw input points (except for INPUT components)
      if (component.type !== 'INPUT') {
        const inputCount = component.type === 'OUTPUT' || component.type === 'NOT' ? 1 : 2;
        for (let i = 0; i < inputCount; i++) {
          const inputY = component.y + (i + 1) * (component.height / (inputCount + 1));
          ctx.beginPath();
          ctx.arc(component.x, inputY, 5, 0, 2 * Math.PI);
          ctx.fillStyle = component.inputs[i] ? 'red' : 'blue';
          ctx.fill();
        }
      }
    });

    // Draw connections
    components.forEach(component => {
      component.outputs.forEach(outputId => {
        const outputComponent = components.find(c => c.id === outputId);
        if (outputComponent) {
          const startX = component.x + component.width;
          const startY = component.y + component.height / 2;
          const endX = outputComponent.x;
          const endY = outputComponent.y + outputComponent.height / 2;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = 'blue';
          ctx.stroke();
        }
      });
    });

    // Draw connection preview
    if (connectionStart) {
      const startX = connectionStart.x + connectionStart.width;
      const startY = connectionStart.y + connectionStart.height / 2;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(mousePosition.x, mousePosition.y);
      ctx.strokeStyle = 'blue';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const isPointNearLine = (x, y, x1, y1, x2, y2, tolerance = 5) => {
    const A = { x: x1, y: y1 };
    const B = { x: x2, y: y2 };
    const C = { x, y };
    const distAB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
    const distAC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2);
    const distCB = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
    return Math.abs(distAC + distCB - distAB) < tolerance;
  };

  const getCanvasCoordinates = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    return { x, y };
  };

  const handleCanvasDoubleClick = (event) => {
    const { x, y } = getCanvasCoordinates(event);

    const clickedComponent = components.find(component =>
      x >= component.x && x <= component.x + component.width &&
      y >= component.y && y <= component.y + component.height
    );

    if (clickedComponent && clickedComponent.type === 'INPUT') {
      setComponents(components.map(c =>
        c.id === clickedComponent.id ? { ...c, state: !c.state } : c
      ));
    }
  };

  const handleCanvasMouseDown = (event) => {
    event.preventDefault();
    const { x, y } = getCanvasCoordinates(event.touches ? event.touches[0] : event);

    const clickedComponent = components.find(component =>
      x >= component.x && x <= component.x + component.width &&
      y >= component.y && y <= component.y + component.height
    );

    if (clickedComponent) {
      setDraggingComponent(clickedComponent);
      setDragOffset({
        x: x - clickedComponent.x,
        y: y - clickedComponent.y
      });
    }
  };

  const handleCanvasMouseMove = (event) => {
    event.preventDefault();
    const { x, y } = getCanvasCoordinates(event.touches ? event.touches[0] : event);
    setMousePosition({ x, y });

    if (draggingComponent) {
      setComponents(prevComponents => prevComponents.map(component =>
        component.id === draggingComponent.id
          ? { ...component, x: x - dragOffset.x, y: y - dragOffset.y }
          : component
      ));
    }
  };

  const handleCanvasMouseUp = (event) => {
    event.preventDefault();
    setDraggingComponent(null);
  };

  const handleCanvasContextMenu = (event) => {
    event.preventDefault();
  };

  const simulateCircuit = () => {
    const simulateComponent = (component) => {
      if (component.type === 'INPUT') {
        return component.state ? 1 : 0;
      }

      if (component.type === 'OUTPUT') {
        return component.inputs.length > 0 ? simulateComponent(components.find(c => c.id === component.inputs[0])) : 0;
      }

      const inputStates = component.inputs.map(inputId => {
        const inputComponent = components.find(c => c.id === inputId);
        return inputComponent ? simulateComponent(inputComponent) : 0;
      });

      const truthTable = TRUTH_TABLES[component.type];
      if (!truthTable) {
        console.error(`No truth table found for gate type: ${component.type}`);
        return 0;
      }

      const result = truthTable.find(row => 
        row.inputs.length === inputStates.length &&
        row.inputs.every((input, index) => input === inputStates[index])
      );

      return result ? result.output : 0;
    };

    setComponents(components.map(component => {
      if (component.type !== 'INPUT') {
        const newState = simulateComponent(component) === 1;
        return { ...component, state: newState };
      }
      return component;
    }));
  };

  const saveCircuit = () => {
    const circuitData = JSON.stringify(components);
    localStorage.setItem('savedCircuit', circuitData);
    alert('Circuit saved!');
  };

  const loadCircuit = () => {
    const savedCircuit = localStorage.getItem('savedCircuit');
    if (savedCircuit) {
      setComponents(JSON.parse(savedCircuit));
      alert('Circuit loaded!');
    } else {
      alert('No saved circuit found.');
    }
  };

  const clearCanvas = () => {
    setComponents([]);
    setConnectionStart(null);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="App">
      <h1>Logic Gate Designer</h1>
      <div className="main-container">
        <div className="toolbar">
          {GATE_TYPES.map(type => (
            <button key={type} onClick={() => addComponent(type)}>{type}</button>
          ))}
          <button onClick={clearCanvas}>Clear</button>
          <button onClick={toggleInstructions}>Instructions</button>
        </div>
        <div className="canvas-container" ref={containerRef}>
          <canvas
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onTouchStart={handleCanvasMouseDown}
            onTouchMove={handleCanvasMouseMove}
            onTouchEnd={handleCanvasMouseUp}
            onClick={handleCanvasClick}
            onContextMenu={(e) => e.preventDefault()}
            style={{ border: '1px solid black', touchAction: 'none' }}
          />
        </div>
        <div className="truth-tables-container">
          {components.filter(c => c.type !== 'INPUT' && c.type !== 'OUTPUT').map(component => (
            <TruthTable
              key={component.id}
              gateType={component.type}
              inputs={component.inputs.map(inputId => {
                const inputComponent = components.find(c => c.id === inputId);
                return inputComponent ? (inputComponent.state ? 1 : 0) : 0;
              })}
              output={component.state ? 1 : 0}
            />
          ))}
        </div>
      </div>
      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-content">
            <h2>Instructions</h2>
            <ul>
              <li>Click on a gate type in the toolbar to add it to the canvas.</li>
              <li>Drag gates to move them around.</li>
              <li>Click on an output (right side) of a gate, then click on an input (left side) of another gate to connect them.</li>
              <li>Double-click on an INPUT to toggle its state.</li>
              <li>Click on a wire to delete it.</li>
              <li>Use the Clear button to reset the canvas.</li>
            </ul>
            <button onClick={toggleInstructions}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
