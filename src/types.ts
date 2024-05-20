import { LovelaceCardConfig } from 'custom-card-helpers';

export interface PublicTransportVictoriaCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  entity: string;
}

export interface PublicTransportVictoriaAttributes {
  at_platform: false;
  attribution: string;
  departure: string;
  departure_sequence: number;
  direction_id: number;
  disruption_ids: number[];
  estimated_departure_utc: string | null;
  flags: string;
  friendly_name: string;
  platform_number: string | null;
  route_id: number;
  run_id: number;
  run_ref: string;
  scheduled_departure_utc: string;
  stop_id: number;
}
