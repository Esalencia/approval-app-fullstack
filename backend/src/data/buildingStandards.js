export default {
    clear_height: {
      habitable_rooms: 2.4,  // meters
      non_habitable_rooms: 2.1
    },
    floor_area: {
      habitable_rooms_min: 7,  // square meters
      horizontal_dimension_min: 2.1,
      alcove_max_percentage: 10  // percent of total floor area
    },
    daylight_openings: {
      min_percentage: 5,  // percent of floor area
      min_area: 0.5,  // square meters
      min_height_from_floor: 0.3  // meters (300mm)
    },
    ventilation: {
      min_percentage: 5,  // percent of floor area
      external_walls_required: true
    },
    walls: {
      foundation_min_thickness: 0.215,  // meters (215mm)
      bearing_walls_min_thickness: 0.1,  // meters (100mm)
      bearing_walls_solid: 0.2,  // meters (200mm)
      bearing_walls_cavity: 0.15,  // meters (150mm)
      partition_walls_min: 0.1  // meters (100mm)
    },
    access_egress: {
      min_exit_ways: 2,  // per dwelling unit
      min_doorway_width: 1.1,  // meters
      min_passageway_width: 1.1,  // meters
      min_small_building_passageway: 0.8,  // meters (800mm)
      max_dead_end_passageway: 15,  // meters
      min_passageway_non_street: 3  // meters
    },
    stairways: {
      min_width: 0.9,  // meters (900mm)
      min_headroom: 2.3  // meters
    },
    height_requirements: {
      max_dwelling_storeys: 2,
      max_residential_storeys: 4,
      max_residential_height: 15  // meters
    },
    fire_safety: {
      exit_way_fire_rating: 1,  // hour
      partition_basement_fire_rating: 0.5,  // hour (30 minutes)
      floor_fire_rating: 0.5,  // hour (30 minutes)
      roof_fire_rating: 0.5  // hour (30 minutes)
    },
    windows: {
      min_height_above_pavement: 2.5,  // meters
      min_ventilation_per_soil_fitting: 0.2  // square meters
    },
    // Additional standards that might be useful
    structural: {
      minimum_beam_depth: 0.2,  // meters
      minimum_column_dimension: 0.25,  // meters
      maximum_floor_to_floor_height: 3.5  // meters
    },
    accessibility: {
      wheelchair_turn_radius: 1.5,  // meters
      minimum_door_width: 0.8,  // meters
      maximum_ramp_slope: 0.083  // 1:12 ratio
    },
    electrical: {
      minimum_outlets_per_room: 1,
      minimum_lighting_levels: {
        living_areas: 150,  // lux
        kitchens: 300,
        bathrooms: 200,
        hallways: 100
      }
    },
    plumbing: {
      minimum_fixture_requirements: {
        toilets_per_persons: 1,  // per 5 persons
        sinks_per_persons: 1,  // per 5 persons
        showers_per_persons: 1  // per 8 persons
      },
      minimum_pipe_sizes: {
        water_supply: 0.015,  // meters (15mm)
        waste_pipe: 0.075  // meters (75mm)
      }
    },
    energy_efficiency: {
      maximum_u_values: {
        walls: 0.35,  // W/m²K
        roof: 0.25,
        floors: 0.25,
        windows: 2.0
      },
      minimum_insulation_thickness: 0.1  // meters
    },
    // Helper methods for validation
    validateMeasurement(value, standard, tolerance = 0.01) {
      return Math.abs(value - standard) <= tolerance;
    },
    validateMinimum(value, minimum) {
      return value >= minimum;
    },
    validateMaximum(value, maximum) {
      return value <= maximum;
    },
    validatePercentage(value, minPercentage, maxPercentage = 100) {
      return value >= minPercentage && value <= maxPercentage;
    }
  };