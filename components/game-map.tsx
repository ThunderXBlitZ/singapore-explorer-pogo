"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Icon, LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from "react"
import { Creature, PokeStop } from "../types/game-types"

interface MapCenterUpdaterProps {
  position: LatLngExpression;
}

interface GameMapProps {
  playerPosition: LatLngExpression;
  creatures: Creature[];
  pokeStops: PokeStop[];
}

// Custom icons
const playerIcon = new Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff0000' width='32px' height='32px'%3E%3Ccircle cx='12' cy='12' r='10' stroke='white' strokeWidth='2'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const creatureIcons: Record<Creature["type"], Icon> = {
  normal: new Icon({
    iconUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300ff00' width='24px' height='24px'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }),
  rare: new Icon({
    iconUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230000ff' width='24px' height='24px'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }),
  epic: new Icon({
    iconUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff00ff' width='24px' height='24px'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }),
  legendary: new Icon({
    iconUrl:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffff00' width='24px' height='24px'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }),
}

const pokeStopIcon = new Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230088ff' width='24px' height='24px'%3E%3Cpolygon points='12,2 22,12 12,22 2,12'/%3E%3C/svg%3E",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

const activatedPokeStopIcon = new Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888888' width='24px' height='24px'%3E%3Cpolygon points='12,2 22,12 12,22 2,12'/%3E%3C/svg%3E",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

// Component to update the map center when player moves
function MapCenterUpdater({ position }: MapCenterUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    map.setView(position, map.getZoom())
  }, [position, map])

  return null
}

export default function GameMap({ playerPosition, creatures, pokeStops }: GameMapProps) {
  return (
    <MapContainer
      center={playerPosition}
      zoom={17}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Player marker */}
      <Marker position={playerPosition} icon={playerIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Creature markers */}
      {creatures.map(
        (creature) =>
          !creature.caught && (
            <Marker key={`creature-${creature.id}`} position={creature.position} icon={creatureIcons[creature.type]}>
              <Popup>
                {creature.type.charAt(0).toUpperCase() + creature.type.slice(1)} Creature
                <br />
                Points: {creature.points}
              </Popup>
            </Marker>
          ),
      )}

      {/* PokeStop markers */}
      {pokeStops.map((stop) => (
        <Marker
          key={`pokestop-${stop.id}`}
          position={stop.position}
          icon={stop.activated ? activatedPokeStopIcon : pokeStopIcon}
        >
          <Popup>{stop.activated ? "Activated PokeStop" : "PokeStop - Get close to refill energy!"}</Popup>
        </Marker>
      ))}

      {/* Update map center when player moves */}
      <MapCenterUpdater position={playerPosition} />
    </MapContainer>
  )
}
