import React from 'react';

const TruthTable = ({ gateType, inputs, output }) => {
  const truthTables = {
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
    BUFFER: [
      { inputs: [0], output: 0 },
      { inputs: [1], output: 1 },
    ],
  };

  const table = truthTables[gateType];

  if (!table) return null;

  return (
    <div className="truth-table">
      <h3>{gateType} Truth Table</h3>
      <table>
        <thead>
          <tr>
            {table[0].inputs.map((_, index) => (
              <th key={index}>Input {index + 1}</th>
            ))}
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => (
            <tr
              key={index}
              className={
                JSON.stringify(row.inputs) === JSON.stringify(inputs) &&
                row.output === output
                  ? 'highlighted'
                  : ''
              }
            >
              {row.inputs.map((input, inputIndex) => (
                <td key={inputIndex}>{input}</td>
              ))}
              <td>{row.output}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TruthTable;
