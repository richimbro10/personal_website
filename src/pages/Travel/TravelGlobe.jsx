import React, { useEffect, useRef } from "react";
import Globe from "globe.gl";
import * as topojson from "topojson-client";
import places from "./places.json";

const TravelGlobe = ({ setPopup }) => {
  const globeRef = useRef();
  const placesRef = useRef(places); // avoids stale references in callbacks

  useEffect(() => {
    const globe = Globe()(globeRef.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png");

    Promise.all([
      fetch("https://unpkg.com/world-atlas/countries-110m.json").then(res =>
        res.json()
      ),
      fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(
        res => res.json()
      )
    ]).then(([worldData, usData]) => {
      // Convert TopoJSON to GeoJSON features
      const countries = topojson
        .feature(worldData, worldData.objects.countries)
        .features.map(f => ({ ...f, regionType: "country" }));

      const states = topojson
        .feature(usData, usData.objects.states)
        .features.map(f => ({ ...f, regionType: "state" }));

      const allPolygons = [...countries, ...states];

      // Configure polygons
      globe
        .polygonsData(allPolygons)
        .polygonCapColor(d => {
          const data =
            d.regionType === "state"
              ? placesRef.current.states[d.properties.name]
              : placesRef.current.countries[d.properties.name];
          return data ? "green" : "rgba(200,200,200,0.2)";
        })
        .polygonSideColor(() => "rgba(0, 100, 0, 0.15)")
        .polygonStrokeColor(() => "#111")
        .onPolygonClick(d => {
          const data =
            d.regionType === "state"
              ? placesRef.current.states[d.properties.name]
              : d.regionType === "country"
              ? placesRef.current.countries[d.properties.name]
              : null;

          if (data) {
            setPopup({
              title: d.properties.name,
              content: `${data.blurb}\n\nLast visited: ${data.lastVisited}`
            });
          } else {
            setPopup(null); // safe close
          }
        });
    });

    return () => globe._destructor();
  }, [setPopup]);

  return <div ref={globeRef} className="globe-canvas" />;
};

export default TravelGlobe;