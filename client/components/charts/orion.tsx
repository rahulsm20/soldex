import {
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";

const stars = [
  { name: "Betelgeuse", x: 10, y: 80 },
  { name: "Bellatrix", x: 30, y: 75 },

  { name: "BeltLeft", x: 35, y: 50 },
  { name: "BeltMid", x: 45, y: 48 },
  { name: "BeltRight", x: 55, y: 46 },

  { name: "Saiph", x: 40, y: 20 },
  { name: "Rigel", x: 60, y: 25 },
];

// Lines connecting the stars
const lines = [
  ["Betelgeuse", "Bellatrix"],
  ["Betelgeuse", "BeltLeft"],
  ["Bellatrix", "BeltRight"],
  ["BeltLeft", "BeltMid"],
  ["BeltMid", "BeltRight"],
  ["BeltMid", "Saiph"],
  ["BeltRight", "Rigel"],
];

const starByName = Object.fromEntries(stars.map((s) => [s.name, s]));

export default function OrionChart() {
  return (
    <ResponsiveContainer width={600} height={300}>
      <ScatterChart>
        <XAxis type="number" dataKey="x" hide />
        <YAxis type="number" dataKey="y" hide />

        {/* Constellation lines */}
        {lines.map(([a, b], i) => (
          <Line
            key={i}
            type="linear"
            data={[starByName[a], starByName[b]]}
            dataKey="y"
            stroke="#8884d8"
            dot={false}
          />
        ))}

        {/* Stars */}
        <Scatter data={stars} fill="#ffffff" shape="circle" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
