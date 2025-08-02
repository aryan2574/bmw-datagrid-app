export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  accelSec: number;
  topSpeedKm: number;
  rangeKm: number;
  efficiencyKwh100km: number;
  fastChargKmh: number;
  rapidChar: string;
  powerTrain: string;
  plugType: string;
  bodyStyle: string;
  segment: string;
  seats: number;
  priceEuro: number;
  date: string;
}

export interface FilterState {
  [key: string]: {
    operator: string;
    value: string;
  };
}

export interface FilterData {
  field: string;
  operator: string;
  value: string;
}
