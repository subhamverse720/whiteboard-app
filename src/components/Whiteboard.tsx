'use client';

import { Stage, Layer, Line } from 'react-konva';
import { useRef, useState, useEffect } from 'react';

export default function Whiteboard() {
  const [lines, setLines] = useState<Array<{ points: number[]; color: string }>>([]);
  const [color, setColor] = useState('#ffffff'); // white color for dark background
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resize canvas to fit window
  useEffect(() => {
    const updateSize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    setLines([...lines, { points: [pos.x, pos.y], color }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;
    const lastLine = lines[lines.length - 1];
    const updatedLine = {
      ...lastLine,
      points: [...lastLine.points, point.x, point.y],
    };
    setLines([...lines.slice(0, -1), updatedLine]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => setLines([]);

  const handleExport = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = uri;
    link.click();
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#111' }}>
      {/* Toolbar floats over canvas */}
      <div style={toolbarStyle}>
        <button onClick={handleClear} style={btnStyle}>Clear</button>
        <button onClick={handleExport} style={btnStyle}>Export</button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={colorStyle}
        />
      </div>

      {/* Konva canvas */}
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

const toolbarStyle: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  left: '15px',
  background: 'rgba(255, 255, 255, 0.9)',
  padding: '8px 12px',
  borderRadius: '8px',
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const btnStyle: React.CSSProperties = {
  padding: '6px 10px',
  background: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const colorStyle: React.CSSProperties = {
  width: '40px',
  height: '30px',
  border: 'none',
  cursor: 'pointer',
};
