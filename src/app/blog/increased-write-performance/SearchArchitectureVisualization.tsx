"use client";

import React, { useState, useEffect } from 'react';

interface State {
  // Mutable buffers: one per connection
  mutableBuffers: Array<{ rows: number; sizeKB: number }>;
  // Size in KB for realistic modeling
  l0SizeKB: number;
  l1SizeKB: number;
  l2SizeKB: number;
  l3SizeKB: number;
  l4PlusSizeKB: number;
  // Segment counts for display
  l0Segments: number;
  l1Segments: number;
  l2Segments: number;
  l3Segments: number;
  l4PlusSegments: number;
  isConverting: boolean;
  isMerging: boolean;
  isCreatingSegment: boolean;
  segmentCreationLevel: string;
  writeCount: number;
  worker1Status: 'idle' | 'working';
  worker2Status: 'idle' | 'working';
  worker3Status: 'idle' | 'working';
  worker4Status: 'idle' | 'working';
  worker1Task: string;
  worker2Task: string;
  worker3Task: string;
  worker4Task: string;
  readCount: number;
  workerCount: number;
  mutableEnabled: boolean;
  clientCount: number;
  totalBytesWrittenKB: number;
  rowsPerSecond: number;
  last5SecondRows: number;
  lastTPSUpdate: number;
}

export const SearchArchitectureVisualization: React.FC = () => {
  const [state, setState] = useState<State>({
    // One mutable buffer per connection
    mutableBuffers: [{ rows: 0, sizeKB: 0 }],
    // Size tracking in KB
    l0SizeKB: 0,
    l1SizeKB: 0,
    l2SizeKB: 0,
    l3SizeKB: 0,
    l4PlusSizeKB: 0,
    // Segment counts
    l0Segments: 0,
    l1Segments: 0,
    l2Segments: 0,
    l3Segments: 0,
    l4PlusSegments: 0,
    isConverting: false,
    isMerging: false,
    isCreatingSegment: false,
    segmentCreationLevel: '',
    writeCount: 0,
    worker1Status: 'idle',
    worker2Status: 'idle',
    worker3Status: 'idle',
    worker4Status: 'idle',
    worker1Task: '',
    worker2Task: '',
    worker3Task: '',
    worker4Task: '',
    readCount: 0,
    workerCount: 2,
    mutableEnabled: true,
    clientCount: 1,
    totalBytesWrittenKB: 0,
    rowsPerSecond: 0,
    last5SecondRows: 0,
    lastTPSUpdate: Date.now()
  });

  const resetSimulation = () => {
    setState({
      mutableBuffers: Array.from({ length: state.clientCount }, () => ({ rows: 0, sizeKB: 0 })),
      l0SizeKB: 0,
      l1SizeKB: 0,
      l2SizeKB: 0,
      l3SizeKB: 0,
      l4PlusSizeKB: 0,
      l0Segments: 0,
      l1Segments: 0,
      l2Segments: 0,
      l3Segments: 0,
      l4PlusSegments: 0,
      isConverting: false,
      isMerging: false,
      isCreatingSegment: false,
      segmentCreationLevel: '',
      writeCount: 0,
      worker1Status: 'idle',
      worker2Status: 'idle',
      worker3Status: 'idle',
      worker4Status: 'idle',
      worker1Task: '',
      worker2Task: '',
      worker3Task: '',
      worker4Task: '',
      readCount: 0,
      workerCount: state.workerCount,
      mutableEnabled: state.mutableEnabled,
      clientCount: state.clientCount,
      totalBytesWrittenKB: 0,
      rowsPerSecond: 0,
      last5SecondRows: 0,
      lastTPSUpdate: Date.now()
    });
  };

  // Main animation loop
  useEffect(() => {

    const interval = setInterval(() => {
      setState(prev => {
        // Skip animation tick if segment creation is in progress
        if (prev.isCreatingSegment) {
          return prev;
        }
        let newState = { ...prev };
        
        // Ensure we have the right number of mutable buffers for current client count
        while (newState.mutableBuffers.length < prev.clientCount) {
          newState.mutableBuffers.push({ rows: 0, sizeKB: 0 });
        }
        while (newState.mutableBuffers.length > prev.clientCount) {
          newState.mutableBuffers.pop();
        }
        
        // Generate writes per client once - weighted toward smaller batches
        const clientWrites = Array.from({ length: prev.clientCount }, () => {
          const rand = Math.random();
          if (rand < 0.7) {
            // 70% chance: small writes (1-20 rows, median ~10)
            return Math.floor(Math.random() * 20) + 1;
          } else if (rand < 0.95) {
            // 25% chance: medium writes (21-100 rows)
            return Math.floor(Math.random() * 80) + 21;
          } else {
            // 5% chance: large writes (101-500 rows)
            return Math.floor(Math.random() * 400) + 101;
          }
        });
        const totalNewRows = clientWrites.reduce((sum, rows) => sum + rows, 0);
        
        const rowSizeKB = 1; // Fixed 1KB per row
        const totalWriteSizeKB = totalNewRows * rowSizeKB;
        newState.writeCount += prev.clientCount; // Each client contributes writes
        newState.totalBytesWrittenKB += totalWriteSizeKB; // Track total bytes written
        
        // Calculate RPS (Rows Per Second) - 5 second average
        const currentTime = Date.now();
        newState.last5SecondRows += totalNewRows;
        
        // Only update every 5 seconds, not on every tick that happens to cross the threshold
        const timeSinceLastUpdate = currentTime - prev.lastTPSUpdate;
        if (timeSinceLastUpdate >= 5000) {
          const actualSeconds = timeSinceLastUpdate / 1000;
          newState.rowsPerSecond = Math.round(newState.last5SecondRows / actualSeconds);
          newState.last5SecondRows = 0;
          newState.lastTPSUpdate = currentTime;
        }
        
        // Simulate reads happening constantly too
        const newReads = Math.floor(Math.random() * 3) + 1;
        newState.readCount += newReads;
        
        // Mutable buffer: 1000 rows max, regardless of total size
        const MUTABLE_ROW_THRESHOLD = 1000;
        const L0_SIZE_KB = 100; // 100KB per L0 segment
        const L1_THRESHOLD_KB = 1024; // 1MB
        const L2_THRESHOLD_KB = 10240; // 10MB
        const L3_THRESHOLD_KB = 102400; // 100MB
        const L4_THRESHOLD_KB = 1048576; // 1GB
        
        // Handle writes based on mutable enabled status
        if (prev.mutableEnabled) {
          // Add to per-connection mutable buffers (row-based limit)
          newState.mutableBuffers = newState.mutableBuffers.map((buffer, clientIndex) => {
            if (clientIndex < prev.clientCount && clientIndex < clientWrites.length) {
              const newRows = clientWrites[clientIndex];
              if (buffer.rows < MUTABLE_ROW_THRESHOLD) {
                const rowsToAdd = Math.min(newRows, MUTABLE_ROW_THRESHOLD - buffer.rows);
                return {
                  rows: buffer.rows + rowsToAdd,
                  sizeKB: buffer.sizeKB + (rowsToAdd * rowSizeKB)
                };
              }
            }
            return buffer;
          });
          
          // Convert any full mutable buffers to L0
          const fullBuffers = newState.mutableBuffers.filter(buffer => buffer.rows >= MUTABLE_ROW_THRESHOLD);
          if (fullBuffers.length > 0 && !prev.isConverting) {
            newState.isConverting = true;
            setTimeout(() => {
              setState(s => {
                const buffersToConvert = s.mutableBuffers.filter(buffer => buffer.rows >= MUTABLE_ROW_THRESHOLD);
                let totalSizeToConvert = 0;
                let segmentsToCreate = 0;
                
                buffersToConvert.forEach(buffer => {
                  totalSizeToConvert += buffer.sizeKB;
                  // Split each full buffer (1MB) into multiple 100KB L0 segments
                  segmentsToCreate += Math.ceil(buffer.sizeKB / L0_SIZE_KB);
                });
                
                return {
                  ...s,
                  mutableBuffers: s.mutableBuffers.map(buffer => 
                    buffer.rows >= MUTABLE_ROW_THRESHOLD ? { rows: 0, sizeKB: 0 } : buffer
                  ),
                  l0SizeKB: s.l0SizeKB + totalSizeToConvert,
                  l0Segments: s.l0Segments + segmentsToCreate,
                  isConverting: false
                };
              });
            }, 100);
          }
        } else {
          // Direct to L0 when mutable is disabled - each transaction becomes its own tiny segment!
          // This is VERY expensive because you get one segment per transaction (could be 1 row!)
          let totalSegmentsCreated = 0;
          clientWrites.forEach(rows => {
            // Each client write = 1 transaction = 1 new L0 segment (regardless of size!)
            totalSegmentsCreated += 1;
          });
          
          newState.l0SizeKB = prev.l0SizeKB + totalWriteSizeKB;
          newState.l0Segments = prev.l0Segments + totalSegmentsCreated; // One segment per transaction!
          newState.mutableBuffers = newState.mutableBuffers.map(() => ({ rows: 0, sizeKB: 0 }));
          
          // Simulate the overhead cost of creating many tiny segments
          if (Math.random() < 0.5) { // 50% chance of segment creation overhead (more likely due to tiny segments)
            const avgSegmentSizeKB = totalWriteSizeKB / totalSegmentsCreated;
            newState.isCreatingSegment = true;
            newState.segmentCreationLevel = `L0 (${totalSegmentsCreated} tiny segments, avg ${avgSegmentSizeKB.toFixed(0)}KB each)`;
            
            setTimeout(() => {
              setState(s => ({
                ...s,
                isCreatingSegment: false,
                segmentCreationLevel: ''
              }));
            }, 100); // 100ms for tiny segment creation
          }
        }
        
        // Background merge operations with priority ordering
        const workers = ['worker1Status', 'worker2Status', 'worker3Status', 'worker4Status'] as const;
        
        // Priority-based compaction assignment
        // 1. L0→L1 (highest priority - blocks writes if L0 gets too full)
        // Merge L0 segments when we have enough to create a 1MB L1 segment (about 10 L0 segments)
        let availableL0SizeKB = newState.l0SizeKB;
        if (availableL0SizeKB >= L1_THRESHOLD_KB) {
          for (let i = 0; i < prev.workerCount; i++) {
            const workerKey = workers[i];
            if (newState[workerKey] === 'idle' && availableL0SizeKB >= L1_THRESHOLD_KB) {
              newState[workerKey] = 'working';
              const taskKey = `worker${i + 1}Task` as keyof State;
              newState[taskKey] = 'L0→L1';
              if (i === 0) newState.isMerging = true;
              
              availableL0SizeKB -= L1_THRESHOLD_KB;
              
              setTimeout(() => {
                // First phase: Start segment creation (acquire locks)
                setState(s => ({
                  ...s,
                  isCreatingSegment: true,
                  segmentCreationLevel: 'L1'
                }));
                
                // Second phase: Complete segment creation after lock period
                setTimeout(() => {
                  setState(s => {
                    // Remove approximately 10 L0 segments (100KB each) to create 1 L1 segment (1MB)
                    const segmentsToRemove = Math.min(s.l0Segments, Math.ceil(L1_THRESHOLD_KB / L0_SIZE_KB));
                    
                    return {
                      ...s,
                      l0SizeKB: Math.max(0, s.l0SizeKB - L1_THRESHOLD_KB),
                      l0Segments: Math.max(0, s.l0Segments - segmentsToRemove),
                      l1SizeKB: s.l1SizeKB + L1_THRESHOLD_KB,
                      l1Segments: s.l1Segments + 1,
                      [workerKey]: 'idle',
                      [`worker${i + 1}Task`]: '',
                      isCreatingSegment: false,
                      segmentCreationLevel: '',
                      ...(i === 0 && { isMerging: false })
                    };
                  });
                }, 100); // 100ms for segment creation
              }, 5000);
            }
          }
        }

        // 2. L1→L2 (second priority - only if no L0→L1 work available)
        let availableL1SizeKB = newState.l1SizeKB;
        if (availableL1SizeKB >= L2_THRESHOLD_KB && availableL0SizeKB < L1_THRESHOLD_KB) {
          for (let i = 0; i < prev.workerCount; i++) {
            const workerKey = workers[i];
            if (newState[workerKey] === 'idle' && availableL1SizeKB >= L2_THRESHOLD_KB) {
              newState[workerKey] = 'working';
              const taskKey = `worker${i + 1}Task` as keyof State;
              newState[taskKey] = 'L1→L2';
              availableL1SizeKB -= L2_THRESHOLD_KB;
              
              setTimeout(() => {
                setState(s => ({
                  ...s,
                  isCreatingSegment: true,
                  segmentCreationLevel: 'L2'
                }));
                
                setTimeout(() => {
                  setState(s => {
                    const avgL1SegmentSize = s.l1Segments > 0 ? s.l1SizeKB / s.l1Segments : 1024;
                    const segmentsToRemove = Math.min(s.l1Segments, Math.ceil(L2_THRESHOLD_KB / avgL1SegmentSize));
                    
                    return {
                      ...s,
                      l1SizeKB: Math.max(0, s.l1SizeKB - L2_THRESHOLD_KB),
                      l1Segments: Math.max(0, s.l1Segments - segmentsToRemove),
                      l2SizeKB: s.l2SizeKB + L2_THRESHOLD_KB,
                      l2Segments: s.l2Segments + 1,
                      [workerKey]: 'idle',
                      [`worker${i + 1}Task`]: '',
                      isCreatingSegment: false,
                      segmentCreationLevel: ''
                    };
                  });
                }, 100); // 100ms for segment creation
              }, 8000);
            }
          }
        }

        // 3. L2→L3 (third priority - only if no L0→L1 or L1→L2 work available)
        let availableL2SizeKB = newState.l2SizeKB;
        if (availableL2SizeKB >= L3_THRESHOLD_KB && availableL0SizeKB < L1_THRESHOLD_KB && availableL1SizeKB < L2_THRESHOLD_KB) {
          for (let i = 0; i < prev.workerCount; i++) {
            const workerKey = workers[i];
            if (newState[workerKey] === 'idle' && availableL2SizeKB >= L3_THRESHOLD_KB) {
              newState[workerKey] = 'working';
              const taskKey = `worker${i + 1}Task` as keyof State;
              newState[taskKey] = 'L2→L3';
              availableL2SizeKB -= L3_THRESHOLD_KB;
              
              setTimeout(() => {
                setState(s => ({
                  ...s,
                  isCreatingSegment: true,
                  segmentCreationLevel: 'L3'
                }));
                
                setTimeout(() => {
                  setState(s => {
                    const avgL2SegmentSize = s.l2Segments > 0 ? s.l2SizeKB / s.l2Segments : 10240;
                    const segmentsToRemove = Math.min(s.l2Segments, Math.ceil(L3_THRESHOLD_KB / avgL2SegmentSize));
                    
                    return {
                      ...s,
                      l2SizeKB: Math.max(0, s.l2SizeKB - L3_THRESHOLD_KB),
                      l2Segments: Math.max(0, s.l2Segments - segmentsToRemove),
                      l3SizeKB: s.l3SizeKB + L3_THRESHOLD_KB,
                      l3Segments: s.l3Segments + 1,
                      [workerKey]: 'idle',
                      [`worker${i + 1}Task`]: '',
                      isCreatingSegment: false,
                      segmentCreationLevel: ''
                    };
                  });
                }, 100); // 100ms for segment creation
              }, 12000);
            }
          }
        }

        // 4. L3→L4+ (lowest priority - only if no other work available)
        let availableL3SizeKB = newState.l3SizeKB;
        if (availableL3SizeKB >= L4_THRESHOLD_KB && availableL0SizeKB < L1_THRESHOLD_KB && availableL1SizeKB < L2_THRESHOLD_KB && availableL2SizeKB < L3_THRESHOLD_KB) {
          for (let i = 0; i < prev.workerCount; i++) {
            const workerKey = workers[i];
            if (newState[workerKey] === 'idle' && availableL3SizeKB >= L4_THRESHOLD_KB) {
              newState[workerKey] = 'working';
              const taskKey = `worker${i + 1}Task` as keyof State;
              newState[taskKey] = 'L3→L4+';
              availableL3SizeKB -= L4_THRESHOLD_KB;
              
              setTimeout(() => {
                setState(s => ({
                  ...s,
                  isCreatingSegment: true,
                  segmentCreationLevel: 'L4+'
                }));
                
                setTimeout(() => {
                  setState(s => {
                    const avgL3SegmentSize = s.l3Segments > 0 ? s.l3SizeKB / s.l3Segments : 102400;
                    const segmentsToRemove = Math.min(s.l3Segments, Math.ceil(L4_THRESHOLD_KB / avgL3SegmentSize));
                    
                    return {
                      ...s,
                      l3SizeKB: Math.max(0, s.l3SizeKB - L4_THRESHOLD_KB),
                      l3Segments: Math.max(0, s.l3Segments - segmentsToRemove),
                      l4PlusSizeKB: s.l4PlusSizeKB + L4_THRESHOLD_KB,
                      l4PlusSegments: s.l4PlusSegments + 1,
                      [workerKey]: 'idle',
                      [`worker${i + 1}Task`]: '',
                      isCreatingSegment: false,
                      segmentCreationLevel: ''
                    };
                  });
                }, 100); // 100ms for segment creation
              }, 15000);
            }
          }
        }
        
        return newState;
      });
    }, state.mutableEnabled ? 300 : 500); // Fixed interval regardless of client count

    return () => clearInterval(interval);
  }, [state.clientCount, state.mutableEnabled]);

  // Progress bar renderer
  const renderProgressBar = (current: number, max: number, width: number = 20) => {
    const filled = Math.floor((current / max) * width);
    const empty = width - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
  };

  // Format size in KB to human readable
  const formatSize = (sizeKB: number): string => {
    if (sizeKB >= 1048576) return `${(sizeKB / 1048576).toFixed(1)}GB`;
    if (sizeKB >= 1024) return `${(sizeKB / 1024).toFixed(1)}MB`;
    return `${sizeKB.toFixed(0)}KB`;
  };

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
                    Scan {state.l0Segments + state.l1Segments + state.l2Segments + state.l3Segments + state.l4PlusSegments} immutable segments
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
                          [{buffer.rows.toString().padStart(3)}/1000]
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
                  <span className="text-cyan-400">{state.l0Segments} ({formatSize(state.l0SizeKB)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">L1:</span>
                  <span className="text-cyan-400">{state.l1Segments} ({formatSize(state.l1SizeKB)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">L2:</span>
                  <span className="text-cyan-400">{state.l2Segments} ({formatSize(state.l2SizeKB)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">L3:</span>
                  <span className="text-cyan-400">{state.l3Segments} ({formatSize(state.l3SizeKB)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">L4+:</span>
                  <span className="text-cyan-400">{state.l4PlusSegments} ({formatSize(state.l4PlusSizeKB)})</span>
                </div>
                <div className="text-purple-300 text-xs mt-1">
                  Total: {formatSize(state.l0SizeKB + state.l1SizeKB + state.l2SizeKB + state.l3SizeKB + state.l4PlusSizeKB)}
                </div>
              </div>

              {/* Background Workers */}
              <div className="border border-purple-400 bg-black/50 p-2">
                <div className="text-purple-400">COMPACTION ({state.workerCount} worker{state.workerCount > 1 ? 's' : ''})</div>
                <div className="space-y-1 mt-2">
                  {Array.from({ length: state.workerCount }, (_, i) => {
                    const workerKey = `worker${i + 1}Status` as keyof State;
                    const taskKey = `worker${i + 1}Task` as keyof State;
                    const workerStatus = state[workerKey] as 'idle' | 'working';
                    const workerTask = state[taskKey] as string;
                    const isWorking = workerStatus === 'working';
                    
                    return (
                      <div key={i} className="text-white text-xs">
                        {isWorking ? (
                          <span className="text-orange-400 animate-pulse">🔧 Worker {i + 1} {workerTask}</span>
                        ) : (
                          <span className="text-green-400">● Worker {i + 1} idle</span>
                        )}
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
