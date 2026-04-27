import type { ServerSdk } from "@dev-agents/sdk-server";

/**
 * This file is auto-generated. DO NOT modify directly.
 * Any changes will be overwritten when the code is regenerated.
 */

export const SERVER_INFO = {
   serverName: "flightaware",
   serverVersion: "1.0.0",
   description: "Live and historical flight tracking via FlightAware",
} as const;

/**
 * The type of the input parameter for getLastFlight tool.
 */
export type getLastFlightParams = {
  // Aircraft registration (e.g., N545DB)
  registration: string
}

/**
 * The type of the output of the getLastFlight tool.
 */
export type getLastFlightOutput = {
  raw?: any,
  error?: {
    type: string,
    status?: number,
    details?: any,
    message: string
  },
  flights?: Array<{
    type?: (string | null),
    ident?: (string | null),
    route?: (string | null),
    origin?: ({
      city?: (string | null),
      code?: (string | null),
      name?: (string | null),
      code_lid?: (string | null),
      timezone?: (string | null),
      code_iata?: (string | null),
      code_icao?: (string | null),
      airport_info_url?: (string | null)
    } | null),
    status?: (string | null),
    blocked?: (boolean | null),
    diverted?: (boolean | null),
    operator?: (string | null),
    actual_in?: (string | null),
    actual_on?: (string | null),
    atc_ident?: (string | null),
    cancelled?: (boolean | null),
    filed_ete?: (number | null),
    actual_off?: (string | null),
    actual_out?: (string | null),
    codeshares?: (Array<string> | null),
    ident_iata?: (string | null),
    ident_icao?: (string | null),
    destination?: (any | null),
    gate_origin?: (string | null),
    estimated_in?: (string | null),
    estimated_on?: (string | null),
    fa_flight_id?: (string | null),
    registration?: (string | null),
    scheduled_in?: (string | null),
    scheduled_on?: (string | null),
    aircraft_type?: (string | null),
    arrival_delay?: (number | null),
    baggage_claim?: (string | null),
    estimated_off?: (string | null),
    estimated_out?: (string | null),
    flight_number?: (string | null),
    operator_iata?: (string | null),
    operator_icao?: (string | null),
    position_only?: (boolean | null),
    scheduled_off?: (string | null),
    scheduled_out?: (string | null),
    filed_airspeed?: (number | null),
    filed_altitude?: (number | null),
    route_distance?: (number | null),
    codeshares_iata?: (Array<string> | null),
    departure_delay?: (number | null),
    terminal_origin?: (string | null),
    actual_runway_on?: (string | null),
    gate_destination?: (string | null),
    progress_percent?: (number | null),
    actual_runway_off?: (string | null),
    seats_cabin_coach?: (number | null),
    seats_cabin_first?: (number | null),
    inbound_fa_flight_id?: (string | null),
    seats_cabin_business?: (number | null),
    terminal_destination?: (string | null),
    foresight_predictions_available?: (boolean | null)
  }>,
  success: boolean,
  fetchedAt: string,
  registration?: string
}

/**
 * Get the last flight information for an aircraft by registration number. Returns detailed flight history including origin, destination, times, and status.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function getLastFlight(
  sdk: ServerSdk,
  params: getLastFlightParams
): Promise<getLastFlightOutput> {
  return await sdk.callTool("flightaware/1.0.0/getLastFlight", params) as getLastFlightOutput;
}

/**
 * The type of the input parameter for getFlightStatus tool.
 */
export type getFlightStatusParams = {
  // Flight identifier - can be a flight number (e.g., 'ba285', 'dal123') or tail number (e.g., 'N545DB')
  ident: string
}

/**
 * The type of the output of the getFlightStatus tool.
 */
export type getFlightStatusOutput = {
  raw?: any,
  error?: {
    type: string,
    status?: number,
    details?: any,
    message: string
  },
  ident?: string,
  flights?: Array<{
    type?: (string | null),
    ident?: (string | null),
    route?: (string | null),
    origin?: ({
      city?: (string | null),
      code?: (string | null),
      name?: (string | null),
      code_lid?: (string | null),
      timezone?: (string | null),
      code_iata?: (string | null),
      code_icao?: (string | null),
      airport_info_url?: (string | null)
    } | null),
    status?: (string | null),
    blocked?: (boolean | null),
    diverted?: (boolean | null),
    operator?: (string | null),
    actual_in?: (string | null),
    actual_on?: (string | null),
    atc_ident?: (string | null),
    cancelled?: (boolean | null),
    filed_ete?: (number | null),
    actual_off?: (string | null),
    actual_out?: (string | null),
    codeshares?: (Array<string> | null),
    ident_iata?: (string | null),
    ident_icao?: (string | null),
    destination?: (any | null),
    gate_origin?: (string | null),
    estimated_in?: (string | null),
    estimated_on?: (string | null),
    fa_flight_id?: (string | null),
    registration?: (string | null),
    scheduled_in?: (string | null),
    scheduled_on?: (string | null),
    aircraft_type?: (string | null),
    arrival_delay?: (number | null),
    baggage_claim?: (string | null),
    estimated_off?: (string | null),
    estimated_out?: (string | null),
    flight_number?: (string | null),
    operator_iata?: (string | null),
    operator_icao?: (string | null),
    position_only?: (boolean | null),
    scheduled_off?: (string | null),
    scheduled_out?: (string | null),
    filed_airspeed?: (number | null),
    filed_altitude?: (number | null),
    route_distance?: (number | null),
    codeshares_iata?: (Array<string> | null),
    departure_delay?: (number | null),
    terminal_origin?: (string | null),
    actual_runway_on?: (string | null),
    gate_destination?: (string | null),
    progress_percent?: (number | null),
    actual_runway_off?: (string | null),
    seats_cabin_coach?: (number | null),
    seats_cabin_first?: (number | null),
    inbound_fa_flight_id?: (string | null),
    seats_cabin_business?: (number | null),
    terminal_destination?: (string | null),
    foresight_predictions_available?: (boolean | null)
  }>,
  success: boolean,
  fetchedAt: string,
  num_pages?: number
}

/**
 * Get current and recent flight status by flight number or tail number. Returns detailed information about all matching flights including real-time status, times, delays, and route information.
 * @param sdk - The SDK object.
 * @param params - The parameters for the tool.
 * @returns The result of the tool, matching the type defined by the outputSchema.
 */
export async function getFlightStatus(
  sdk: ServerSdk,
  params: getFlightStatusParams
): Promise<getFlightStatusOutput> {
  return await sdk.callTool("flightaware/1.0.0/getFlightStatus", params) as getFlightStatusOutput;
}


