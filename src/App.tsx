import React from "react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  TileLayer,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import robotIcon from "./assets/images/robot.png";
import campusMap from "./assets/images/campus_sim.png";
import "leaflet/dist/leaflet.css";

// Coordinates for SIT@Dover Academic Plaza
const mapCenter: [number, number] = [1.3004538, 103.780125];

// Image dimensions in pixels
const imageWidth = 1000;
const imageHeight = 1820;

// Conversion factor for map image to geographical coordinates
const metersPerPixel = 0.000001;

/**
 * Converts local coordinates to geographical coordinates.
 * @param x - X coordinate in local map system.
 * @param y - Y coordinate in local map system.
 * @returns [latitude, longitude] in geographical coordinates.
 */
const localToGlobal = (x: number, y: number): [number, number] => {
  // Convert local coordinates to image coordinates
  const imageX = x;
  const imageY = imageHeight - y; // Invert Y-axis for image overlay

  // Calculate geographical offset
  const offsetX = mapCenter[1] - (imageWidth / 2) * metersPerPixel;
  const offsetY = mapCenter[0] + (imageHeight / 2) * metersPerPixel;

  // Convert image coordinates to geographical coordinates
  const lat = offsetY - imageY * metersPerPixel;
  const lng = offsetX + imageX * metersPerPixel;

  return [lat, lng];
};

/**
 * Creates a custom icon for robots with rotation based on heading.
 * @param heading - Rotation angle in degrees.
 * @returns L.DivIcon with a rotated robot image.
 */
const createCustomIcon = (heading: number): L.DivIcon => {
  return new L.DivIcon({
    html: `
      <div style="position: relative; height: 30px; width: 30px;">
        <img src="${robotIcon}" style="transform: rotate(${heading}deg); height: 100%; width: 100%; position: absolute;" />
      </div>`,
    iconSize: [25, 25],
  });
};

const robots = [
  { id: "001", x: 406, y: 334, heading: 0 },
  { id: "002", x: 1101, y: 613, heading: 60 },
  { id: "003", x: 922, y: 946, heading: 240 },
  { id: "004", x: 863, y: 324, heading: 330 },
];

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-100">
      <MapContainer center={mapCenter} zoom={18} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ImageOverlay
          url={campusMap}
          bounds={[
            [1.299, 103.778],
            [1.302, 103.782],
          ]}
          opacity={0.9}
        />
        {robots.map((robot) => {
          const [lat, lng] = localToGlobal(robot.x, robot.y);
          return (
            <React.Fragment key={robot.id}>
              <Marker
                position={[lat, lng]}
                icon={createCustomIcon(robot.heading)}
              >
                <Popup>
                  Robot {robot.id}
                  <br />
                  Heading: {robot.heading}°
                </Popup>
              </Marker>
              <Circle
                center={[lat, lng]}
                radius={25}
                color="red"
                fillColor="red"
                fillOpacity={0.2}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default App;
