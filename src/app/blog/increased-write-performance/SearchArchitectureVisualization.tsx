"use client";

import React, { useState, useEffect } from 'react';

// Simple configuration
const CONFIG = {
  MUTABLE_ROW_THRESHOLD: 1000,
  TICK_INTERVAL: 150,
  SEGMENT_CREATION_DELAY: 200, // milliseconds to block ingestion per segment
  THROUGHPUT_UPDATE_INTERVAL: 5000,
  COMPACTION_DELAYS: {
    L0_TO_L1: 2000,    // 2 seconds
    L1_TO_L2: 4000,    // 4 seconds
    L2_TO_L3: 8000,    // 8 seconds
  },
  LAYER_SIZES: {
    L0: 100,      // 100KB threshold
    L1: 1024,     // 1MB threshold  
    L2: 10240,    // 10MB threshold
    L3: 102400,   // 100MB threshold
    L4: 1048576,  // 1GB threshold
    L5: 10485760, // 10GB threshold
  },
};

// Simple interfaces
interface MutableBuffer {
  rows: number;
  sizeKB: number;
}

interface Segment {
  id: string;
  sizeKB: number;
  mergeLocked: boolean;
}

interface WorkerState {
  status: 'idle' | 'compacting';
  task: string;
}

interface State {
  // Core data
  mutableBuffers: MutableBuffer[];
  l0Segments: Segment[];
  l1Segments: Segment[];
  l2Segments: Segment[];
  l3Segments: Segment[];
  
  // Derived sizes for display
  l0SizeKB: number;
  l1SizeKB: number;
  l2SizeKB: number;
  l3SizeKB: number;
  
  // Workers
  workers: WorkerState[];
  
  // Settings
  mutableEnabled: boolean;
  clientCount: number;
  workerCount: number;
  
  // Performance tracking
  rowsPerSecond: number;
  totalRows: number;
  last5SecondRows: number;
  lastUpdate: number;
  writeCount: number;
  readCount: number;
  
  // Blocking state
  isBlocked: boolean;
  blockUntil: number;
  
}

// Utility functions
const generateWriteSize = (): number => {
  const rand = Math.random();
  if (rand < 0.7) return Math.floor(Math.random() * 20) + 1;
  if (rand < 0.95) return Math.floor(Math.random() * 80) + 21;
  return Math.floor(Math.random() * 400) + 101;
};

const calculateRowSizeKB = (): number => {
  const textSize = Math.floor(Math.random() * 240) + 60; // 60-300 bytes
  return (8 + 12 + textSize + 24) / 1024; // Convert to KB
};

const formatSize = (sizeKB: number): string => {
  if (sizeKB >= 1048576) return `${(sizeKB / 1048576).toFixed(1)}GB`;
  if (sizeKB >= 1024) return `${(sizeKB / 1024).toFixed(1)}MB`;
  return `${sizeKB.toFixed(0)}KB`;
};

// Simple compaction logic
const shouldMergeSegments = (segments: Segment[], targetSizeKB: number, level: string): boolean => {
  if (segments.length === 0) return false;
  const totalSize = segments.reduce((sum, s) => sum + s.sizeKB, 0);
  
  // For L0→L1: only merge when total size approaches L1 capacity (1MB)
  if (level === 'L1') {
    return totalSize >= targetSizeKB;
  }
  
  // For L1+ levels: only merge when total size exceeds threshold
  return totalSize >= targetSizeKB;
};

export const SearchArchitectureVisualization: React.FC = () => {
  const [state, setState] = useState<State>({
    mutableBuffers: [{ rows: 0, sizeKB: 0 }],
    l0Segments: [],
    l1Segments: [],
    l2Segments: [],
    l3Segments: [],
    
    l0SizeKB: 0,
    l1SizeKB: 0,
    l2SizeKB: 0,
    l3SizeKB: 0,
    
    workers: [
      { status: 'idle', task: '' },
      { status: 'idle', task: '' },
      { status: 'idle', task: '' },
      { status: 'idle', task: '' },
    ],
    
    mutableEnabled: true,
    clientCount: 1,
    workerCount: 2,
    rowsPerSecond: 0,
    totalRows: 0,
    last5SecondRows: 0,
    lastUpdate: Date.now(),
    writeCount: 0,
    readCount: 0,
    isBlocked: false,
    blockUntil: 0,
  });

  const resetSimulation = () => {
    setState({
      mutableBuffers: Array.from({ length: state.clientCount }, () => ({ rows: 0, sizeKB: 0 })),
      l0Segments: [],
      l1Segments: [],
      l2Segments: [],
      l3Segments: [],
      
      l0SizeKB: 0,
      l1SizeKB: 0,
      l2SizeKB: 0,
      l3SizeKB: 0,
      
      workers: Array.from({ length: 4 }, () => ({ status: 'idle' as const, task: '' })),
      
      mutableEnabled: state.mutableEnabled,
      clientCount: state.clientCount,
      workerCount: state.workerCount,
      rowsPerSecond: 0,
      totalRows: 0,
      last5SecondRows: 0,
      lastUpdate: Date.now(),
      writeCount: 0,
      readCount: 0,
      isBlocked: false,
      blockUntil: 0,
    });
  };

  // Simple compaction execution
  const executeCompaction = async (
    fromLevel: string,
    toLevel: string,
    workerId: number
  ): Promise<void> => {
    // Mark worker as busy
    setState(s => {
      const newWorkers = [...s.workers];
      newWorkers[workerId] = { status: 'compacting', task: `${fromLevel}→${toLevel}` };
      return { ...s, workers: newWorkers };
    });

    // Wait for compaction delay
    const compactionDelay = fromLevel === 'L0' ? CONFIG.COMPACTION_DELAYS.L0_TO_L1 :
                           fromLevel === 'L1' ? CONFIG.COMPACTION_DELAYS.L1_TO_L2 :
                           CONFIG.COMPACTION_DELAYS.L2_TO_L3;
    
    await new Promise(resolve => setTimeout(resolve, compactionDelay));

    // Complete compaction - move segments
    setState(s => {
      let newState = { ...s };
      let segmentsToMerge: Segment[] = [];
      
      if (fromLevel === 'L0') {
        segmentsToMerge = newState.l0Segments.filter(seg => seg.mergeLocked);
        newState.l0Segments = newState.l0Segments.filter(seg => !seg.mergeLocked);
      } else if (fromLevel === 'L1') {
        segmentsToMerge = newState.l1Segments.filter(seg => seg.mergeLocked);
        newState.l1Segments = newState.l1Segments.filter(seg => !seg.mergeLocked);
      } else if (fromLevel === 'L2') {
        segmentsToMerge = newState.l2Segments.filter(seg => seg.mergeLocked);
        newState.l2Segments = newState.l2Segments.filter(seg => !seg.mergeLocked);
      }
      
      if (segmentsToMerge.length > 0) {
        const totalMergeSize = segmentsToMerge.reduce((sum, s) => sum + s.sizeKB, 0);
        const mergedSegment: Segment = {
          id: `merged_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sizeKB: totalMergeSize,
          mergeLocked: false
        };
        
        // Add to target level
        if (toLevel === 'L1') {
          newState.l1Segments.push(mergedSegment);
        } else if (toLevel === 'L2') {
          newState.l2Segments.push(mergedSegment);
        } else if (toLevel === 'L3') {
          newState.l3Segments.push(mergedSegment);
        }
      }
      
      // Worker returns to idle
      const newWorkers = [...newState.workers];
      newWorkers[workerId] = { status: 'idle', task: '' };
      
      return { ...newState, workers: newWorkers };
    });
  };

  // Main simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        let newState = { ...prev };
        const currentTime = Date.now();
        
        // Clear blocking state if time has passed
        if (prev.isBlocked && currentTime >= prev.blockUntil) {
          newState.isBlocked = false;
          newState.blockUntil = 0;
        }
        
        // Check if writes are currently blocked
        const writesBlocked = prev.isBlocked && currentTime < prev.blockUntil;
        
        // Ensure correct number of mutable buffers
        while (newState.mutableBuffers.length < prev.clientCount) {
          newState.mutableBuffers.push({ rows: 0, sizeKB: 0 });
        }
        while (newState.mutableBuffers.length > prev.clientCount) {
          newState.mutableBuffers.pop();
        }
        
        // Generate writes for each client (no staggering)
        const clientWrites = Array.from({ length: prev.clientCount }, generateWriteSize);
        let totalNewRows = clientWrites.reduce((sum, rows) => sum + rows, 0);
        
        // If writes are blocked, prevent any writes
        if (writesBlocked) {
          clientWrites.fill(0);
          totalNewRows = 0;
        }
        
        let successfulRows = 0;
        let segmentsCreated = 0;
        
        // Simulate reads
        const newReads = Math.floor(Math.random() * 3) + 1;
        newState.readCount += newReads;
        
        if (prev.mutableEnabled) {
          // MUTABLE MODE: Fast writes to buffers
          newState.mutableBuffers = newState.mutableBuffers.map((buffer, clientIndex) => {
            if (clientIndex < clientWrites.length && clientWrites[clientIndex] > 0) {
              const newRows = clientWrites[clientIndex];
              const newSizeKB = newRows * calculateRowSizeKB();
              
              if (buffer.rows < CONFIG.MUTABLE_ROW_THRESHOLD) {
                const rowsToAdd = Math.min(newRows, CONFIG.MUTABLE_ROW_THRESHOLD - buffer.rows);
                const proportionalSizeKB = newSizeKB * (rowsToAdd / newRows);
                successfulRows += rowsToAdd;
                
                return {
                  rows: buffer.rows + rowsToAdd,
                  sizeKB: buffer.sizeKB + proportionalSizeKB
                };
              }
            }
            return buffer;
          });
          
          // Convert full buffers to segments and clear them in one step
          newState.mutableBuffers = newState.mutableBuffers.map(buffer => {
            if (buffer.rows >= CONFIG.MUTABLE_ROW_THRESHOLD) {
              const newSegment: Segment = {
                id: `mutable_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                sizeKB: buffer.sizeKB, // Transfer exact accumulated size
                mergeLocked: false
              };
              
              // Mutable buffers go to the lowest layer that can fit them
              // Each layer has a maximum capacity, not a minimum threshold
              if (buffer.sizeKB <= CONFIG.LAYER_SIZES.L1) { // <= 1MB, fits in L1
                newState.l1Segments.push(newSegment);
              } else if (buffer.sizeKB <= CONFIG.LAYER_SIZES.L2) { // <= 10MB, fits in L2
                newState.l2Segments.push(newSegment);
              } else { // > 10MB, goes to L3
                newState.l3Segments.push(newSegment);
              }
              
              segmentsCreated++; // Count segments created by mutable conversion
              
              // Return cleared buffer
              return { rows: 0, sizeKB: 0 };
            }
            return buffer;
          });
          
        } else {
          // NON-MUTABLE MODE: Direct segment creation with overhead (many small L0 segments)
          clientWrites.forEach((rows, clientIndex) => {
            if (rows > 0) { // Only create segments for actual writes
              const sizeKB = rows * calculateRowSizeKB();
              const newSegment: Segment = {
                id: `direct_${Date.now()}_${clientIndex}_${Math.random().toString(36).substr(2, 9)}`,
                sizeKB, // Each write becomes a segment with exact calculated size
                mergeLocked: false
              };
              newState.l0Segments.push(newSegment);
              segmentsCreated++;
            }
          });
          
          successfulRows = totalNewRows;
        }
        
        // Block ingestion if segments were created
        if (segmentsCreated > 0) {
          const blockDuration = segmentsCreated * CONFIG.SEGMENT_CREATION_DELAY;
          newState.isBlocked = true;
          newState.blockUntil = currentTime + blockDuration;
        }
        
        // Background compaction work
        const segmentLayers = [
          { fromLevel: 'L0', segments: newState.l0Segments.filter(s => !s.mergeLocked), threshold: CONFIG.LAYER_SIZES.L1, toLevel: 'L1' },
          { fromLevel: 'L1', segments: newState.l1Segments.filter(s => !s.mergeLocked), threshold: CONFIG.LAYER_SIZES.L2, toLevel: 'L2' },
          { fromLevel: 'L2', segments: newState.l2Segments.filter(s => !s.mergeLocked), threshold: CONFIG.LAYER_SIZES.L3, toLevel: 'L3' },
        ];

        // Find work for idle workers
        for (let layerIndex = 0; layerIndex < segmentLayers.length; layerIndex++) {
          const layer = segmentLayers[layerIndex];
          
          if (!shouldMergeSegments(layer.segments, layer.threshold, layer.toLevel)) {
            continue;
          }
          
          // Find idle worker
          const availableWorkerIndex = newState.workers.findIndex((worker, i) => 
            i < prev.workerCount && worker.status === 'idle'
          );
          
          if (availableWorkerIndex >= 0) {
            // Mark segments as locked for merge
            if (layer.fromLevel === 'L0') {
              newState.l0Segments.forEach(segment => { segment.mergeLocked = true; });
            } else if (layer.fromLevel === 'L1') {
              newState.l1Segments.forEach(segment => { segment.mergeLocked = true; });
            } else if (layer.fromLevel === 'L2') {
              newState.l2Segments.forEach(segment => { segment.mergeLocked = true; });
            }
            
            // Start compaction
            executeCompaction(layer.fromLevel, layer.toLevel, availableWorkerIndex);
            break; // Only start one compaction per tick
          }
        }
        
        // Update derived sizes
        newState.l0SizeKB = newState.l0Segments.reduce((sum, s) => sum + s.sizeKB, 0);
        newState.l1SizeKB = newState.l1Segments.reduce((sum, s) => sum + s.sizeKB, 0);
        newState.l2SizeKB = newState.l2Segments.reduce((sum, s) => sum + s.sizeKB, 0);
        newState.l3SizeKB = newState.l3Segments.reduce((sum, s) => sum + s.sizeKB, 0);
        
        // Update counters
        if (successfulRows > 0) {
          newState.totalRows += successfulRows;
          newState.last5SecondRows += successfulRows;
          newState.writeCount += prev.clientCount;
        }
        
        // Update RPS every 5 seconds
        if (currentTime - prev.lastUpdate >= CONFIG.THROUGHPUT_UPDATE_INTERVAL) {
          const actualSeconds = (currentTime - prev.lastUpdate) / 1000;
          newState.rowsPerSecond = Math.round(newState.last5SecondRows / actualSeconds);
          newState.last5SecondRows = 0;
          newState.lastUpdate = currentTime;
        }
        
        return newState;
      });
    }, CONFIG.TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [state.clientCount, state.mutableEnabled, state.workerCount]);

  return (
    <div className="w-full mx-auto p-3 bg-black text-green-400 font-mono text-xs">
      
      {/* Compact Header */}
      <div className="text-center mb-3">
        <div className="text-cyan-400">ParadeDB LSM Tree Live Monitor</div>
        <div className="flex justify-center items-center gap-4 mt-2">
          <button
            onClick={resetSimulation}
            className="px-2 py-0.5 bg-gray-800 border border-gray-600 text-red-400 hover:bg-gray-700 text-xs"
          >
            🔄 RESET
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">Workers:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(count => (
                <button
                  key={count}
                  onClick={() => setState(prev => ({ ...prev, workerCount: count }))}
                  className={`px-2 py-0.5 border text-xs ${
                    state.workerCount === count 
                      ? 'bg-purple-800 border-purple-400 text-purple-300'
                      : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">Clients:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 8].map(count => (
                <button
                  key={count}
                  onClick={() => setState(prev => ({ ...prev, clientCount: count }))}
                  className={`px-2 py-0.5 border text-xs ${
                    state.clientCount === count 
                      ? 'bg-blue-800 border-blue-400 text-blue-300'
                      : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">Mutable:</span>
            <button
              onClick={() => setState(prev => ({ ...prev, mutableEnabled: !prev.mutableEnabled }))}
              className={`px-2 py-0.5 border text-xs ${
                state.mutableEnabled 
                  ? 'bg-yellow-800 border-yellow-400 text-yellow-300'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {state.mutableEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Flow */}
      <div className="relative">
        {/* Writes coming in from top */}
        <div className="flex justify-center mb-6">
          <div className="border border-green-400 bg-green-900/20 p-2 inline-block">
            <div className="text-green-400">WRITES ({state.clientCount} client{state.clientCount > 1 ? 's' : ''})</div>
            <div className="text-green-300 text-xs">
              {Array.from({ length: Math.min(state.clientCount, 8) }, (_, i) => '▼').join('')}
            </div>
            <div className="text-gray-300 text-xs mt-1">
              → {state.mutableEnabled ? 'Shared mutable buffer' : 'Direct to L0 segments'}
            </div>
          </div>
        </div>

        {/* Main layout: Reads + Database */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Reads on the left */}
          <div className="space-y-4">
            <div className="border border-blue-400 bg-blue-900/20 p-3">
              <div className="text-blue-400 font-semibold mb-2">READS</div>
              <div className="text-blue-300 text-xs mb-3">▶▶▶</div>
              
              <div className="space-y-2">
                <div className="text-xs">
                  <span className="text-yellow-400">→ Mutable:</span>
                  <div className="text-gray-300 ml-2">BM25 on-the-fly</div>
                </div>
                
                <div className="text-xs">
                  <span className="text-cyan-400">→ Immutable:</span>
                  <div className="text-gray-300 ml-2">
                    Scan {state.l0Segments.length + state.l1Segments.length + state.l2Segments.length + state.l3Segments.length} immutable segments
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-green-400 bg-green-900/20 p-3">
              <div className="text-green-400 font-semibold mb-2">THROUGHPUT</div>
              <div className="text-2xl text-green-300 font-mono">
                {state.rowsPerSecond} <span className="text-xs text-gray-400">RPS</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Rows per second
              </div>
            </div>
          </div>

          {/* Database storage */}
          <div className="lg:col-span-2 border border-yellow-400 bg-yellow-900/10 p-4 relative">
            
            <div className="space-y-4 relative" style={{ zIndex: 2 }}>
              {/* Mutable Buffer */}
              <div className={`border p-2 ${
                state.mutableEnabled 
                  ? 'border-yellow-400 bg-black/50' 
                  : 'border-gray-600 bg-gray-900/30'
              }`}>
                <div className={`${
                  state.mutableEnabled ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  MUTABLE {!state.mutableEnabled && '(DISABLED)'}
                </div>
                {state.mutableEnabled && (
                  <>
                    <div className="text-green-400 grid grid-cols-4 gap-1">
                      {state.mutableBuffers.map((buffer, index) => (
                        <span key={index} className={`${buffer.rows > 0 ? "text-green-400" : "text-gray-600"} text-xs font-mono`}>
                          [{buffer.rows.toString().padStart(3)}/{CONFIG.MUTABLE_ROW_THRESHOLD}]
                        </span>
                      ))}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      ({formatSize(state.mutableBuffers.reduce((sum, buffer) => sum + buffer.sizeKB, 0))})
                    </div>
                  </>
                )}
                {!state.mutableEnabled && (
                  <div className="text-gray-600 text-xs mt-1">Writes bypass mutable buffer</div>
                )}
              </div>

              <div className="text-center text-gray-400 text-lg">↓</div>

              {/* Immutable Segments */}
              <div className="border border-cyan-400 bg-black/50 p-2 space-y-1">
                <div className="text-cyan-400">IMMUTABLE SEGMENTS</div>
                <div className="flex justify-between">
                  <span className="text-white">L0:</span>
                  <span className="text-cyan-400">{state.l0Segments.length} ({formatSize(state.l0SizeKB)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">L1:</span>
                  <span className="text-cyan-400">{state.l1Segments.length} ({formatSize(state.l1SizeKB)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">L2:</span>
                  <span className="text-cyan-400">{state.l2Segments.length} ({formatSize(state.l2SizeKB)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">L3:</span>
                  <span className="text-cyan-400">{state.l3Segments.length} ({formatSize(state.l3SizeKB)})</span>
                </div>
                <div className="text-purple-300 text-xs mt-1">
                  Total: {formatSize(state.l0SizeKB + state.l1SizeKB + state.l2SizeKB + state.l3SizeKB)}
                </div>
              </div>

              {/* Background Workers */}
              <div className="border border-purple-400 bg-black/50 p-2">
                <div className="text-purple-400">COMPACTION ({state.workerCount} worker{state.workerCount > 1 ? 's' : ''})</div>
                <div className="space-y-1 mt-2">
                  {state.workers.slice(0, state.workerCount).map((worker, i) => {
                    const statusColors = {
                      'idle': 'text-green-400',
                      'compacting': 'text-orange-400'
                    };
                    
                    const statusSymbols = {
                      'idle': '●',
                      'compacting': '🔧'
                    };
                    
                    return (
                      <div key={i} className="text-white text-xs">
                        <span className={`${statusColors[worker.status]} ${worker.status !== 'idle' ? 'animate-pulse' : ''}`}>
                          {statusSymbols[worker.status]} Worker {i + 1} {worker.task || 'idle'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Database label at bottom */}
            <div className="text-yellow-300 font-semibold mt-4 text-center text-lg">
              🗄️ DATABASE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};