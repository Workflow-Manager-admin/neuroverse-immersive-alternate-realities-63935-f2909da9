import React from "react";
// Import Recharts library for radial charts
import {
  RadialBarChart,
  RadialBar,
  Legend,
  PolarAngleAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// PUBLIC_INTERFACE
/**
 * Dashboard component visualizes simulation outputs using radial charts for:
 * - Emotional Health
 * - Career Trajectory
 * - Financial Status
 * - Relationship Stability
 *
 * Props:
 *   data: Array of timeline step objects, each with metrics {emotional, career, financial, relationships, label}
 *   currentStep: (optional) number - highlights active step on timeline
 */
export default function Dashboard({ data, currentStep }) {
  // Each 'data' element: { label, emotional, career, financial, relationships, ... }
  // Prepare data for each type of radial chart
  const chartColors = {
    emotional: "#0ff",
    career: "#ff00ff",
    financial: "#ffe066",
    relationships: "#8458e0",
  };

  function formatSingleMetricTimeline(metricKey, timelineData) {
    // Extract values by step for this metric
    return timelineData.map((step, i) => ({
      name: step.label,
      value: step[metricKey],
      step: i,
    }));
  }

  // For simplicity, render one chart per metric (timeline arc per step)
  function renderRadialMetric(metricKey, title, color) {
    const timeline = formatSingleMetricTimeline(metricKey, data);
    return (
      <div style={{ minWidth: 170, margin: "8px 14px" }}>
        <h4 style={{ color, textAlign: "center", marginBottom: 7, marginTop: 6, fontSize: "1.08rem" }}>
          {title}
        </h4>
        <ResponsiveContainer width={150} height={150}>
          <RadialBarChart
            innerRadius={36}
            outerRadius={70}
            barSize={16}
            data={timeline}
            startAngle={90}
            endAngle={-270} // Full circle, clockwise
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <Tooltip
              formatter={v => `${v}/100`}
              labelFormatter={(lbl) => timeline[lbl]?.name}
            />
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              cornerRadius={8}
              fill={color}
              isAnimationActive
            />
            {/* Show highlighted step marker */}
            {typeof currentStep === "number" && (
              <RadialBar
                data={[
                  {
                    name: timeline[currentStep]?.name,
                    value: timeline[currentStep]?.value,
                  },
                ]}
                dataKey="value"
                cornerRadius={12}
                fill="#fff"
                opacity={0.38}
                barSize={5}
                isAnimationActive={false}
              />
            )}
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Display all values in a simple time sequence */}
        <div style={{
          display: 'flex',
          justifyContent: "space-between",
          gap: 4,
          marginTop: 4,
          fontSize: "0.98rem"
        }}>
          {timeline.map((step, i) => (
            <span
              key={i}
              style={{
                color: i === currentStep ? "#fff" : color,
                fontWeight: i === currentStep ? 700 : 400,
                opacity: 0.98
              }}
            >
              {step.value}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      className="nv-metrics-section"
      aria-label="Simulation Metrics Dashboard"
      tabIndex={0}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "rgba(0,0,0,0.22)",
        borderRadius: 16,
        margin: "12px auto 0 auto",
        maxWidth: 780,
        boxShadow: "0 0 24px #0ff1",
        padding: 10
      }}
    >
      <div style={{ marginBottom: 4, color: "#ff00ff", fontWeight: 600 }}>
        Alternate Life Metrics Dashboard
      </div>
      <div
        className="metrics-dashboard"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "22px",
          justifyContent: "center",
          alignItems: "flex-start"
        }}
        role="region"
        aria-label="Radial Metrics Charts"
      >
        {renderRadialMetric("emotional", "Emotional Health", chartColors.emotional)}
        {renderRadialMetric("career", "Career Trajectory", chartColors.career)}
        {renderRadialMetric("financial", "Financial Status", chartColors.financial)}
        {renderRadialMetric("relationships", "Relationship Stability", chartColors.relationships)}
      </div>
      <div style={{ marginTop: 8, fontStyle: "italic", color: "#aaa", fontSize: "0.95rem" }}>
        Metrics evolve over time steps in your simulated timeline.
      </div>
    </section>
  );
}
