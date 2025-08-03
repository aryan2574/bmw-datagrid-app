import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./index";

interface VehicleAttributes {
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
  createdAt?: Date;
  updatedAt?: Date;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, "id"> {}

class Vehicle
  extends Model<VehicleAttributes, VehicleCreationAttributes>
  implements VehicleAttributes
{
  public id!: number;
  public brand!: string;
  public model!: string;
  public accelSec!: number;
  public topSpeedKm!: number;
  public rangeKm!: number;
  public efficiencyKwh100km!: number;
  public fastChargKmh!: number;
  public rapidChar!: string;
  public powerTrain!: string;
  public plugType!: string;
  public bodyStyle!: string;
  public segment!: string;
  public seats!: number;
  public priceEuro!: number;
  public date!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accelSec: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    topSpeedKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rangeKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    efficiencyKwh100km: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fastChargKmh: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rapidChar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    powerTrain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plugType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bodyStyle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    segment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    priceEuro: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "vehicles",
  }
);

export default Vehicle;
