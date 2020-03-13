export default interface SemanticLocationHistory {
    timelineObjects: TimelineObject[];
}

export interface TimelineObject {
    activitySegment?: ActivitySegment;
    placeVisit?:      PlaceVisit;
}

export interface ActivitySegment {
    startLocation:      Location;
    endLocation:        Location;
    duration:           Duration;
    distance:           number;
    activityType:       ActivityType;
    confidence:         Confidence;
    activities:         Activity[];
    simplifiedRawPath?: SimplifiedRawPath;
    waypointPath?:      WaypointPath;
    transitPath?:       TransitPath;
}

export interface Activity {
    activityType: ActivityType;
    probability:  number;
}

export enum ActivityType {
    Cycling = "CYCLING",
    Flying = "FLYING",
    InBus = "IN_BUS",
    InFerry = "IN_FERRY",
    InPassengerVehicle = "IN_PASSENGER_VEHICLE",
    InSubway = "IN_SUBWAY",
    InTrain = "IN_TRAIN",
    InTram = "IN_TRAM",
    InVehicle = "IN_VEHICLE",
    Motorcycling = "MOTORCYCLING",
    Running = "RUNNING",
    Sailing = "SAILING",
    Skiing = "SKIING",
    Still = "STILL",
    Walking = "WALKING",
}

export enum Confidence {
    High = "HIGH",
    Low = "LOW",
    Medium = "MEDIUM",
}

export interface Duration {
    startTimestampMs: string;
    endTimestampMs:   string;
}

export interface Location {
    latitudeE7:  number;
    longitudeE7: number;
}

export interface SimplifiedRawPath {
    points: Point[];
}

export interface Point {
    latE7:          number;
    lngE7:          number;
    timestampMs:    string;
    accuracyMeters: number;
}

export interface TransitPath {
    transitStops: OtherCandidateLocation[];
    name:         string;
    hexRgbColor:  string;
}

export interface OtherCandidateLocation {
    latitudeE7:          number;
    longitudeE7:         number;
    placeId:             string;
    name?:               string;
    locationConfidence?: number;
    semanticType?:       SemanticType;
}

export enum SemanticType {
    TypeAliasedLocation = "TYPE_ALIASED_LOCATION",
    TypeHome = "TYPE_HOME",
    TypeSearchedAddress = "TYPE_SEARCHED_ADDRESS",
    TypeWork = "TYPE_WORK",
}

export interface WaypointPath {
    waypoints: { [key: string]: number }[];
}

export interface PlaceVisit {
    location:                LocationClass;
    duration:                Duration;
    placeConfidence:         PlaceConfidence;
    centerLatE7:             number;
    centerLngE7:             number;
    visitConfidence:         number;
    otherCandidateLocations: OtherCandidateLocation[];
    editConfirmationStatus:  EditConfirmationStatus;
    childVisits?:            ChildVisit[];
    simplifiedRawPath?:      SimplifiedRawPath;
}

export interface ChildVisit {
    location:                LocationClass;
    duration:                Duration;
    placeConfidence:         PlaceConfidence;
    centerLatE7:             number;
    centerLngE7:             number;
    visitConfidence:         number;
    otherCandidateLocations: OtherCandidateLocation[];
    editConfirmationStatus:  EditConfirmationStatus;
}

export enum EditConfirmationStatus {
    NotConfirmed = "NOT_CONFIRMED",
}

export interface LocationClass {
    latitudeE7:         number;
    longitudeE7:        number;
    placeId:            string;
    address:            string;
    name:               string;
    sourceInfo:         SourceInfo;
    locationConfidence: number;
    semanticType?:      SemanticType;
}

export interface SourceInfo {
    deviceTag: number;
}

export enum PlaceConfidence {
    HighConfidence = "HIGH_CONFIDENCE",
    LowConfidence = "LOW_CONFIDENCE",
    MediumConfidence = "MEDIUM_CONFIDENCE",
}
